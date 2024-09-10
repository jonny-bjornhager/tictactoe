import { useGame } from '@tictactoe/client/hooks';
import { CurrentPlayer } from '@tictactoe/shared';
import s from './lobby.module.css';
import { Loader } from '../loader/loader';

interface LobbyProps {
  playerName: CurrentPlayer | null;
}

export const Lobby: React.FC<LobbyProps> = ({ playerName }) => {
  const { roomId } = useGame();

  const formattedRoomId = roomId?.replace('game_', '');
  return (
    <div className={s['lobby']}>
      <div className={s['id-click-container']}>
        <span>Lobby ID:</span>
        <button>{formattedRoomId}</button>
      </div>
      <span>You are player: {playerName}</span>
      <Loader />
      <span>Waiting for other player...</span>
      <a href="/" className={s['quit']}>
        Quit Game
      </a>
    </div>
  );
};
