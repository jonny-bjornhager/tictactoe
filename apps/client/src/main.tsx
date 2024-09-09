import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './App';

import { GameProvider, SocketProvider } from '@tictactoe/client/contexts';

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
