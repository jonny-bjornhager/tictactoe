import { useEffect, useState } from 'react';
import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import { useGame, useSocket } from '@tictactoe/client/hooks';
import { Game, JoinGame, Lobby } from '@tictactoe/client/components';
import {
  ClientGameData,
  CurrentPlayer,
  GameOverData,
  HostGameData,
  Message,
  PlayerData,
  UpdatedBoardData,
} from '@tictactoe/shared';

export function App() {
  const socket = useSocket();
  const { setPlayers, setBoardMatrix, setRoomId } = useGame();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [inLobby, setInLobby] = useState<boolean>(false);
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<CurrentPlayer | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer | null>('x');
  const [myTurn, setMyTurn] = useState<boolean>(false);

  const canJoin = roomIdInput.length >= 4;

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
      setInLobby(true);
      setPlayers(data.players);
      setBoardMatrix(data.boardMatrixData);
      setCurrentPlayer(data.currentPlayer);
      setPlayerName('x');
    }

    function onJoinGame(data: ClientGameData) {
      setRoomId(data.roomId);
      setGameStarted(data.gameStarted);
      setInLobby(!data.gameStarted);
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
      setPlayerName('o');
      socket?.emit(SOCKET_EVENTS.startGame, {
        roomId: data.roomId,
      });
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

    function onGameStarted(data: { gameStarted: boolean }) {
      setGameStarted(data.gameStarted);
      setInLobby(false);
    }

    socket?.on(SOCKET_EVENTS.isHosting, onHostGame);
    socket?.on(SOCKET_EVENTS.hasJoined, onJoinGame);
    socket?.on(SOCKET_EVENTS.updateBoard, onUpdateBoard);
    socket?.on(SOCKET_EVENTS.enterDisallowed, onEnterDisallowed);
    socket?.on(SOCKET_EVENTS.gameOver, onGameOver);
    socket?.on(SOCKET_EVENTS.gameStarted, onGameStarted);

    return () => {
      socket?.off(SOCKET_EVENTS.isHosting, onHostGame);
      socket?.off(SOCKET_EVENTS.hasJoined, onJoinGame);
      socket?.off(SOCKET_EVENTS.updateBoard, onUpdateBoard);
      socket?.off(SOCKET_EVENTS.enterDisallowed, onEnterDisallowed);
      socket?.off(SOCKET_EVENTS.gameStarted, onGameStarted);
    };
  }, [socket, setPlayers, setBoardMatrix, setRoomId]);

  useEffect(() => {
    if (playerName && currentPlayer) {
      setMyTurn(currentPlayer === playerName);
    }
  }, [playerName, currentPlayer]);

  return (
    <main>
      {!gameStarted && !inLobby && (
        <JoinGame
          onChange={handleRoomInputChange}
          onHostGame={handleHostGame}
          onJoinGame={handleJoinGame}
          errorMsg={errorMsg}
          canJoin={canJoin}
        />
      )}
      {inLobby && !gameStarted && <Lobby playerName={playerName} />}
      {!inLobby && gameStarted && <Game message={message} myTurn={myTurn} />}
    </main>
  );
}

export default App;
