import React from 'react';

function Agregation({ columns }) {
  return (
    <div className="section">
      <h3 className="section-title">Funções de Agregação</h3>
      <div className="filter-column">
        <select className="filter-select">
          <option>Selecione uma função</option>
          <option>COUNT</option>
          <option>SUM</option>
          <option>AVG</option>
          <option>MAX</option>
          <option>MIN</option>
        </select>
        <select className="filter-select">
          <option>Selecione uma coluna</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Agregation;
