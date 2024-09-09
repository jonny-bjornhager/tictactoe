import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import styles from './app.module.css';

export function App() {
  const socket = useSocket();

  useEffect(() => {}, []);
  return <div></div>;
}

export default App;
