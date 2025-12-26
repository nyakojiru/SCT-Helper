import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const Correlations = ({ data }) => {
  return (
    <div className="correlations">
      <h3>Correlations</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={data.sleep_vs_energy}>
            <CartesianGrid strokeDasharray="3 3" stroke="#7FB3A8" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="sleep"
              name="Sleep"
              label={{ value: 'Sleep Hours', position: 'insideBottom', offset: -5, fill: '#718096' }}
              stroke="#718096"
            />
            <YAxis
              type="number"
              dataKey="energy"
              name="Energy"
              label={{ value: 'Mental Energy', angle: -90, position: 'insideLeft', fill: '#718096' }}
              stroke="#718096"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E0',
                color: '#4A5568'
              }}
            />
            <Scatter name="Sleep vs Energy" data={data.sleep_vs_energy} fill="#7FB3A8" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Correlations

