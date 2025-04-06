import Button from '../atom/Button';

function GameFooter({ handleGameRestart, handleLevelChange }) {
  return (
    <div className="game-footer">
      <Button className="primary-btn" onClick={handleGameRestart} name="Restart" />
      <Button className="primary-btn" onClick={handleLevelChange} name="Change level" />
    </div>
  );
}

export default GameFooter;
