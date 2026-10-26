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
import businessRouter from "./routes/business.route.js"

//routes declaration
app.use("/api/v1/business", businessRouter)
app.use("/api/v1/queue", queueRouter)

export default app;