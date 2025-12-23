const axios = require('axios')

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

async function sendNotification(userId, reminderId, message) {
  try {
    // In production, this would call the backend API to:
    // 1. Create a notification record
    // 2. Send web push notification if user has subscribed
    // 3. Send email notification if configured
    
    console.log(`Sending notification to user ${userId} for reminder ${reminderId}: ${message}`)
    
    // Placeholder for actual notification sending
    // Would require authentication and proper API integration
    
  } catch (error) {
    console.error('Error sending notification:', error)
    throw error
  }
}

module.exports = { sendNotification }

