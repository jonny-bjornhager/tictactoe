import { BoardMatrix } from '../board-matrix/board-matrix';
import { PlayerData } from '../player-data/player-data';

export interface GameOverData {
  boardMatrix: BoardMatrix;
  message: string | null;
  myTurn: boolean;
  players: PlayerData[];
  gameOver: boolean;
}
