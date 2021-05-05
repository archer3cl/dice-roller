import { createMachine } from 'xstate';

export const gameMachine = createMachine({
  id: 'game',
  initial: 'planning',
  states: {
    planning: {
      on: { PLAY: 'ingame' },
    },
    ingame: {
      on: { GAMEOVER: 'gameover' },
    },
    gameover: {
      on: { RESET: 'planning' },
    },
  },
});
