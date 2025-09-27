import { useEffect } from "react";

function InputText({
  setIsRunning,
  isFinished,
  resetKey,
  onValidate,
  currentInput,
  setCurrentInput,
}) {
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentInput(newValue);

    // Démarre le timer si c'est le premier caractère
    if (newValue.length === 1 && !isFinished) {
      setIsRunning(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      if (currentInput.trim() !== "") {
        onValidate(currentInput.trim());
        setCurrentInput("");
      }
    }
  };

  useEffect(() => {
    setCurrentInput("");
  }, [resetKey, setCurrentInput]);

  useEffect(() => {
    if (isFinished) {
      setCurrentInput("");
    }
  }, [isFinished, setCurrentInput]);

  return (
    <div className="input-area">
      <input
        type="text"
        value={currentInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={
          isFinished ? "Le temps est écoulé !" : "Commencez à taper ici..."
        }
        disabled={isFinished}
        autoFocus
      />
    </div>
  );
}

export default InputText;
