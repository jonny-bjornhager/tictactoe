import s from './join-game.module.css';

interface JoinRoomProps {
  errorMsg: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHostRoom: () => void;
  onJoinRoom: () => void;
}

export const JoinGame: React.FC<JoinRoomProps> = ({
  errorMsg,
  onChange,
  onHostRoom,
  onJoinRoom,
}) => {
  return (
    <div className={s['join-game']}>
      <button className={s['btn']} onClick={onHostRoom}>
        Host a game
      </button>
      <span>Or...</span>
      <div className={s['join-section']}>
        <input
          minLength={20}
          maxLength={20}
          className={s['room-input']}
          placeholder="Enter a room ID..."
          onChange={onChange}
        />
        <button className={s['btn']} onClick={onJoinRoom}>
          Join
        </button>
      </div>
      {errorMsg}
    </div>
  );
};
