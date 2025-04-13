import { useEffect, useState } from 'react';
import Modal from '../molecule/Modal';
import Button from '../atom/Button';

const CoinTossPopup = ({ setFirstPlayer }) => {
  const [side, setSide] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  useEffect(() => {
    if (side) {
      setTimeout(() => {
        setFirstPlayer(side === 'heads' ? 0 : 1);
        setDisableBtn(false);
      }, 1000);
    }
  }, [side]);

  const handleCoinToss = () => {
    if (flipping) return;
    setFlipping(true);
    setDisableBtn(true);

    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setSide(result);
      setFlipping(false);
    }, 2000);
  };

  return (
    <Modal>
      <div className="coin-container">
        <div className={`coin ${flipping ? 'flipping' : ''}`}>
          {side === 'heads' || (!side && flipping) ? (
            <img src="/graphics/heads.svg" className="face" width={120} height={120} alt="heads" />
          ) : (
            <img src="/graphics/tails.svg" className="face" width={120} height={120} alt="tails" />
          )}
        </div>
        <Button name={flipping ? 'Flipping...' : 'Toss the Coin'} onClick={handleCoinToss} disabled={disableBtn} />
      </div>
    </Modal>
  );
};

export default CoinTossPopup;
