export const Packet = ({ data, isAlert, isHovered, onMouseEnter, onMouseLeave }) => {
  const rowStyle = {
    backgroundColor: isAlert 
      ? (isHovered ? '#9a2a2a' : '#7a1a1a') 
      : (isHovered ? '#2a2a2a' : 'transparent'),
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  };

  return (
    <tr onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={rowStyle}>
      <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{data.id}</td>
      <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{new Date(data.timestamp).toLocaleString()}</td>
      <td style={{ padding: '12px', borderBottom: '1px solid #333' }}>{data.avg_val.toFixed(2)}</td>
    </tr>
  );
};