import { useEffect } from "react";

function InputText({
  setIsRunning, // Fonction pour démarrer le test
  isFinished, // État indiquant si le test est terminé
  resetKey, // Clé pour réinitialiser le composant
  onValidate, // Fonction pour valider un mot saisi
  currentInput, // Texte actuellement saisi
  setCurrentInput, // Fonction pour mettre à jour le texte saisi
}) {
  // Met à jour `currentInput` quand l'utilisateur tape
  const handleChange = (e) => {
    const newValue = e.target.value;
    setCurrentInput(newValue);
    // Démarre le test si c'est la première frappe et que le test n'est pas terminé
    if (newValue.length === 1 && !isFinished) {
      setIsRunning(true);
    }
  };

  // Valide le mot quand l'utilisateur appuie sur la barre d'espace
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Empêche l'ajout d'un espace dans l'input
      if (currentInput.trim() !== "") {
        onValidate(currentInput.trim()); // Valide le mot
        setCurrentInput(""); // Réinitialise l'input
      }
    }
  };

  // Réinitialise l'input quand `resetKey` change
  useEffect(() => {
    setCurrentInput("");
  }, [resetKey, setCurrentInput]);

  // Réinitialise l'input quand le test est terminé
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
        autoFocus // Met le focus automatiquement sur l'input
      />
    </div>
  );
}

export default InputText;
