import React, { useState } from 'react';
import '../styles/Code.css';
import { useQuery } from '../context/queryContext';
import copyIcon from '../assets/copy.png';
import confirmIcon from '../assets/confirm.png';

function SQLViewer() {
  const { query } = useQuery();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (query) {
      navigator.clipboard.writeText(query);
      setCopied(true);

      // Volta para o ícone de copy após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="codigo-container">
      <h2 className="codigo-title">Consulta SQL Gerada</h2>
      <div className="sql-viewer" style={{ position: 'relative' }}>
        
        {/* Botão de copiar fixo no canto superior direito */}
        <img
          className='copy-button'
          src={copied ? confirmIcon : copyIcon}
          alt={copied ? "Copiado" : "Copiar"}
          onClick={handleCopy}
        />

        <pre style={{ paddingTop: '10px' }}>
          {query || 'Aguardando geração do relatório...'}
        </pre>
      </div>
    </div>
  );
}

export default SQLViewer;
