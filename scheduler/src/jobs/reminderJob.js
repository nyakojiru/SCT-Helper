const axios = require('axios')

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

async function checkAndSendReminders() {
  try {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const currentDay = now.getDay()
    const dbDay = currentDay === 0 ? 6 : currentDay - 1

    // This would require authentication token in production
    // For now, this is a template for the reminder checking logic
    
    console.log(`Checking reminders for ${currentTime} on day ${dbDay}`)
    
    // In production:
    // 1. Get all active reminders from backend
    // 2. Filter by time and day_of_week
    // 3. Send notifications via backend API
    // 4. Log notification sends
    
  } catch (error) {
    console.error('Error in reminder job:', error)
  }
}

module.exports = { checkAndSendReminders }

