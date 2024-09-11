import { animated, useSpring } from '@react-spring/web';
import s from './join-game.module.css';
import { Button } from '../button/button';

interface JoinRoomProps {
  errorMsg: string | null;
  canJoin: boolean;

  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHostGame: () => void;
  onJoinGame: () => void;
}

export const JoinGame: React.FC<JoinRoomProps> = ({
  errorMsg,
  canJoin,
  onChange,
  onHostGame,
  onJoinGame,
}) => {
  const [props] = useSpring(
    () => ({
      config: { mass: 2, tension: 500, friction: 18 },
      from: { opacity: 0, y: -100 },
      to: { opacity: 1, y: 0 },
    }),
    []
  );

  function enterPressed(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      onJoinGame();
    }
  }

  return (
    <animated.div style={props} className={s['join-game']}>
      <Button onClick={onHostGame}>Host Game</Button>
      <span>Or...</span>
      <div className={s['join-section']}>
        <input
          className={s['room-input']}
          placeholder="Enter a room ID..."
          onChange={onChange}
          onKeyUp={enterPressed}
        />
        <button
          disabled={!canJoin}
          className={s['btn-join']}
          onClick={onJoinGame}
        >
          Join
        </button>
      </div>
      <span className={s['error']}>{errorMsg}</span>
    </animated.div>
  );
};
