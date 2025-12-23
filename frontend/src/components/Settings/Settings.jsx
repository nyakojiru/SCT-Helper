import { useState } from 'react'
import { entriesAPI } from '../../services/api'
import { format } from 'date-fns'
import './Settings.css'

const Settings = () => {
  const [exporting, setExporting] = useState(false)

  const exportData = async (format) => {
    try {
      setExporting(true)
      const response = await entriesAPI.getEntries()
      const data = response.data

      if (format === 'json') {
        const jsonStr = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sct-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else if (format === 'csv') {
        const headers = ['Date', 'Mental Energy', 'Fog Episodes', 'Sleep Hours', 'Notes']
        const rows = data.map(entry => [
          entry.date,
          entry.mental_energy,
          entry.fog_episodes,
          entry.sleep_hours,
          entry.notes.replace(/,/g, ';')
        ])
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n')
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sct-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error al exportar datos')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="settings-container fade-in">
      <h2>Configuración</h2>
      
      <div className="settings-section">
        <h3>Exportar Datos</h3>
        <p className="settings-description">
          Descarga tus datos en formato JSON o CSV. Tus datos te pertenecen.
        </p>
        <div className="export-buttons">
          <button
            onClick={() => exportData('json')}
            disabled={exporting}
            className="export-btn"
          >
            {exporting ? 'Exportando...' : 'Exportar JSON'}
          </button>
          <button
            onClick={() => exportData('csv')}
            disabled={exporting}
            className="export-btn"
          >
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings

