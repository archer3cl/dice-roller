import { assign, createMachine } from 'xstate';

const initialContext = {
  players: 1,
  playerTurn: 1,
  diceSettings: [],
  results: [],
  prevResults: [],
};

// ACTIONS

const setContextForIngame = assign({
  players: (_, event) => event.value.players,
  diceSettings: (_, event) => event.value.diceSettings,
});

const addResult = assign({
  results: (context, event) => [...context.results, event.value.result],
});

const increasePlayerTurn = assign({
  playerTurn: (context, _) => context.playerTurn + 1,
});

const resetContextForReplay = assign({
  playerTurn: (_context, _) => 1,
  results: (_context, _) => [],
  prevResults: (_context, _) => [..._context.results],
});

const resetToInitialContext = assign(() => {
  return { ...initialContext };
});

// GUARDS
const arePendingTurns = (context, _) => {
  return context.playerTurn < context.players;
};

const allPlayersRolled = (context, _) => {
  return context.playerTurn === context.players;
};

export const gameMachine = createMachine(
  {
    id: 'game',
    context: initialContext,
    initial: 'planning',
    states: {
      planning: {
        on: {
          PLAY: {
            target: 'ingame',
            actions: 'setContextForIngame',
          },
        },
      },
      ingame: {
        initial: 'waiting',
        type: 'compound',
        states: {
          waiting: {
            on: {
              ROLLED: {
                target: 'turnover',
                actions: 'addResult',
              },
            },
          },
          turnover: {
            always: [
              {
                target: '#game.gameover',
                cond: 'allPlayersRolled',
                actions: 'increasePlayerTurn',
              },
              {
                target: 'waiting',
                cond: 'arePendingTurns',
                actions: 'increasePlayerTurn',
              },
            ],
          },
        },
      },
      gameover: {
        on: {
          REPLAY: {
            target: 'ingame',
            actions: 'resetContextForReplay',
          },
        },
      },
    },
    on: {
      RESET: {
        target: 'planning',
        actions: 'resetToInitialContext',
      },
    },
  },

  {
    actions: {
      setContextForIngame,
      addResult,
      increasePlayerTurn,
      resetToInitialContext,
      resetContextForReplay,
    },
    guards: {
      arePendingTurns,
      allPlayersRolled,
    },
  }
);
