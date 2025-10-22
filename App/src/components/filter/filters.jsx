import React, { useState, useEffect } from 'react';

function FiltersSection({ columns, setFilters }) {
  const [filtersList, setFiltersList] = useState([
    { column: '', operator: '=', value: '', logic: 'AND' }
  ]);

  // Atualiza os filtros no pai sempre que houver mudança
  useEffect(() => {
    // remove filtros incompletos antes de enviar
    const validFilters = filtersList.filter(f => f.column && f.value !== '');
    setFilters(validFilters);
  }, [filtersList, setFilters]);

  // Atualiza um filtro específico
  const updateFilter = (index, key, value) => {
    const updated = [...filtersList];
    updated[index][key] = value;
    setFiltersList(updated);
  };

  // Adiciona novo filtro
  const addFilter = () => {
    setFiltersList([
      ...filtersList,
      { column: '', operator: '=', value: '', logic: 'AND' }
    ]);
  };

  // Remove filtro
  const removeFilter = (index) => {
    const updated = filtersList.filter((_, i) => i !== index);
    setFiltersList(updated);
  };

  return (
    <div className="section">
      <h3 className="section-title">Filtros</h3>

      {filtersList.map((filter, index) => (
        <div key={index} className="filter-column">
          {/* Operador lógico (exceto no primeiro filtro) */}
          {index > 0 && (
            <select
              className="filter-select"
              id='selector_tables'
              value={filter.logic}
              onChange={e => updateFilter(index, 'logic', e.target.value)}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}

          {/* Coluna */}
          <select
            className="filter-select"
            value={filter.column}
            onChange={e => updateFilter(index, 'column', e.target.value)}
          >
            <option value="">Selecione uma coluna</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>

          {/* Operador */}
          <select
            className="filter-select"
            id='operators'
            value={filter.operator}
            onChange={e => updateFilter(index, 'operator', e.target.value)}
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value="<">&lt;</option>
            <option value=">">&gt;</option>
            <option value="LIKE">LIKE</option>
          </select>

          {/* Valor */}
          <input
            type="text"
            className="filter-input"
            id='value'
            placeholder="Valor"
            value={filter.value}
            onChange={e => updateFilter(index, 'value', e.target.value)}
          />

          {/* Botão de remover */}
          {filtersList.length > 1 && (
            <button
              className="filter-remove"
              onClick={() => removeFilter(index)}
            >
              X
            </button>
          )}
        </div>
      ))}

      {/* Botão de adicionar filtro */}
      <button
        className="filter-add"
        onClick={addFilter}
      >
        Adicionar Filtro
      </button>
    </div>
  );
}

export default FiltersSection;
