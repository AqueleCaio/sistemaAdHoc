// FilterMain.jsx
import React, { useState, useEffect } from 'react';
import '../styles/Filters.css';
import question from '../assets/tooltip.png';
import { getTableNames, 
         getTableAttributes, 
         getAllRelatedTables, 
         handleReportGeneration } from '../services/frontController';
import { useQuery } from '../context/queryContext';


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
  const [selectedAgg, setSelectedAgg] = useState([{ func: null, column: null }]);
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


  // Sempre que selectedTables mudar, atualiza as tabelas disponíveis
  useEffect(() => {
    if (selectedTables.length === 0) {
      // Nenhuma tabela selecionada → mostrar todas as disponíveis
      setAvailableTables(tables);
    } else {
      // Atualiza com base na última tabela selecionada
      const lastTable = selectedTables[selectedTables.length - 1];
      updateAvailableTables(lastTable, selectedTables);
    }
  }, [selectedTables, tables]);


  
  const removeTable = (tableName) => {
    const updatedTables = selectedTables.filter(t => t !== tableName);
    setSelectedTables(updatedTables);

    const updatedColumns = selectedColumns.filter(col => !col.startsWith(`${tableName}.`));
    setSelectedColumns(updatedColumns);

    // Atualiza as tabelas disponíveis após remover
    updateAvailableTables(updatedTables[updatedTables.length - 1], updatedTables);
  };


  // Atualiza as tabelas disponíveis com base na tabela selecionada
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

  // Função para alternar a seleção de colunas
  const toggleColumn = (columnId) => {
    if (selectedColumns.includes(columnId)) {
      setSelectedColumns(selectedColumns.filter(c => c !== columnId));
    } else {
      setSelectedColumns([...selectedColumns, columnId]);
    }
  };


  const { setQuery } = useQuery();

  const handleGenerateReport = async () => {
    const payload = {
      tables: selectedTables.map(name => ({ name })),
      joinType,
      columns: selectedColumns.map(col => ({ column: col })),
      aggregation: selectedAgg || [],
      filters,
      orderBy: orderBy.column ? { column: orderBy.column, direction: orderBy.direction } : null
    };

    // Usa a função pai para distribuir o payload
    const result = await handleReportGeneration(payload);

    setQuery(result.query);    
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
