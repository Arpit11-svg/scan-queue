import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.get('/', (_, res) => {
    res.json({ message: 'ScanQ is running...' });
});

export default app;