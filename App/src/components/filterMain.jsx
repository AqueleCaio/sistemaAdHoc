// FilterMain.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Filters.css';
import question from '../assets/tooltip.png';
import { getTableNames, getTableAttributes, getAllRelatedTables, postDataReport } from '../services/controller';

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
  const [selectedAgg, setSelectedAgg] = useState({ func: null, column: null });
  const [filters, setFilters] = useState([]);
  const [orderBy, setOrderBy] = useState({ column: null, direction: 'ASC' });

  const visibleColumns = columns.filter(col => selectedColumns.includes(col.id));

  // Apenas para colunas numéricas que fazem sentido para agregação
  const aggregatableColumns = columns.filter(col => {
    const lower = col.name.toLowerCase();

    // Campos que não fazem sentido em agregação
    const invalid = /(nome|iso3|categoria|createdat|updatedat)/i.test(lower);

    // Colunas que provavelmente são numéricas
    const validNumeric = /(valor|ano|populacao|renda|indice|taxa|id)/i.test(lower);

    return !invalid && validNumeric;
  });




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

  const removeTable = (tableToRemove) => {
    const newSelectedTables = selectedTables.filter(table => table !== tableToRemove);
    setSelectedTables(newSelectedTables);

    if (newSelectedTables.length === 0) {
      setAvailableTables([...tables]);
      setRelatedTables([]);
      setSelectedTable('');
    }
  };

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

  const toggleColumn = (columnId) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(c => c !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };

  // Envia para o back
  const handleGenerateReport = async () => {
    console.log('Generating report with:', { selectedTables, joinType, selectedColumns, selectedAgg, filters, orderBy });
    const payload = {
      tables: selectedTables.map(name => ({ name })),
      joinType,
      columns: selectedColumns.map(col => ({ column: col })),
      aggregation: selectedAgg.func ? { function: selectedAgg.func, column: selectedAgg.column } : null,
      filters,
      orderBy: orderBy.column ? { column: orderBy.column, direction: orderBy.direction } : null
    };
    const result = await postDataReport(payload);
    console.log('Report result:', result);
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
        updateAvailableTables={updateAvailableTables}
      />

      <TypeJoin 
        joinType={joinType} 
        setJoinType={setJoinType} 
        question={question} 
      />

      <Columns
        columns={columns}
        selectedColumns={selectedColumns}
        toggleColumn={toggleColumn}
      />

      <Agregation 
        columns={aggregatableColumns} 
        selectedAgg={selectedAgg} 
        setSelectedAgg={setSelectedAgg} 
      />

      <FiltersSection 
        columns={visibleColumns} 
        setFilters={setFilters} 
      />

      <OrderBy 
        columns={visibleColumns} 
        orderBy={orderBy} 
        setOrderBy={setOrderBy} 
      />


      <button className="generate-report-button" onClick={handleGenerateReport}>
        Gerar Relatório
      </button>
    </div>
  );
}

export default FilterMain;
