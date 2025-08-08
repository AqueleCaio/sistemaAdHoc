import React, { useState } from 'react';
import FilterMain from './components/filterMain';
import SQLCode from './components/code';
import Chart from './components/chart';
import Table from './components/table';
import './App.css';

function App() {
  const [sqlQuery] = useState('SELECT * FROM COUNTRY');
  const [reportData] = useState([
    { COUNTRY_NAME: 'Brazil', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
    { COUNTRY_NAME: 'Estados Unidos', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
    { COUNTRY_NAME: 'China', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
    { COUNTRY_NAME: 'Alemanha', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
    { COUNTRY_NAME: 'Japão', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
    { COUNTRY_NAME: 'Índia', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
    { COUNTRY_NAME: 'Rubio Lirado', GDP: 'N/A', POPULATION: 'N/A', LIFE_EXPECTANCE: 'N/A' },
  ]);

  return (
    <div className="app-container">
      <h1 className="app-title">Sistema de Relatórios Ad Hoc</h1>
      <p className="app-subtitle">Gere relatórios personalizados com dados de pistas</p>
      
      <div className="app-content">
        <FilterMain />
        <div className="app-right-panel">
          <SQLCode sqlQuery={sqlQuery} />
          <Chart />
          <Table data={reportData} />
        </div>
      </div>
    </div>
  );
}

export default App;
