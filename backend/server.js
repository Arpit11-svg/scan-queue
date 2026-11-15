import app from './src/app.js';
import "dotenv/config";
import pool from './src/config/db.js';
import { createServer } from 'node:http';
import { initializeSocket } from './src/config/socket.js';


const PORT = process.env.PORT || 5000;

// Create HTTP server using Express
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

async function startServer() {
    try {
        await pool.query("SELECT 1");
        console.log("===== Database connected successfully! =====");

        httpServer.listen(PORT, () => {
            console.log(`===== Server of ScanQ is running on port ${PORT} =====`);
        });
    } catch (error) {
        console.error("===== Database connection failed: =====", error.message);
        process.exit(1);
        await pool.end();
    }
}

startServer();