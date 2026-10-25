import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please log in first."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const businessResult = await pool.query(
            `SELECT id, name, email
             FROM businesses
             WHERE id = $1`,
            [decoded.id]
        );

        if (businessResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token."
            });
        }
        
        req.business = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
});

export default authMiddleware;
