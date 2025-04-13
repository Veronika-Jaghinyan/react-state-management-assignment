import { useEffect, useState } from 'react';
import { usePlayersStore } from '../../stores/usePlayersStore';
import Input from '../atom/Input';

function PlayerNameInput({ playerIndex, updateStore }) {
  const updatePlayerName = usePlayersStore(state => state.updatePlayerName);
  const storePlayerName = usePlayersStore(state => state.players[playerIndex].name);

  const [playerName, setPlayerName] = useState(storePlayerName);

  useEffect(() => {
    if (updateStore) {
      updatePlayerName(playerIndex, playerName);
    }
  }, [playerName, updateStore]);

  return (
    <Input
      id={`player-${playerIndex + 1}-name`}
      value={playerName}
      onChange={setPlayerName}
      placeholder={'Type name'}
      label={`Player ${playerIndex + 1} name`}
      maxLength={50}
    />
  );
}

export default PlayerNameInput;
