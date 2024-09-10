import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket | null;

export const SocketContext = createContext<SocketContextType>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  const host =
    import.meta.env.VITE_MODE === 'production'
      ? 'http'
      : 'http://localhost:3001';

  useEffect(() => {
    const newSocket = io(host);

    function onConnect() {
      setSocket(newSocket);
    }

    newSocket.on('connect', onConnect);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
