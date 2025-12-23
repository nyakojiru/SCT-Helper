import { useState } from 'react'
import LexicalExercise from './LexicalExercise'
import PomodoroTimer from './PomodoroTimer'
import MeditationFocus from './MeditationFocus'
import WordGames from './WordGames'
import MorningRoutine from './MorningRoutine'
import './Guides.css'

const Guides = () => {
  const [activeGuide, setActiveGuide] = useState(null)

  const guides = [
    { id: 'lexical', name: 'Ejercicio Léxico', component: LexicalExercise, icon: '🔤' },
    { id: 'pomodoro', name: 'Pomodoro Timer', component: PomodoroTimer, icon: '🍅' },
    { id: 'meditation', name: 'Meditación Focalizada', component: MeditationFocus, icon: '🎯' },
    { id: 'wordgames', name: 'Juegos de Palabras', component: WordGames, icon: '🎮' },
    { id: 'morning', name: 'Rutina Matutina', component: MorningRoutine, icon: '☀️' },
  ]

  const ActiveComponent = guides.find(g => g.id === activeGuide)?.component

  return (
    <div className="guides-container">
      <h2>Guías Interactivas</h2>
      {!activeGuide ? (
        <div className="guides-grid">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="guide-card"
              onClick={() => setActiveGuide(guide.id)}
            >
              <span className="guide-icon">{guide.icon}</span>
              <h3>{guide.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="guide-active">
          <button onClick={() => setActiveGuide(null)} className="back-btn">
            ← Volver
          </button>
          {ActiveComponent && <ActiveComponent />}
        </div>
      )}
    </div>
  )
}

export default Guides

