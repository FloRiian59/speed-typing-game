import { useState, useEffect } from "react";

function Timer({ duration, isRunning, setIsRunning, setIsFinished, resetKey }) {
  // Temps restant en secondes
  const [timeLeft, setTimeLeft] = useState(duration);

  // Réinitialise le timer quand `resetKey` ou `duration` change
  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsFinished(false);
  }, [resetKey, duration, setIsRunning, setIsFinished]);

  // Décrémente le temps restant toutes les secondes si le test est en cours
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0)); // Décrémente sans aller en dessous de 0
    }, 1000);
    return () => clearInterval(interval); // Nettoie l'intervalle à la fin
  }, [isRunning, timeLeft]);

  // Termine le test quand le temps est écoulé
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [timeLeft, isRunning, setIsRunning, setIsFinished]);

  return <div className="timer">⏱ {timeLeft}s</div>;
}

export default Timer;
