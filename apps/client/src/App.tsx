import { useEffect, useState } from 'react';
import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import { useGame, useSocket } from '@tictactoe/client/hooks';
import { Game, JoinGame } from '@tictactoe/client/components';
import {
  ClientGameData,
  GameOverData,
  HostGameData,
  Message,
  PlayerData,
  UpdatedBoardData,
} from '@tictactoe/shared';

export function App() {
  const socket = useSocket();
  const { setPlayers, setBoardMatrix, setRoomId } = useGame();
  const [isInGame, setIsInGame] = useState<boolean>(false);
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<'x' | 'o' | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'x' | 'o' | null>('x');
  const [myTurn, setMyTurn] = useState<boolean>(false);

  function handleRoomInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setRoomIdInput(event.target.value);
    if (errorMsg) {
      setErrorMsg(null);
    }
  }

  function handleJoinGame() {
    if (!roomIdInput || !socket?.id) {
      return;
    }
    const playerData: PlayerData = {
      id: socket.id,
      isHost: false,
      name: 'o',
      roomId: roomIdInput,
      score: 0,
    };
    socket?.emit(SOCKET_EVENTS.joinGame, { ...playerData });
  }

  function handleHostGame() {
    socket?.emit(SOCKET_EVENTS.hostGame);
  }

  useEffect(() => {
    // Event callbacks
    function onHostGame(data: HostGameData) {
      setRoomId(data.roomId);
      setIsInGame(true);
      setPlayers(data.players);
      setBoardMatrix(data.boardMatrixData);
      setPlayerName('x');
      setCurrentPlayer(data.currentPlayer);
    }

    function onJoinGame(data: ClientGameData) {
      setRoomId(data.roomId);
      setIsInGame(true);
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
      setPlayerName('o');
    }

    function onEnterDisallowed(data: { message: string }) {
      setErrorMsg(data.message);
    }

    function onUpdateBoard(data: UpdatedBoardData) {
      setBoardMatrix(data.boardMatrix);
      setCurrentPlayer(data.currentPlayer);
    }

    function onGameOver(data: GameOverData) {
      setBoardMatrix(data.boardMatrix);
      setMessage(data.message);
      setMyTurn(data.myTurn);
    }

    socket?.on(SOCKET_EVENTS.isHosting, onHostGame);
    socket?.on(SOCKET_EVENTS.hasJoined, onJoinGame);
    socket?.on(SOCKET_EVENTS.updateBoard, onUpdateBoard);
    socket?.on(SOCKET_EVENTS.enterDisallowed, onEnterDisallowed);
    socket?.on(SOCKET_EVENTS.gameOver, onGameOver);

    return () => {
      socket?.off(SOCKET_EVENTS.isHosting, onHostGame);
      socket?.off(SOCKET_EVENTS.hasJoined, onJoinGame);
      socket?.off(SOCKET_EVENTS.updateBoard, onUpdateBoard);
      socket?.off(SOCKET_EVENTS.enterDisallowed, onEnterDisallowed);
    };
  }, [socket, setPlayers, setBoardMatrix, setRoomId]);

  useEffect(() => {
    if (playerName && currentPlayer) {
      console.log(playerName === currentPlayer);
      setMyTurn(currentPlayer === playerName);
    }
  }, [playerName, currentPlayer]);

  return (
    <main>
      {!isInGame && (
        <JoinGame
          onChange={handleRoomInputChange}
          onHostGame={handleHostGame}
          onJoinGame={handleJoinGame}
          errorMsg={errorMsg}
        />
      )}
      {isInGame && <Game message={message} myTurn={myTurn} />}
    </main>
  );
}

export default App;
