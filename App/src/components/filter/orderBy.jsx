import React from 'react';

function OrderBy({ columns, orderBy, setOrderBy }) {

  // Atualiza uma cláusula específica
  const handleColumnChange = (index, value) => {
    const updated = [...orderBy];
    updated[index].column = value;
    setOrderBy(updated);
  };

  const handleDirectionChange = (index, value) => {
    const updated = [...orderBy];
    updated[index].direction = value;
    setOrderBy(updated);
  };

  // Adiciona uma nova cláusula de ORDER BY
  const addOrderClause = () => {
    setOrderBy([...orderBy, { column: null, direction: 'ASC' }]);
  };

  // Remove cláusula
  const removeOrderClause = (index) => {
    const updated = orderBy.filter((_, i) => i !== index);
    setOrderBy(updated);
  };

  return (
    <div className="section">
      <h3 className="section-title">Ordenação</h3>

      {orderBy.map((ob, index) => (
        <div key={index} className="filter-column">
         <select
          className="filter-select"
          value={ob.column || ''}
          onChange={e => handleColumnChange(index, e.target.value)}
        >
          <option value="">Selecione uma coluna</option>
          {columns.map(opt => (
            <option key={opt.column} value={opt.column}>{opt.label}</option>
          ))}
        </select>


          <select
            className="filter-select"
            value={ob.direction || 'ASC'}
            onChange={e => handleDirectionChange(index, e.target.value)}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>

          {orderBy.length > 1 && (
            <button className="filter-remove" onClick={() => removeOrderClause(index)}>X</button>
          )}
        </div>
      ))}

      <button className="filter-add" onClick={addOrderClause}>
        Adicionar Ordenação
      </button>
    </div>
  );
}

export default OrderBy;
