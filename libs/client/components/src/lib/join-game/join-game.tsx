import s from './join-game.module.css';

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
  return (
    <div className={s['join-game']}>
      <button className={s['btn']} onClick={onHostGame}>
        New Game
      </button>
      <span>Or...</span>
      <div className={s['join-section']}>
        <input
          className={s['room-input']}
          placeholder="Enter a room ID..."
          onChange={onChange}
        />
        <button disabled={!canJoin} className={s['btn']} onClick={onJoinGame}>
          Join
        </button>
      </div>
      {errorMsg}
    </div>
  );
};
