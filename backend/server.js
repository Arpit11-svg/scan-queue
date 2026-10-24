import app from './src/app.js';
import "dotenv/config";
import pool from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await pool.connect();
        console.log("===== Database connected successfully! =====");

        app.listen(PORT, () => {
            console.log(`===== Server of ScanQ is running on port ${PORT} =====`);
        });
    } catch (error) {
        console.error("===== Database connection failed: =====", error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

startServer();