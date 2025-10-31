import { useEffect, useRef, useState, useMemo } from 'react';
import { Chart } from 'chart.js/auto';
import '../styles/Chart.css';
import { useQuery } from '../context/queryContext';
import ModalChart from './modalChart';
import { FaChartBar, FaChartLine, FaChartPie, FaDotCircle, FaSlidersH } from 'react-icons/fa';

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { result } = useQuery();
  const { rows = [], columns = [] } = result || {};

  const [chartType, setChartType] = useState('bar');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [yearRange, setYearRange] = useState([null, null]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValueColumns, setSelectedValueColumns] = useState([]);

  // Detectar colunas de valor automaticamente
  const valueColumns = useMemo(() => {
    return columns.filter(col => {
      const isNumeric = col.type === 'number' || 
                       col.dataKey.toLowerCase().includes('valor') ||
                       col.dataKey.toLowerCase().includes('sum') ||
                       col.dataKey.toLowerCase().includes('max') ||
                       col.dataKey.toLowerCase().includes('min') ||
                       col.dataKey.toLowerCase().includes('avg') ||
                       col.dataKey.toLowerCase().includes('count');
      return isNumeric && !col.dataKey.toLowerCase().includes('ano');
    }).map(col => col.dataKey);
  }, [columns]);

  // Selecionar automaticamente a primeira coluna de valor
  useEffect(() => {
    if (valueColumns.length > 0 && selectedValueColumns.length === 0) {
      setSelectedValueColumns([valueColumns[0]]);
    }
  }, [valueColumns]);


  // Funções para manipular as configurações do modal
  const handleCountriesChange = (newCountries) => {
    setSelectedCountries(newCountries);
  };

  const handleYearRangeChange = (newRange) => {
    setYearRange(newRange);
  };

  // Detecta colunas
  const yearColumn = useMemo(() => {
    return columns.find(c => c.dataKey.toLowerCase().includes('ano'))?.dataKey || null;
  }, [columns]);

  const countryColumn = useMemo(() => {
    return columns.find(c => c.dataKey.toLowerCase().includes('pais'))?.dataKey || null;
  }, [columns]);

  const valueColumn = useMemo(() => {
    return columns.find(c => c.dataKey.toLowerCase().includes('valor') || c.dataKey.toLowerCase().includes('sum'))?.dataKey || null;
  }, [columns]);

  // Define range de anos e países únicos
  const uniqueYears = useMemo(() => {
    if (!yearColumn) return [];
    return [...new Set(rows.map(r => r[yearColumn]))].sort((a, b) => a - b);
  }, [rows, yearColumn]);

  const uniqueCountries = useMemo(() => {
    if (!countryColumn) return [];
    return [...new Set(rows.map(r => r[countryColumn]))];
  }, [rows, countryColumn]);

  useEffect(() => {
    if (uniqueCountries.length && selectedCountries.length === 0) {
      setSelectedCountries(uniqueCountries.slice(0, 5)); // mostra até 5 países por padrão
    }
  }, [uniqueCountries]);

  useEffect(() => {
    if (uniqueYears.length && !yearRange[0]) {
      setYearRange([Math.min(...uniqueYears), Math.max(...uniqueYears)]);
    }
  }, [uniqueYears]);

  // Prepara dados para o gráfico
  const chartData = useMemo(() => {
    if (!rows.length || !countryColumn || selectedValueColumns.length === 0) return null;

    // Filtra por range e países
    const filtered = rows.filter(r => {
      const yearOk = yearColumn ? (r[yearColumn] >= yearRange[0] && r[yearColumn] <= yearRange[1]) : true;
      const countryOk = selectedCountries.includes(r[countryColumn]);
      return yearOk && countryOk;
    });

    // Agrupa por país e ano
    const grouped = {};
    filtered.forEach(r => {
      const pais = r[countryColumn];
      const ano = yearColumn ? r[yearColumn] : 'Sem ano';
      if (!grouped[pais]) grouped[pais] = {};
      if (!grouped[pais][ano]) grouped[pais][ano] = 0;
      grouped[pais][ano] += parseFloat(r[valueColumn]) || 0;
    });

    const anos = yearColumn ? [...new Set(filtered.map(r => r[yearColumn]))].sort((a, b) => a - b) : ['Sem ano'];
     // Processar múltiplas métricas
    const datasets = [];
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1',
      '#d084d0', '#ff8042', '#00bcd4', '#4caf50', '#e91e63'
    ];

    selectedValueColumns.forEach((valueCol, valueIndex) => {
      // Agrupar por país para esta métrica específica
      const groupedByCountry = {};
      filtered.forEach(r => {
        const pais = r[countryColumn];
        if (!groupedByCountry[pais]) groupedByCountry[pais] = [];
        groupedByCountry[pais].push(parseFloat(r[valueCol]) || 0);
      });

      // Para cada país, criar um dataset
      Object.keys(groupedByCountry).forEach((pais, countryIndex) => {
        const datasetIndex = valueIndex * Object.keys(groupedByCountry).length + countryIndex;
        datasets.push({
          label: `${pais} - ${valueCol.replace(/_/g, ' ')}`,
          data: groupedByCountry[pais],
          borderColor: colors[datasetIndex % colors.length],
          backgroundColor: chartType === 'line' 
            ? 'transparent' 
            : `${colors[datasetIndex % colors.length]}80`,
          borderWidth: 2,
          fill: chartType === 'line'
        });
      });
    });

    return { labels: anos, datasets };
  }, [rows, countryColumn, yearColumn, selectedCountries, yearRange, chartType, selectedValueColumns]);
  
    // Função para manipular mudanças nas colunas de valor
  const handleValueColumnsChange = (newValueColumns) => {
    setSelectedValueColumns(newValueColumns);
  };

  // Parte que renderiza o gráfico
  useEffect(() => {
    if (!chartData || !chartRef.current) return;

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Visualização por País e Ano'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: yearColumn || 'Ano'
            }
          },
          y: {
            title: {
              display: true,
              text: selectedValueColumns.join(', ') || 'Valor'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [
    chartData,
    chartType,
    selectedValueColumns,   
    selectedCountries,      
    yearRange               
  ]);

  return (
    <div className="chart-wrapper">
      <div className="chart-controls">
        <div className="chart-type-selector">
          <label>Tipo de Gráfico:</label>
          <div className="chart-type-buttons">
            <button className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')}>
              <FaChartBar size={18} />
            </button>
            <button className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`} onClick={() => setChartType('line')}>
              <FaChartLine size={18} />
            </button>
            <button className={`chart-type-btn ${chartType === 'pie' ? 'active' : ''}`} onClick={() => setChartType('pie')}>
              <FaChartPie size={18} />
            </button>
            <button className={`chart-type-btn ${chartType === 'doughnut' ? 'active' : ''}`} onClick={() => setChartType('doughnut')}>
              <FaDotCircle size={18} />
            </button>
          </div>
        </div>

        <button className="config-btn" onClick={() => setModalOpen(true)}>
          <FaSlidersH size={16} /> Configurar gráfico
        </button>
      </div>

      <div className="chart-canvas-container">
        <canvas ref={chartRef}></canvas>
      </div>
        {/* Modal de Configurações */}
        <ModalChart
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        uniqueCountries={uniqueCountries}
        selectedCountries={selectedCountries}
        onCountriesChange={handleCountriesChange}
        uniqueYears={uniqueYears}
        yearRange={yearRange}
        onYearRangeChange={handleYearRangeChange}
        columns={columns}
        selectedValueColumns={selectedValueColumns}
        onValueColumnsChange={handleValueColumnsChange}
      />
    </div>
  );

};

export default ChartComponent;
