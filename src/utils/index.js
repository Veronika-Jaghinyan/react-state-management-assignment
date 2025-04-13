function Card(id, illus) {
  this.id = id;
  this.illusPath = illus;
  this.flipped = false;
  this.matched = false;
  this.flippedCount = 0;
}

export const suffleCards = cards => {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export const setUpCards = illustrations => {
  const cards = [...illustrations, ...illustrations].map((illus, index) => {
    return new Card(index, illus);
  });

  return suffleCards(cards);
};

export const calculateGameDuration = (startDate, initDuration = 0) => {
  const start = new Date(startDate).getTime();
  const now = new Date().getTime();
  const duration = now - start + initDuration;

  return duration;
};

export const formatDuration = duration => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const calculateAccuracy = (matches, moves) => {
  return moves > 0 ? Math.max(0, Math.round((matches / moves) * 100)) : 0;
};
