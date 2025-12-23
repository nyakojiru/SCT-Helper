import './Dashboard.css'

const StatsSummary = ({ data }) => {
  return (
    <div className="stats-summary">
      <h3>Resumen de Estadísticas</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Energía Mental Promedio</div>
          <div className="stat-value">{data.avg_mental_energy.toFixed(1)}</div>
          <div className="stat-unit">/ 10</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Episodios de Niebla Promedio</div>
          <div className="stat-value">{data.avg_fog_episodes.toFixed(1)}</div>
          <div className="stat-unit">por día</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Horas de Sueño Promedio</div>
          <div className="stat-value">{data.avg_sleep_hours.toFixed(1)}</div>
          <div className="stat-unit">horas</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Entradas Totales</div>
          <div className="stat-value">{data.total_entries}</div>
          <div className="stat-unit">días</div>
        </div>
      </div>
    </div>
  )
}

export default StatsSummary

