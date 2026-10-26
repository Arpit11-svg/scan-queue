import asyncHandler from "../utils/asyncHandler.js";
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

export { joinQueue };