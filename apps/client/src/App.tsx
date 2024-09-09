import { useEffect, useState } from 'react';
import { useGame, useSocket } from './hooks';

import { SOCKET_EVENTS } from '@tictactoe/shared/constants';

import { JoinGame } from '@tictactoe/client/components';
import { GameData } from '@tictactoe/shared';

export function App() {
  const socket = useSocket();
  const { setPlayersInRoom, setBoardMatrix, setRoomId } = useGame();
  const [isInGame, setIsInGame] = useState<boolean>(false);
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<'x' | 'o' | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'x' | 'o' | null>('x');

  function handleRoomInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setRoomIdInput(event.target.value);
    if (errorMsg) {
      setErrorMsg(null);
    }
  }

  function handleJoinGame() {
    if (!roomIdInput) {
      return;
    }
    socket?.emit(SOCKET_EVENTS.joinGame, {
      id: socket.id,
      isHost: false,
      name: 'o',
      roomId: `${roomIdInput}`,
    });
  }

  function handleHostGame() {
    socket?.emit(SOCKET_EVENTS.hostGame);
  }

  useEffect(() => {
    // Event callbacks
    function onHostGame(data: GameData) {
      setRoomId(`${socket?.id}`);
      setIsInGame(true);
      setPlayersInRoom(data.players);
      setBoardMatrix(data.boardMatrixData);
      setPlayerName('x');
      setCurrentPlayer(data.currentPlayer);
    }

    socket?.on(SOCKET_EVENTS.isHosting, onHostGame);

    return () => {
      socket?.off(SOCKET_EVENTS.isHosting, onHostGame);
    };
  }, [socket, setPlayersInRoom, setBoardMatrix, setRoomId]);

  return (
    <main>
      {!isInGame && (
        <JoinGame
          onChange={handleRoomInputChange}
          onHostRoom={handleHostGame}
          onJoinRoom={handleJoinGame}
          errorMsg={errorMsg}
        />
      )}
    </main>
  );
}

export default App;
