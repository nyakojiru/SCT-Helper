import { useState } from 'react'
import ReminderForm from './ReminderForm'
import './Reminders.css'

const ReminderList = ({ reminders, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)

  const handleToggle = async (reminder) => {
    await onUpdate(reminder.id, { enabled: !reminder.enabled })
  }

  const handleEdit = (reminder) => {
    setEditingId(reminder.id)
  }

  const handleUpdate = async (id, data) => {
    await onUpdate(id, data)
    setEditingId(null)
  }

  const formatTime = (time) => {
    if (typeof time === 'string') {
      return time
    }
    // Handle time object if needed
    return time
  }

  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  return (
    <div className="reminder-list">
      {reminders.length === 0 ? (
        <p className="no-reminders">No hay recordatorios configurados</p>
      ) : (
        reminders.map(reminder => (
          <div key={reminder.id} className="reminder-item">
            {editingId === reminder.id ? (
              <ReminderForm
                initialData={reminder}
                onSubmit={(data) => handleUpdate(reminder.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <>
                <div className="reminder-info">
                  <h4>{reminder.habit_key}</h4>
                  <p className="reminder-time">{formatTime(reminder.time)}</p>
                  <div className="reminder-days">
                    {dayLabels.map((label, index) => (
                      <span
                        key={index}
                        className={`day-badge ${reminder.days_of_week?.includes(index) ? 'active' : ''}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="reminder-actions">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={reminder.enabled}
                      onChange={() => handleToggle(reminder)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <button onClick={() => handleEdit(reminder)} className="edit-btn">
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default ReminderList

