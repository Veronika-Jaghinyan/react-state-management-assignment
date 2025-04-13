import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import GameStats from '../components/molecule/GameStats';
import GameBoard from '../components/organizm/GameBoard';
import GameFooter from '../components/molecule/GameFooter';
import Win from '../components/organizm/Win';
import CoinTossPopup from '../components/organizm/CoinTossPopup';
import Toast from '../components/atom/Toast';
import { useGameStore } from '../stores/useGameStore';
import { usePlayersStore } from '../stores/usePlayersStore';
import { useCardsStore } from '../stores/useCardsStore';
import { useTimerStore } from '../stores/useTimerStore';

function Game() {
  const navigate = useNavigate();
  const { gameId } = useParams();

  const storeGameId = useGameStore(state => state.gameId);
  const gameEndedAt = useGameStore(state => state.gameEndedAt);
  const setGameStartedAt = useGameStore(state => state.setGameStartedAt);
  const resetGameStorePartial = useGameStore(state => state.resetGameStorePartial);
  const activePlayer = usePlayersStore(state => state.activePlayer);
  const setNextPlayer = usePlayersStore(state => state.setNextPlayer);
  const resetPlayersPartial = usePlayersStore(state => state.resetPlayersPartial);
  const resetActivePlayer = usePlayersStore(state => state.resetActivePlayer);
  const startPlayerTimer = usePlayersStore(state => state.startPlayerTimer);

  const firstPlayerName = usePlayersStore(state => {
    if (activePlayer !== null) {
      return state.players[activePlayer].name;
    }
    return null;
  });
  const resetTimerStore = useTimerStore(state => state.resetTimerStore);
  const resetCardsStore = useCardsStore(state => state.resetCardsStore);

  useEffect(() => {
    // If store data is invalid navigate home
    if (gameId && parseInt(storeGameId) !== parseInt(gameId)) {
      navigate('/');
    }
  }, [gameId, storeGameId]);

  useEffect(() => {
    // Start/Restart player timer after setting active player
    typeof activePlayer === 'number' && startPlayerTimer(activePlayer);
  }, []);

  const handleSetPlayer = playerIndex => {
    setGameStartedAt(new Date().toISOString());
    console.log('playerIndex', playerIndex);
    setNextPlayer(playerIndex);
  };

  const handleReset = newGame => {
    resetGameStorePartial();
    resetPlayersPartial();
    resetTimerStore();
    resetCardsStore();
    resetActivePlayer();
    newGame && navigate('/');
  };

  if (gameId && parseInt(storeGameId) !== parseInt(gameId)) return;

  return gameEndedAt ? (
    <Win />
  ) : (
    <>
      <div className="d-flex gap-10">
        <GameStats playerIndex={0} />
        <GameBoard />
        <GameStats playerIndex={1} />
        {activePlayer === null ? <CoinTossPopup setFirstPlayer={handleSetPlayer} /> : null}
        {firstPlayerName ? <Toast message={`${firstPlayerName} starts the game.`} /> : null}
      </div>
      <GameFooter handleGameRestart={() => handleReset()} handleNewGame={() => handleReset(true)} />
    </>
  );
}

export default Game;
