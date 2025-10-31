import React from 'react';

function Tables({ selectedTable, setSelectedTable, selectedTables, setSelectedTables, availableTables, removeTable, updateAvailableTables }) {
  // garante que só tenha valores únicos
  const uniqueTables = [...new Set(
    availableTables.map(t => (typeof t === 'string' ? t : t.name))
  )];

  return (
    <div className="section">
      <h3 className="section-title">
        <span>📋</span>
        Tabelas Disponíveis
      </h3>
      
      <div className="dropbox_tables">
        <select
          className="filter-select"
          value={selectedTable || ''}
          onChange={(e) => setSelectedTable(e.target.value)}
          disabled={uniqueTables.length === 0}
        >
          <option value="">
            {uniqueTables.length === 0 ? 'Nenhuma opção disponível' : 'Tabelas'}
          </option>
          {uniqueTables.map((tableName) => (
            <option key={tableName} value={tableName}>
              {tableName}
            </option>
          ))}
        </select>

        <div className="selected-tables-container">
          {selectedTables.map(table => (
            <div key={table} className="selected-table-badge">
              {table}
              <button 
                onClick={() => removeTable(table)}
                className='remove_button'
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          className="add-button"
          onClick={() => {
            if (selectedTable && !selectedTables.includes(selectedTable)) {
              const newTables = [...selectedTables, selectedTable];
              setSelectedTables(newTables);
              updateAvailableTables(selectedTable, newTables); // só atualiza aqui
              setSelectedTable('');
            }
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Tables;
