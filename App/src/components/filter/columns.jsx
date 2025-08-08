import React from 'react';

function Columns({ columns, selectedColumns, toggleColumn }) {
  return (
    <div className="section">
      <h3 className="section-title">Colunas para Exibir</h3>
      <div className="checkbox-group">
        {columns.map(column => (
          <label key={column.id} className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox-input"
              checked={selectedColumns.includes(column.id)}
              onChange={() => toggleColumn(column.id)}
            />
            <span className="checkbox-text">{column.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default Columns;
