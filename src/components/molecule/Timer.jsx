import { useTimerStore } from '../../stores/useTimerStore';
import { formatDuration } from '../../utils';
import StatsCard from './StatsCard';

function Timer({ duration, isActivePlayer }) {
  const activePlayerduration = useTimerStore(state => {
    if (isActivePlayer) {
      return state.activePlayerDuration;
    }
    return null;
  });

  return <StatsCard label="Timer" value={formatDuration(activePlayerduration || duration)} />;
}

export default Timer;
