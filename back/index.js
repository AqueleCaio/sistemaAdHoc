const express = require('express');
const cors = require('cors');
const {
  getTableNames,
  getTableAttributes,
  getRelatedTables
} = require('./DAO/BDmain');

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

app.get('/related-tables/:tableName', async (req, res) => {
  const { tableName } = req.params;
try {
    const related = await getRelatedTables(tableName);
    res.json(related);
  } catch (error) {
    console.error(`Erro ao buscar tabelas relacionadas à ${tableName}:`, error);
    res.status(500).json({ error: 'Erro ao buscar tabelas relacionadas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
