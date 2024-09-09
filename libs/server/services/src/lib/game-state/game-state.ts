import { BoardMatrix, CurrentPlayer, Player } from '@tictactoe/shared/types';

export class GameState {
  boardMatrix: BoardMatrix;
  currentPlayer: CurrentPlayer;
  players: Player[];
  roomId?: string;
  constructor(
    boardMatrix: BoardMatrix,
    currentPlayer: CurrentPlayer,
    players: Player[],
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

  setPlayers(input: Player[]) {
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
