import React, { useState, useEffect } from 'react';
import '../styles/Filters.css';
import question from '../assets/tooltip.png';
import { getTableNames, getTableAttributes, getAllRelatedTables } from '../services/controller';

// Importação dos subcomponentes
import Tables from './filter/tables';
import TypeJoin from './filter/typeJoin';
import Columns from './filter/columns';
import Agregation from './filter/agreggation';
import FiltersSection from './filter/filters';
import OrderBy from './filter/orderBy';

function FilterMain() {
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedTables, setSelectedTables] = useState([]);
  const [tables, setTables] = useState([]);
  const [relatedTables, setRelatedTables] = useState([]);
  const [relations, setRelations] = useState({});
  const [availableTables, setAvailableTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [joinType, setJoinType] = useState('INNER JOIN');
  const [selectedColumns, setSelectedColumns] = useState([]);

  // Carrega os nomes da tabela
  useEffect(() => {
    async function fetchTables() {
      const data = await getTableNames();
      const formatted = data.map(t => ({ name: t.table_name, label: t.table_name }));
      setTables(formatted);
      setAvailableTables(formatted);
    }
    fetchTables();
  }, []);

  // Carrega relações apenas uma vez
  useEffect(() => {
    const loadData = async () => {
      const rels = await getAllRelatedTables();
      setRelations(rels);
    };
    loadData();
  }, []);

  // Carrega atributos das tabelas selecionadas
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

  // Função para remover tabela
  const removeTable = (tableToRemove) => {
    const newSelectedTables = selectedTables.filter(table => table !== tableToRemove);
    setSelectedTables(newSelectedTables);

    if (newSelectedTables.length === 0) {
      setAvailableTables([...tables]);
      setRelatedTables([]);
      setSelectedTable('');
    }
  };

  // Atualiza as tabelas dentro do dropdown
  const updateAvailableTables = (tableName, currentSelectedTables = selectedTables) => {
    if (!tableName) {
      setAvailableTables([...tables].filter(t => !currentSelectedTables.includes(t.name)));
      return;
    }

    const related = relations[tableName] || [];
    setRelatedTables(related);

    setAvailableTables(
      tables.filter(table =>
        (related.includes(table.name) || currentSelectedTables.includes(table.name)) &&
        !currentSelectedTables.includes(table.name)
      )
    );
  };

  // Toggle de colunas
  const toggleColumn = (columnId) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(c => c !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };

  return (
    <div className="filters">
      <h2 className="filters-title">Configurar Relatório</h2>

      <Tables
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
        selectedTables={selectedTables}
        setSelectedTables={setSelectedTables}
        availableTables={availableTables}
        removeTable={removeTable}
        updateAvailableTables={updateAvailableTables} // passa para o filho
      />

      <TypeJoin joinType={joinType} setJoinType={setJoinType} question={question} />

      <Columns
        columns={columns}
        selectedColumns={selectedColumns}
        toggleColumn={toggleColumn}
      />

      <Agregation columns={columns} />

      <FiltersSection columns={columns} />

      <OrderBy columns={columns} />

      <button className="generate-report-button">Gerar Relatório</button>
    </div>
  );
}

export default FilterMain;
