import React from 'react';
import '../styles/Table.css';

function Table({ data }) {
  return (
    <div className="tabela">
      <h2>Resultados do Relatório</h2>
      <table>
        <thead>
          <tr>
            <th>CONNTEY_NAME</th>
            <th>GDPI</th>
            <th>POPULATION</th>
            <th>LIFE EXPECTANCY</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.CONNTEY_NAME}</td>
              <td>{row.GDPI}</td>
              <td>{row.POPULATION}</td>
              <td>{row.LIFE_EXPECTANCY}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;