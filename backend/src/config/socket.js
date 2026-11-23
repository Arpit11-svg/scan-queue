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
        
        const role = socket.role;

        // ======= Customer Connection
        if(role==="customer"){
            const publicToken =socket.publicToken;
            // Join customer-specific room
            socket.join(`customer_${publicToken}`);

            socket.on("disconnect", () => {
                console.log(
                    `Customer ${publicToken} disconnected`
                );
            });
            return;

        }


        // =======Business connection
        if(role==="business"){
            const businessId = socket.businessId;

            // Join business-specific room
            socket.join(`business_${businessId}`);

            socket.on("disconnect", () => {
                console.log(
                    `Business ${businessId} disconnected`
                );
            });
            return;
        }

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
