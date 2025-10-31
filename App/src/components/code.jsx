import React, { useState } from 'react';
import '../styles/Code.css';
import { useQuery } from '../context/queryContext';


function SQLViewer() {
  const { query } = useQuery();
  const [copied, setCopied] = useState(false);

  // Função simples para highlight de SQL
  const highlightSQL = (sql) => {
    if (!sql) return sql;
    
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS',
      'ON', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'AS', 'DISTINCT', 'BETWEEN', 'IN',
      'LIKE', 'IS', 'NULL', 'NOT', 'ASC', 'DESC'
    ];

    let highlighted = sql;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    // Destacar strings
    highlighted = highlighted.replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>');
    
    // Destacar números
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
    
    // Destacar comentários
    highlighted = highlighted.replace(/--.*$/gm, '<span class="comment">$&</span>');

    return highlighted;
  };

  const displayQuery = query || '-- Aguardando geração do relatório...\n-- Configure os filtros acima e clique em "Gerar Relatório"';

  const handleCopy = () => {
    if (query) {
      navigator.clipboard.writeText(query);
      setCopied(true);

      // Volta para o ícone de copy após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    }
  };



  return (
    <div className="code-container">
      <h2 className="code-title">Consulta SQL Gerada</h2>
      <div className="sql-viewer">
        <button 
          className={`copy-button ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title={copied ? "Copiado!" : "Copiar para área de transferência"}
        >
          {copied ? (
            <>
              <span className="copy-icon">✓</span>
              <span className="copy-text">Copiado!</span>
            </>
          ) : (
            <>
              <span className="copy-icon">📋</span>
              <span className="copy-text">Copiar</span>
            </>
          )}
        </button>

        <div className="sql-content">
          <pre className="sql-code">
            <code 
              dangerouslySetInnerHTML={{ 
                __html: highlightSQL(displayQuery) 
              }} 
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SQLViewer;