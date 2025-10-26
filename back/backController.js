// utilidades para sanitizar/formatar valores (mantive aqui — agora na rota)
function isNumeric(val) {
  return typeof val === 'number' || (!Array.isArray(val) && !isNaN(val) && val !== '' && !/^\s+$/.test(String(val)));
}
function quoteValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (isNumeric(val)) return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Normaliza entrada de columns/aggs/tables para arrays/strings seguros
function normalizeColumns(columns) {
  if (!columns) return [];
  return columns.map(c => (typeof c === 'string' ? c : c.column)).filter(Boolean);
}
function normalizeAggregation(aggregation) {
  if (!aggregation) return [];
  return aggregation.map(a => {
    return {
      func: (a.func || '').toUpperCase(),
      column: a.column
    };
  }).filter(a => a.func && a.column);
}

function helperDataReport(payload) {
  try {
    // ----------------------------
    // 1) Extrair e normalizar
    // ----------------------------
    const tables = payload.tables || []; // espera array de objetos {name, type?, on?} ou strings
    if (!Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({ error: 'É necessário informar ao menos uma tabela em payload.tables' });
    }
    const joinType = payload.joinType || 'INNER JOIN';
    const columnsArr = normalizeColumns(payload.columns); // array de strings
    const aggregationArr = normalizeAggregation(payload.aggregation);
    const filters = Array.isArray(payload.filters) ? payload.filters : [];
    const orderBy = payload.orderBy || null;
    const having = payload.having || null; // 👈 nova cláusula HAVING
    // groupBy pode vir como array, string ou como propriedade aggregation.groupBy já definida
    let groupBy = payload.groupBy || null;
    if (!groupBy && Array.isArray(aggregationArr) && aggregationArr.length > 0) {
      // se o front não enviou groupBy, mas tem aggregation, usa as columns como groupBy (comportamento anterior)
      groupBy = columnsArr.length > 0 ? [...columnsArr] : null;
    }

    // ----------------------------
    // 2) Montar SELECT (colunas + agregações)
    // ----------------------------

    // 🔹 Agregações com alias seguro (ex: AVG(saude.valor) AS AVG_saude_valor)
    const aggsPartArr = aggregationArr.map(a => {
      const alias = `${a.func}_${String(a.column).replace(/\./g, '_')}`;
      return `${a.func}(${a.column}) AS ${alias}`;
    });

    // 🔹 Colunas normais com alias seguro (ex: pais.nome AS pais_nome)
    const columnsPartArr = columnsArr.map(c => {
      if (c.includes('.')) {
        const alias = String(c).replace(/\./g, '_');
        return `${c} AS ${alias}`;
      }
      return c; // coluna simples sem tabela
    });

    // 🔹 Select final
    const selectItems = [];
    if (aggsPartArr.length > 0) selectItems.push(...aggsPartArr);
    if (columnsPartArr.length > 0) selectItems.push(...columnsPartArr);

    const selectPart = selectItems.length > 0 ? selectItems.join(', \n\t') : '*';



    // 🔧 Mapa de relações diretas do schema
    const RELATIONS = {
      saude:      { pais: 'pais_id', indicador: 'indicador_id' },
      economia:   { pais: 'pais_id', indicador: 'indicador_id' },
      ambiente:   { pais: 'pais_id', indicador: 'indicador_id' },
      tecnologia: { pais: 'pais_id', indicador: 'indicador_id' },
      demografia: { pais: 'pais_id', indicador: 'indicador_id' },
    };

    // ----------------------------
    // 3) Montar FROM e JOINs seguros
    // ----------------------------
    const firstTable = typeof tables[0] === 'string' ? tables[0] : tables[0].name;
    let fromPart = firstTable;

    if (tables.length > 1) {
      for (let i = 1; i < tables.length; i++) {
        const t = tables[i];
        const name = typeof t === 'string' ? t : t.name;

        let joinClause = '';
        const type = (t && t.type) ? t.type.toUpperCase() : joinType || 'INNER JOIN';

        // 1️⃣ Se o front definir manualmente a condição
        if (t?.on?.left && t?.on?.right) {
          joinClause = `${type} ${name} ON ${t.on.left} = ${t.on.right}`;
        } else {
          // 2️⃣ Tenta achar uma relação válida com QUALQUER tabela já incluída
          const relatedTable = tables
            .slice(0, i)
            .map(tt => (typeof tt === 'string' ? tt : tt.name))
            .find(prev => RELATIONS[name]?.[prev] || RELATIONS[prev]?.[name]);

          if (relatedTable && RELATIONS[name]?.[relatedTable]) {
            const fk = `${name}.${RELATIONS[name][relatedTable]}`;
            joinClause = `${type} ${name} ON ${fk} = ${relatedTable}.id`;
          } else if (relatedTable && RELATIONS[relatedTable]?.[name]) {
            const fk = `${relatedTable}.${RELATIONS[relatedTable][name]}`;
            joinClause = `${type} ${name} ON ${fk} = ${name}.id`;
          } else {
            console.warn(`⚠️ Nenhuma relação encontrada para ${name}, JOIN ignorado.`);
            continue;
          }
        }
        fromPart += `\n${joinClause}`;

      }
    }

    const tableNames = ['pais', 'saude', 'tecnologia', 'ambiente', 'demografia', 'indicador'];

    // ----------------------------
    // 4) Montar WHERE (valores já escapados aqui)
    // ----------------------------
    let wherePart = '';
    if (Array.isArray(filters) && filters.length > 0) {
      const conds = filters.map(f => {
        // permite operador 'IN' com array
        if (Array.isArray(f.value)) {
          const vals = f.value.map(v => quoteValue(v)).join(', ');
          return `${f.column} ${f.operator} (${vals})`;
        }

        let valToUse = f.value;

        // 🔍 Verifica se o valor é uma referência a tabela.coluna
        const isTableRef =
          typeof f.value === 'string' &&
          f.value.includes('.') &&
          tableNames.some(tbl => f.value.toLowerCase().startsWith(tbl.toLowerCase() + '.'));

        // operadores especiais como LIKE
        if (typeof f.value === 'string' && f.operator?.toUpperCase() === 'LIKE') {
          valToUse = `%${f.value}%`;
        } 
        else if (f.operator === '=' && !isTableRef) {
          // capitaliza valores comuns (mas não referências a tabelas)
          valToUse = f.value.charAt(0).toUpperCase() + f.value.slice(1);
        }

        // 🔧 Se for uma tabela.coluna, deixa sem aspas e lowercase
        if (isTableRef) {
          return `${f.column} ${f.operator} ${f.value.toLowerCase()}`;
        }

        // caso comum: escapa valor com aspas
        return `${f.column} ${f.operator} ${quoteValue(valToUse)}`;
      });

      wherePart = conds.join(' AND ');
    }


    // ----------------------------
    // 5) Montar GROUP BY (já em forma de string)
    // ----------------------------
    let groupByPart = '';
    if (Array.isArray(groupBy) && groupBy.length > 0) {
      groupByPart = `${groupBy.join(', ')}`;
    } else if (groupBy && typeof groupBy === 'string') {
      groupByPart = `${groupBy}`;
    }


    // Monta o HAVING
    let havingPart = '';
    if (having) {
      if (Array.isArray(having)) {
        // Exemplo: [{ column: 'AVG(saude.valor)', operator: '>', value: 100 }]
        havingPart = having
          .map(h => `${h.aggregation} ${h.operator} ${h.value}`)
          .join(' AND ');
      } else if (typeof having === 'string') {
        havingPart = having; // já veio pronto do front
      }
    }


    // ----------------------------
    // 6) Montar ORDER BY (suporte a múltiplas cláusulas)
    // ----------------------------
    let orderByPart = '';
    if (orderBy && Array.isArray(orderBy) && orderBy.length > 0) {
      // transforma cada cláusula em "coluna DIREÇÃO"
      const clauses = orderBy.map(ob => {
        const col = ob.column;
        const dir = ob.direction ? ob.direction.toUpperCase() : 'ASC';
        return `${col} ${dir}`;
      });

      // junta tudo separado por vírgula
      orderByPart = clauses.join(', ');
    }


    // ----------------------------
    // 7) Retornar as partes para a rota
    // ----------------------------
    return {
      selectPart,
      fromPart,
      wherePart,
      groupByPart,
      havingPart,
      orderByPart
    };

  } catch (err) {
      console.error('Erro ao limpar dados do relatório:', err);
      throw err;
    }
}

module.exports = {
    isNumeric,
    quoteValue,
    normalizeColumns,
    normalizeAggregation,
    helperDataReport
};