import { useEffect, useRef, useState } from 'react';
import Die from './die';

export default function RollDie({ faces, roll }) {
  const [state, setState] = useState('');
  const [displayValue, setDisplayValue] = useState(1);
  const [result, setResult] = useState();
  const dieValues = Array.from({ length: faces }, (_, i) => i + 1);
  const prevResultRef = useRef();

  useEffect(() => {
    prevResultRef.current = result;
  });

  const prevCount = prevResultRef.current;

  useEffect(() => {
    if (roll) {
      setState('ROLLING');
      setTimeout(() => {
        setState('RESULT');
      }, 500);
    }
  }, [roll]);

  useEffect(() => {
    let intervalId;

    if (state === 'ROLLING') {
      intervalId = setInterval(() => {
        setDisplayValue(Math.ceil(Math.random() * dieValues.length));
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [state, displayValue, dieValues]);

  useEffect(() => {
    if (state === 'RESULT') {
      if (prevCount && dieValues.length > 1) {
        dieValues.splice(dieValues.indexOf(prevCount), 1);
      }
      setResult(dieValues[Math.floor(Math.random() * dieValues.length)]);
    }
  }, [state]);

  if (state === 'ROLLING') return <Die value={displayValue} />;

  return <Die value={result} />;
}
