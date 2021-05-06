import { assign, createMachine } from 'xstate';

const ticker = () => (cb) => {
  const interval = setInterval(() => {
    cb('TICK');
  }, 50);
  return () => clearInterval(interval);
};

const timer = () => (cb) => {
  const interval = setTimeout(() => {
    cb('DISPLAY');
  }, 500);
  return () => clearTimeout(interval);
};

export const createDieMachine = (faces) => {
  return createMachine({
    id: 'die',
    initial: 'empty',
    context: {
      faces,
      displayValue: 1,
      value: null,
    },
    states: {
      empty: {
        on: {
          ROLL: 'rolling',
        },
      },
      rolling: {
        invoke: [
          {
            id: 'ticker',
            src: ticker,
          },
          {
            id: 'timer',
            src: timer,
          },
        ],
        on: {
          DISPLAY: {
            target: 'displaying',
            actions: assign({
              value: (ctx) => {
                const dieValues = Array.from(
                  { length: ctx.faces },
                  (_, i) => i + 1
                );
                if (ctx.value) {
                  dieValues.splice(dieValues.indexOf(ctx.value), 1);
                }
                return dieValues[Math.floor(Math.random() * dieValues.length)];
              },
            }),
          },
          TICK: {
            actions: assign({
              displayValue: (ctx) => {
                const newValue = ctx.displayValue + 1;
                return newValue > ctx.faces ? 1 : newValue;
              },
            }),
          },
        },
      },
      displaying: {
        on: {
          ROLL: 'rolling',
        },
      },
    },
  });
};
