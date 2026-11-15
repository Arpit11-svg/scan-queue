import { Server } from "socket.io";

let io;

export const initializeSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
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
