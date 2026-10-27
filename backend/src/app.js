import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
    res.json({ message: 'ScanQ is running...' });
});

//routes import
import businessRouter from "./routes/business.route.js";
import queueRouter from "./routes/queue.route.js";
import customerQueueRouter from "./routes/customerQueue.route.js";
import qrCodeRouter from "./routes/qrCode.route.js"

//routes declaration
app.use("/api/v1/business", businessRouter);
app.use("/api/v1/queue", queueRouter);
app.use("/api/v1/customer-queue", customerQueueRouter);
app.use("/api/v1/qr-code", qrCodeRouter);

export default app;