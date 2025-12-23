import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const Correlations = ({ data }) => {
  return (
    <div className="correlations">
      <h3>Correlaciones</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={data.sleep_vs_energy}>
            <CartesianGrid strokeDasharray="3 3" stroke="#6366f1" opacity={0.3} />
            <XAxis
              type="number"
              dataKey="sleep"
              name="Sueño"
              label={{ value: 'Horas de Sueño', position: 'insideBottom', offset: -5, fill: '#818cf8' }}
              stroke="#818cf8"
            />
            <YAxis
              type="number"
              dataKey="energy"
              name="Energía"
              label={{ value: 'Energía Mental', angle: -90, position: 'insideLeft', fill: '#818cf8' }}
              stroke="#818cf8"
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #6366f1',
                color: '#c084fc'
              }}
            />
            <Scatter name="Sueño vs Energía" data={data.sleep_vs_energy} fill="#6366f1" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Correlations

