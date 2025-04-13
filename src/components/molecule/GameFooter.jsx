import Button from '../atom/Button';

function GameFooter({ handleGameRestart, handleNewGame }) {
  return (
    <div className="game-footer">
      <Button onClick={handleGameRestart} name="Restart the game" />
      <Button onClick={handleNewGame} name="New game" />
    </div>
  );
}

export default GameFooter;
