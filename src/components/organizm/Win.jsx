import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { calculateAccuracy, formatDuration } from '../../utils';
import { usePlayersStore } from '../../stores/usePlayersStore';
import { useGameStore } from '../../stores/useGameStore';
import StatsCard from '../molecule/StatsCard';
import Button from '../atom/Button';

function Win() {
  const navigate = useNavigate();

  const players = usePlayersStore(state => state.players);
  const selectedLevel = useGameStore(state => state.selectedLevel);
  const resetPlayersPartial = usePlayersStore(state => state.resetPlayersPartial);
  const resetGameStorePartial = useGameStore(state => state.resetGameStorePartial);

  const [winnerIndex, setWinnerIndex] = useState(null);

  useEffect(() => {
    const player1MatchedCards = players[0].score;
    const player2MatchedCards = players[1].score;

    const player1Moves = players[0].moves;
    const player2Moves = players[1].moves;

    if (player1MatchedCards === player2MatchedCards) {
      setWinnerIndex(player1Moves > player2Moves ? 1 : 0);
    } else {
      setWinnerIndex(player1MatchedCards > player2MatchedCards ? 0 : 1);
    }
  }, [players]);

  const handleReset = newGame => {
    resetGameStorePartial();
    resetPlayersPartial();
    newGame && navigate('/');
  };

  return typeof winnerIndex === 'number' ? (
    <div className="win-container">
      <div className="win-container-header">
        <img src="/graphics/level-win.gif" className="celebration-gif" width={150} height={150} alt="Celebration gif" />
        <div className="text-center">
          <img src="/graphics/trophy.svg" className="trophy-icon" width={60} height={60} alt="Trophy icon" />
          <div>{players[winnerIndex].name} wins!</div>
          <div className="d-flex gap-10 align-items-center justify-content-center">
            <StatsCard label="Score" value={players[winnerIndex].score} />
            <StatsCard label="Moves" value={players[winnerIndex].moves} />
          </div>
        </div>
        <img src="/graphics/level-win.gif" className="celebration-gif" width={150} height={150} alt="Celebration gif" />
      </div>
      <div className="win-container-table">
        <div className="text-center">Ranking for board size: {selectedLevel.grid}</div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Player</th>
              <th>Score</th>
              <th>Moves</th>
              <th>Accuracy</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {players.length
              ? players.map((row, index) => (
                  <tr key={row.name}>
                    <td>
                      <div className="d-flex gap-10 align-items-center justify-content-center">
                        {winnerIndex === index ? (
                          <img src={`/graphics/trophy.svg`} width={18} height={18} alt="winner icon" />
                        ) : null}
                      </div>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.score}</td>
                    <td>{row.moves}</td>
                    <td>{calculateAccuracy(row.score, row.moves)}%</td>
                    <td>{formatDuration(row.duration)}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>

        <div className="d-flex gap-10 align-items-center justify-content-center mt-2">
          <Button onClick={() => handleReset()} name="Play again" />
          <Button onClick={() => handleReset(true)} name="New game" />
        </div>
      </div>
    </div>
  ) : null;
}

export default Win;
