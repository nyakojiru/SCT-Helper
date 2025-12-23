import React, { useState, useEffect } from 'react'
import { entriesAPI, habitsAPI } from '../../services/api'
import { format } from 'date-fns'
import './SCTTracker.css'

const SCTTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entry, setEntry] = useState(null)
  const [habits, setHabits] = useState({}) // Store habits by habit_key
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const formatDate = (date) => format(date, 'yyyy-MM-dd')
  const today = formatDate(currentDate)
  
  const habitLabels = {
    morningLight: { label: 'Morning Sunlight', icon: '☀️', category: 'morning' },
    coldWater: { label: 'Cold Water on Face', icon: '💧', category: 'morning' },
    exerciseBrief: { label: 'Brief Morning Exercise', icon: '🏃', category: 'morning' },
    proteinBreakfast: { label: 'Protein Breakfast', icon: '🥚', category: 'morning' },
    pomodoros: { label: 'Pomodoros Completed', icon: '🍅', category: 'day', type: 'number' },
    lexicalExercise: { label: 'Lexical Exercise 10min', icon: '🔤', category: 'day' },
    aerobicExercise: { label: 'Aerobic Exercise 30min', icon: '❤️', category: 'day' },
    focusedMeditation: { label: 'Focused Meditation', icon: '🎯', category: 'night' },
    wordGames: { label: 'Word Games', icon: '🎮', category: 'day' },
    sleepSchedule: { label: 'Sleep Schedule Met', icon: '🌙', category: 'night' }
  }

  useEffect(() => {
    loadEntry()
    loadHabits()
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

  const loadHabits = async () => {
    try {
      const response = await habitsAPI.getTodayHabits()
      const habitsMap = {}
      if (response.data) {
        response.data.forEach(habit => {
          habitsMap[habit.habit_key] = habit
        })
      }
      setHabits(habitsMap)
    } catch (error) {
      console.error('Error loading habits:', error)
      setHabits({})
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
    setEntry(prev => {
      if (!prev) {
        // Initialize entry if it doesn't exist
        return {
          date: today,
          mentalEnergy: 5,
          fogEpisodes: 0,
          sleepHours: 7,
          notes: '',
          [field]: value
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const updateHabit = async (habitKey, value) => {
    const date = today
    const completed = typeof value === 'boolean' ? value : value > 0
    const numValue = typeof value === 'number' ? value : (completed ? 1 : 0)
    
    try {
      const response = await habitsAPI.completeHabit(habitKey, {
        date,
        habit_key: habitKey,
        completed,
        value: numValue
      })
      // Update local state with the response
      if (response.data) {
        setHabits(prev => ({
          ...prev,
          [habitKey]: response.data
        }))
      }
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }

  const getHabitValue = (habitKey) => {
    const habit = habits[habitKey]
    const isNumberType = habitLabels[habitKey]?.type === 'number'
    
    if (!habit) {
      // Return 0 for number inputs, false for checkboxes
      return isNumberType ? 0 : false
    }
    
    if (isNumberType) {
      // For number inputs, return the value (or 0 if undefined/null)
      return habit.value ?? 0
    }
    
    // For checkboxes, return the completed status
    return habit.completed || false
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
        <h3>Daily Metrics</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <label>Mental Energy (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              value={entry.mentalEnergy ?? 5}
              onChange={(e) => updateField('mentalEnergy', parseInt(e.target.value))}
              className="slider"
            />
            <span className="metric-value">{entry.mentalEnergy ?? 5}</span>
          </div>

          <div className="metric-card">
            <label>Fog Episodes</label>
            <input
              type="number"
              min="0"
              value={entry.fogEpisodes ?? 0}
              onChange={(e) => updateField('fogEpisodes', parseInt(e.target.value) || 0)}
              className="number-input"
            />
          </div>

          <div className="metric-card">
            <label>Sleep Hours</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={entry.sleepHours ?? 7}
              onChange={(e) => updateField('sleepHours', parseFloat(e.target.value) || 0)}
              className="number-input"
            />
          </div>
        </div>
      </div>

      <div className="tracker-section">
        <h3>Morning Habits</h3>
        <div className="habits-grid">
          {habitsByCategory.morning.map(({ key, label, icon }) => (
            <div key={key} className="habit-item">
              <span className="habit-icon">{icon}</span>
              <span className="habit-label">{label}</span>
              <input
                type="checkbox"
                checked={getHabitValue(key)}
                onChange={(e) => updateHabit(key, e.target.checked)}
                className="habit-checkbox"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tracker-section">
        <h3>Daytime Habits</h3>
        <div className="habits-grid">
          {habitsByCategory.day.map(({ key, label, icon, type }) => (
            <div key={key} className="habit-item">
              <span className="habit-icon">{icon}</span>
              <span className="habit-label">{label}</span>
              {type === 'number' ? (
                <input
                  type="number"
                  min="0"
                  value={getHabitValue(key)}
                  onChange={(e) => updateHabit(key, parseInt(e.target.value) || 0)}
                  className="habit-number"
                />
              ) : (
                <input
                  type="checkbox"
                  checked={getHabitValue(key)}
                  onChange={(e) => updateHabit(key, e.target.checked)}
                  className="habit-checkbox"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="tracker-section">
        <h3>Nighttime Habits</h3>
        <div className="habits-grid">
          {habitsByCategory.night.map(({ key, label, icon }) => (
            <div key={key} className="habit-item">
              <span className="habit-icon">{icon}</span>
              <span className="habit-label">{label}</span>
              <input
                type="checkbox"
                checked={getHabitValue(key)}
                onChange={(e) => updateHabit(key, e.target.checked)}
                className="habit-checkbox"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tracker-section">
        <h3>Notes</h3>
        <textarea
          value={entry.notes ?? ''}
          onChange={(e) => updateField('notes', e.target.value)}
          className="notes-textarea"
          placeholder="Add notes about your day..."
          rows={4}
        />
      </div>

      {saving && <div className="saving-indicator">Saving...</div>}
    </div>
  )
}

export default SCTTracker

