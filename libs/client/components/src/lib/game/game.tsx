import { Board } from '../board/board';
import { Scores } from '../scores/scores';
import s from './game.module.css';

interface GameProps {
  myTurn: boolean;
}

export const Game: React.FC<GameProps> = ({ message, myTurn }) => {
  return (
    <div className={s['game']}>
      <Board myTurn={myTurn} />
      <Scores myTurn={myTurn} />
    </div>
  );
};
