import { useEffect, useState } from 'react';
import { useSocket } from './hooks/useSocket';

import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import styles from './App.module.css';

import { JoinGame } from '@tictactoe/client/components';

export function App() {
  const socket = useSocket();
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleRoomInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setRoomIdInput(event.target.value);
    if (errorMsg) {
      setErrorMsg(null);
    }
  }

  function handleJoinRoom() {
    if (!roomIdInput) {
      return;
    }
    socket?.emit(SOCKET_EVENTS.joinGame, {
      id: socket.id,
      isHost: false,
      name: 'o',
      roomId: `room_${roomIdInput}`,
    });
  }

  function handleHostRoom() {
    socket?.emit(SOCKET_EVENTS.hostGame);
  }

  return (
    <main>
      <JoinGame
        onChange={handleRoomInputChange}
        onHostRoom={handleHostRoom}
        onJoinRoom={handleJoinRoom}
        errorMsg={errorMsg}
      />
    </main>
  );
}

export default App;
