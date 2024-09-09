import { useContext } from 'react';

import { GameContext } from '../contexts/game-provicer/game-provider';

export const useGame = () => {
  return useContext(GameContext);
};
