import { BoardMatrix } from '../board-matrix/board-matrix';

export interface IncomingMoveData {
  boardMatrix: BoardMatrix;
  index: number;
  roomId: string;
}
