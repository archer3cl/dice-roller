import './App.css';
import ConfigurationForm from './components/configurationForm';
import { useEffect, useState } from 'react';
import RollDie from './components/rollDie';

function App() {
  const [diceConfigurationState, setDiceConfigurationState] = useState([]);
  const [rollDiceState, setRollDiceState] = useState(false);

  useEffect(() => {
    if (rollDiceState) {
      setRollDiceState(false);
    }
  }, [rollDiceState]);

  const onSubmitConfiguration = (configuration) => {
    setDiceConfigurationState(configuration);
    setRollDiceState(true);
  };

  return (
    <div className="App">
      <h1>Dice Roller</h1>
      <ConfigurationForm onSubmitConfiguration={onSubmitConfiguration} />
      <div className="App__dice-container">
        {diceConfigurationState.map((value, idx) => (
          <RollDie key={idx} faces={value.faces} roll={rollDiceState} />
        ))}
      </div>
    </div>
  );
}

export default App;
