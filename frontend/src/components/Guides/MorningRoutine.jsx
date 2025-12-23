import { useState } from 'react'
import './GuideComponents.css'

const MorningRoutine = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  const steps = [
    { id: 'light', name: 'Sunlight Exposure', duration: 10, icon: '☀️' },
    { id: 'water', name: 'Cold Water on Face', duration: 2, icon: '💧' },
    { id: 'exercise', name: 'Brief Exercise', duration: 5, icon: '🏃' },
    { id: 'breakfast', name: 'Protein Breakfast', duration: 15, icon: '🥚' },
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
      <h3>Guided Morning Routine</h3>
      <p className="guide-description">
        Follow these steps to activate your cognitive system
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
                <span className="step-duration">{step.duration} minutes</span>
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
          Progress: {completedSteps.length} / {steps.length} completed
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

