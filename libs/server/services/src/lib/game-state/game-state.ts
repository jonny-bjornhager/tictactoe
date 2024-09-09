import {
  BoardMatrix,
  CurrentPlayer,
  PlayerData,
} from '@tictactoe/shared/types';

export class GameState {
  boardMatrix: BoardMatrix;
  currentPlayer: CurrentPlayer;
  players: PlayerData[];
  roomId?: string;
  constructor(
    boardMatrix: BoardMatrix,
    currentPlayer: CurrentPlayer,
    players: PlayerData[],
    roomId?: string
  ) {
    this.boardMatrix = boardMatrix;
    this.currentPlayer = currentPlayer;
    this.players = players;
    this.roomId = roomId;
  }
  setBoardMatrix(input: BoardMatrix) {
    this.boardMatrix = input;
  }
  getBoardMatrix() {
    return this.boardMatrix;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
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
}
