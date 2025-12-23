import { useState } from 'react'
import './GuideComponents.css'

const WordGames = () => {
  const [activeGame, setActiveGame] = useState(null)

  const games = [
    { id: 'wordle', name: 'Wordle', component: WordleGame },
    { id: 'anagram', name: 'Anagramas', component: AnagramGame },
  ]

  const ActiveComponent = games.find(g => g.id === activeGame)?.component

  return (
    <div className="guide-component">
      <h3>Juegos de Palabras</h3>
      {!activeGame ? (
        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => setActiveGame(game.id)}
            >
              <h4>{game.name}</h4>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setActiveGame(null)} className="back-btn">
            ← Volver
          </button>
          {ActiveComponent && <ActiveComponent />}
        </div>
      )}
    </div>
  )
}

function WordleGame() {
  const words = ['TRACK', 'BRAIN', 'FOCUS', 'MIND', 'CLOUD']
  const [targetWord] = useState(words[Math.floor(Math.random() * words.length)])
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)

  const handleGuess = () => {
    if (currentGuess.length === 5 && guesses.length < 6) {
      const newGuesses = [...guesses, currentGuess.toUpperCase()]
      setGuesses(newGuesses)
      setCurrentGuess('')
      if (currentGuess.toUpperCase() === targetWord || newGuesses.length === 6) {
        setGameOver(true)
      }
    }
  }

  const getLetterColor = (letter, index, guess) => {
    if (targetWord[index] === letter) return 'green'
    if (targetWord.includes(letter)) return 'yellow'
    return 'gray'
  }

  return (
    <div className="wordle-game">
      <h4>Wordle</h4>
      <div className="wordle-grid">
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="wordle-row">
            {Array.from({ length: 5 }).map((_, col) => {
              const guess = guesses[row]
              const letter = guess?.[col] || ''
              const color = guess ? getLetterColor(letter, col, guess) : ''
              return (
                <div key={col} className={`wordle-cell ${color}`}>
                  {letter}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {!gameOver && (
        <div className="wordle-input">
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.slice(0, 5).toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
            maxLength={5}
            className="word-input"
          />
          <button onClick={handleGuess} className="add-btn">
            Adivinar
          </button>
        </div>
      )}
      {gameOver && (
        <div className="game-result">
          {guesses[guesses.length - 1] === targetWord ? '¡Ganaste!' : `La palabra era: ${targetWord}`}
        </div>
      )}
    </div>
  )
}

function AnagramGame() {
  const words = ['TRACKER', 'FOCUS', 'BRAIN', 'MEDITATION']
  const [targetWord] = useState(words[Math.floor(Math.random() * words.length)])
  const [shuffled, setShuffled] = useState(shuffleWord(targetWord))
  const [userWord, setUserWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)

  function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('')
  }

  const checkWord = () => {
    if (userWord.toUpperCase() === targetWord) {
      setScore(prev => prev + 1)
      const newWord = words[Math.floor(Math.random() * words.length)]
      setShuffled(shuffleWord(newWord))
      setUserWord('')
    }
  }

  return (
    <div className="anagram-game">
      <h4>Anagramas</h4>
      <div className="anagram-display">
        <div className="shuffled-letters">{shuffled}</div>
        <p>Reordena las letras para formar una palabra</p>
        <input
          type="text"
          value={userWord}
          onChange={(e) => setUserWord(e.target.value.toUpperCase())}
          className="word-input"
          placeholder="Tu respuesta..."
        />
        <button onClick={checkWord} className="add-btn">
          Verificar
        </button>
        <div className="game-stats">
          <span>Puntuación: <strong>{score}</strong></span>
          <span>Tiempo: <strong>{timeLeft}s</strong></span>
        </div>
      </div>
    </div>
  )
}

export default WordGames

