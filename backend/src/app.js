import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.get('/', (_, res) => {
  res.json({ message: 'ScanQ is running...' });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ScanQ API is healthy"
  });
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