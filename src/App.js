import './App.css';
import ConfigurationForm from './components/configurationForm';
import { useCallback, useEffect, useState } from 'react';
import RollDie from './components/rollDie';
import { useMachine } from '@xstate/react';
import { gameMachine } from './machines/gameMachine';

function PlayerRoll({ turn, diceConfig, onComplete, display, active }) {
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
      onComplete(results);
    }
  }, [onComplete, diceConfig.length, results]);

  if (!display) return null;

  return (
    <div>
      <button type="button" onClick={onRollDiceCliked} disabled={!active}>
        Jugador {turn} {active && ', ¡Tira!'}
      </button>
      <div className="App__dice-container">
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

function Players({ amount, diceConfig, onGameOver }) {
  const [results, setResults] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(0);
  const players = [];

  const onPlayerRollComplete = useCallback((result) => {
    setResults((r) => [...r, result]);
    setPlayerTurn((t) => t + 1);
  }, []);

  useEffect(() => {
    if (results.length === amount) {
      onGameOver(results);
    }
  }, [onGameOver, amount, results]);

  for (let index = 0; index < amount; index++) {
    players.push(
      <PlayerRoll
        key={index}
        turn={index + 1}
        diceConfig={diceConfig}
        onComplete={onPlayerRollComplete}
        display={index <= playerTurn}
        active={index === playerTurn}
      />
    );
  }
  return <>{players}</>;
}

function App() {
  const [gameConfiguration, setGameConfiguration] = useState({});
  const [current, send] = useMachine(gameMachine);
  const [gameResults, setGameResults] = useState([]);

  const onSubmitConfiguration = (configuration) => {
    setGameConfiguration(configuration);
    send('PLAY');
  };

  const onResetGame = () => {
    send('RESET');
  };

  const onGameOver = (results) => {
    setGameResults(results);
    send('GAMEOVER');
  };

  const ResultsComponent = () => {
    const flatResults = gameResults.map((r) => r.reduce((a, b) => a + b, 0));
    const largestValue = Math.max(...flatResults);

    return (
      <div>
        Se acabo.
        <ul>
          {flatResults.map((value, index) => (
            <li key={index}>
              Jugador {index + 1} - {value} puntos{' '}
              {value === largestValue && '¡GANADOR!'}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Dice Roller</h1>
      {current.matches('planning') && (
        <ConfigurationForm onSubmitConfiguration={onSubmitConfiguration} />
      )}
      {!current.matches('planning') && (
        <Players
          amount={gameConfiguration.players}
          diceConfig={gameConfiguration.dice}
          onGameOver={onGameOver}
        />
      )}

      {current.matches('gameover') && (
        <>
          <ResultsComponent />
          <button type="button" onClick={onResetGame}>
            Reiniciar
          </button>
        </>
      )}
    </div>
  );
}

export default App;
