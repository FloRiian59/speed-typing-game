import { useState, useEffect } from "react";

function Timer({ duration, isRunning, setIsRunning, setIsFinished, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsFinished(false);
  }, [resetKey, duration, setIsRunning, setIsFinished]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [timeLeft, isRunning, setIsRunning, setIsFinished]);

  return <div className="timer">⏱ {timeLeft}s</div>;
}

export default Timer;
