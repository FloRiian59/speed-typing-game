function Controls({
  difficulty,
  setDifficulty,
  duration,
  setDuration,
  onReset,
}) {
  return (
    <div className="controls">
      <div className="difficulty-selector">
        <label htmlFor="difficulty">Difficulté : </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Facile</option>
          <option value="hard">Difficile</option>
        </select>
      </div>

      <div className="duration-selector">
        <label htmlFor="duration">Temps : </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={30}>30s</option>
          <option value={60}>60s</option>
          <option value={120}>120s</option>
        </select>
      </div>

      <button onClick={onReset} className="reload-btn" title="Rafraîchir">
        <i className="fa-solid fa-rotate-right"></i>
      </button>
    </div>
  );
}

export default Controls;
