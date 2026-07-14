export const Table = ({ headers, children, currentPage, totalPages, onPageChange }) => {
  return (
    <>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{textAlign:'center'}}>
          <tr style={{ backgroundColor: '#1e1e1e' }}>
            {headers.map((h) => (
              <th key={h} style={{ textAlign:'center', padding: '12px', borderBottom: '1px solid #444' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none' }}>Previous</button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none' }}>Next</button>
      </div>
    </>
  );
};