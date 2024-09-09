import s from './join-game.module.css';

interface JoinRoomProps {
  errorMsg: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHostGame: () => void;
  onJoinGame: () => void;
}

export const JoinGame: React.FC<JoinRoomProps> = ({
  errorMsg,
  onChange,
  onHostGame,
  onJoinGame,
}) => {
  return (
    <div className={s['join-game']}>
      <button className={s['btn']} onClick={onHostGame}>
        Host a game
      </button>
      <span>Or...</span>
      <div className={s['join-section']}>
        <input
          className={s['room-input']}
          placeholder="Enter a room ID..."
          onChange={onChange}
        />
        <button className={s['btn']} onClick={onJoinGame}>
          Join
        </button>
      </div>
      {errorMsg}
    </div>
  );
};
