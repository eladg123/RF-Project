import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from './components/Table';
import { Packet } from './components/Packet';

function App() {
  const [samples, setSamples] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const fetchData = async () => {
    try {
      const [samplesRes, alertsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/samples'),
        axios.get('http://127.0.0.1:8000/alerts')
      ]);
      setSamples(samplesRes.data);
      setAlerts(alertsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      <Table 
        headers={['ID', 'Timestamp', 'Value']} 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage}
      >
        {currentRows.map(s => (
          <Packet 
            key={s.id}
            data={s}
            isAlert={isAlert(s.id) || s.avg_val > -40}
            isHovered={hoveredId === s.id}
            onMouseEnter={() => setHoveredId(s.id)}
            onMouseLeave={() => setHoveredId(null)}
          />
        ))}
      </Table>
    </div>
  );
}

export default App;