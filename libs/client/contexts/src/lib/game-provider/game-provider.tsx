import React, { createContext, useState } from 'react';
import { BoardMatrix, PlayerData } from '@tictactoe/shared/types';

interface GameContextProps {
  boardMatrix: BoardMatrix;
  roomId: string | null;
  players: PlayerData[];
  gameOver: boolean;
  setBoardMatrix: React.Dispatch<React.SetStateAction<BoardMatrix>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameContext = createContext<GameContextProps>({
  boardMatrix: [],
  roomId: null,
  players: [],
  gameOver: false,
  setBoardMatrix: () => {},
  setRoomId: () => {},
  setPlayers: () => {},
  setGameOver: () => {},
});

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [boardMatrix, setBoardMatrix] = useState<BoardMatrix>(
    Array(9).fill(null)
  );
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  return (
    <GameContext.Provider
      value={{
        boardMatrix,
        roomId,
        players,
        gameOver,
        setBoardMatrix,
        setRoomId,
        setPlayers,
        setGameOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
