import { useMachine } from '@xstate/react';
import { createContext, useContext } from 'react';
import { gameMachine } from '../machines/gameMachine';

const GameStateContext = createContext();
const LocalStateProvider = GameStateContext.Provider;

function GameStateProvider({ children }) {
  const [gameState, send] = useMachine(gameMachine, {
    devTools: process.env.NODE_ENV === 'development',
  });
  const gm = [gameState, send];
  return <LocalStateProvider value={gm}>{children}</LocalStateProvider>;
}

function useGameState() {
  const all = useContext(GameStateContext);
  return all;
}

export { GameStateProvider, useGameState };
