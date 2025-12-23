import React, { useState, useEffect } from 'react'
import { entriesAPI, habitsAPI } from '../../services/api'
import { format } from 'date-fns'
import './SCTTracker.css'

const SCTTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const formatDate = (date) => format(date, 'yyyy-MM-dd')
  const today = formatDate(currentDate)
  
  const habitLabels = {
    morningLight: { label: 'Luz solar matutina', icon: '☀️', category: 'morning' },
    coldWater: { label: 'Agua fría en cara', icon: '💧', category: 'morning' },
    exerciseBrief: { label: 'Ejercicio breve AM', icon: '🏃', category: 'morning' },
    proteinBreakfast: { label: 'Desayuno proteico', icon: '🥚', category: 'morning' },
    pomodoros: { label: 'Pomodoros completados', icon: '🍅', category: 'day', type: 'number' },
    lexicalExercise: { label: 'Ejercicio léxico 10min', icon: '🔤', category: 'day' },
    aerobicExercise: { label: 'Ejercicio aeróbico 30min', icon: '❤️', category: 'day' },
    focusedMeditation: { label: 'Meditación focalizada', icon: '🎯', category: 'night' },
    wordGames: { label: 'Juegos de palabras', icon: '🎮', category: 'day' },
    sleepSchedule: { label: 'Horario sueño cumplido', icon: '🌙', category: 'night' }
  }

  useEffect(() => {
    loadEntry()
  }, [today])

  const loadEntry = async () => {
    try {
      setLoading(true)
      const response = await entriesAPI.getEntries(today, today)
      if (response.data && response.data.length > 0) {
        setEntry(response.data[0])
      } else {
        // Create default entry
        const defaultEntry = {
          date: today,
          mentalEnergy: 5,
          fogEpisodes: 0,
          sleepHours: 7,
          notes: ''
        }
        setEntry(defaultEntry)
      }
    } catch (error) {
      console.error('Error loading entry:', error)
      // Set default entry on error
      setEntry({
        date: today,
        mentalEnergy: 5,
        fogEpisodes: 0,
        sleepHours: 7,
        notes: ''
      })
    } finally {
      setLoading(false)
    }
  }

  const saveEntry = async () => {
    if (!entry) return
    
    try {
      setSaving(true)
      if (entry.id) {
        await entriesAPI.updateEntry(today, {
          mentalEnergy: entry.mentalEnergy,
          fogEpisodes: entry.fogEpisodes,
          sleepHours: entry.sleepHours,
          notes: entry.notes
        })
      } else {
        const response = await entriesAPI.createEntry(entry)
        setEntry(response.data)
      }
    } catch (error) {
      console.error('Error saving entry:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field, value) => {
    setEntry(prev => ({ ...prev, [field]: value }))
  }

  const updateHabit = async (habitKey, value) => {
    const date = today
    const completed = typeof value === 'boolean' ? value : value > 0
    
    try {
      await habitsAPI.completeHabit(habitKey, {
        date,
        habit_key: habitKey,
        completed,
        value: typeof value === 'number' ? value : (completed ? 1 : 0)
      })
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  const changeDate = (days) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  useEffect(() => {
    if (entry && !saving) {
      const timeoutId = setTimeout(() => {
        saveEntry()
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [entry?.mentalEnergy, entry?.fogEpisodes, entry?.sleepHours, entry?.notes])

  if (loading) {
    return <div className="loading">Loading tracker...</div>
  }

  if (!entry) {
    return <div className="loading">No entry found</div>
  }

  const habitsByCategory = {
    morning: [],
    day: [],
    night: []
  }

  Object.entries(habitLabels).forEach(([key, config]) => {
    habitsByCategory[config.category].push({ key, ...config })
  })

  return (
    <div className="tracker-container fade-in">
      <div className="tracker-header">
        <button onClick={() => changeDate(-1)} className="date-nav-btn">←</button>
        <h2>{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
        <button onClick={() => changeDate(1)} className="date-nav-btn">→</button>
      </div>

      <div className="tracker-section">
        <h3>Métricas Diarias</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <label>Energía Mental (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={entry.mentalEnergy}
              onChange={(e) => updateField('mentalEnergy', parseInt(e.target.value))}
              className="slider"
            />
            <span className="metric-value">{entry.mentalEnergy}</span>
          </div>

          <div className="metric-card">
            <label>Episodios de Niebla</label>
            <input
              type="number"
              min="0"
              value={entry.fogEpisodes}
              onChange={(e) => updateField('fogEpisodes', parseInt(e.target.value) || 0)}
              className="number-input"
            />
          </div>

          <div className="metric-card">
            <label>Horas de Sueño</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={entry.sleepHours}
              onChange={(e) => updateField('sleepHours', parseFloat(e.target.value) || 0)}
              className="number-input"
            />
          </div>
        </div>
      </div>

      <div className="tracker-section">
        <h3>Hábitos Matutinos</h3>
        <div className="habits-grid">
          {habitsByCategory.morning.map(({ key, label, icon }) => (
            <div key={key} className="habit-item">
              <span className="habit-icon">{icon}</span>
              <span className="habit-label">{label}</span>
              <input
                type="checkbox"
                checked={false} // Will be loaded from habits API
                onChange={(e) => updateHabit(key, e.target.checked)}
                className="habit-checkbox"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tracker-section">
        <h3>Hábitos del Día</h3>
        <div className="habits-grid">
          {habitsByCategory.day.map(({ key, label, icon, type }) => (
            <div key={key} className="habit-item">
              <span className="habit-icon">{icon}</span>
              <span className="habit-label">{label}</span>
              {type === 'number' ? (
                <input
                  type="number"
                  min="0"
                  value={0}
                  onChange={(e) => updateHabit(key, parseInt(e.target.value) || 0)}
                  className="habit-number"
                />
              ) : (
                <input
                  type="checkbox"
                  checked={false}
                  onChange={(e) => updateHabit(key, e.target.checked)}
                  className="habit-checkbox"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="tracker-section">
        <h3>Hábitos Nocturnos</h3>
        <div className="habits-grid">
          {habitsByCategory.night.map(({ key, label, icon }) => (
            <div key={key} className="habit-item">
              <span className="habit-icon">{icon}</span>
              <span className="habit-label">{label}</span>
              <input
                type="checkbox"
                checked={false}
                onChange={(e) => updateHabit(key, e.target.checked)}
                className="habit-checkbox"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tracker-section">
        <h3>Notas</h3>
        <textarea
          value={entry.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          className="notes-textarea"
          placeholder="Añade notas sobre tu día..."
          rows={4}
        />
      </div>

      {saving && <div className="saving-indicator">Guardando...</div>}
    </div>
  )
}

export default SCTTracker

