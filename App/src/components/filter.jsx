import React, { useState, useEffect } from 'react';
import '../styles/Filters.css';
import question from "../assets/tooltip.png";
import { getTableNames, getTableAttributes, getRelatedTables } from '../services/controller';

function Filters() {
  const [selectedTable, setSelectedTable] = useState(''); // Estado para a tabela selecionada
  const [selectedTables, setSelectedTables] = useState([]); // Todas tabelas selecionadas
  const [tables, setTables] = useState([]);
  const [relatedTables, setRelatedTables] = useState([]); // Tabelas relacionadas à tabela selecionada
  const [availableTables, setAvailableTables] = useState(tables); // Tabelas disponíveis para seleção
  const [columns, setColumns] = useState([]);
  const [joinType, setJoinType] = useState('INNER JOIN');
  const [selectedColumns, setSelectedColumns] = useState([]);


  useEffect(() => {
    async function fetchTables() {
      const data = await getTableNames();
      setTables(data.map(t => ({ name: t.table_name, label: t.table_name })));
    }
    fetchTables();
  }, []);

  useEffect(() => {
    async function fetchColumns() {
      const allColumns = [];

      for (const table of selectedTables) {
        const cols = await getTableAttributes(table);
        cols.forEach(col => {
          allColumns.push({
            id: `${table}.${col.column_name}`,
            name: `${table}.${col.column_name}`
          });
        });
      }

      setColumns(allColumns);
    }

    if (selectedTables.length > 0) {
      fetchColumns();
    } else {
      setColumns([]);
    }
  }, [selectedTables]);

  
  // Função para remover uma tabela selecionada
  const removeTable = (tableToRemove) => {
    const newSelectedTables = selectedTables.filter(table => table !== tableToRemove);
    setSelectedTables(newSelectedTables);

    // Se não há mais tabelas selecionadas, resetamos para o estado inicial
    if (newSelectedTables.length === 0) {
      setAvailableTables([...tables]);
      setRelatedTables([]);
      setSelectedTable('');
      return;
    }

   // Caso contrário, atualizamos as tabelas disponíveis
    const lastSelected = newSelectedTables[newSelectedTables.length - 1];
    updateAvailableTables(lastSelected, newSelectedTables);
  };

  // Função para atualizar as tabelas disponíveis
  const updateAvailableTables = async (tableName, currentSelectedTables = selectedTables) => {
    if (!tableName) {
      setAvailableTables([...tables].filter(t => !currentSelectedTables.includes(t.name)));
      return;
    }

    const data = await getRelatedTables(tableName);
    const related = data.map(t => t.foreign_table);
    setRelatedTables(related);

    setAvailableTables(
      tables.filter(table => 
        (related.includes(table.name) || currentSelectedTables.includes(table.name)) &&
        !currentSelectedTables.includes(table.name)
      )
    );
  };

  // Efeito para monitorar mudanças na tabela selecionada
  useEffect(() => {
    if (selectedTable) {
      setSelectedTables(prev => [...prev, selectedTable]);
      updateAvailableTables(selectedTable);
    }
  }, [selectedTable]);

  // Função chamada quando uma tabela é selecionada
  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    if (tableName) {
      setSelectedTables(prev => [...prev, tableName]);
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
          disabled={availableTables.length === 0}
        >
          <option value="">{availableTables.length === 0 ? 'Nenhuma opção disponível' : 'Selecione uma tabela'}</option>
          
          {availableTables.map((table) => (
            <option key={table.name} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>

        <div className="selected-tables-container">
          {selectedTables.map(table => (
            <div key={table} className="selected-table-item">
              {table}
              <button onClick={() => removeTable(table)}>Remover</button>
            </div>
          ))}
        </div>

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
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>
        </div>
      </div>

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
          <input type="text" className="filter-input" placeholder="Valor" id='value'/>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Ordenação</h3>
        <div className="filter-column">
          <select className="filter-select">
            <option>Selecione uma coluna</option>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
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

export default Filters;
