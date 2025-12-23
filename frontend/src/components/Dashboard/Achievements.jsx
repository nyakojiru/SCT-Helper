import './Dashboard.css'

const Achievements = () => {
  // Placeholder for achievements/st streaks
  return (
    <div className="achievements">
      <h3>Logros y Racha</h3>
      <div className="achievements-grid">
        <div className="achievement-card">
          <span className="achievement-icon">🔥</span>
          <div className="achievement-info">
            <div className="achievement-name">Racha Actual</div>
            <div className="achievement-value">0 días</div>
          </div>
        </div>
        <div className="achievement-card">
          <span className="achievement-icon">⭐</span>
          <div className="achievement-info">
            <div className="achievement-name">Mejor Racha</div>
            <div className="achievement-value">0 días</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievements

