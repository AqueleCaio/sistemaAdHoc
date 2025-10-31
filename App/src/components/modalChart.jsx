import { useState, useEffect } from 'react';
import '../styles/ModalChart.css';
import { FaTimes, FaCheck, FaCalendarAlt, FaGlobeAmericas, FaChartBar } from 'react-icons/fa';

const ModalChart = ({ 
  isOpen, 
  onClose, 
  uniqueCountries, 
  selectedCountries, 
  onCountriesChange,
  uniqueYears,
  yearRange,
  onYearRangeChange,
  columns = [],
  selectedValueColumns,
  onValueColumnsChange
}) => {
  const [localSelectedCountries, setLocalSelectedCountries] = useState([]);
  const [localYearRange, setLocalYearRange] = useState([null, null]);
  const [localSelectedValueColumns, setLocalSelectedValueColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('countries'); // 'countries', 'years', 'metrics'

  // Inicializar estados locais quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedCountries([...selectedCountries]);
      setLocalYearRange([...yearRange]);
      setLocalSelectedValueColumns([...selectedValueColumns]);
      setSearchTerm('');
      setActiveTab('countries');
    }
  }, [isOpen, selectedCountries, yearRange, selectedValueColumns]);

  // Fechar modal ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Extrair colunas numéricas (atributos de valor)
  const numericColumns = columns.filter(col => {
    const isNumeric = col.type === 'number' || 
                     col.dataKey.toLowerCase().includes('valor') ||
                     col.dataKey.toLowerCase().includes('sum') ||
                     col.dataKey.toLowerCase().includes('max') ||
                     col.dataKey.toLowerCase().includes('min') ||
                     col.dataKey.toLowerCase().includes('avg') ||
                     col.dataKey.toLowerCase().includes('count');
    return isNumeric && !col.dataKey.toLowerCase().includes('ano');
  });

  if (!isOpen) return null;

  const handleCountryToggle = (country) => {
    setLocalSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleSelectAllCountries = () => {
    setLocalSelectedCountries([...uniqueCountries]);
  };

  const handleClearAllCountries = () => {
    setLocalSelectedCountries([]);
  };

  const handleValueColumnToggle = (column) => {
    setLocalSelectedValueColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleSelectAllValueColumns = () => {
    setLocalSelectedValueColumns(numericColumns.map(col => col.dataKey));
  };

  const handleClearAllValueColumns = () => {
    setLocalSelectedValueColumns([]);
  };

  const handleYearRangeChange = (index, value) => {
    const newRange = [...localYearRange];
    newRange[index] = value ? parseInt(value) : null;
    setLocalYearRange(newRange);
  };

  const handleApply = () => {
    onCountriesChange(localSelectedCountries);
    onYearRangeChange(localYearRange);
    onValueColumnsChange(localSelectedValueColumns);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Filtrar países baseado na busca
  const filteredCountries = uniqueCountries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatar nome da coluna para exibição
  const formatColumnName = (columnName) => {
    return columnName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/(max|min|sum|avg|count)\s+/gi, (match) => match.toUpperCase());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configurar Gráfico</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tabs de Navegação */}
        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'countries' ? 'active' : ''}`}
            onClick={() => setActiveTab('countries')}
          >
            <FaGlobeAmericas size={14} />
            Países
          </button>
          <button 
            className={`tab-btn ${activeTab === 'years' ? 'active' : ''}`}
            onClick={() => setActiveTab('years')}
          >
            <FaCalendarAlt size={14} />
            Anos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
          >
            <FaChartBar size={14} />
            Métricas
          </button>
        </div>

        <div className="modal-body">
          {/* Tab Países */}
          {activeTab === 'countries' && (
            <div className="config-section">
              <div className="section-header">
                <FaGlobeAmericas className="section-icon" />
                <h3>Selecionar Países</h3>
              </div>
              
              <div className="countries-controls">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Buscar países..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                <div className="bulk-actions">
                  <button onClick={handleSelectAllCountries} className="bulk-btn">
                    Selecionar Todos
                  </button>
                  <button onClick={handleClearAllCountries} className="bulk-btn">
                    Limpar Seleção
                  </button>
                </div>
              </div>

              <div className="countries-list">
                {filteredCountries.map(country => (
                  <label key={country} className="country-checkbox">
                    <input
                      type="checkbox"
                      checked={localSelectedCountries.includes(country)}
                      onChange={() => handleCountryToggle(country)}
                    />
                    <span className="checkmark"></span>
                    {country}
                  </label>
                ))}
                {filteredCountries.length === 0 && (
                  <p className="no-results">Nenhum país encontrado</p>
                )}
              </div>

              <div className="selection-info">
                {localSelectedCountries.length} de {uniqueCountries.length} países selecionados
              </div>
            </div>
          )}

          {/* Tab Anos */}
          {activeTab === 'years' && (
            <div className="config-section">
              <div className="section-header">
                <FaCalendarAlt className="section-icon" />
                <h3>Range de Anos</h3>
              </div>
              
              <div className="year-range">
                <div className="range-inputs">
                  <div className="range-input-group">
                    <label>Ano Inicial:</label>
                    <select 
                      value={localYearRange[0] || ''} 
                      onChange={(e) => handleYearRangeChange(0, e.target.value)}
                      className="range-select"
                    >
                      <option value="">Todos</option>
                      {uniqueYears.map(year => (
                        <option key={`start-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="range-input-group">
                    <label>Ano Final:</label>
                    <select 
                      value={localYearRange[1] || ''} 
                      onChange={(e) => handleYearRangeChange(1, e.target.value)}
                      className="range-select"
                    >
                      <option value="">Todos</option>
                      {uniqueYears.map(year => (
                        <option key={`end-${year}`} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="range-info">
                  {localYearRange[0] && localYearRange[1] 
                    ? `Mostrando dados de ${localYearRange[0]} a ${localYearRange[1]}`
                    : 'Mostrando todos os anos disponíveis'
                  }
                </div>
              </div>
            </div>
          )}

          {/* Tab Métricas */}
          {activeTab === 'metrics' && (
            <div className="config-section">
              <div className="section-header">
                <FaChartBar className="section-icon" />
                <h3>Selecionar Métricas</h3>
              </div>
              
              <p className="section-description">
                Escolha quais métricas numéricas deseja visualizar no gráfico:
              </p>

              <div className="bulk-actions">
                <button onClick={handleSelectAllValueColumns} className="bulk-btn">
                  Selecionar Todas
                </button>
                <button onClick={handleClearAllValueColumns} className="bulk-btn">
                  Limpar Seleção
                </button>
              </div>

              <div className="metrics-list">
                {numericColumns.map(column => (
                  <label key={column.dataKey} className="metric-checkbox">
                    <input
                      type="checkbox"
                      checked={localSelectedValueColumns.includes(column.dataKey)}
                      onChange={() => handleValueColumnToggle(column.dataKey)}
                    />
                    <span className="checkmark"></span>
                    <div className="metric-info">
                      <span className="metric-name">
                        {formatColumnName(column.dataKey)}
                      </span>
                      {column.type && (
                        <span className="metric-type">{column.type}</span>
                      )}
                    </div>
                  </label>
                ))}
                {numericColumns.length === 0 && (
                  <div className="no-metrics">
                    <p>Nenhuma métrica numérica encontrada</p>
                    <small>As métricas são detectadas automaticamente das colunas numéricas da consulta</small>
                  </div>
                )}
              </div>

              <div className="selection-info">
                {localSelectedValueColumns.length} de {numericColumns.length} métricas selecionadas
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-summary">
            {activeTab === 'countries' && (
              <span>{localSelectedCountries.length} países selecionados</span>
            )}
            {activeTab === 'years' && (
              <span>
                {localYearRange[0] && localYearRange[1] 
                  ? `Anos: ${localYearRange[0]} - ${localYearRange[1]}`
                  : 'Todos os anos'
                }
              </span>
            )}
            {activeTab === 'metrics' && (
              <span>{localSelectedValueColumns.length} métricas selecionadas</span>
            )}
          </div>
          
          <div className="footer-actions">
            <button onClick={handleCancel} className="btn btn-cancel">
              Cancelar
            </button>
            <button 
              onClick={handleApply} 
              className="btn btn-apply"
              disabled={localSelectedCountries.length === 0 || localSelectedValueColumns.length === 0}
            >
              <FaCheck size={16} />
              Aplicar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChart;