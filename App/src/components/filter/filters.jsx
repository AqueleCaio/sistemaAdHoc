import React, { useState, useEffect } from 'react';

function FiltersSection({ columns, setFilters }) {
  const [filtersList, setFiltersList] = useState([
    { column: '', operator: '=', value: '', logic: 'AND' }
  ]);

  // Atualiza os filtros válidos no componente pai
  useEffect(() => {
    const validFilters = filtersList.filter(f => f.column && f.value !== '');
    setFilters(validFilters);
  }, [filtersList, setFilters]);

  // Atualiza um campo específico de um filtro
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
    setFiltersList(filtersList.filter((_, i) => i !== index));
  };

  return (
    <div className="section">
      <h3 className="section-title">Filtros</h3>

      {filtersList.map((filter, index) => (
        <div key={index} className="filter-column">
          {/* Operador lógico (exceto o primeiro) */}
          {index > 0 && (
            <select
              className="filter-select"
              value={filter.logic}
              onChange={e => updateFilter(index, 'logic', e.target.value)}
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          )}

          {/* Coluna principal */}
          <select
            className="filter-select"
            value={filter.column}
            onChange={e => updateFilter(index, 'column', e.target.value)}
          >
            <option value="">Colunas</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>

          {/* Operador */}
          <select
            className="filter-select-operator"
            value={filter.operator}
            onChange={e => updateFilter(index, 'operator', e.target.value)}
          >
            <option value="=">=</option>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value=">=">{'>='}</option>
            <option value="<=">{'<='}</option>
            <option value="<>">{'<>'}</option>
            <option value="LIKE">{'LIKE'}</option>
          </select>

          {/* Valor como combobox híbrido */}
          <div className="filter-combobox-container">
            <input
              list={`valueOptions-${index}`}
              className="filter-combobox"
              placeholder="Valor"
              value={filter.value}
              onChange={(e) => updateFilter(index, 'value', e.target.value)}
            />
            <datalist id={`valueOptions-${index}`}>
              {columns
                .filter(col => col.id !== filter.column)
                .map(col => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
            </datalist>
          </div>

          {/* Botão remover */}
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

      {/* Botão adicionar filtro */}
      <button className="filter-add" onClick={addFilter}>
        Adicionar Filtro
      </button>
    </div>
  );
}

export default FiltersSection;
