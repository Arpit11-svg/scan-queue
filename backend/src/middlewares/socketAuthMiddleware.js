import jwt from "jsonwebtoken";
import pool from "../config/db.js";


const socketAuthMiddleware = async (socket, next) => {
    try {
        // Read cookies from the handshake request
        const cookies = cookie.parse(
            socket.handshake.headers.cookie || ""
        );

        const token = cookies.accessToken;

        if (!token) {
            return next(new Error("Authentication required."));
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const result = await pool.query(
            `SELECT id FROM businesses WHERE id = $1`,
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return next(new Error("Business not found."));
        }

        // Attach business ID to socket
        socket.businessId = decoded.id;

        next();

    } catch (error) {
        next(new Error("Invalid or expired token."));
    }
};

export default socketAuthMiddleware;
