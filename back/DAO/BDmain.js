// DAO/BDmain.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Retorna todas as tabelas públicas do banco
 */
async function getTableNames() {
  return await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
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

/**
 * Retorna as tabelas relacionadas com a tabela informada
 */
async function getRelatedTables(tableName) {
  return await prisma.$queryRaw`
    SELECT DISTINCT
      tc.table_name AS foreign_table
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
      AND (ccu.table_name = ${tableName} OR tc.table_name = ${tableName})
      AND tc.table_schema = 'public'
  `;
}

module.exports = {
  getTableNames,
  getTableAttributes,
  getRelatedTables,
};
