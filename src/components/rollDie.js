import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import { createDieMachine } from '../machines/dieMachine';
import Die from './die';

export default function RollDie({ faces = 6, roll, onComplete }) {
  const [state, send, service] = useMachine(createDieMachine(faces), {
    devTools: process.env.NODE_ENV === 'development',
  });
  const { value, displayValue } = state.context;

  useEffect(() => {
    if (roll) {
      send('ROLL');
    }
  }, [roll, send]);

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      if (state.matches('displaying')) {
        onComplete?.(state.context.value);
      }
    });

    return subscription.unsubscribe;
  }, [service, onComplete]);

  if (state.matches('rolling')) return <Die value={displayValue} />;
  return <Die value={value} />;
}
