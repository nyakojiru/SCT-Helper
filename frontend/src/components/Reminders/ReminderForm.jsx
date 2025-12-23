import { useState } from 'react'
import './Reminders.css'

const habitOptions = [
  { key: 'morningLight', label: 'Luz solar matutina' },
  { key: 'coldWater', label: 'Agua fría en cara' },
  { key: 'exerciseBrief', label: 'Ejercicio breve AM' },
  { key: 'proteinBreakfast', label: 'Desayuno proteico' },
  { key: 'pomodoros', label: 'Inicio bloque Pomodoro' },
  { key: 'lexicalExercise', label: 'Ejercicio léxico' },
  { key: 'aerobicExercise', label: 'Ejercicio aeróbico' },
  { key: 'focusedMeditation', label: 'Meditación focalizada' },
  { key: 'wordGames', label: 'Juegos de palabras' },
  { key: 'sleepSchedule', label: 'Rutina nocturna' },
]

const ReminderForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [habitKey, setHabitKey] = useState(initialData?.habit_key || '')
  const [time, setTime] = useState(initialData?.time || '07:00')
  const [enabled, setEnabled] = useState(initialData?.enabled !== false)
  const [daysOfWeek, setDaysOfWeek] = useState(initialData?.days_of_week || [0, 1, 2, 3, 4, 5, 6])

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

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
        <label>Hábito</label>
        <select
          value={habitKey}
          onChange={(e) => setHabitKey(e.target.value)}
          required
          className="form-input"
        >
          <option value="">Selecciona un hábito</option>
          {habitOptions.map(option => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Hora</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Días de la Semana</label>
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
          Habilitado
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default ReminderForm

