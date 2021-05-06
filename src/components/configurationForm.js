import { useState } from 'react';
import { useGameState } from '../lib/gameState';
import './configurationForm.css';

export default function ConfigurationForm() {
  const newDie = { faces: 6 };
  const [diceSettings, setDiceSettings] = useState([newDie]);
  const [players, setPlayers] = useState(1);
  const [gameState, send] = useGameState();

  function handleSubmit(evt) {
    evt.preventDefault();
    send({
      type: 'PLAY',
      value: {
        players,
        diceSettings,
      },
    });
  }

  function handleDiceNumberChange(evt) {
    if (evt.target.value === diceSettings.length) return;
    if (evt.target.value < diceSettings.length) {
      const updatedDice = [...diceSettings];
      updatedDice.splice(evt.target.value);
      setDiceSettings(updatedDice);
    } else {
      setDiceSettings([
        ...diceSettings,
        ...Array.from(
          { length: evt.target.value - diceSettings.length },
          () => {
            return { ...newDie };
          }
        ),
      ]);
    }
  }

  function handleDieFaceChange(evt) {
    const updatedDice = [...diceSettings];
    updatedDice[evt.target.dataset.idx].faces = +evt.target.value;
    setDiceSettings(updatedDice);
  }

  function handlePlayersChange(evt) {
    setPlayers(+evt.target.value);
  }

  if (!gameState.matches('planning')) return null;

  return (
    <form onSubmit={handleSubmit} className="configurationForm">
      <div className="configurationForm__players-amount">
        <label htmlFor="players">Número de jugadores: </label>
        <input
          type="number"
          min="1"
          name="players"
          id="players"
          value={players}
          onChange={handlePlayersChange}
        />
      </div>
      <div className="configurationForm__die-amount">
        <label htmlFor="diceNumber">Número de dados: </label>
        <input
          type="number"
          min="1"
          name="diceNumber"
          id="diceNumber"
          value={diceSettings.length}
          onChange={handleDiceNumberChange}
        />
      </div>
      <div className="configurationForm__die-config-container">
        {diceSettings.map((val, idx) => {
          return (
            <div key={`die-${idx}`} className="configurationForm__die-config">
              <p>Dado {idx + 1}</p>
              <label htmlFor={`die-${idx}-faces`}>Caras: </label>
              <input
                type="number"
                min="2"
                max="6"
                value={val.faces}
                data-idx={idx}
                onChange={handleDieFaceChange}
                name={`die-${idx}-faces`}
                id={`die-${idx}-faces`}
              />
            </div>
          );
        })}
      </div>
      <button type="submit">Comenzar</button>
    </form>
  );
}
