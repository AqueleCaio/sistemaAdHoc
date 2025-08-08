import React from 'react';

function TypeJoin({ joinType, setJoinType, question }) {
  return (
    <div className="section">
      <div className="section-title-with-tooltip">
        <h3 className="section-title">Tipo de JOIN</h3>
        <div className="tooltip-container">
          <span className="tooltip-icon">
            <img src={question} alt="?" />
          </span>
          <div className="tooltip-text">
            <strong>Joins</strong> combinam registros de duas ou mais tabelas.<br /><br />
            <strong>INNER JOIN:</strong> registros com correspondência em ambas.<br />
            <strong>LEFT JOIN:</strong> todos da esquerda e correspondentes da direita.<br />
            <strong>RIGHT JOIN:</strong> todos da direita e correspondentes da esquerda.<br />
            <strong>FULL JOIN:</strong> registros com correspondência em pelo menos uma.<br />
            <strong>CROSS JOIN:</strong> produto cartesiano.
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
  );
}

export default TypeJoin;
