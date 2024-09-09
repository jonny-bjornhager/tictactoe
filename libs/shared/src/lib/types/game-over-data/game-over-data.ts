import { BoardMatrix } from '../board-matrix/board-matrix';
import { CurrentPlayer } from '../current-player/current-player';
import { Message } from '../message/message';

export interface GameOverData {
  boardMatrix: BoardMatrix;
  message: string | null;
  myTurn: boolean;
}
