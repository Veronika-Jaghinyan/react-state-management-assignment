import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCardsStore = create(
  persist(
    set => ({
      cards: [],
      flippedCards: [],
      setCards: cards => set({ cards }),
      setFlippedCards: flippedCards => set({ flippedCards }),
      resetCardsStore: () => set({ cards: [], flippedCards: [] }),
    }),
    {
      name: 'cards-store',
    },
  ),
);
