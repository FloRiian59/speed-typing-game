import { useState, useEffect, useRef, useCallback } from "react";
import textData from "../data/textData.json";
import "../css/textDisplay.css";

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function TextDisplay({
  difficulty,
  reloadSignal,
  activeWordIndex,
  results,
  setShuffledWords,
  currentInput,
}) {
  const [localWords, setLocalWords] = useState([]);
  const [lineMap, setLineMap] = useState([]); // index mot -> numéro de ligne
  const [lineTops, setLineTops] = useState([]); // top (px) de chaque ligne
  const [currentLine, setCurrentLine] = useState(0);

  const containerRef = useRef(null);
  const wordRefs = useRef([]); // refs to each <li>

  // Génération des mots
  useEffect(() => {
    const words = textData.words[difficulty] || [];
    const shuffled = shuffleArray(words).slice(0, 50);
    setLocalWords(shuffled);
    if (typeof setShuffledWords === "function") setShuffledWords(shuffled);
    setCurrentLine(0);
    setLineMap([]);
    setLineTops([]);
    // reset refs
    wordRefs.current = [];
  }, [difficulty, reloadSignal, setShuffledWords]);

  // Fonction de mesure (groupement en lignes)
  const measureLines = useCallback(() => {
    const refs = wordRefs.current;
    if (!refs || refs.length === 0) return;

    // Récupère offsetTop (position dans le flux, indépendant des transforms visuels)
    const positions = refs.map((el) => (el ? el.offsetTop : 0));

    const map = [];
    const tops = [];
    let currentLineIndex = 0;

    for (let i = 0; i < positions.length; i++) {
      if (i === 0) {
        map.push(0);
        tops[0] = positions[0];
      } else {
        // Si top diffère suffisamment du précédent -> nouvelle ligne
        // seuil = 6px pour éviter micro-variations
        if (Math.abs(positions[i] - positions[i - 1]) > 6) {
          currentLineIndex++;
          tops[currentLineIndex] = positions[i];
        }
        map.push(currentLineIndex);
      }
    }

    setLineMap(map);
    setLineTops(tops);
  }, []);

  // Mesure après que les mots soient rendus
  useEffect(() => {
    // Mesurer au prochain frame pour être sûr que les refs sont bien montées
    const id = requestAnimationFrame(() => {
      measureLines();
    });
    return () => cancelAnimationFrame(id);
  }, [localWords, measureLines, containerRef]);

  // Re-mesure aussi sur resize (responsive)
  useEffect(() => {
    const onResize = () => {
      // faire la mesure après que le layout se stabilise
      requestAnimationFrame(measureLines);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureLines]);

  // Lorsque activeWordIndex change, avance la ligne si besoin
  useEffect(() => {
    if (!lineMap || lineMap.length === 0) return;
    const targetLine = lineMap[activeWordIndex] ?? 0;
    if (targetLine > currentLine) {
      setCurrentLine(targetLine);
    }
    // Si on recule (rare), on peut aussi gérer le retour :
    if (targetLine < currentLine) {
      setCurrentLine(targetLine);
    }
  }, [activeWordIndex, lineMap, currentLine]);

  // Calcul de la translation en px (utiliser lineTops réels)
  const OFFSET_PX = -4; // petit offset pour cacher le bas de la ligne précédente
  let translatePx = 0;
  if (lineTops && lineTops.length > 0) {
    const base = lineTops[0] || 0;
    const topForCurrent = lineTops[currentLine] || 0;
    translatePx = Math.max(0, topForCurrent - base - OFFSET_PX);
  }

  return (
    <div
      className="text-display-container"
      aria-live="polite"
      ref={containerRef}
      style={{
        overflow: "hidden",
      }}
    >
      <ul
        className="word-list"
        style={{
          transform: `translateY(-${translatePx}px)`,
          transition: "transform 200ms ease",
        }}
      >
        {localWords.map((word, index) => {
          let className = "";
          if (index === activeWordIndex) {
            className = "active-word";
            if (currentInput && !word.startsWith(currentInput)) {
              className = "wrong-typing";
            }
          }
          if (results && results[index] === "correct")
            className = "correct-word";
          if (results && results[index] === "incorrect")
            className = "incorrect-word";

          return (
            <li
              key={index}
              ref={(el) => (wordRefs.current[index] = el)}
              className={className}
            >
              {word}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TextDisplay;
