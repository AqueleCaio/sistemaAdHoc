import React, { useState, useEffect } from 'react';

function FiltersSection({ columns, setFilters }) {
  // estados locais para os campos
  const [selectedColumn, setSelectedColumn] = useState('');
  const [operator, setOperator] = useState('=');
  const [value, setValue] = useState('');

  // sempre que algum campo mudar, atualizamos os filtros no pai
  useEffect(() => {
    if (selectedColumn && value !== '') {
      setFilters([{ column: selectedColumn, operator, value }]);
    } else {
      setFilters([]); // se não tiver nada válido, limpa
    }
  }, [selectedColumn, operator, value, setFilters]);

  return (
    <div className="section">
      <h3 className="section-title">Filtros</h3>
      <div className="filter-column">
        <select 
          className="filter-select"
          id='selector_tables'
          value={selectedColumn}
          onChange={e => setSelectedColumn(e.target.value)}
        >
          <option value="">Selecione uma coluna</option>
          {columns.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          id="operators"
          value={operator}
          onChange={e => setOperator(e.target.value)}
        >
          <option value="=">=</option>
          <option value="!=">!=</option>
          <option value="<">&lt;</option>
          <option value=">">&gt;</option>
          <option value="LIKE">LIKE</option>
        </select>

        <input 
          type="text" 
          className="filter-input" 
          placeholder="Valor" 
          id='value'
          onChange={e => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}

export default FiltersSection;
