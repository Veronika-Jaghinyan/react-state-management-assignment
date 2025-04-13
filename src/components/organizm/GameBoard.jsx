import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIllustrations } from '../../api/fetchIllustrations';
import { setUpCards } from '../../utils';
import { usePlayersStore } from '../../stores/usePlayersStore';
import { useCardsStore } from '../../stores/useCardsStore';
import { useGameStore } from '../../stores/useGameStore';
import BoardCard from '../molecule/BoardCard';

function GameBoard() {
  const { cards, flippedCards, setCards, setFlippedCards } = useCardsStore();
  const selectedLevel = useGameStore(state => state.selectedLevel);
  const setGameEndedAt = useGameStore(state => state.setGameEndedAt);

  const setNextPlayer = usePlayersStore(state => state.setNextPlayer);
  const incrementActivePlayerStats = usePlayersStore(state => state.incrementActivePlayerStats);
  const activePlayer = usePlayersStore(state => state.activePlayer);
  const stopPlayerTimer = usePlayersStore(state => state.stopPlayerTimer);

  const [timeoutId, setTimeoutId] = useState(null);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [randomPage, setRandomPage] = useState(() => Math.floor(Math.random() * 30) + 1);

  const pair = parseInt(selectedLevel.pair);

  const { data } = useQuery({
    queryKey: ['picsum', randomPage, pair],
    queryFn: () => fetchIllustrations(randomPage, pair),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled: !!(randomPage && pair && !cards.length),
  });

  const initializeGame = () => {
    const initCards = setUpCards(data);
    setCards(initCards);
  };

  // ----------------------------- GAME HANDLER FUNCTIONS -----------------------------

  // Step 1 (Flip cards on click)
  const handleCardClick = card => {
    if (card.flipped || card.matched) return;

    setCards(cards.map(c => (c.id === card.id ? { ...card, flipped: true, flippedCount: c.flippedCount + 1 } : c)));
    setFlippedCards([...flippedCards, card]);
  };

  // Step 2 (Close previously opened cards when the third card is clicked, if they are still open)
  const closeAdditionalCards = () => {
    // Clear timeout for closing cards after 1 second to avoid additional flip
    clearTimeout(timeoutId);

    const lastOpenCard = flippedCards[flippedCards.length - 1];

    setFlippedCards([lastOpenCard]);
    setCards(cards.map(c => (c.id !== lastOpenCard.id ? { ...c, flipped: c.matched ? c.flipped : false } : c)));
  };

  // Step 3 (Check if opened cards are matching and update stats)
  const checkForMatch = () => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      // Increment moves
      incrementActivePlayerStats('moves');

      if (card1.illusPath === card2.illusPath) {
        setCards(cards.map(c => (c.id === card1.id || c.id === card2.id ? { ...c, matched: true } : c)));

        // Increment matched cards number
        incrementActivePlayerStats('score');

        // Play matching cards sound
        setPlaySuccessSound(true);
      } else {
        if (card1.flippedCount > 0 && card2.flippedCount > 0) {
          // Increment misses
          incrementActivePlayerStats('misses');
        }

        // Flip cards back after 1 second
        const timeId = setTimeout(() => {
          flipBack();
          setNextPlayer();
        }, 1000);

        // Save timeout ID for using in closeAdditionalCards() function
        setTimeoutId(timeId);
      }
    }
  };

  // Step 4 (Flip back not matching cards)
  const flipBack = () => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;

      setCards(cards.map(c => (c.id === card1.id || c.id === card2.id ? { ...c, flipped: false } : c)));
      setFlippedCards([]);
    }
  };

  // ----------------------------- USE EFFECTS -----------------------------
  useEffect(() => {
    // Refetch cards after cards store reset
    if (!cards.length) {
      setRandomPage(() => Math.floor(Math.random() * 30) + 1);
    }
  }, [cards]);

  useEffect(() => {
    if (data) {
      initializeGame();
    }
  }, [data]);

  useEffect(() => {
    if (flippedCards.length > 2) {
      // Close previuosly opened cards if the third card is flipped before closing the previous 2 (1 sec wait time before closing cards)
      closeAdditionalCards();
    } else if (flippedCards.length === 2) {
      // Check for match if 2 cards are open
      checkForMatch();
    }
  }, [flippedCards]);

  useEffect(() => {
    // Stop timer and flip back unmatched cards before page reload
    const handleBeforeUnload = () => {
      setCards(
        cards.map(c =>
          flippedCards.find(flippedC => flippedC.id === c.id && !c.matched && !flippedC.matched)
            ? { ...c, flipped: false }
            : c,
        ),
      );
      setFlippedCards([]);
      stopPlayerTimer(activePlayer);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [flippedCards, activePlayer, cards]);

  useEffect(() => {
    if (cards.length) {
      const unmatchedCards = cards.filter(c => !c.matched);

      // End game if all cards are matching
      if (!unmatchedCards.length) {
        setTimeout(() => {
          setGameEndedAt(new Date().toISOString());

          // Play the game-ending audio.
          new Audio('/audio/level-win.mp3').play();
        }, 1000);
      }
    }
  }, [cards]);

  useEffect(() => {
    if (playSuccessSound) {
      new Audio('/audio/success-sound.mp3').play();
      setPlaySuccessSound(false);
    }
  }, [playSuccessSound]);

  return (
    <div className="game-grid">
      <div className="game-main">
        <div className={`cards-grid grid-${selectedLevel.grid}`}>
          {cards.map(card => (
            <BoardCard key={card.id} card={card} handleCardClick={handleCardClick} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
