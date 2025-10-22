const express = require('express');
const cors = require('cors');
const {
  getTableNames,
  getTableAttributes,
  getAllRelatedTables,
  builderQuery
} = require('./DAO/BDmain');

const {
  isNumeric,
  quoteValue,
  normalizeColumns,
  normalizeAggregation,
  helperDataReport,
} = require('./backController');

BigInt.prototype.toJSON = function() {
  return this.toString();
};

// const { default: Agregation } = require('../App/src/components/filter/agreggation');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/tables', async (req, res) => {
  try {
    const tabelas = await getTableNames();
    res.json(tabelas);
  } catch (error) {
    console.error('Erro ao obter tabelas:', error);
    res.status(500).json({ error: 'Erro ao obter tabelas' });
  }
});

app.get('/attributes/:tableName', async (req, res) => {
  const { tableName } = req.params;
  try {
    const atributos = await getTableAttributes(tableName);
    res.json(atributos);
  } catch (error) {
    console.error(`Erro ao obter atributos da tabela ${tableName}:`, error);
    res.status(500).json({ error: `Erro ao obter atributos da tabela ${tableName}` });
  }
});

app.get('/all-related-tables', async (req, res) => {
  try {
    const related = await getAllRelatedTables();
    res.json(related);
  } catch (error) {
    console.error("Erro ao buscar todas as relações:", error);
    res.status(500).json({ error: 'Erro ao buscar todas as relações' });
  }
});

//
// 1️⃣ ROTA PARA EXECUTAR A CONSULTA E RETORNAR APENAS O RESULTADO
//
app.post('/query-report', async (req, res) => {
  try {
    const payload = req.body;

    // 1) Monta as partes da query com o helper
    const {
      selectPart,
      fromPart,
      wherePart,
      groupByPart,
      orderByPart
    } = helperDataReport(payload);

    // 2) Executa a query completa com o builderQuery
    const { result } = await builderQuery({
      selectPart,
      fromPart,
      wherePart,
      groupByPart,
      orderByPart,
    });

    // 3) Retorna somente o resultado
    res.json({ result });

  } catch (err) {
    console.error('❌ Erro ao processar /query-report:', err);
    res.status(500).json({
      error: 'Erro ao gerar relatório',
      details: err.message,
    });
  }
});


//
// 2️⃣ ROTA PARA RETORNAR APENAS A QUERY GERADA (sem executar)
//
app.post('/query-to-view', async (req, res) => {
  try {
    const payload = req.body;

    // 1) Usa o mesmo helper para montar a query
    const {
      selectPart,
      fromPart,
      wherePart,
      groupByPart,
      orderByPart
    } = helperDataReport(payload);

    // 2) Gera a query final (igual ao builderQuery, mas sem executar)
    const fullQuery = `
      SELECT ${selectPart}
      FROM ${fromPart}
      ${wherePart}
      ${groupByPart}
      ${orderByPart};
    `.trim();

    // 3) Retorna apenas a query formatada
    res.json({ fullQuery });


  } catch (err) {
    console.error('❌ Erro ao montar query para visualização:', err);
    res.status(500).json({
      error: 'Erro ao montar query',
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
