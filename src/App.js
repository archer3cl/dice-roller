import './App.css';
import ConfigurationForm from './components/configurationForm';
import FinalScore from './components/finalScore';
import { GameStateProvider } from './lib/gameState';
import Players from './components/players';

function App() {
  return (
    <GameStateProvider>
      <div className="App">
        <h1>Dice Roller</h1>
        <ConfigurationForm />
        <Players />
        <FinalScore />
      </div>
    </GameStateProvider>
  );
}

export default App;
