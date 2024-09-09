import React, { createContext, useState } from 'react';
import { Player } from '@tictactoe/shared/types';

type BoardMatrix = (string | null)[];

interface GameContextProps {
  boardMatrix: BoardMatrix;
  roomId: string | null;
  playersInRoom: Player[];

  setBoardMatrix: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  setPlayersInRoom: React.Dispatch<React.SetStateAction<Player[]>>;
}

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameContext = createContext<GameContextProps>({
  boardMatrix: [],
  roomId: null,
  playersInRoom: [],
  setBoardMatrix: () => {},
  setRoomId: () => {},
  setPlayersInRoom: () => {},
});

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [boardMatrix, setBoardMatrix] = useState<BoardMatrix>(
    Array(9).fill(null)
  );
  const [playersInRoom, setPlayersInRoom] = useState<Player[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);

  return (
    <GameContext.Provider
      value={{
        boardMatrix,
        roomId,
        playersInRoom,
        setBoardMatrix,
        setRoomId,
        setPlayersInRoom,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
