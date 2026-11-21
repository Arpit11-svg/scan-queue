import { Server } from "socket.io";
import socketAuthMiddleware from "../middlewares/socketAuthMiddleware.js";

let io;

export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        }
    });

    // Authenticate every business connection
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {

        const businessId = socket.businessId;

        // Join business-specific room
        socket.join(`business_${businessId}`);

        socket.on("disconnect", () => {
            console.log(
                `Business ${businessId} disconnected`
            );
        });
    });

    console.log("===== Socket.IO initialized successfully! =====");

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};
