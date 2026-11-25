import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../config/db.js";
import { getIO } from "../config/socket.js";


const getBusinessQueue = asyncHandler(async (req, res) => {

    const result = await pool.query(
        `
        WITH stats AS(

            SELECT
                COUNT (*) FILTER(
                    WHERE status = 'WAITING'
                )::INTEGER AS waiting,

                COUNT (*) FILTER(
                    WHERE status = 'CALLED'
                )::INTEGER AS called,

                COUNT(*) FILTER (
                    WHERE status = 'SERVED'
                )::INTEGER AS served
            
            FROM queue_entries
            WHERE business_id = $1
                AND queue_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE
        ),
        customers AS(
            SELECT id, name, mobile, description, status,
                joined_at, token_number, party_size, queue_date
            FROM queue_entries
            WHERE business_id = $1
                AND queue_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE
                AND status = 'WAITING'
            ORDER BY joined_at ASC, id ASC
            LIMIT 5
        )
        SELECT
            (SELECT row_to_json(stats) FROM stats) AS stats,

            COALESCE(
                (SELECT json_agg(customers) FROM customers),
                '[]'::JSON
            ) AS customers;
        `,
        [req.business.id]
    );

    res.status(200).json({
        success: true,
        data: result.rows[0]
    });
});


const callNextCustomer = asyncHandler(async (req, res) => {
    const businessId = req.business.id;
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Lock the business row to prevent simultaneous call-next requests
        await client.query(
            `SELECT id FROM businesses WHERE id = $1 FOR UPDATE`,
            [businessId]
        );

        // Check whether another customer is already active
        const activeCustomer = await client.query(
            `SELECT id
             FROM queue_entries
             WHERE business_id = $1
               AND queue_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE
               AND status IN ('CALLED', 'ON_THE_WAY')
             LIMIT 1`,
            [businessId]
        );

        if (activeCustomer.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Please serve or cancel the current customer first."
            });
        }

        // Select the next customer
        const result = await client.query(
            `UPDATE queue_entries
             SET status = 'CALLED',
                 called_at = NOW()
             WHERE id = (
                 SELECT id
                 FROM queue_entries
                 WHERE business_id = $1
                   AND queue_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE
                   AND status = 'WAITING'
                 ORDER BY joined_at ASC, id ASC
                 LIMIT 1
                 FOR UPDATE
             )
             RETURNING id, business_id, public_token,
                       name, mobile, description,
                       status, joined_at, token_number`,
            [businessId]
        );

        if (result.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "No waiting customers found in the queue."
            });
        }

        await client.query("COMMIT");

        const customer = result.rows[0];

        // Notify the specific customer
        getIO()
            .to(`customer_${customer.public_token}`)
            .emit("customerCalled", {
                tokenNumber: customer.token_number,
                message: "It's your turn! Please proceed to the counter."
            });

        // Refresh business dashboard
        getIO()
            .to(`business_${businessId}`)
            .emit("queueUpdated");

        return res.status(200).json({
            success: true,
            message: "Next customer has been called.",
            data: {
                id: customer.id,
                name: customer.name,
                token_number: customer.token_number,
                status: customer.status
            }
        });

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
});


//mark customer as SERVED or CANCELLED
const updateQueueStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'SERVED' && status !== 'CANCELLED') {
        return res.status(400).json({
            success: false,
            message: "Invalid status. Only 'WAITING' or 'CALLED' are allowed."
        });
    }

    const result = await pool.query(
        `UPDATE queue_entries
         SET status = $1,
             served_at = CASE
                 WHEN $4 = 'SERVED' THEN NOW()
                 ELSE served_at
             END
         WHERE id = $2
           AND business_id = $3
           AND status IN ('WAITING', 'CALLED')
         RETURNING id, name, status, served_at`,
        [status, id, req.business.id, status]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Customer not found or already processed."
        });
    }

    res.status(200).json({
        success: true,
        message: `Customer marked as ${status}.`,
        customer: result.rows[0]
    });
});

const getActiveCustomer = asyncHandler(async (req, res) => {
    const result = await pool.query(
        `
        SELECT id, name, mobile, description, status,
            joined_at, token_number, party_size, queue_date
        FROM queue_entries
        WHERE business_id = $1
            AND queue_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE
            AND status IN ('CALLED', 'ON_THE_WAY')`,
        [req.business.id]
    );

    res.status(200).json({
        success: true,
        data: result.rows[0] || null
    });
})

const cancelActiveCustomer = asyncHandler(async (req, res) => {

    const customerId = req.params.id;
    const businessId = req.business.id;

    const result = await pool.query(
        `UPDATE queue_entries
         SET status = 'CANCELLED'
         WHERE id = $1
           AND business_id = $2
           AND status IN ('ON_THE_WAY', 'CALLED')
           AND queue_date = (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE
         RETURNING id, business_id, name, mobile, status
        `,
        [customerId, businessId]
    );
    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No active customer found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Customer cancelled successfully.",
        customer: result.rows[0]
    });
});

export { getBusinessQueue, callNextCustomer, updateQueueStatus, getActiveCustomer, cancelActiveCustomer };