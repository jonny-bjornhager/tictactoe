// useSocket.ts
import { useContext } from 'react';
import { SocketContext } from '../contexts/socket-provider/socket-provider';
import { Socket } from 'socket.io-client';

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};
