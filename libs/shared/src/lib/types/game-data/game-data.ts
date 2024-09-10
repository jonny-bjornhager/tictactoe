import { BoardMatrix } from '../board-matrix/board-matrix';
import { CurrentPlayer } from '../current-player/current-player';
import { PlayerData } from '../player-data/player-data';

export interface HostGameData {
  roomId: string;
  players: PlayerData[];
  boardMatrixData: BoardMatrix;
  currentPlayer: CurrentPlayer;
}

export interface ClientGameData {
  roomId: string;
  players: PlayerData[];
  currentPlayer: CurrentPlayer;
  gameStarted: boolean;
}
