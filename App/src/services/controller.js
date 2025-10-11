const API_BASE_URL = 'http://localhost:5000';

let cachedTableNames = null;
let cachedRelations = null;

// Função para buscar os nomes das tabelas do banco de dados
export async function getTableNames() {
  if (cachedTableNames) return cachedTableNames;

  try {
    const res = await fetch(`${API_BASE_URL}/tables`);
    cachedTableNames = await res.json();
    return cachedTableNames;
  } catch (err) {
    console.error('Erro ao buscar tabelas:', err);
    return [];
  }
}


// Função para buscar todas as relações entre tabelas
export async function getAllRelatedTables() {
  if (cachedRelations) return cachedRelations;

  try {
    const res = await fetch(`${API_BASE_URL}/all-related-tables`);
    const data = await res.json();

    // monta um grafo de relações: { tabela: [relacionadas] }
    cachedRelations = {};
    data.forEach(rel => {
      if (!cachedRelations[rel.table_name]) cachedRelations[rel.table_name] = [];
      if (!cachedRelations[rel.related_table]) cachedRelations[rel.related_table] = [];

      cachedRelations[rel.table_name].push(rel.related_table);
      cachedRelations[rel.related_table].push(rel.table_name);
    });

    console.log(cachedRelations)

    return cachedRelations;
  } catch (err) {
    console.error('Erro ao buscar relações:', err);
    return {};
  }
}


// Função para buscar os atributos (colunas) de uma tabela específica
export async function getTableAttributes(tableName) {
  try {
    const res = await fetch(`${API_BASE_URL}/attributes/${tableName}`);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar atributos:', err);
    return [];
  }
}



// Função para enviar os dados do relatório para o backend
export async function postDataReport(payload) {
  console.log('Chegou no controller:', payload);
  try {
    const res = await fetch(`${API_BASE_URL}/query-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error('Erro ao enviar dados para relatório:', err);
    return { error: 'Erro ao enviar dados para relatório' };
  }
}

