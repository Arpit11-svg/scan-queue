import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../config/db.js";


const joinQueue = asyncHandler(async (req, res) => {
    const { businessId } = req.params;
    const {
        name,
        partySize = 1,
        mobile,
        description,
        notificationConsent
    } = req.body;

    // Validate input
    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof mobile !== "string" ||
        !mobile.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Name and mobile number are required."
        });
    }

    if (!/^[1-9]\d*$/.test(businessId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid business ID."
        });
    }

    if (!Number.isInteger(partySize) || partySize < 1 || partySize > 20) {
        return res.status(400).json({
            success: false,
            message: "Party size must be between 1 and 20."
        });
    }

    const client = await pool.connect();

    try {

        //transaction to ensure atomicity of operations
        await client.query("BEGIN");

        // Prevent simultaneous customers from getting the same token
        await client.query(
            "SELECT pg_advisory_xact_lock($1::bigint)",
            [businessId]
        );

        // Check whether the business exists
        const businessResult = await client.query(
            `SELECT id FROM businesses WHERE id = $1`,
            [businessId]
        );

        if (businessResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Business not found."
            });
        }

        // Generate the next token number for this business, each day starts from 1
        const tokenResult = await client.query(
            `SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token
             FROM queue_entries
             WHERE business_id = $1
             AND queue_date = CURRENT_DATE`,
            [businessId]
        );

        const tokenNumber = tokenResult.rows[0].next_token;

        // Insert customer into queue
        const result = await client.query(
            `INSERT INTO queue_entries
            (
                business_id,
                name,
                party_size,
                token_number,
                queue_date,
                mobile,
                description,
                notification_consent,
                status
            )
            VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6, $7, 'WAITING')
            RETURNING
                id,
                token_number,
                public_token,
                name,
                party_size,
                mobile,
                description,
                notification_consent,
                status,
                joined_at`,
            [
                businessId,
                name.trim(),
                partySize,
                tokenNumber,
                mobile.trim(),
                typeof description === "string"
                    ? description.trim()
                    : null,
                notificationConsent === true
            ]
        );

        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "You have joined the queue successfully.",
            data: result.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
});


//position of current customer with specific business_id and entryID 
const getQueuePosition = asyncHandler(async (req, res) => {
    const { businessId, entryId } = req.params;

    const result = await pool.query(
        `SELECT
            q.id,
            q.name,
            q.mobile,
            q.status,
            q.joined_at,
            CASE
                WHEN q.status = 'WAITING' THEN
                    (
                     SELECT COUNT(*)+1 
                     FROM queue_entries as ahead
                     WHERE ahead.business_id = q.business_id
                     AND ahead.status = 'WAITING'
                     AND (
                        ahead.joined_at < q.joined_at
                        OR (
                            ahead.joined_at = q.joined_at 
                            AND ahead.id < q.id
                        )
                     )
                    )
                ELSE
                    NULL
            END AS position
        FROM queue_entries as q
        WHERE q.id = $1
        AND q.business_id = $2`,
        [entryId, businessId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Queue entry not found."
        });
    }

    return res.status(200).json({
        success: true,
        data: result.rows[0]
    });
});

const leaveQueue = asyncHandler(async (req, res) => {
    const { businessId, entryId } = req.params;

    const result = await pool.query(
        `UPDATE queue_entries
         SET status = 'CANCELLED'
         WHERE id = $1 
          AND business_id = $2
          AND status IN ('WAITING', 'CALLED')
         RETURNING id, name, mobile, status`,
        [entryId, businessId]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Queue entry not found or already removed."
        });
    }

    return res.status(200).json({
        success: true,
        message: "You have left the queue successfully.",
        data: result.rows[0]
    });
});

export { joinQueue, getQueuePosition, leaveQueue };