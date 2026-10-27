import { asyncHandler } from "../utils/asyncHandler.js";
import pool from "../config/db.js";

const joinQueue = asyncHandler(async (req, res) => {
    const { businessId } = req.params;
    const { name, mobile, description } = req.body;

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

    const businessResult = await pool.query(
        `SELECT id FROM businesses WHERE id = $1`,
        [businessId]
    );

    if (businessResult.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Business not found."
        });
    }

    //Add customer to the queue with status 'WAITING'
    const result = await pool.query(
        `INSERT INTO queue_entries 
        (business_id, name, mobile, description, status)
        VALUES ($1, $2, $3, $4, 'WAITING')
        RETURNING id, name, mobile, description, status, joined_at`,
        [businessId, name.trim(), mobile.trim(), typeof description === "string" ? description.trim() : null]
    );

    return res.status(201).json({
        success: true,
        message: "You have joined the queue successfully.",
        data: result.rows[0]
    });
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