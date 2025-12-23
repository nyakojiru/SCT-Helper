import './Dashboard.css'

const StatsSummary = ({ data }) => {
  return (
    <div className="stats-summary">
      <h3>Statistics Summary</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Average Mental Energy</div>
          <div className="stat-value">{data.avg_mental_energy.toFixed(1)}</div>
          <div className="stat-unit">/ 10</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Fog Episodes</div>
          <div className="stat-value">{data.avg_fog_episodes.toFixed(1)}</div>
          <div className="stat-unit">per day</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Sleep Hours</div>
          <div className="stat-value">{data.avg_sleep_hours.toFixed(1)}</div>
          <div className="stat-unit">hours</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Entries</div>
          <div className="stat-value">{data.total_entries}</div>
          <div className="stat-unit">days</div>
        </div>
      </div>
    </div>
  )
}

export default StatsSummary

