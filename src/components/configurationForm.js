import { useState } from 'react';
import './configurationForm.css';

export default function ConfigurationForm({ onSubmitConfiguration }) {
  const newDie = { faces: 6 };
  const [diceConfigurationState, setDiceConfigurationState] = useState([
    newDie,
  ]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onSubmitConfiguration(diceConfigurationState);
  }

  function handleDiceNumberChange(evt) {
    if (evt.target.value === diceConfigurationState.length) return;
    if (evt.target.value < diceConfigurationState.length) {
      const updatedDice = [...diceConfigurationState];
      updatedDice.splice(evt.target.value);
      setDiceConfigurationState(updatedDice);
    } else {
      setDiceConfigurationState([
        ...diceConfigurationState,
        ...Array.from(
          { length: evt.target.value - diceConfigurationState.length },
          () => {
            return { ...newDie };
          }
        ),
      ]);
    }
  }

  function handleDieFaceChange(evt) {
    const updatedDice = [...diceConfigurationState];
    updatedDice[evt.target.dataset.idx].faces = parseInt(evt.target.value, 10);
    setDiceConfigurationState(updatedDice);
  }

  return (
    <form onSubmit={handleSubmit} className="configurationForm">
      <div className="configurationForm__die-amount">
        <label htmlFor="diceNumber">Número de dados: </label>
        <input
          type="number"
          min="1"
          name="diceNumber"
          id="diceNumber"
          value={diceConfigurationState.length}
          onChange={handleDiceNumberChange}
        />
      </div>
      <div className="configurationForm__die-config-container">
        {diceConfigurationState.map((val, idx) => {
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
      <button type="submit">Lanzar</button>
    </form>
  );
}
