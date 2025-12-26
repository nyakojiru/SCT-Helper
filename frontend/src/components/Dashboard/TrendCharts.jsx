import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { entriesAPI } from '../../services/api'
import { format, subDays } from 'date-fns'
import './Dashboard.css'

const TrendCharts = ({ period }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [period])

  const loadChartData = async () => {
    try {
      setLoading(true)
      const days = parseInt(period)
      const fromDate = format(subDays(new Date(), days), 'yyyy-MM-dd')
      const toDate = format(new Date(), 'yyyy-MM-dd')
      
      const response = await entriesAPI.getEntries(fromDate, toDate)
      const entries = response.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      const chartData = entries.map(entry => ({
        date: format(new Date(entry.date), 'MMM d'),
        mentalEnergy: entry.mental_energy,
        fogEpisodes: entry.fog_episodes,
        sleepHours: entry.sleep_hours
      }))
      
      setData(chartData)
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading charts...</div>
  }

  return (
    <div className="trend-charts">
      <h3>Trends</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7FB3A8" opacity={0.3} />
            <XAxis dataKey="date" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E0',
                color: '#4A5568'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="mentalEnergy"
              stroke="#7FB3A8"
              strokeWidth={2}
              name="Mental Energy"
            />
            <Line
              type="monotone"
              dataKey="fogEpisodes"
              stroke="#F4A460"
              strokeWidth={2}
              name="Fog Episodes"
            />
            <Line
              type="monotone"
              dataKey="sleepHours"
              stroke="#A5C9C7"
              strokeWidth={2}
              name="Sleep Hours"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TrendCharts

