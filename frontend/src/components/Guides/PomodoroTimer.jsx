import { useState, useEffect } from 'react'
import { activitiesAPI } from '../../services/api'
import './GuideComponents.css'

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)

  useEffect(() => {
    let interval = null
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          handleTimerComplete()
        }
      }, 1000)
    } else if (!isActive && minutes === 0 && seconds === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, minutes, seconds])

  const handleTimerComplete = async () => {
    setIsActive(false)
    if (!isBreak) {
      setCompletedPomodoros(prev => prev + 1)
      setIsBreak(true)
      setMinutes(5)
      setSeconds(0)
      
      if (sessionId) {
        try {
          await activitiesAPI.endActivity(sessionId, {
            ended_at: new Date().toISOString(),
            score: 1,
            metadata_json: { type: 'work', duration: 25 }
          })
        } catch (error) {
          console.error('Error ending session:', error)
        }
      }
    } else {
      setIsBreak(false)
      setMinutes(25)
      setSeconds(0)
    }
  }

  const startTimer = async () => {
    setIsActive(true)
    if (!sessionId && !isBreak) {
      try {
        const response = await activitiesAPI.startActivity('pomodoro', {
          activity_type: 'pomodoro',
          metadata_json: { type: 'work' }
        })
        setSessionId(response.data.id)
      } catch (error) {
        console.error('Error starting session:', error)
      }
    }
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(isBreak ? 5 : 25)
    setSeconds(0)
    setSessionId(null)
  }

  const formatTime = (m, s) => {
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="guide-component">
      <h3>Pomodoro Timer</h3>
      <p className="guide-description">
        {isBreak ? 'Tiempo de descanso' : 'Tiempo de trabajo'}
      </p>

      <div className="pomodoro-display">
        <div className={`timer-circle ${isBreak ? 'break' : 'work'}`}>
          <span className="timer-value-large">{formatTime(minutes, seconds)}</span>
        </div>
      </div>

      <div className="pomodoro-stats">
        <span>Pomodoros completados: <strong>{completedPomodoros}</strong></span>
      </div>

      <div className="pomodoro-controls">
        {!isActive ? (
          <button onClick={startTimer} className="start-btn">
            Iniciar
          </button>
        ) : (
          <button onClick={pauseTimer} className="pause-btn">
            Pausar
          </button>
        )}
        <button onClick={resetTimer} className="reset-btn">
          Reiniciar
        </button>
      </div>
    </div>
  )
}

export default PomodoroTimer

