import express from 'express';
import { configDotenv } from 'dotenv';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import {
  BoardMatrix,
  ClientGameData,
  HostGameData,
  PlayerData,
  IncomingMoveData,
  UpdatedBoardData,
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
  // When a player hosts a room
  socket.on(SOCKET_EVENTS.hostGame, () => {
    const roomId = `game_${socket.id}`;
    const playerData: PlayerData = {
      id: 1,
      socketId: socket.id,
      isHost: true,
      name: 'x',
      roomId: roomId,
      score: 0,
    };

    // Initiate game state
    gameStates[roomId] = new GameState(
      Array(9).fill(null),
      'x',
      [playerData],
      false,
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
      ...hostGameData,
    });
  });

  // When a player joins a hosted room
  socket.on(SOCKET_EVENTS.joinGame, (data: PlayerData) => {
    const roomId = `game_${data.roomId}`;
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
        ...data,
        roomId: roomId,
      };

      gameState.setPlayers([...gameState.getPlayers(), joinedPlayer]);
      socket.leave(socket.id);
      socket.join(roomId);

      const clientGameData: ClientGameData = {
        players: gameState.getPlayers(),
        currentPlayer: gameState.getCurrentPlayer(),
        roomId: roomId,
        gameStarted: true,
      };
      socket.to(roomId).emit(SOCKET_EVENTS.hasJoined, clientGameData);
    }
  });

  socket.on(SOCKET_EVENTS.startGame, (data: { roomId: string }) => {
    socket.to(data.roomId).emit(SOCKET_EVENTS.gameStarted, {
      gameStarted: true,
    });
  });

  // When a player makes a move
  socket.on(SOCKET_EVENTS.playerMove, (data: IncomingMoveData) => {
    const { boardMatrix, index, roomId } = data;
    if (!roomId) {
      return;
    }
    //
    const gameState = gameStates[roomId];
    const newMatrix: BoardMatrix = [...boardMatrix];
    newMatrix[index] = gameState.getCurrentPlayer();

    gameState.setBoardMatrix(newMatrix);
    const updatedBoardData: UpdatedBoardData = {
      boardMatrix: gameState.getBoardMatrix(),
      currentPlayer: gameState.getCurrentPlayer(),
    };

    // Check draw
    if (gameState.checkDraw()) {
      gameState.setGameOver(true);
      socket.to(roomId).emit(SOCKET_EVENTS.gameOver, {
        ...updatedBoardData,
        gameOver: gameState.getGameOver(),
        message: "It's a draw!",
      });
      return;
      // Check winner
    } else if (gameState.checkWinner()) {
      gameState.setGameOver(true);
      gameState.updatePlayerScore(gameState.getCurrentPlayer());
      socket.to(roomId).emit(SOCKET_EVENTS.gameOver, {
        ...updatedBoardData,
        gameOver: gameState.getGameOver(),
        message: `${gameState.getCurrentPlayer().toUpperCase()} wins!`,
        myTurn: false,
        players: gameState.getPlayers(),
      });
      return;
      // If no one has won, keep playing
    } else {
      gameState.switchCurrentPlayer(gameState.getCurrentPlayer());
      const updatedBoardData: UpdatedBoardData = {
        boardMatrix: gameState.getBoardMatrix(),
        currentPlayer: gameState.getCurrentPlayer(),
      };
      socket.to(roomId).emit(SOCKET_EVENTS.updateBoard, {
        ...updatedBoardData,
      });
    }
  });

  socket.on(SOCKET_EVENTS.quitGame, (data: { roomId: string }) => {
    socket.to(data.roomId).emit(SOCKET_EVENTS.reloadWindow);
  });

  socket.on(SOCKET_EVENTS.disconnect, (data) => {
    for (const roomId in gameStates) {
      const gameState = gameStates[roomId];
      const updatedPlayerState = gameState
        .getPlayers()
        .filter((player: PlayerData) => player.socketId !== socket.id);
      gameState.setPlayers(updatedPlayerState);

      if (gameState.getPlayers().length === 0) {
        delete gameStates[roomId];
      }
    }
    console.log(data.roomId);
    socket.to(data.roomId).emit(SOCKET_EVENTS.afterDisconnect, {
      boardMatrix: Array(9).fill(null),
    });
  });
});

server.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
