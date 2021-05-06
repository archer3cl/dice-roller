import { useGameState } from '../lib/gameState';

export default function FinalScore() {
  const [gameState, send] = useGameState();
  const { results } = gameState.context;
  if (!gameState.matches('gameover')) return null;

  const flatResults = results.map((r) => r.reduce((a, b) => a + b, 0));
  const largestValue = Math.max(...flatResults);

  return (
    <div>
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
      <button type="button" onClick={() => send('REPLAY')}>
        Repetir
      </button>
      <button type="button" onClick={() => send('RESET')}>
        Comenzar de nuevo
      </button>
    </div>
  );
}
