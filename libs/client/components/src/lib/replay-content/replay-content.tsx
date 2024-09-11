import { Button } from '../button/button';
import s from './replay-content.module.css';

interface ReplayContent {
  headline: string | null;
  onReplay: () => void;
  onQuit: () => void;
}

export const ReplayContent: React.FC<ReplayContent> = ({
  headline,
  onReplay,
  onQuit,
}) => {
  return (
    <div className={s['replay-content']}>
      <h2>{headline}</h2>
      <div className={s['buttons']}>
        <Button onClick={onReplay}>Play again</Button>
        <Button onClick={onQuit}>Quit Game</Button>
      </div>
    </div>
  );
};
