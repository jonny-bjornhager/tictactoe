import { BoardMatrix } from '../board-matrix/board-matrix';
import { CurrentPlayer } from '../current-player/current-player';

export interface ReloadData {
  boardMatrix: BoardMatrix;
  currentPlayer: CurrentPlayer;
  gameOver: boolean;
}
