import jwt from "jsonwebtoken";
import { parseCookie } from "cookie";
import pool from "../config/db.js";


const socketAuthMiddleware = async (socket, next) => {
    try {

        //================== Customer authentication ============
        const publicToken = socket.handshake.auth?.publicToken;

        if (publicToken) {
            const result = await pool.query(
                `SELECT id, public_token, business_id
                 FROM queue_entries
                 WHERE public_token = $1`,
                [publicToken]
            );

            if (result.rows.length === 0) {
                return next(new Error("Invalid customer token."));
            }

            const customer = result.rows[0];

            socket.role = "customer";
            socket.customerId = customer.id;
            socket.publicToken = customer.public_token;
            socket.businessId = customer.business_id;

            return next();
        }

        // ================== Business authentication ============
        // Read cookies from the handshake request
        const cookies = parseCookie(
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

        // Attach business ID and role to socket
        socket.role = "business";
        socket.businessId = decoded.id;

        next();

    } catch (error) {

        next(new Error("Invalid or expired token."));
    }
};

export default socketAuthMiddleware;
