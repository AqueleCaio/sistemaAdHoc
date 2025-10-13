import React, { useState, useEffect } from 'react';

function Agregation({ columns, selectedAgg, setSelectedAgg }) {
  const [aggregations, setAggregations] = useState([
    { func: '', column: '' }
  ]);

  // Atualiza o estado no componente pai
  useEffect(() => {
    const validAgg = aggregations.filter(a => a.func && a.column);
    setSelectedAgg(validAgg);
  }, [aggregations, setSelectedAgg]);

  const updateAggregation = (index, key, value) => {
    const updated = [...aggregations];
    updated[index][key] = value;
    setAggregations(updated);
  };

  const addAggregation = () => {
    setAggregations([...aggregations, { func: '', column: '' }]);
  };

  const removeAggregation = (index) => {
    const updated = aggregations.filter((_, i) => i !== index);
    setAggregations(updated);
  };

  return (
    <div className="section">
      <h3 className="section-title">Funções de Agregação</h3>

      {aggregations.map((agg, index) => (
        <div key={index} className="filter-column">
          {/* Função de agregação */}
          <select
            className="filter-select"
            value={agg.func}
            onChange={e => updateAggregation(index, 'func', e.target.value)}
          >
            <option value="">Selecione uma função</option>
            <option value="COUNT">COUNT</option>
            <option value="SUM">SUM</option>
            <option value="AVG">AVG</option>
            <option value="MAX">MAX</option>
            <option value="MIN">MIN</option>
          </select>

          {/* Coluna */}
          <select
            className="filter-select"
            value={agg.column}
            onChange={e => updateAggregation(index, 'column', e.target.value)}
          >
            <option value="">Selecione uma coluna</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>

          {/* Botão de remover (se houver mais de um) */}
          {aggregations.length > 1 && (
            <button
              className="filter-remove"
              onClick={() => removeAggregation(index)}
            >
              X
            </button>
          )}
        </div>
      ))}

      {/* Botão para adicionar nova agregação */}
      <button
        className="filter-add"
        onClick={addAggregation}
      >
        Adicionar Agregação
      </button>
    </div>
  );
}

export default Agregation;
