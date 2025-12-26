import { useState, useEffect, useRef } from 'react'
import { activitiesAPI } from '../../services/api'
import './GuideComponents.css'

const MeditationFocus = () => {
  const [mode, setMode] = useState('point') // 'point' or 'breathing'
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [resets, setResets] = useState(0)
  const [breathCount, setBreathCount] = useState(0)
  const [breathPhase, setBreathPhase] = useState('inhale') // 'inhale', 'hold', 'exhale'
  const [sessionId, setSessionId] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (mode === 'breathing' && isActive) {
      const breathingInterval = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === 'inhale') return 'hold'
          if (prev === 'hold') return 'exhale'
          if (prev === 'exhale') {
            setBreathCount(prev => prev + 1)
            return 'inhale'
          }
          return 'inhale'
        })
      }, 4000) // 4 seconds per phase
      return () => clearInterval(breathingInterval)
    }
  }, [mode, isActive])

  useEffect(() => {
    if (mode === 'point' && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#7FB3A8'
        ctx.beginPath()
        ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI)
        ctx.fill()
      }
      
      draw()
    }
  }, [mode])

  const startSession = async () => {
    setIsActive(true)
    setTimeElapsed(0)
    setResets(0)
    setBreathCount(0)
    
    try {
      const response = await activitiesAPI.startActivity('meditation', {
        activity_type: 'meditation',
        metadata_json: { mode }
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
          score: timeElapsed,
          metadata_json: { 
            mode, 
            resets, 
            breathCount: mode === 'breathing' ? breathCount : null 
          }
        })
      } catch (error) {
        console.error('Error ending session:', error)
      }
    }
  }

  const handleReset = () => {
    setResets(prev => prev + 1)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="guide-component">
      <h3>Focused Meditation</h3>
      
      <div className="meditation-mode-selector">
        <button
          onClick={() => setMode('point')}
          className={mode === 'point' ? 'active' : ''}
        >
          Point Concentration
        </button>
        <button
          onClick={() => setMode('breathing')}
          className={mode === 'breathing' ? 'active' : ''}
        >
          Breath Counting
        </button>
      </div>

      {mode === 'point' ? (
        <div className="point-meditation">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="focus-canvas"
            onClick={handleReset}
          />
          <p className="instruction">Click when your mind wanders</p>
          <div className="meditation-stats">
            <span>Time: <strong>{formatTime(timeElapsed)}</strong></span>
            <span>Resets: <strong>{resets}</strong></span>
          </div>
        </div>
      ) : (
        <div className="breathing-meditation">
          <div className={`breathing-circle ${breathPhase}`}>
            <span className="breath-count">{breathCount}</span>
          </div>
          <p className="breath-instruction">
            {breathPhase === 'inhale' && 'Inhale...'}
            {breathPhase === 'hold' && 'Hold...'}
            {breathPhase === 'exhale' && 'Exhale...'}
          </p>
          <div className="meditation-stats">
            <span>Time: <strong>{formatTime(timeElapsed)}</strong></span>
            <span>Cycles: <strong>{breathCount}</strong></span>
          </div>
        </div>
      )}

      <div className="meditation-controls">
        {!isActive ? (
          <button onClick={startSession} className="start-btn">
            Start Meditation
          </button>
        ) : (
          <button onClick={endSession} className="stop-btn">
            Finalizar
          </button>
        )}
      </div>
    </div>
  )
}

export default MeditationFocus

