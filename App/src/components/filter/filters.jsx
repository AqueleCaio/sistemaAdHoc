import React from 'react';

function FiltersSection({ columns }) {
  return (
    <div className="section">
      <h3 className="section-title">Filtros</h3>
      <div className="filter-column">
        <select className="filter-select" id='selector_tables'>
          <option>Selecione uma coluna</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
        <select className="filter-select" id="operators">
          <option>=</option>
          <option>!=</option>
          <option>&lt;</option>
          <option>&gt;</option>
          <option>LIKE</option>
        </select>
        <input type="text" className="filter-input" placeholder="Valor" id='value' />
      </div>
    </div>
  );
}

export default FiltersSection;
