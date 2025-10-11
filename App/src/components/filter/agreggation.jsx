import React from 'react';

function Agregation({ columns, selectedAgg, setSelectedAgg }) {
  const handleFunctionChange = (e) => {
    setSelectedAgg({
      ...selectedAgg,
      func: e.target.value
    });
  };

  const handleColumnChange = (e) => {
    setSelectedAgg({
      ...selectedAgg,
      column: e.target.value
    });
  };

  return (
    <div className="section">
      <h3 className="section-title">Funções de Agregação</h3>
      <div className="filter-column">
        <select 
          className="filter-select"
          value={selectedAgg.func || ''}
          onChange={handleFunctionChange}
        >
          <option value="">Selecione uma função</option>
          <option value="COUNT">COUNT</option>
          <option value="SUM">SUM</option>
          <option value="AVG">AVG</option>
          <option value="MAX">MAX</option>
          <option value="MIN">MIN</option>
        </select>

        <select 
          className="filter-select"
          value={selectedAgg.column || ''}
          onChange={handleColumnChange}
        >
          <option value="">Selecione uma coluna</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Agregation;
