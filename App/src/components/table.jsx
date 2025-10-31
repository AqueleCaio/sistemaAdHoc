import React, { useMemo } from 'react';
import { useQuery } from '../context/queryContext';
import '../styles/Table.css';

function Table() {
  const { result } = useQuery();
  const { rows = [], columns = [] } = result || {};

  if (!rows.length || !columns.length) {
    return (
      <div className="tabela">
        <h2>Resultados do Relatório</h2>
        <p>Nenhum dado disponível.</p>
      </div>
    );
  }

  // 🧩 Pré-tratamento dos dados
  const processedRows = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) return [];

    return rows.map(row => {
      const newRow = {};

      for (const col of columns) {
        const key = col.dataKey;
        let value = row[key];

        // 🔍 Corrige tipos de dados
        if (value === null || value === undefined) {
          newRow[key] = '';
        } 
        else if (typeof value === 'number') {
          // Se o nome da coluna indicar ano, id ou algo inteiro
          if (key.toLowerCase().includes('ano') || key.toLowerCase().endsWith('_id')) {
            newRow[key] = Math.round(value); // remove decimais
          } else {
            // Caso contrário, trata como valor monetário
            newRow[key] = value.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
          }
        } 
        else {
          // Caso texto ou outro tipo
          newRow[key] = value;
        }
      }

      return newRow;
    });
  }, [rows, columns]);


  // Define altura máxima se houver mais de 15 linhas
  const maxRowsVisible = 15;
  const rowHeight = 40;
  const tableHeight = rows.length > maxRowsVisible ? maxRowsVisible * rowHeight : 'auto';

  return (
    <div className="tabela">
      <h2>Resultados do Relatório</h2>
      <div
        className="table-container"
        style={{
          maxHeight: tableHeight,
          overflowY: rows.length > maxRowsVisible ? 'auto' : 'visible',
        }}
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
            {processedRows.map((row, index) => (
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
