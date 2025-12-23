const cron = require('node-cron')
const axios = require('axios')
require('dotenv').config()

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Check for reminders every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust for Monday = 0 format used in database
    const dbDay = currentDay === 0 ? 6 : currentDay - 1

    console.log(`[${new Date().toISOString()}] Checking reminders for ${currentTime} on day ${dbDay}`)

    // In a real implementation, we would:
    // 1. Query backend API for active reminders matching current time and day
    // 2. Send notifications via backend API
    // 3. Log notifications
    
    // For now, this is a placeholder that logs the check
    // The actual implementation would require authentication and API calls
    
  } catch (error) {
    console.error('Error in reminder check:', error)
  }
})

console.log('Scheduler service started')
console.log(`Backend URL: ${BACKEND_URL}`)
console.log('Checking reminders every minute...')

