import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { Message } from "../../types/message";

export const config = {
  api: {
    bodyParser: false,
  },
};

const socketio = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });

    io.on("connection", (socket) => {
      const { room } = socket.request.headers;

      console.log(`Client ${socket.id} connected to room \"${room}\"`);
      socket.join(room as string);

      socket.on("sendMessage", (message: Message) => {
        io.to(room as string).emit("message", message);
      });

      socket.on("clientMessage", (message) => {
        io.to(room as string).emit("clientMessage", message);
      });
    });

    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default socketio;
