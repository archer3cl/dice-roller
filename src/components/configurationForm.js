import { useState } from 'react';
import './configurationForm.css';

export default function ConfigurationForm({ onSubmitConfiguration }) {
  const newDie = { faces: 6 };
  const [diceConfiguration, setDiceConfiguration] = useState([newDie]);
  const [players, setPlayers] = useState(1);

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmitConfiguration({ players, dice: diceConfiguration });
  }

  function handleDiceNumberChange(evt) {
    if (evt.target.value === diceConfiguration.length) return;
    if (evt.target.value < diceConfiguration.length) {
      const updatedDice = [...diceConfiguration];
      updatedDice.splice(evt.target.value);
      setDiceConfiguration(updatedDice);
    } else {
      setDiceConfiguration([
        ...diceConfiguration,
        ...Array.from(
          { length: evt.target.value - diceConfiguration.length },
          () => {
            return { ...newDie };
          }
        ),
      ]);
    }
  }

  function handleDieFaceChange(evt) {
    const updatedDice = [...diceConfiguration];
    updatedDice[evt.target.dataset.idx].faces = parseInt(evt.target.value, 10);
    setDiceConfiguration(updatedDice);
  }

  function handlePlayersChange(evt) {
    setPlayers(parseInt(evt.target.value, 10));
  }

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
          value={diceConfiguration.length}
          onChange={handleDiceNumberChange}
        />
      </div>
      <div className="configurationForm__die-config-container">
        {diceConfiguration.map((val, idx) => {
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
