import { useState, useEffect } from 'react'
import { remindersAPI } from '../../services/api'
import ReminderForm from './ReminderForm'
import ReminderList from './ReminderList'
import './Reminders.css'

const Reminders = () => {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadReminders()
  }, [])

  const loadReminders = async () => {
    try {
      setLoading(true)
      const response = await remindersAPI.getReminders()
      setReminders(response.data)
    } catch (error) {
      console.error('Error loading reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (reminderData) => {
    try {
      await remindersAPI.createReminder(reminderData)
      await loadReminders()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating reminder:', error)
    }
  }

  const handleUpdate = async (id, reminderData) => {
    try {
      await remindersAPI.updateReminder(id, reminderData)
      await loadReminders()
    } catch (error) {
      console.error('Error updating reminder:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading reminders...</div>
  }

  return (
    <div className="reminders-container fade-in">
      <div className="reminders-header">
        <h2>Recordatorios</h2>
        <button onClick={() => setShowForm(!showForm)} className="add-reminder-btn">
          {showForm ? 'Cancelar' : '+ Nuevo Recordatorio'}
        </button>
      </div>

      {showForm && (
        <ReminderForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ReminderList
        reminders={reminders}
        onUpdate={handleUpdate}
      />
    </div>
  )
}

export default Reminders

