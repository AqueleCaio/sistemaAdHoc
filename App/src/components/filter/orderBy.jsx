import React from 'react';

function OrderBy({ columns }) {
  return (
    <div className="section">
      <h3 className="section-title">Ordenação</h3>
      <div className="filter-column">
        <select className="filter-select">
          <option>Selecione uma coluna</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
        <select className="filter-select">
          <option>ASC</option>
          <option>DESC</option>
        </select>
      </div>
    </div>
  );
}

export default OrderBy;
