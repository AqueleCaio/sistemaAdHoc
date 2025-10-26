import React, { useState } from 'react';
import FilterMain from './components/filterMain';
import SQLCode from './components/code';
import Chart from './components/chart';
import Table from './components/table';
import './App.css';
import { QueryProvider } from './context/queryContext';

function App() {
  return (
    <QueryProvider>
      <div className="app-container">
        <h1 className="app-title">Sistema de Relatórios Ad Hoc</h1>
        <p className="app-subtitle">Gere relatórios personalizados com dados de pistas</p>
        
        <div className="app-content">
          <FilterMain />
          <div className="app-right-panel">
            <SQLCode/>
            <Chart />
            <Table/>
          </div>
        </div>
      </div>
    </QueryProvider>
  );
}

export default App;
