import { useState, useEffect } from "react";
// Import des composants enfants utilisés dans l'application
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import InputText from "./components/InputText";
import TextDisplay from "./components/TextDisplay";
import Results from "./components/Results";

function App() {
  // État pour gérer la difficulté du test (facile, moyen, difficile)
  const [difficulty, setDifficulty] = useState("easy");
  // Durée du test en secondes
  const [duration, setDuration] = useState(60);
  // État pour savoir si le test est en cours
  const [isRunning, setIsRunning] = useState(false);
  // État pour savoir si le test est terminé
  const [isFinished, setIsFinished] = useState(false);
  // Clé pour réinitialiser les composants enfants
  const [resetKey, setResetKey] = useState(0);
  // Texte actuellement saisi par l'utilisateur
  const [currentInput, setCurrentInput] = useState("");
  // Statistiques des frappes (totales, correctes, incorrectes)
  const [keystrokes, setKeystrokes] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
  });
  // Liste des mots à taper, mélangés aléatoirement
  const [shuffledWords, setShuffledWords] = useState([]);
  // Index du mot actif (celui en cours de saisie)
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  // Résultats des mots validés (corrects ou incorrects)
  const [results, setResults] = useState({});

  // Effet pour mettre à jour les statistiques de frappe à chaque changement dans `currentInput`
  useEffect(() => {
    // Récupère le mot actif actuel
    const currentWord = shuffledWords[activeWordIndex] || "";
    const newLength = currentInput.length;
    if (newLength > 0) {
      // Récupère le dernier caractère saisi
      const typedChar = currentInput[newLength - 1];
      // Récupère le caractère attendu (celui du mot actif)
      const expectedChar = currentWord[newLength - 1];
      // Met à jour les statistiques de frappe
      setKeystrokes((prev) => ({
        total: prev.total + 1, // Incrémente le total de frappes
        correct: typedChar === expectedChar ? prev.correct + 1 : prev.correct, // Incrémente si correct
        incorrect:
          typedChar !== expectedChar ? prev.incorrect + 1 : prev.incorrect, // Incrémente si incorrect
      }));
    }
  }, [currentInput, shuffledWords, activeWordIndex]);

  // Fonction pour réinitialiser le test
  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    // Incrémente `resetKey` pour déclencher une réinitialisation dans les composants enfants
    setResetKey((prev) => prev + 1);
    setActiveWordIndex(0);
    setResults({});
    setCurrentInput("");
    setKeystrokes({ total: 0, correct: 0, incorrect: 0 });
  };

  // Fonction pour valider un mot saisi
  const handleWordValidation = (typedWord) => {
    const currentWord = shuffledWords[activeWordIndex];
    const isCorrect = typedWord === currentWord;
    // Enregistre le résultat (correct ou incorrect) pour le mot actif
    setResults((prev) => ({
      ...prev,
      [activeWordIndex]: isCorrect ? "correct" : "incorrect",
    }));
    // Passe au mot suivant
    setActiveWordIndex((prev) => prev + 1);
    // Réinitialise l'entrée utilisateur
    setCurrentInput("");
  };

  // Réinitialise le test si la difficulté ou la durée change
  useEffect(() => {
    handleReset();
  }, [difficulty, duration]);

  // Calcule les statistiques de performance
  const correctWords = Object.values(results).filter(
    (r) => r === "correct"
  ).length;
  const incorrectWords = Object.values(results).filter(
    (r) => r === "incorrect"
  ).length;
  const totalWords = correctWords + incorrectWords;
  // Précision en pourcentage (mots corrects / total)
  const accuracyWords =
    totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  // Précision en pourcentage (frappes correctes / total)
  const accuracyKeystrokes =
    keystrokes.total > 0
      ? Math.round((keystrokes.correct / keystrokes.total) * 100)
      : 0;
  // Vitesse en mots par minute (WPM)
  const minutes = duration / 60;
  const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;

  return (
    <div className="app">
      <h1>Test de vitesse de frappe</h1>
      {!isFinished ? (
        // Affichage pendant le test
        <>
          <Controls
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            duration={duration}
            setDuration={setDuration}
            onReset={handleReset}
          />
          <TextDisplay
            difficulty={difficulty}
            reloadSignal={resetKey}
            activeWordIndex={activeWordIndex}
            results={results}
            setShuffledWords={setShuffledWords}
            currentInput={currentInput}
          />
          <InputText
            setIsRunning={setIsRunning}
            isFinished={isFinished}
            resetKey={resetKey}
            onValidate={handleWordValidation}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
          />
          <Timer
            duration={duration}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            setIsFinished={setIsFinished}
            resetKey={resetKey}
          />
        </>
      ) : (
        // Affichage des résultats à la fin du test
        <Results
          correctWords={correctWords}
          incorrectWords={incorrectWords}
          accuracyWords={accuracyWords}
          accuracyKeystrokes={accuracyKeystrokes}
          wpm={wpm}
          keystrokes={keystrokes}
          onRestart={handleReset}
        />
      )}
    </div>
  );
}

export default App;
