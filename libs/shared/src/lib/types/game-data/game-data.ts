import { BoardMatrix } from '../board-matrix/board-matrix';
import { CurrentPlayer } from '../current-player/current-player';
import { Player } from '../player/player';

export interface GameData {
  roomId: string;
  players: Player[];
  boardMatrixData: BoardMatrix;
  currentPlayer: CurrentPlayer;
}
