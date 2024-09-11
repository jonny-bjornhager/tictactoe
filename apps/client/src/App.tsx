import { useEffect, useState } from 'react';

import { SOCKET_EVENTS } from '@tictactoe/shared/constants';
import { useGame, useSocket } from '@tictactoe/client/hooks';
import {
  Game,
  JoinGame,
  Lobby,
  Modal,
  ReplayContent,
} from '@tictactoe/client/components';
import {
  BoardMatrix,
  ClientGameData,
  CurrentPlayer,
  GameOverData,
  HostGameData,
  Message,
  PlayerData,
  ReloadData,
  UpdatedBoardData,
} from '@tictactoe/shared';

import s from './App.module.css';

export function App() {
  const socket = useSocket();
  const {
    setPlayers,
    setBoardMatrix,
    setRoomId,
    currentPlayer,
    setCurrentPlayer,
    gameOver,
    setGameOver,
    roomId,
  } = useGame();

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [inLobby, setInLobby] = useState<boolean>(false);
  const [roomIdInput, setRoomIdInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<CurrentPlayer | null>(null);
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
    setPlayerName('o');
    const playerData: PlayerData = {
      id: 2,
      isHost: false,
      name: 'o',
      roomId: roomIdInput,
      socketId: socket?.id,
      score: 0,
    };
    socket?.emit(SOCKET_EVENTS.joinGame, { ...playerData });
  }

  function handleHostGame() {
    socket?.emit(SOCKET_EVENTS.hostGame);
  }

  function handlePlayAgain() {
    socket?.emit(SOCKET_EVENTS.playAgain, {
      roomId: roomId,
      playerName: playerName,
      gameOver: false,
    });
  }

  function handleQuitGame() {
    socket?.emit(SOCKET_EVENTS.quitGame, { roomId: roomId });
  }

  useEffect(() => {
    // Event callbacks
    function onHostGame(data: HostGameData) {
      setRoomId(data.roomId);
      setInLobby(true);
      setPlayers(data.players);
      setBoardMatrix(data.boardMatrixData);
      setPlayerName('x');
    }

    function onJoinGame(data: ClientGameData) {
      setRoomId(data.roomId);
      setGameStarted(data.gameStarted);
      setInLobby(!data.gameStarted);
      setPlayers(data.players);
      socket?.emit(SOCKET_EVENTS.startGame, {
        roomId: data.roomId,
      });
    }

    function onEnterDisallowed(data: Message) {
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
      setPlayers(data.players);
      setGameOver(data.gameOver);
    }

    function onGameStarted(data: { gameStarted: boolean }) {
      setGameStarted(data.gameStarted);
      setInLobby(false);
    }

    function onReloadGame(data: ReloadData) {
      setBoardMatrix(data.boardMatrix);
      setCurrentPlayer(data.currentPlayer);
      setGameOver(false);
    }

    function onReloadWindow() {
      if (!window?.location || typeof window?.location === 'undefined') {
        return;
      }
      window.location.reload();
    }

    socket?.on(SOCKET_EVENTS.isHosting, onHostGame);
    socket?.on(SOCKET_EVENTS.hasJoined, onJoinGame);
    socket?.on(SOCKET_EVENTS.updateBoard, onUpdateBoard);
    socket?.on(SOCKET_EVENTS.enterDisallowed, onEnterDisallowed);
    socket?.on(SOCKET_EVENTS.gameOver, onGameOver);
    socket?.on(SOCKET_EVENTS.gameStarted, onGameStarted);
    socket?.on(SOCKET_EVENTS.reloadWindow, onReloadWindow);
    socket?.on(SOCKET_EVENTS.reloadGame, onReloadGame);

    return () => {
      socket?.off(SOCKET_EVENTS.isHosting, onHostGame);
      socket?.off(SOCKET_EVENTS.hasJoined, onJoinGame);
      socket?.off(SOCKET_EVENTS.updateBoard, onUpdateBoard);
      socket?.off(SOCKET_EVENTS.enterDisallowed, onEnterDisallowed);
      socket?.off(SOCKET_EVENTS.gameStarted, onGameStarted);
      socket?.off(SOCKET_EVENTS.reloadWindow, onReloadWindow);
      socket?.off(SOCKET_EVENTS.reloadGame, onReloadGame);
    };
  }, [
    socket,
    setPlayers,
    setBoardMatrix,
    setRoomId,
    setCurrentPlayer,
    setGameOver,
    gameOver,
  ]);

  useEffect(() => {
    if (playerName && currentPlayer) {
      setMyTurn(currentPlayer === playerName);
    }
  }, [playerName, currentPlayer]);

  useEffect(() => {
    if (gameOver && playerName === currentPlayer) {
      setMyTurn(true);
    }
  }, [playerName, currentPlayer, gameOver]);

  return (
    <main className={s['app']}>
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
      {!inLobby && gameStarted && <Game myTurn={myTurn} />}
      <Modal isOpen={gameOver}>
        <ReplayContent
          headline={message}
          onQuit={handleQuitGame}
          onReplay={handlePlayAgain}
        />
      </Modal>
    </main>
  );
}

export default App;
