import './Dashboard.css'

const Achievements = () => {
  // Placeholder for achievements/st streaks
  return (
    <div className="achievements">
      <h3>Achievements & Streaks</h3>
      <div className="achievements-grid">
        <div className="achievement-card">
          <span className="achievement-icon">🔥</span>
          <div className="achievement-info">
            <div className="achievement-name">Current Streak</div>
            <div className="achievement-value">0 days</div>
          </div>
        </div>
        <div className="achievement-card">
          <span className="achievement-icon">⭐</span>
          <div className="achievement-info">
            <div className="achievement-name">Best Streak</div>
            <div className="achievement-value">0 days</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievements

