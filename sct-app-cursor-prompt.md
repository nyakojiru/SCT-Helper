# SCT Tracker + Reminder + Guide App

## Contexto
Tengo un tracker React para seguimiento de síntomas de SCT (Cognitive Disengagement Syndrome / Sluggish Cognitive Tempo). Necesito expandirlo a una aplicación completa con backend, notificaciones y guías interactivas.

## Stack Técnico
- Frontend: React + Vite
- Backend: Node.js + Express (o FastAPI si prefieres Python)
- Base de datos: SQLite (desarrollo) / PostgreSQL (producción)
- Notificaciones: node-cron + web push notifications
- Containerización: Docker + Docker Compose

## Arquitectura de Contenedores

```
docker-compose.yml
├── frontend (React, puerto 3000)
├── backend (API REST, puerto 8000)
├── db (PostgreSQL, puerto 5432)
└── scheduler (servicio de notificaciones/cron)
```

## Funcionalidades a Implementar

### 1. Sistema de Tracking (ya existe parcialmente)
- Métricas diarias: energía mental (1-10), episodios de niebla, horas de sueño
- Hábitos con toggle: rutina matutina, ejercicios, meditación
- Historial y visualización de tendencias
- Exportación de datos (CSV/JSON)

### 2. Sistema de Reminders
- Notificaciones programables por horario:
  - 07:00 - Recordatorio rutina matutina (luz solar, agua fría, ejercicio breve)
  - 09:00 - Inicio bloque Pomodoro
  - 12:00 - Recordatorio ejercicio léxico
  - 17:00 - Recordatorio ejercicio aeróbico
  - 22:00 - Recordatorio rutina nocturna (meditación, preparar sueño)
- Notificaciones push (PWA) + email opcional
- Configuración flexible de horarios por usuario
- Snooze y skip de recordatorios
- Integración con calendario (iCal export)

### 3. Sistema de Guías Interactivas
Cada hábito debe tener una guía asociada con:

#### Ejercicios de Activación Cognitiva
- **Recuperación léxica**: Timer de 60 segundos, categorías aleatorias ("animales con A", "países de Europa"), contador de palabras, historial de puntuaciones
- **Descripción sin nombre**: Mostrar imagen de objeto, usuario debe describirlo sin usar el nombre
- **Lectura en voz alta**: Textos cortos con timer de 10 minutos, tracking de sesiones

#### Regulación de Activación
- **Rutina matutina guiada**: Checklist paso a paso con timers
- **Pomodoro integrado**: 25min trabajo / 5min descanso, sonidos, estadísticas
- **Ejercicio intenso rápido**: Videos/GIFs de ejercicios de 2-5 minutos (jumping jacks, burpees)

#### Meditación Focalizada
- **Concentración en punto**: Canvas con punto visual + timer + contador de "resets" cuando la mente divaga
- **Conteo de respiraciones**: Guía visual de respiración, contador del 1-10, tracking de intentos exitosos

#### Juegos de Palabras
- **Wordle clone** integrado
- **Crucigramas** simples generados
- **Anagramas**: Reordenar letras contra reloj

### 4. Dashboard de Progreso
- Gráficos de tendencia (últimos 7/30/90 días)
- Correlaciones: sueño vs energía mental, ejercicio vs episodios de niebla
- Streaks y logros (gamificación ligera)
- Resumen semanal automático

### 5. Modelo de Datos

```sql
-- Users
users (id, email, password_hash, settings_json, created_at)

-- Daily entries
daily_entries (id, user_id, date, mental_energy, fog_episodes, sleep_hours, notes, created_at)

-- Habit completions
habit_logs (id, user_id, date, habit_key, completed, value, completed_at)

-- Reminder settings
reminders (id, user_id, habit_key, time, enabled, days_of_week)

-- Activity sessions (para guías interactivas)
activity_sessions (id, user_id, activity_type, started_at, ended_at, score, metadata_json)

-- Notifications log
notifications (id, user_id, reminder_id, sent_at, status, clicked_at)
```

