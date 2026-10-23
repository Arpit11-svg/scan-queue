import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.get('/', (req, res) => {
    res.send('ScanQ is running...')
})

export default app;