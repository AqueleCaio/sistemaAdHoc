import React, { useEffect, useState } from 'react';
import '../styles/Code.css';
import { useQuery } from '../context/queryContext';


function SQLViewer() {
  // estado para armazenar a query recebida do back-end
  const { query } = useQuery();

  return (
    <div className="codigo-container">
      <h2 className="codigo-title">Consulta SQL Gerada</h2>
      <div className="sql-viewer">
         <pre>{query || 'Aguardando geração do relatório...'}</pre>
      </div>
    </div>
  );
}

export default SQLViewer;
