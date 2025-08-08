import React from 'react';

function Tables({ selectedTable, setSelectedTable, selectedTables, setSelectedTables, availableTables, removeTable }) {
  return (
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
            <div key={table} className="selected-table-badge">
              {table}
              <button 
                onClick={() => removeTable(table)}
                className='remove_button'>
                  x
              </button>
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
    </div>
  );
}

export default Tables;
