// useSocket.ts
import { useContext } from 'react';
import { SocketContext } from '@tictactoe/client/contexts';
import { Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};
