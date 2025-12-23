-- Initial database schema for SCT Tracker
-- This file is for reference. Actual migrations are handled by Alembic in the backend.

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    settings_json JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Daily entries table
CREATE TABLE IF NOT EXISTS daily_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mental_energy INTEGER DEFAULT 5,
    fog_episodes INTEGER DEFAULT 0,
    sleep_hours REAL DEFAULT 7.0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, date);

-- Habit logs table
CREATE TABLE IF NOT EXISTS habit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    habit_key VARCHAR NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    value INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_key ON habit_logs(habit_key);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    habit_key VARCHAR NOT NULL,
    time TIME NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    days_of_week JSONB DEFAULT '[0,1,2,3,4,5,6]'
);

CREATE INDEX IF NOT EXISTS idx_reminders_user ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_habit_key ON reminders(habit_key);

-- Activity sessions table
CREATE TABLE IF NOT EXISTS activity_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    score REAL DEFAULT 0.0,
    metadata_json JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_activity_sessions_user ON activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_type ON activity_sessions(activity_type);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reminder_id INTEGER REFERENCES reminders(id) ON DELETE SET NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR DEFAULT 'sent',
    clicked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_reminder ON notifications(reminder_id);

