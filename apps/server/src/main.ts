import express from 'express';
import { configDotenv } from 'dotenv';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import {
  ClientGameData,
  HostGameData,
  PlayerData,
} from '@tictactoe/shared/types';
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
    const roomId = `game_${socket.id}`;
    const playerData: PlayerData = {
      id: socket.id,
      isHost: true,
      name: 'x',
      roomId: `${roomId}`,
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

    const hostGameData: HostGameData = {
      boardMatrixData: gameStates[roomId].getBoardMatrix(),
      players: gameStates[roomId].getPlayers(),
      currentPlayer: gameStates[roomId].getCurrentPlayer(),
      roomId: roomId,
    };

    // Return data to set on client
    socket.emit(SOCKET_EVENTS.isHosting, {
      hostGameData,
    });
  });

  // When a player joins a hosted room
  socket.on(SOCKET_EVENTS.joinGame, (data: PlayerData) => {
    const roomId = data.roomId;
    const roomExists = io.sockets.adapter.rooms.get(roomId);
    const gameState = gameStates[roomId];

    // If the room doesn't exist or is full, send a message and return
    if (!roomExists) {
      socket.emit(SOCKET_EVENTS.enterDisallowed, {
        message: "Can't find room. Please try another one.",
      });
      return;
    } else if (gameState.getPlayers().length === 2) {
      socket.emit(SOCKET_EVENTS.enterDisallowed, {
        message: 'That game is full. Please join another room.',
      });
      return;
    } else {
      const joinedPlayer: PlayerData = {
        id: data.id,
        isHost: data.isHost,
        name: data.name,
        roomId: roomId,
      };

      gameState.setPlayers([...gameState.getPlayers(), joinedPlayer]);
      socket.leave(socket.id);
      socket.join(roomId);

      const clientGameData: ClientGameData = {
        players: gameState.getPlayers(),
        currentPlayer: gameState.getCurrentPlayer(),
        roomId: roomId,
      };

      socket.emit(SOCKET_EVENTS.hasJoined, clientGameData);
    }
  });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
