import asyncHandler from "../utils/asyncHandler.js";


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

export { getBusinessQueue }