import { useEffect, useRef, useState } from 'react';
import Die from './die';

export default function RollDie({ faces, roll, onComplete }) {
  const [state, setState] = useState('');
  const [displayValue, setDisplayValue] = useState(1);
  const [result, setResult] = useState();
  const prevResultRef = useRef();

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
        const dieValues = Array.from({ length: faces }, (_, i) => i + 1);
        setDisplayValue(Math.ceil(Math.random() * dieValues.length));
      }, 50);
    }

    return () => clearInterval(intervalId);
  }, [state, displayValue, faces]);

  useEffect(() => {
    prevResultRef.current = result;
  });

  useEffect(() => {
    if (state === 'RESULT') {
      const dieValues = Array.from({ length: faces }, (_, i) => i + 1);
      const prevResult = prevResultRef.current;
      if (prevResult && dieValues.length > 1) {
        dieValues.splice(dieValues.indexOf(prevResult), 1);
      }
      var newResult = dieValues[Math.floor(Math.random() * dieValues.length)];
      setResult(newResult);
      onComplete(newResult);
    }
  }, [state, faces, onComplete]);

  if (state === 'ROLLING') return <Die value={displayValue} />;

  return <Die value={result} />;
}
