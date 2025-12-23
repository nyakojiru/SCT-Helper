import { useState, useEffect } from 'react'
import { statsAPI, entriesAPI } from '../../services/api'
import StatsSummary from './StatsSummary'
import TrendCharts from './TrendCharts'
import Correlations from './Correlations'
import Achievements from './Achievements'
import './Dashboard.css'

const Dashboard = () => {
  const [period, setPeriod] = useState('30')
  const [summary, setSummary] = useState(null)
  const [correlations, setCorrelations] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [period])

  const loadData = async () => {
    try {
      setLoading(true)
      const [summaryRes, correlationsRes] = await Promise.all([
        statsAPI.getSummary(period),
        statsAPI.getCorrelations()
      ])
      setSummary(summaryRes.data)
      setCorrelations(correlationsRes.data)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <div>
          <h2>SCT Helper</h2>
          <p className="app-subtitle">Cognitive Disengagement Syndrome</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="period-select"
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>

      {summary && <StatsSummary data={summary} />}
      {summary && <TrendCharts period={period} />}
      {correlations && <Correlations data={correlations} />}
      <Achievements />
    </div>
  )
}

export default Dashboard

