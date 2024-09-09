import {
  BoardMatrix,
  CurrentPlayer,
  PlayerData,
} from '@tictactoe/shared/types';

import { winConditions } from '@tictactoe/shared';

export class GameState {
  boardMatrix: BoardMatrix;
  currentPlayer: CurrentPlayer;
  players: PlayerData[];
  gameOver: boolean;
  roomId?: string;
  constructor(
    boardMatrix: BoardMatrix,
    currentPlayer: CurrentPlayer,
    players: PlayerData[],
    gameOver: boolean,
    roomId?: string
  ) {
    this.boardMatrix = boardMatrix;
    this.currentPlayer = currentPlayer;
    this.players = players;
    this.gameOver = gameOver;
    this.roomId = roomId;
  }
  setBoardMatrix(input: BoardMatrix) {
    this.boardMatrix = input;
  }
  getBoardMatrix() {
    return this.boardMatrix;
  }
  switchCurrentPlayer(player: CurrentPlayer) {
    if (player === 'x') {
      this.currentPlayer = 'o';
    } else {
      this.currentPlayer = 'x';
    }
  }
  getCurrentPlayer() {
    return this.currentPlayer;
  }

  checkWinner() {
    return winConditions.some((condition) =>
      condition.every((index) => this.boardMatrix[index] === this.currentPlayer)
    );
  }
  checkDraw() {
    const boardIsFull = this.boardMatrix.every((index) => index !== null);
    return boardIsFull && !this.checkWinner();
  }
  setPlayers(input: PlayerData[]) {
    this.players = input;
  }
  getPlayers() {
    return this.players;
  }
  setRoomId(input: string) {
    this.roomId = input;
  }
  getRoomId() {
    return this.roomId;
  }
  getGameOver() {
    return this.gameOver;
  }
  setGameOver(input: boolean) {
    this.gameOver = input;
  }
}