### 6. API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/entries?from=&to=
POST   /api/entries
PUT    /api/entries/:date
GET    /api/habits/today
POST   /api/habits/:key/complete
GET    /api/reminders
PUT    /api/reminders/:id
POST   /api/activities/:type/start
POST   /api/activities/:id/end
GET    /api/stats/summary?period=
GET    /api/stats/correlations
```

### 7. Estructura de Archivos

```
/sct-app
├── docker-compose.yml
├── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tracker/
│   │   │   ├── Reminders/
│   │   │   ├── Guides/
│   │   │   │   ├── LexicalExercise.jsx
│   │   │   │   ├── PomodoroTimer.jsx
│   │   │   │   ├── MeditationFocus.jsx
│   │   │   │   ├── WordGames.jsx
│   │   │   │   └── MorningRoutine.jsx
│   │   │   ├── Dashboard/
│   │   │   └── Settings/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── notification.service.js
│   │   │   └── scheduler.service.js
│   │   └── middleware/
├── scheduler/
│   ├── Dockerfile
│   └── jobs/
└── db/
    └── migrations/
```

## Instrucciones de Desarrollo

1. Primero genera el docker-compose.yml con todos los servicios
2. Crea el backend con autenticación JWT básica
3. Migra el tracker React existente al nuevo frontend
4. Implementa el sistema de reminders con cron
5. Añade las guías interactivas una por una
6. Implementa el dashboard con gráficos (usar Recharts)
7. Configura PWA para notificaciones push

## Prioridades
1. [ALTA] Docker setup + Backend básico + Auth
2. [ALTA] Migrar tracker existente + persistencia en DB
3. [MEDIA] Sistema de reminders funcional
4. [MEDIA] Guías: Pomodoro, Ejercicio léxico, Meditación
5. [BAJA] Dashboard avanzado con correlaciones
6. [BAJA] Gamificación y logros

## Código Base Existente (Tracker React)

El siguiente componente React es el tracker existente que debe migrarse e integrarse:

```jsx
import React, { useState, useEffect } from 'react';

const SCTTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState({});
  const [viewMode, setViewMode] = useState('today');
  
  const formatDate = (date) => date.toISOString().split('T')[0];
  const today = formatDate(currentDate);
  
  const getEntry = (date) => entries[date] || {
    mentalEnergy: 5,
    fogEpisodes: 0,
    sleepHours: 7,
    habits: {
      morningLight: false,
      coldWater: false,
      exerciseBrief: false,
      proteinBreakfast: false,
      pomodoros: 0,
      lexicalExercise: false,
      aerobicExercise: false,
      focusedMeditation: false,
      wordGames: false,
      sleepSchedule: false
    },
    notes: ''
  };
  
  const [todayEntry, setTodayEntry] = useState(getEntry(today));
  
  useEffect(() => {
    setTodayEntry(getEntry(today));
  }, [today, entries]);
  
  const saveEntry = () => {
    setEntries(prev => ({ ...prev, [today]: todayEntry }));
  };
  
  useEffect(() => {
    saveEntry();
  }, [todayEntry]);
  
  const updateHabit = (habit, value) => {
    setTodayEntry(prev => ({
      ...prev,
      habits: { ...prev.habits, [habit]: value }
    }));
  };
  
  const updateField = (field, value) => {
    setTodayEntry(prev => ({ ...prev, [field]: value }));
  };
  
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
  };

  // ... resto del componente
};

export default SCTTracker;
```

## Notas de Diseño
- Diseño oscuro/cyberpunk consistente con el tracker existente
- Paleta de colores: fondo #0a0a0f a #1a1a2e, acentos #6366f1, #818cf8, #c084fc
- Mobile-first, debe funcionar bien en móvil
- Offline-capable donde sea posible (PWA)
- Datos exportables siempre (el usuario es dueño de sus datos)
- Tipografía monospace ('Courier New' o similar)
- Animaciones sutiles (shimmer, fadeIn, pulse)

## Comandos Docker Esperados

```bash
# Desarrollo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Rebuild después de cambios
docker-compose up -d --build

# Producción
docker-compose -f docker-compose.prod.yml up -d
```
