import React from 'react';
import { useQuery } from '../context/queryContext';
import '../styles/Table.css';

function Table() {
  const { result } = useQuery();
  const { rows = [], columns = [] } = result;

  if (!rows.length || !columns.length) {
    return (
      <div className="tabela">
        <h2>Resultados do Relatório</h2>
        <p>Nenhum dado disponível.</p>
      </div>
    );
  }

  // Define altura máxima se houver mais de 15 linhas
  const maxRowsVisible = 15;
  const rowHeight = 25; // altura aproximada da linha em px
  const tableHeight = rows.length > maxRowsVisible ? maxRowsVisible * rowHeight : 'auto';

  return (
    <div className="tabela">
      <h2>Resultados do Relatório</h2>
      <div
        className="table-container"
        style={{ maxHeight: tableHeight, overflowY: rows.length > maxRowsVisible ? 'auto' : 'visible' }}
      >
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.dataKey}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.dataKey}>{row[col.dataKey]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
