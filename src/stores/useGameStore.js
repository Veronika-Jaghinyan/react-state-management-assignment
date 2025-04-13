import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { useCardsStore } from './useCardsStore';
import { useTimerStore } from './useTimerStore';
import { usePlayersStore } from './usePlayersStore';

export const useGameStore = create(
  subscribeWithSelector(
    persist(
      set => ({
        gameId: null,
        selectedLevel: null,
        gameStartedAt: null,
        gameEndedAt: null,
        setGameId: gameId => set({ gameId }),
        setSelectedLevel: level => set({ selectedLevel: level }),
        setGameStartedAt: startedAt => set({ gameStartedAt: startedAt }),
        setGameEndedAt: endedAt => set({ gameEndedAt: endedAt }),
        resetGameStore: () => set({ gameId: null, selectedLevel: null, gameStartedAt: null, gameEndedAt: null }),
        resetGameStorePartial: () => set({ gameStartedAt: null, gameEndedAt: null }),
      }),
      {
        name: 'game-store',
      },
    ),
  ),
);

useGameStore.subscribe(
  state => state.gameEndedAt,
  () => {
    usePlayersStore.getState().resetActivePlayer();
    useTimerStore.getState().resetTimerStore();
    useCardsStore.getState().resetCardsStore();
  },
);
