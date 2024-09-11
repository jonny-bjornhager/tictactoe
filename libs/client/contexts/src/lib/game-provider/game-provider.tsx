import React, { createContext, useState } from 'react';
import {
  BoardMatrix,
  CurrentPlayer,
  PlayerData,
} from '@tictactoe/shared/types';

interface GameContextProps {
  boardMatrix: BoardMatrix;
  currentPlayer: CurrentPlayer;
  roomId: string | null;
  players: PlayerData[];
  gameOver: boolean;
  setBoardMatrix: React.Dispatch<React.SetStateAction<BoardMatrix>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<CurrentPlayer>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameContext = createContext<GameContextProps>({
  boardMatrix: [],
  currentPlayer: 'x',
  roomId: null,
  players: [],
  gameOver: false,
  setBoardMatrix: () => {},
  setCurrentPlayer: () => {},
  setRoomId: () => {},
  setPlayers: () => {},
  setGameOver: () => {},
});

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [boardMatrix, setBoardMatrix] = useState<BoardMatrix>(
    Array(9).fill(null)
  );
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer>('x');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  return (
    <GameContext.Provider
      value={{
        boardMatrix,
        currentPlayer,
        roomId,
        players,
        gameOver,
        setBoardMatrix,
        setCurrentPlayer,
        setRoomId,
        setPlayers,
        setGameOver,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
