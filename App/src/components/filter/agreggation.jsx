import React, { useState, useEffect } from 'react';

function Agregation({ columns, selectedAgg, setSelectedAgg, setSelectedHaving }) {
  const [aggregations, setAggregations] = useState([{ func: '', column: '' }]);
  const [havingClauses, setHavingClauses] = useState([]);

  // Atualiza o estado de agregações no componente pai
  useEffect(() => {
    const validAgg = aggregations.filter(a => a.func && a.column);
    setSelectedAgg(validAgg);
  }, [aggregations, setSelectedAgg]);

  // Atualiza o estado de HAVING no componente pai
  useEffect(() => {
    setSelectedHaving(havingClauses);
  }, [havingClauses, setSelectedHaving]);

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

  // ---------------------------
  // HAVING SECTION
  // ---------------------------
  const addHavingClause = () => {
    setHavingClauses([...havingClauses, { aggregation: '', operator: '=', value: '' }]);
  };

  const removeHavingClause = (index) => {
    const updated = havingClauses.filter((_, i) => i !== index);
    setHavingClauses(updated);
  };

  const updateHaving = (index, key, value) => {
    const updated = [...havingClauses];
    updated[index][key] = value;
    setHavingClauses(updated);
  };

  // Monta as opções de agregações já feitas (para o dropdown de HAVING)
  const availableAggregations = aggregations
    .filter(a => a.func && a.column)
    .map(a => `${a.func}(${a.column})`);

  return (
    <div className="section">
      <h3 className="section-title">Funções de Agregação</h3>

      {/* Lista de agregações */}
      {aggregations.map((agg, index) => (
        <div key={index} className="filter-column">
          {/* Função de agregação */}
          <select
            className="filter-select"
            value={agg.func}
            onChange={e => updateAggregation(index, 'func', e.target.value)}
          >
            <option value="">Funções</option>
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
            <option value="">Colunas</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>

          {/* Botão de remover */}
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

      {/* Botões de ação */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button className="filter-add" onClick={addAggregation}>
          Adicionar Agregação
        </button>

        <button
          className="filter-add"
          onClick={addHavingClause}
          disabled={availableAggregations.length === 0}
        >
          Adicionar HAVING
        </button>
      </div>

      {/* Seção HAVING */}
      {havingClauses.length > 0 && (
        <div>
          {havingClauses.map((having, index) => (
            <div key={index} className="filter-column" id="#container_having">
              {/* Seleção da agregação */}
              <select
                className="filter-select"
                value={having.aggregation}
                onChange={e => updateHaving(index, 'aggregation', e.target.value)}
              >
                <option value="">Agregações</option>
                {availableAggregations.map((agg, i) => (
                  <option key={i} value={agg}>{agg}</option>
                ))}
              </select>

              {/* Operador */}
              <select
                className="filter-select"
                id="operators"
                value={having.operator}
                onChange={e => updateHaving(index, 'operator', e.target.value)}
              >
                <option value="=">=</option>
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value=">=">{'>='}</option>
                <option value="<=">{'<='}</option>
                <option value="<>">{'<>'}</option>
              </select>

              {/* Valor */}
              <input
                type="text"
                className="filter-input"
                id="value"
                placeholder="Valor"
                value={having.value}
                onChange={e => updateHaving(index, 'value', e.target.value)}
              />

              <button
                className="filter-remove"
                onClick={() => removeHavingClause(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Agregation;
