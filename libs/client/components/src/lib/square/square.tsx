import clsx from 'clsx';

import s from './square.module.css';
import { animated, useSpring } from '@react-spring/web';

interface SquareProps {
  onClick: () => void;
  value: string | null;
}

export const Square: React.FC<SquareProps> = ({ onClick, value }) => {
  const [props] = useSpring(
    () => ({
      config: { mass: 1, tension: 800, friction: 18 },
      from: { opacity: 0, scale: 0 },
      to: { opacity: 1, scale: 1 },
      reset: true,
    }),
    [value]
  );

  const classNames = clsx({
    [s['x']]: value === 'x',
    [s['o']]: value === 'o',
  });
  return (
    <div className={s['square']}>
      <button type="button" aria-label="Game square" onClick={onClick} />
      {value !== null && (
        <animated.div className={s['outer']} style={props}>
          <div className={classNames}></div>
        </animated.div>
      )}
    </div>
  );
};
