import "../css/results.css";

function Results({
  correctWords, // Nombre de mots corrects
  incorrectWords, // Nombre de mots incorrects
  accuracyWords, // Précision en pourcentage (mots)
  accuracyKeystrokes, // Précision en pourcentage (frappes)
  wpm, // Vitesse en mots par minute
  keystrokes, // Statistiques des frappes
  onRestart, // Fonction pour recommencer le test
}) {
  return (
    <div className="results-container">
      <h2>Résultats</h2>
      <p>
        Mots corrects : <span style={{ color: "green" }}>{correctWords}</span>
      </p>
      <p>
        Mots incorrects : <span style={{ color: "red" }}>{incorrectWords}</span>
      </p>
      <p>Précision (mots) : {accuracyWords}%</p>
      <p>Précision (frappes) : {accuracyKeystrokes}%</p>
      <p>Vitesse (WPM) : {wpm}</p>
      <p>
        Frappes clavier : {keystrokes.total} (
        <span style={{ color: "green" }}>{keystrokes.correct}</span> |
        <span style={{ color: "red" }}>{keystrokes.incorrect}</span>)
      </p>
      <button onClick={onRestart}>Recommencer</button>
    </div>
  );
}

export default Results;
