import { useState } from 'react'
import './Reminders.css'

const habitOptions = [
  { key: 'morningLight', label: 'Morning Sunlight' },
  { key: 'coldWater', label: 'Cold Water on Face' },
  { key: 'exerciseBrief', label: 'Brief Morning Exercise' },
  { key: 'proteinBreakfast', label: 'Protein Breakfast' },
  { key: 'pomodoros', label: 'Pomodoro Block Start' },
  { key: 'lexicalExercise', label: 'Lexical Exercise' },
  { key: 'aerobicExercise', label: 'Aerobic Exercise' },
  { key: 'focusedMeditation', label: 'Focused Meditation' },
  { key: 'wordGames', label: 'Word Games' },
  { key: 'sleepSchedule', label: 'Nighttime Routine' },
]

const ReminderForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [habitKey, setHabitKey] = useState(initialData?.habit_key || '')
  const [time, setTime] = useState(initialData?.time || '07:00')
  const [enabled, setEnabled] = useState(initialData?.enabled !== false)
  const [daysOfWeek, setDaysOfWeek] = useState(initialData?.days_of_week || [0, 1, 2, 3, 4, 5, 6])

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const toggleDay = (day) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day))
    } else {
      setDaysOfWeek([...daysOfWeek, day].sort())
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      habit_key: habitKey,
      time: time,
      enabled: enabled,
      days_of_week: daysOfWeek
    })
  }

  return (
    <form className="reminder-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Habit</label>
        <select
          value={habitKey}
          onChange={(e) => setHabitKey(e.target.value)}
          required
          className="form-input"
        >
          <option value="">Select a habit</option>
          {habitOptions.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Days of the Week</label>
        <div className="days-selector">
          {dayLabels.map((label, index) => (
            <button
              key={index}
              type="button"
              onClick={() => toggleDay(index)}
              className={`day-btn ${daysOfWeek.includes(index) ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enabled
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {initialData ? 'Update' : 'Create'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ReminderForm

