import { useEffect, useState } from 'react';
import { gameLevels } from '../../utils/constants';
import { useGameStore } from '../../stores/useGameStore';

function Levels({ updateStore }) {
  const setSelectedLevel = useGameStore(state => state.setSelectedLevel);

  const [selectedLevelTemp, setSelectedLevelTemp] = useState(gameLevels[0]);

  useEffect(() => {
    if (updateStore) {
      setSelectedLevel(selectedLevelTemp);
    }
  }, [selectedLevelTemp, updateStore]);

  return (
    <div className="level-cards-container my-2">
      {gameLevels.map(level => (
        <div
          key={level.grid}
          className={`level-card ${selectedLevelTemp?.pair === level.pair ? 'selected' : ''}`}
          onClick={() => setSelectedLevelTemp(level)}
        >
          <div className="level-card-title">{level.title}</div>
          <img src={level.icon} className="level-card-icon" width={100} height={100} alt={level.title} />
          <div className="level-card-subtitle">{level.subtitle}</div>
        </div>
      ))}
    </div>
  );
}

export default Levels;
