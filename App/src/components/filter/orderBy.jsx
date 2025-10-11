import React from 'react';

function OrderBy({ columns, orderBy, setOrderBy }) {


  const handleColumnChange = (e) => {
    setOrderBy({
      ...orderBy,
      column: e.target.value
    });
  };
  

  const handleDirectionChange = (e) => {
    setOrderBy({
      ...orderBy,
      direction: e.target.value
    });
  };


  return (
    <div className="section">
      <h3 className="section-title">Ordenação</h3>
      <div className="filter-column">
        <select 
          className="filter-select"
          value={orderBy.column || ''}
          onChange={handleColumnChange}
        >
          <option value="">Selecione uma coluna</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={orderBy.direction || 'ASC'}
          onChange={handleDirectionChange}
        >
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
        </select>
      </div>
    </div>
  );
}

export default OrderBy;
