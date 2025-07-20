import React from 'react';
import '../styles/Code.css';

function Codigo({ sqlQuery }) {
  return (
    <div className="codigo-container">
      <h2 className="codigo-title">Consulta SQL Gerada</h2>
      <div className="sql-viewer">
        <pre>{sqlQuery}</pre>
      </div>
    </div>
  );
}

export default Codigo;