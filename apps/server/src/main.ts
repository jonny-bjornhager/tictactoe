import express from 'express';
import { configDotenv } from 'dotenv';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import { GameData, Player } from '@tictactoe/shared/types';
import { GameState } from '@tictactoe/server/services';
configDotenv();

const app = express();
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: host !== 'localhost' ? host : `http://${host}:3000`,
    methods: ['GET', 'POST'],
  },
});

const gameStates: { [roomId: string]: GameState } = {};

io.on(SOCKET_EVENTS.connect, (socket: Socket) => {
  console.log(`User ${socket.id} has connected`);

  // When a player hosts a room
  socket.on(SOCKET_EVENTS.hostGame, () => {
    const roomId = `${socket.id}`;
    const playerData: Player = {
      id: socket.id,
      isHost: true,
      name: 'x',
      roomId: roomId,
    };

    // Initiate game state
    gameStates[roomId] = new GameState(
      Array(9).fill(null),
      'x',
      [playerData],
      roomId
    );
    socket.join(roomId);
    socket.leave(socket.id);

    const gameData: GameData = {
      boardMatrixData: gameStates[roomId].getBoardMatrix(),
      players: gameStates[roomId].getPlayers(),
      currentPlayer: gameStates[roomId].getCurrentPlayer(),
      roomId: roomId,
    };

    // Return data to set on client
    socket.emit(SOCKET_EVENTS.isHosting, {
      gameData,
    });
  });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
