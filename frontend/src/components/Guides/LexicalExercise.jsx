import { useState, useEffect } from 'react'
import { activitiesAPI } from '../../services/api'
import './GuideComponents.css'

const categories = [
  'animales con A',
  'países de Europa',
  'frutas',
  'colores',
  'profesiones',
  'deportes',
  'instrumentos musicales',
  'ciudades de España'
]

const LexicalExercise = () => {
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [words, setWords] = useState([])
  const [currentWord, setCurrentWord] = useState('')
  const [currentCategory, setCurrentCategory] = useState('')
  const [sessionId, setSessionId] = useState(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && isActive) {
      endSession()
    }
  }, [isActive, timeLeft])

  const startSession = async () => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    setCurrentCategory(category)
    setIsActive(true)
    setTimeLeft(60)
    setWords([])
    setScore(0)
    
    try {
      const response = await activitiesAPI.startActivity('lexical_exercise', {
        activity_type: 'lexical_exercise',
        metadata_json: { category }
      })
      setSessionId(response.data.id)
    } catch (error) {
      console.error('Error starting session:', error)
    }
  }

  const endSession = async () => {
    setIsActive(false)
    if (sessionId) {
      try {
        await activitiesAPI.endActivity(sessionId, {
          ended_at: new Date().toISOString(),
          score: words.length,
          metadata_json: { words, category: currentCategory }
        })
      } catch (error) {
        console.error('Error ending session:', error)
      }
    }
  }

  const addWord = () => {
    if (currentWord.trim() && !words.includes(currentWord.trim().toLowerCase())) {
      const newWords = [...words, currentWord.trim().toLowerCase()]
      setWords(newWords)
      setScore(newWords.length)
      setCurrentWord('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addWord()
    }
  }

  return (
    <div className="guide-component">
      <h3>Lexical Retrieval Exercise</h3>
      <p className="guide-description">
        Write words from the category: <strong>{currentCategory || 'Select a category'}</strong>
      </p>
      
      <div className="timer-display">
        <div className="timer-circle">
          <span className="timer-value">{timeLeft}</span>
          <span className="timer-label">seconds</span>
        </div>
      </div>

      <div className="score-display">
        <span>Words found: <strong>{score}</strong></span>
      </div>

      {!isActive ? (
        <button onClick={startSession} className="start-btn">
          Start Exercise
        </button>
      ) : (
        <div className="exercise-active">
          <div className="input-group">
            <input
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe una palabra..."
              className="word-input"
              autoFocus
            />
            <button onClick={addWord} className="add-btn">
              Añadir
            </button>
          </div>
          
          <div className="words-list">
            {words.map((word, index) => (
              <span key={index} className="word-tag">
                {word}
              </span>
            ))}
          </div>

          <button onClick={endSession} className="stop-btn">
            Finalizar
          </button>
        </div>
      )}
    </div>
  )
}

export default LexicalExercise

