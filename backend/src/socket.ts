import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-contest', (contestId) => {
      socket.join(`contest-${contestId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const emitLeaderboardUpdate = (contestId: string, data: any) => {
  io.to(`contest-${contestId}`).emit('leaderboard-update', data);
};
