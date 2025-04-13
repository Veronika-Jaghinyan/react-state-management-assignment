import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTimerStore = create(
  persist(
    (set, get) => ({
      activePlayerDuration: 0,
      intervalId: null,
      intervalStart: null,
      setActivePlayerDuration: time => set({ activePlayerDuration: time }),
      setIntervalId: intervalId => set({ intervalId }),
      setIntervalStart: intervalStart => set({ intervalStart }),
      resetTimerStore: () => {
        const { intervalId } = get();
        intervalId && clearInterval(intervalId);
        set({ activePlayerDuration: 0, intervalId: null, intervalStart: null });
      },
    }),
    {
      name: 'timer-store',
    },
  ),
);
