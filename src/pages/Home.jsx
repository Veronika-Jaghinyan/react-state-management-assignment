import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Levels from '../components/organizm/Levels';
import Button from '../components/atom/Button';
import PlayerNameInput from '../components/molecule/PlayerNameInput';
import { useGameStore } from '../stores/useGameStore';
import { useTimerStore } from '../stores/useTimerStore';
import { useCardsStore } from '../stores/useCardsStore';
import { usePlayersStore } from '../stores/usePlayersStore';

function Home() {
  const navigate = useNavigate();

  const setGameId = useGameStore(state => state.setGameId);
  const resetGameStorePartial = useGameStore(state => state.resetGameStorePartial);
  const resetPlayersPartial = usePlayersStore(state => state.resetPlayersPartial);
  const resetActivePlayer = usePlayersStore(state => state.resetActivePlayer);
  const resetTimerStore = useTimerStore(state => state.resetTimerStore);
  const resetCardsStore = useCardsStore(state => state.resetCardsStore);

  const [updateStore, setUpdateStore] = useState(false);

  useEffect(() => {
    //Reset stores before starting new game
    resetTimerStore();
    resetCardsStore();
    resetPlayersPartial();
    resetActivePlayer();
    resetGameStorePartial();
  }, []);

  const handleStartGame = e => {
    e.preventDefault();
    const gameId = new Date().getTime();
    setGameId(gameId);
    setUpdateStore(true);
    navigate(`/${gameId}`);
  };

  return (
    <div className="home-page-container">
      <form onSubmit={handleStartGame} className="form-container">
        <PlayerNameInput playerIndex={0} updateStore={updateStore} />
        <PlayerNameInput playerIndex={1} updateStore={updateStore} />
        <Levels updateStore={updateStore} />
        <Button type="submit" name="Start the Game" className="primary-btn my-2 w-100" />
      </form>
    </div>
  );
}

export default Home;
