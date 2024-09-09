import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './App';

import { SocketProvider } from './contexts/socket-provider/socket-provider';
import { GameProvider } from './contexts/game-provicer/game-provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <GameProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </GameProvider>
  </StrictMode>
);
