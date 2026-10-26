import asyncHandler from "../utils/asyncHandler.js";
import pool from "../config/db.js";


const getBusinessQueue = asyncHandler(async (req, res) => {

    const result = await pool.query(
        `SELECT id, name, mobile, description, status, joined_at
         FROM queue_entries
         WHERE business_id = $1`,
        [req.business.id]
    );

    res.status(200).json({
        success: true,
        data: result.rows
    });
});

const callNextCustomer = asyncHandler(async (req, res) => {
    const result = await pool.query(
        `Update queue_entries
         SET status = 'CALLED'
         WHERE id = (
            SELECT id
            FROM queue_entries
            WHERE business_id = $1 
             AND status = 'WAITING'
            ORDER BY joined_at ASC, id ASC
            LIMIT 1
         )
         RETURNING id, name, mobile, description, status, joined_at`,
        [req.business.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No waiting customers found in the queue."
        });
    }

    res.status(200).json({
        success: true,
        data: result.rows[0],
        message: "Next customer has been called."
    });
});

//mark customer as SERVED or CANCELLED
const updateQueueStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== 'SERVED' && status !== 'CANCELLED') {
        return res.status(400).json({
            success: false,
            message: "Invalid status. Only 'SERVED' or 'CANCELLED' are allowed."
        });
    }

    const result = await pool.query(
        `UPDATE queue_entries
         SET status = $1,
             served_at = CASE
                 WHEN $1 = 'SERVED' THEN NOW()
                 ELSE served_at
             END
         WHERE id = $2
           AND business_id = $3
           AND status IN ('WAITING', 'CALLED')
         RETURNING id, name, status, served_at`,
        [status, id, req.business.id]
    );

    if(result.rows.length === 0) {
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



export { getBusinessQueue, callNextCustomer }