import { useGame } from '@tictactoe/client/hooks';
import { CurrentPlayer } from '@tictactoe/shared';
import s from './lobby.module.css';
import { Loader } from '../loader/loader';
import clipboardIcon from './clipboard.svg';
import { animated, useSpring } from '@react-spring/web';

interface LobbyProps {
  playerName: CurrentPlayer | null;
}

export const Lobby: React.FC<LobbyProps> = ({ playerName }) => {
  const { roomId } = useGame();

  const [props] = useSpring(
    () => ({
      config: { mass: 2, tension: 500, friction: 18 },
      from: { opacity: 0, y: 100 },
      to: { opacity: 1, y: 0 },
    }),
    []
  );

  const formattedRoomId = roomId?.replace('game_', '');

  if (!formattedRoomId) {
    return;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedRoomId);
    } catch (error) {
      console.error('Unable to copy to clipboard:', error);
    }
  };

  return (
    <animated.div style={props} className={s['lobby']}>
      <div className={s['id-click-container']}>
        <span>Lobby ID:</span>
        <button title="Copy to clipboard" onClick={handleCopy}>
          {formattedRoomId}
          <img src={clipboardIcon} alt="A copy icon" />
        </button>
      </div>
      <span>You are player: {playerName}</span>
      <Loader />
      <span>Waiting for other player...</span>
      <a href="/" className={s['quit']}>
        Quit Game
      </a>
    </animated.div>
  );
};
