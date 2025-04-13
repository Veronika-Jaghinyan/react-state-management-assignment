import { usePlayersStore } from '../../stores/usePlayersStore.js';
import { calculateAccuracy } from '../../utils/index.js';
import StatsCard from './StatsCard';
import Timer from './Timer.jsx';

function GameStats({ playerIndex }) {
  const activePlayer = usePlayersStore(state => state.activePlayer);
  const player = usePlayersStore(state => state.players[playerIndex]);

  return (
    <div key={player.name} className={`game-stats ${playerIndex === activePlayer ? 'active' : ''}`}>
      <div className={`player-name `}>{player.name}</div>
      <Timer duration={player.duration} isActivePlayer={playerIndex === activePlayer} />
      <StatsCard label="Score" value={player.score} />
      <StatsCard label="Moves" value={player.moves} />
      <StatsCard label="Accuracy" value={`${calculateAccuracy(player.score, player.moves)}%`} />
    </div>
  );
}

export default GameStats;
