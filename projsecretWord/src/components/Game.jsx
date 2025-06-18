import { useState, useRef } from "react";

// styles
import "./Game.css";

const Game = ({
  verifyLetter,      // função para verificar se a letra está correta
  pickedCategory,    // dica: categoria da palavra
  letters,           // Letras da palavra sorteada
  guessedLetters,    // Letras acertadas
  wrongLetters,      // Letras erradas
  guesses,           // tentativas restantes
  score,             // pontuação atual
  successMessage,    // mensagem de sucesso
}) => {
  const [letter, setLetter] = useState(""); // controla a letra digitada
  const letterInputRef = useRef(null); // Mantém o foco no input

  const handleSubmit = (e) => {
    e.preventDefault();  // evita recarregar a página

    verifyLetter(letter);  // verifica a letra digitada

    setLetter(""); // limpa o campo

    letterInputRef.current.focus(); // volta o foco para o input
  };

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação</span>: {score}
      </p>
      <h1>Advinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>

       {successMessage && (
        <p className="successMessage">{successMessage}</p> // NOVO
      )}

      <div className="wordContainer">
        {letters.map((letter, i) =>
          guessedLetters.includes(letter) ? (
            <span className="letter" key={i}>
              {letter}
            </span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            onChange={(e) => setLetter(e.target.value)}
            required
            value={letter}
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div>
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}, </span>
        ))}
      </div>
    </div>
  );
};

export default Game;




