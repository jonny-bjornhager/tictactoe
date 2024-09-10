import { useGame, useSocket } from '@tictactoe/client/hooks';

import { Square } from '../square/square';
import s from './board.module.css';

import clsx from 'clsx';
import { SOCKET_EVENTS } from '@tictactoe/shared';

interface BoardProps {
  myTurn: boolean;
}

export const Board: React.FC<BoardProps> = ({ myTurn }) => {
  const socket = useSocket();
  const { boardMatrix, roomId, gameOver } = useGame();

  function handleClickSquare(index: number) {
    if (boardMatrix[index] !== null) {
      return;
    }
    socket?.emit(SOCKET_EVENTS.playerMove, {
      boardMatrix: boardMatrix,
      index: index,
      roomId: `${roomId}`,
    });
  }

  const classes = clsx({
    [s['board']]: true,
    [s['non-interact']]: !myTurn || gameOver,
  });

  function matrixMapper(value: string | null, index: number) {
    const key = `square-${index}`;
    return (
      <Square
        key={key}
        onClick={() => handleClickSquare(index)}
        value={value}
      />
    );
  }

  return <div className={classes}>{boardMatrix?.map(matrixMapper)}</div>;
};
