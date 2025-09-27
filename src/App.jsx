import { useState, useEffect } from "react";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import InputText from "./components/InputText";
import TextDisplay from "./components/TextDisplay";
import Results from "./components/Results";

function App() {
  const [difficulty, setDifficulty] = useState("easy");
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [keystrokes, setKeystrokes] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
  });
  const [shuffledWords, setShuffledWords] = useState([]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [results, setResults] = useState({});

  // Suivi des frappes clavier via useEffect
  useEffect(() => {
    const currentWord = shuffledWords[activeWordIndex] || "";
    const newLength = currentInput.length;

    // Si un nouveau caractère est ajouté
    if (newLength > 0) {
      const typedChar = currentInput[newLength - 1];
      const expectedChar = currentWord[newLength - 1];

      setKeystrokes((prev) => ({
        total: prev.total + 1,
        correct: typedChar === expectedChar ? prev.correct + 1 : prev.correct,
        incorrect:
          typedChar !== expectedChar ? prev.incorrect + 1 : prev.incorrect,
      }));
    }
  }, [currentInput, shuffledWords, activeWordIndex]);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setResetKey((prev) => prev + 1);
    setActiveWordIndex(0);
    setResults({});
    setCurrentInput("");
    setKeystrokes({ total: 0, correct: 0, incorrect: 0 });
  };

  const handleWordValidation = (typedWord) => {
    const currentWord = shuffledWords[activeWordIndex];
    const isCorrect = typedWord === currentWord;
    setResults((prev) => ({
      ...prev,
      [activeWordIndex]: isCorrect ? "correct" : "incorrect",
    }));
    setActiveWordIndex((prev) => prev + 1);
    setCurrentInput("");
  };

  useEffect(() => {
    handleReset();
  }, [difficulty, duration]);

  const correctWords = Object.values(results).filter(
    (r) => r === "correct"
  ).length;
  const incorrectWords = Object.values(results).filter(
    (r) => r === "incorrect"
  ).length;
  const totalWords = correctWords + incorrectWords;
  const accuracyWords =
    totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  const accuracyKeystrokes =
    keystrokes.total > 0
      ? Math.round((keystrokes.correct / keystrokes.total) * 100)
      : 0;
  const minutes = duration / 60;
  const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;

  return (
    <div className="app">
      <h1>Test de vitesse de frappe</h1>
      {!isFinished ? (
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
            setCurrentInput={setCurrentInput} // Passe directement la fonction de mise à jour
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
