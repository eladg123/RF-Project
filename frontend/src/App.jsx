import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [samples, setSamples] = useState([])
  const [alerts, setAlerts] = useState([])
  const [hoveredId, setHoveredId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 25

const fetchData = async () => {
    try {
      const [samplesRes, alertsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/samples'),
        axios.get('http://127.0.0.1:8000/alerts')
      ]);
      
      setSamples(samplesRes.data);
      setAlerts(alertsRes.data);

      // זה ידפיס את כל האובייקט של ההתראה הראשונה כדי שנראה את שמות השדות
      console.log("Alert Object Example:", alertsRes.data[0]);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const isAlert = (id) => alerts.some(a => String(a.sample_id) === String(id));

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = samples.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(samples.length / rowsPerPage);

  return (
    <div style={{ padding: '40px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <h1>RF Data Monitor</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e1e1e' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #444', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #444', textAlign: 'left' }}>Timestamp</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #444', textAlign: 'left' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map(s => {
            // צביעה אדומה אם יש התראה ב-DB או אם הערך גדול מ-40-
            const isAlertRow = isAlert(s.id) || s.avg_val > -40;
            const isHovered = hoveredId === s.id;
            
            const rowStyle = {
              backgroundColor: isAlertRow 
                ? (isHovered ? '#9a2a2a' : '#7a1a1a') 
                : (isHovered ? '#2a2a2a' : 'transparent'),
              transition: 'background-color 0.2s ease',
              cursor: 'pointer'
            };

            return (
              <tr 
                key={s.id} 
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={rowStyle}
              >
                <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{s.id}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{new Date(s.timestamp).toLocaleString()}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{s.avg_val.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none' }}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button 
          disabled={currentPage >= totalPages} 
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none' }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default App