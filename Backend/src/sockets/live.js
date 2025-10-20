import { Server } from "socket.io";

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  let leaderboard = [
    { pos: 1, driver: "A. Perera", bestLap: "1:41.238", gap: "-" },
    { pos: 2, driver: "S. Fernando", bestLap: "1:41.910", gap: "+0.672" },
  ];

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", (sessionId) => {
      socket.join(sessionId);
      socket.emit("leaderboard:update", leaderboard);
    });

    socket.on("leaderboard:update:admin", (data) => {
      leaderboard = data;
      io.to("colombo-practice-001").emit("leaderboard:update", leaderboard);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};
