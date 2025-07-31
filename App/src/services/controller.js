const API_BASE_URL = 'http://localhost:5000';

export async function getTableNames() {
  try {
    const res = await fetch(`${API_BASE_URL}/tables`);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar tabelas:', err);
    return [];
  }
}

export async function getTableAttributes(tableName) {
  try {
    const res = await fetch(`${API_BASE_URL}/attributes/${tableName}`);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar atributos:', err);
    return [];
  }
}

export async function getRelatedTables(tableName) {
  try {
    const res = await fetch(`${API_BASE_URL}/related-tables/${tableName}`);
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar tabelas relacionadas:', err);
    return [];
  }
}
