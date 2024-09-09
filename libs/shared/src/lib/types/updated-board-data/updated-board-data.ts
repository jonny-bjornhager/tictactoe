import { BoardMatrix } from '../board-matrix/board-matrix';
import { CurrentPlayer } from '../current-player/current-player';

export interface UpdatedBoardData {
  boardMatrix: BoardMatrix;
  currentPlayer: CurrentPlayer;
}
