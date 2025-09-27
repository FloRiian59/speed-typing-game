import { useState, useEffect, useRef, useCallback } from "react";
import textData from "../data/textData.json";
import "../css/textDisplay.css";

// Fonction pour mélanger aléatoirement un tableau
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Échange les éléments
  }
  return newArray;
}

function TextDisplay({
  difficulty, // Niveau de difficulté
  reloadSignal, // Signal pour recharger les mots
  activeWordIndex, // Index du mot actif
  results, // Résultats des mots validés
  setShuffledWords, // Fonction pour mettre à jour la liste des mots
  currentInput, // Texte actuellement saisi
}) {
  // Liste locale des mots à afficher
  const [localWords, setLocalWords] = useState([]);
  // Tableau pour mapper chaque mot à sa ligne
  const [lineMap, setLineMap] = useState([]);
  // Positions verticales des lignes
  const [lineTops, setLineTops] = useState([]);
  // Ligne actuellement active
  const [currentLine, setCurrentLine] = useState(0);
  // Référence au conteneur DOM pour mesurer les positions
  const containerRef = useRef(null);
  // Références aux éléments DOM des mots
  const wordRefs = useRef([]);

  // Charge les mots en fonction de la difficulté et les mélange
  useEffect(() => {
    const words = textData.words[difficulty] || [];
    const shuffled = shuffleArray(words).slice(0, 50); // Prend les 50 premiers mots après mélange
    setLocalWords(shuffled);
    if (typeof setShuffledWords === "function") setShuffledWords(shuffled);
    setCurrentLine(0);
    setLineMap([]);
    setLineTops([]);
    wordRefs.current = [];
  }, [difficulty, reloadSignal, setShuffledWords]);

  // Mesure les positions des mots pour déterminer les lignes
  const measureLines = useCallback(() => {
    const refs = wordRefs.current;
    if (!refs || refs.length === 0) return;
    const positions = refs.map((el) => (el ? el.offsetTop : 0));
    const map = [];
    const tops = [];
    let currentLineIndex = 0;
    for (let i = 0; i < positions.length; i++) {
      if (i === 0) {
        map.push(0);
        tops[0] = positions[0];
      } else {
        // Si le mot est sur une nouvelle ligne (décalage vertical > 6px)
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

  // Mesure les lignes après le rendu des mots
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      measureLines();
    });
    return () => cancelAnimationFrame(id);
  }, [localWords, measureLines, containerRef]);

  // Réajuste les lignes en cas de redimensionnement de la fenêtre
  useEffect(() => {
    const onResize = () => {
      requestAnimationFrame(measureLines);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureLines]);

  // Fait défiler automatiquement pour garder le mot actif visible
  useEffect(() => {
    if (!lineMap || lineMap.length === 0) return;
    const targetLine = lineMap[activeWordIndex] ?? 0;
    if (targetLine > currentLine) {
      setCurrentLine(targetLine);
    }
    if (targetLine < currentLine) {
      setCurrentLine(targetLine);
    }
  }, [activeWordIndex, lineMap, currentLine]);

  // Détermine le décalage vertical pour le défilement
  const OFFSET_PX = -4;
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
        overflow: "hidden", // Cache le contenu qui dépasse
      }}
    >
      <ul
        className="word-list"
        style={{
          transform: `translateY(-${translatePx}px)`, // Décale verticalement pour le défilement
          transition: "transform 200ms ease", // Animation fluide
        }}
      >
        {localWords.map((word, index) => {
          let className = "";
          // Met en surbrillance le mot actif
          if (index === activeWordIndex) {
            className = "active-word";
            // Si le début du mot saisi ne correspond pas, marque comme erreur
            if (currentInput && !word.startsWith(currentInput)) {
              className = "wrong-typing";
            }
          }
          // Applique un style en fonction du résultat (correct ou incorrect)
          if (results && results[index] === "correct")
            className = "correct-word";
          if (results && results[index] === "incorrect")
            className = "incorrect-word";
          return (
            <li
              key={index}
              ref={(el) => (wordRefs.current[index] = el)} // Stocke la référence DOM du mot
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
