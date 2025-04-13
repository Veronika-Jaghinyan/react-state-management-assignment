import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { calculateGameDuration } from '../utils';
import { useTimerStore } from './useTimerStore';

const createPlayer = name => ({
  name,
  score: 0,
  duration: 0,
  moves: 0,
  misses: 0,
  intervalStart: null,
});

export const usePlayersStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        players: [createPlayer('Player 1'), createPlayer('Player 2')],
        activePlayer: null,

        setNextPlayer: playerIndex => {
          const { players, activePlayer } = get();
          if (players.length === 0) return;

          if (playerIndex) {
            set({ activePlayer: playerIndex });
            return;
          }

          const nextActivePlayer = activePlayer === null || players.length - 1 === activePlayer ? 0 : activePlayer + 1;

          set({ activePlayer: nextActivePlayer });
        },

        incrementActivePlayerStats: statKey => {
          const { activePlayer, players } = get();
          const updatedPlayers = [...players];
          if (statKey in updatedPlayers[activePlayer]) {
            updatedPlayers[activePlayer][statKey] += 1;
          }

          set({ players: updatedPlayers });
        },

        updatePlayerName: (playerIndex, name) => {
          const { players } = get();
          if (!players[playerIndex]) return;

          const updatedPlayers = [...players];
          updatedPlayers[playerIndex].name = name;

          set({ players: updatedPlayers });
        },

        startPlayerTimer: playerIndex => {
          const { players } = get();
          const startTime = new Date().toISOString();
          const activePlayerInitDuration = players[playerIndex].duration || 0;

          const timerStore = useTimerStore.getState();

          const intervalId = setInterval(() => {
            timerStore.setActivePlayerDuration(calculateGameDuration(startTime, activePlayerInitDuration));
          }, 1000);

          timerStore.setIntervalId(intervalId);
          timerStore.setIntervalStart(startTime);
        },

        stopPlayerTimer: (prevPlayerIndex, newPlayerIndex) => {
          const { players } = get();
          if (!players[prevPlayerIndex]) return; 
          const timerStore = useTimerStore.getState();
          const timeToUpdate =
            typeof newPlayerIndex !== 'number' ? timerStore.activePlayerDuration : players[prevPlayerIndex].duration;

          const updatedPlayers = players.map((player, index) => {
            if (prevPlayerIndex === index && timerStore.intervalId) {
              clearInterval(timerStore.intervalId);
              return {
                ...player,
                duration: player.duration + calculateGameDuration(timerStore.intervalStart),
                intervalStart: timerStore.intervalStart,
              };
            }
            return player;
          });

          typeof newPlayerIndex === 'number' && timerStore.setActivePlayerDuration(timeToUpdate);

          timerStore.setIntervalId(null);
          set({ players: updatedPlayers });
        },

        resetPlayersPartial: () => {
          const { players } = get();
          const updatedPlayers = players.map(player => {
            return createPlayer(player.name);
          });

          set({ players: updatedPlayers });
        },

        resetPlayers: () => {
          set({
            players: [createPlayer('Player 1'), createPlayer('Player 2')],
          });
        },

        resetActivePlayer: () => set({ activePlayer: null }),
      }),
      {
        name: 'players-store',
      },
    ),
  ),
);

usePlayersStore.subscribe(
  state => state.activePlayer,
  (newActivePlayer, oldActivePlayer) => {
    if (newActivePlayer !== oldActivePlayer) {
      usePlayersStore.getState().stopPlayerTimer(oldActivePlayer, newActivePlayer);
      newActivePlayer !== null && usePlayersStore.getState().startPlayerTimer(newActivePlayer);
    }
  },
);
