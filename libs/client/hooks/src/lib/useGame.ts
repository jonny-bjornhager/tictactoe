import { useContext } from 'react';

import { GameContext } from '@tictactoe/client/contexts';

export const useGame = () => {
  return useContext(GameContext);
};
