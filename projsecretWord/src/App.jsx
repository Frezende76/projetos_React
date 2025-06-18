import { useCallback, useEffect, useState } from "react";

// components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

// styles
import "./App.css";

// data
import { wordsList } from "./data/words";

//define as três etapas(telas) do jogo
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);//etapa atual
  const [words] = useState(wordsList);//Lista de palavras 

  const [pickedWord, setPickedWord] = useState("");//palavra sorteada
  const [pickedCategory, setPickedCategory] = useState("");//categoria da palavra
  const [letters, setLetters] = useState([]);//letras da palavra
  
  const [guessedLetters, setGuessedLetters] = useState([]);//letras acertadas
  const [wrongLetters, setWrongLetters] = useState([]);//letras erradas
  const [guesses, setGuesses] = useState(3);//tentativas restantes
  const [score, setScore] = useState(0);//pontuação
  const [successMessage, setSuccessMessage] = useState("");//mensagem de sucesso
  const [errorMessage, setErrorMessage] = useState("");

  //escolhe aleatoriamente uma categoria e uma palavra
  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
      return { category, word };
  }, [words]);

  // start the game
  const startGame = useCallback(() => {
    // reset attempts for new word
    setGuesses(3);

    // clear all letters
    clearLettersStates();

    // choose a word
    const { category, word } = pickWordAndCategory();

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);
    setErrorMessage("");

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        letter,
      ]);
      setErrorMessage(""); // Limpa mensagem de erro ao acertar
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
      setErrorMessage("Na palavra não tem essa letra.");
    }
  };

  // restart the game
  const retry = () => {
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  // clear letters state
  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // check if guesses ended
  useEffect(() => {
    if (guesses === 0) {
      // game over and reset all states
      clearLettersStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if (guessedLetters.length === uniqueLetters.length) {
      setSuccessMessage("Parabéns! Você acertou a palavra!"); // NOVO

      setTimeout(() => {
        setSuccessMessage("");
        setScore((actualScore) => actualScore + 100);
        startGame();
      }, 2000);
    }
  }, [guessedLetters, letters, startGame]);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
