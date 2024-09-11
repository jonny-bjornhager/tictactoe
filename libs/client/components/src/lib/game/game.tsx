import { Board } from '../board/board';
import { Scores } from '../scores/scores';
import s from './game.module.css';

interface GameProps {
  message?: string | null;
  myTurn: boolean;
}

export const Game: React.FC<GameProps> = ({ message, myTurn }) => {
  return (
    <div className={s['game']}>
      {message && <h2>{message}</h2>}
      <Board myTurn={myTurn} />
      <Scores myTurn={myTurn} />
    </div>
  );
};
