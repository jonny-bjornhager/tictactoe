import { animated, useSpring } from '@react-spring/web';

import clsx from 'clsx';

import s from './scores.module.css';
import { useGame } from '@tictactoe/client/hooks';
import { PlayerData } from '@tictactoe/shared';

interface ScoreProps {
  myTurn: boolean;
}

export const Scores: React.FC<ScoreProps> = ({ myTurn }) => {
  const { currentPlayer, players } = useGame();
  const [props] = useSpring(
    () => ({
      config: { mass: 2, tension: 800, friction: 18 },
      from: { opacity: 0, y: 100 },
      to: { opacity: 1, y: 0 },
    }),
    []
  );

  function playersMapper(player: PlayerData) {
    const key = `player-${player.id}`;
    const classes = clsx({
      [s['score']]: true,
      [s['highlighted']]: currentPlayer === player.name,
    });

    return (
      <div key={key} className={classes}>
        <h3>Player ({player.name})</h3>
        <span>{player.score}</span>
      </div>
    );
  }

  return (
    <animated.div style={props} className={s['scores']}>
      {players.sort((a, b) => a.id - b.id).map(playersMapper)}
    </animated.div>
  );
};
