import { useGameState } from '../lib/gameState';
import { useCallback, useEffect, useState } from 'react';
import RollDie from './rollDie';
import './players.css';

function PlayerRoll({ turn, currentTurn, diceConfig, onComplete }) {
  const [rollDice, setRollDice] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (rollDice) {
      setRollDice(false);
    }
  }, [rollDice]);

  const onRollDiceCliked = () => {
    setRollDice(true);
  };

  const onDiceRolled = useCallback((result) => {
    setResults((r) => [...r, result]);
  }, []);

  useEffect(() => {
    if (results.length === diceConfig.length) {
      setResults([]);
      onComplete(results);
    }
  }, [onComplete, diceConfig.length, results]);

  if (turn > currentTurn) return null;

  return (
    <div className="player-roll">
      <button
        type="button"
        onClick={onRollDiceCliked}
        disabled={turn !== currentTurn}
      >
        Jugador {turn} {turn === currentTurn && ', ¡Tira!'}
      </button>
      <div className="player-roll__dice-container">
        {diceConfig?.map((value, idx) => (
          <RollDie
            key={idx}
            faces={value.faces}
            roll={rollDice}
            onComplete={onDiceRolled}
          />
        ))}
      </div>
    </div>
  );
}

export default function Players() {
  const [gameState, send] = useGameState();
  const { players, playerTurn, diceSettings } = gameState.context;
  const playersUI = [];

  const onPlayerRoll = useCallback(
    (result) => {
      send({
        type: 'ROLLED',
        value: {
          result,
        },
      });
    },
    [send]
  );

  if (gameState.matches('planning')) return null;

  for (let index = 0; index < players; index++) {
    playersUI.push(
      <PlayerRoll
        key={index}
        turn={index + 1}
        currentTurn={playerTurn}
        diceConfig={diceSettings}
        onComplete={onPlayerRoll}
      />
    );
  }
  return <>{playersUI}</>;
}
