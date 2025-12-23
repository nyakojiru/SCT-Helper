import { useState } from 'react'
import './GuideComponents.css'

const MorningRoutine = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  const steps = [
    { id: 'light', name: 'Exposición a luz solar', duration: 10, icon: '☀️' },
    { id: 'water', name: 'Agua fría en cara', duration: 2, icon: '💧' },
    { id: 'exercise', name: 'Ejercicio breve', duration: 5, icon: '🏃' },
    { id: 'breakfast', name: 'Desayuno proteico', duration: 15, icon: '🥚' },
  ]

  const toggleStep = (stepId) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId))
    } else {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  return (
    <div className="guide-component">
      <h3>Rutina Matutina Guiada</h3>
      <p className="guide-description">
        Sigue estos pasos para activar tu sistema cognitivo
      </p>

      <div className="routine-steps">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`routine-step ${completedSteps.includes(step.id) ? 'completed' : ''} ${currentStep === index ? 'active' : ''}`}
          >
            <div className="step-header">
              <span className="step-icon">{step.icon}</span>
              <div className="step-info">
                <h4>{step.name}</h4>
                <span className="step-duration">{step.duration} minutos</span>
              </div>
              <input
                type="checkbox"
                checked={completedSteps.includes(step.id)}
                onChange={() => toggleStep(step.id)}
                className="step-checkbox"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="routine-progress">
        <p>
          Progreso: {completedSteps.length} / {steps.length} completados
        </p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default MorningRoutine

