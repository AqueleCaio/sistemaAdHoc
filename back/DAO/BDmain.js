// DAO/BDmain.js
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Retorna todas as tabelas públicas do banco
 */
async function getTableNames() {
  return await prisma.$queryRaw`
    SELECT table_name
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name NOT LIKE '%_prisma_%'
  `;
}

/**
 * Retorna os atributos (colunas) de uma tabela
 */
async function getTableAttributes(tableName) {
  return await prisma.$queryRaw`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = ${tableName} AND table_schema = 'public'
  `;
}

async function getAllRelatedTables() {
  return await prisma.$queryRaw`
    SELECT DISTINCT
      tc.table_name AS table_name,
      ccu.table_name AS related_table
    FROM
      information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE
      tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
  `;
}

async function builderQuery({
  selectPart,
  fromPart,
  wherePart = '',
  groupByPart = '',
  orderByPart = ''
}) {
  // assegura que os argumentos são strings (evita undefined na montagem)
  selectPart = selectPart || '*';
  fromPart = fromPart || '';
  wherePart = wherePart || '';
  groupByPart = groupByPart || '';
  orderByPart = orderByPart || '';

  // Monta na ordem correta: SELECT -> FROM (+ JOINs) -> WHERE -> GROUP BY -> ORDER BY
  const fullQuery = `
    SELECT ${selectPart}
    FROM ${fromPart}
    ${wherePart}
    ${groupByPart}
    ${orderByPart};
      `.trim();

  console.log('🧩 Query final montada no DAO:\n', fullQuery);

  try {
    const result = await prisma.$queryRawUnsafe(fullQuery);
    return { result, fullQuery };
  } catch (err) {
    console.error('❌ Erro ao executar query no builderQuery:', err);
    throw err;
  }
}


/*
Exemplo de uma consulta com SQL correta:

SELECT COUNT(column_name), other_column
FROM table_name
WHERE condition
JOIN TYPE another_table ON table_name.id = another_table.ref_id
GROUP BY other_column
ORDER BY COUNT(column_name) DESC

*/

module.exports = {
  getTableNames,
  getTableAttributes,
  getAllRelatedTables,
  builderQuery
};
