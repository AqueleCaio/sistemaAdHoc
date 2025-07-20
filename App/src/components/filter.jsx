import React, { useState } from 'react';
import '../styles/Filters.css';
import question from "../assets/tooltip.png";

function Filters() {
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedTables, setSelectedTables] = useState([]);

  const [joinType, setJoinType] = useState('INNER JOIN');
  const [selectedColumns, setSelectedColumns] = useState([
    'countries.country_id',
    'countries.country_name',
    'countries.continent',
    'countries.capital'
  ]);

  const tables = [
    { name: 'countries', label: 'Paletes' },
    { name: 'economy', label: 'Economia' },
    { name: 'demographics', label: 'Demografia' },
    { name: 'health', label: 'Saúde' }
  ];

  const columns = [
    { id: 'countries.country_id', name: 'ID do País' },
    { id: 'countries.country_name', name: 'Nome do País' },
    { id: 'countries.continent', name: 'Continente' },
    { id: 'countries.capital', name: 'Capital' },
    { id: 'economy.gdp', name: 'PIB' },
    { id: 'demographics.population', name: 'População' },
    { id: 'health.life_expectancy', name: 'Expectativa de Vida' }
  ];

  const toggleColumn = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };

  return (
    <div className="filters">
      <h2 className="filters-title">Configurar Relatório</h2>
      <div className="section">
        <h3 className="section-title">Tabelas Disponíveis</h3>
        <div className="filter-column">
          <select
            className="filter-select"
            value={selectedTable || ''}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Selecione uma tabela</option>
            {tables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.name} ({table.label})
              </option>
            ))}
          </select>
          <button
            className="add-button"
            onClick={() => {
              if (selectedTable && !selectedTables.includes(selectedTable)) {
                setSelectedTables([...selectedTables, selectedTable]);
                setSelectedTable('');
              }
            }}
          >
            +
          </button>
        </div>

      {selectedTables.length > 0 && (
        <div>
          <ul>
            {selectedTables.map((table, index) => (
              <li key={index}>
                {table}
                <button
                  onClick={() =>
                    setSelectedTables(selectedTables.filter((t) => t !== table))
                  }
                  className="remove_button"
                  aria-label={`Remover ${table}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>


      <div className="section">
        <div className="section-title-with-tooltip">
          <h3 className="section-title">Tipo de JOIN</h3>
          <div className="tooltip-container">
            <span className="tooltip-icon">
              <img src={question} alt="?" />
            </span>
            <div className="tooltip-text">
              <strong>Joins</strong> são usados para combinar registros de duas ou mais tabelas em uma base de dados.<br /><br />
              <strong>INNER JOIN:</strong> retorna registros que têm correspondência em ambas as tabelas.<br />
              <strong>LEFT JOIN:</strong> retorna todos os registros da tabela da esquerda e os correspondentes da direita (ou null).<br />
              <strong>RIGHT JOIN:</strong> retorna todos os registros da tabela da direita e os correspondentes da esquerda (ou null).<br />
              <strong>FULL JOIN:</strong> retorna registros quando há correspondência em uma das tabelas (esquerda ou direita).<br />
              <strong>CROSS JOIN:</strong> retorna o produto cartesiano entre as duas tabelas.
            </div>
          </div>
        </div>

        <select 
          className="filter-select"
          id='join_type'
          value={joinType}
          onChange={(e) => setJoinType(e.target.value)}
        >
          <option value="INNER JOIN">INNER JOIN</option>
          <option value="LEFT JOIN">LEFT JOIN</option>
          <option value="RIGHT JOIN">RIGHT JOIN</option>
          <option value="FULL JOIN">FULL JOIN</option>
          <option value="CROSS JOIN">CROSS JOIN</option>
        </select>
      </div>


      <div className="section">
        <h3 className="section-title">Colunas para Exibir</h3>
        <div className="checkbox-group">
          {columns.map(column => (
            <label key={column.id} className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={selectedColumns.includes(column.id)}
                onChange={() => toggleColumn(column.id)}
              />
              <span className="checkbox-text">{column.name}</span>
            </label>
          ))}
        </div>
      </div>

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
            <option>population</option>
            <option>gdp</option>
            <option>life_expectancy</option>
          </select>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Filtros</h3>
        <div className="filter-column">
          <select className="filter-select" id='selector_tables'>
            <option>Selecione uma coluna</option>
            <option>country_name</option>
            <option>population</option>
            <option>gdp</option>
          </select>
          <select className="filter-select" id="operators">
            <option>=</option>
            <option>!=</option>
            <option>&lt;</option>
            <option>&gt;</option>
            <option>LIKE</option>
          </select>
          <input type="text" className="filter-input" placeholder="Valor" id='value'/>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Ordenação</h3>
        <div className="filter-column">
          <select className="filter-select">
            <option>Selecione uma coluna</option>
            <option>country_name</option>
            <option>population</option>
            <option>gdp</option>
          </select>
          <select className="filter-select">
            <option>ASC</option>
            <option>DESC</option>
          </select>
        </div>
      </div>


    <button className="generate-report-button">Gerar Relatório</button>
  </div>
  );
}

export default Filters