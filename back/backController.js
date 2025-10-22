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
    const joinTypeDefault = payload.joinType || 'INNER JOIN';
    const columnsArr = normalizeColumns(payload.columns); // array de strings
    const aggregationArr = normalizeAggregation(payload.aggregation);
    const filters = Array.isArray(payload.filters) ? payload.filters : [];
    const orderBy = payload.orderBy || null;
    // groupBy pode vir como array, string ou como propriedade aggregation.groupBy já definida
    let groupBy = payload.groupBy || null;
    if (!groupBy && Array.isArray(aggregationArr) && aggregationArr.length > 0) {
      // se o front não enviou groupBy, mas tem aggregation, usa as columns como groupBy (comportamento anterior)
      groupBy = columnsArr.length > 0 ? [...columnsArr] : null;
    }

    // ----------------------------
    // 2) Montar SELECT (colunas + agregações)
    // ----------------------------
    // agregações com alias seguro (substitui '.' por '_')
    const aggsPartArr = aggregationArr.map(a => {
      const alias = `${a.func}_${String(a.column).replace(/\./g, '_')}`;
      return `${a.func}(${a.column}) AS ${alias}`;
    });

    // select final: agregações primeiro (se existirem) + colunas normais
    const selectItems = [];
    if (aggsPartArr.length > 0) selectItems.push(...aggsPartArr);
    if (columnsArr.length > 0) selectItems.push(...columnsArr);
    const selectPart = selectItems.length > 0 ? selectItems.join(', ') : '*';

    // ----------------------------
    // 3) Montar FROM e JOINs (OBRIGATÓRIO ON para joins "significativos")
    // ----------------------------
    // primeira tabela
    const firstTable = typeof tables[0] === 'string' ? tables[0] : tables[0].name;
    let fromPart = firstTable;

    // se houver mais tabelas, cada uma deve ter .type (opcional) e preferencialmente .on (left/right)
    if (tables.length > 1) {
      for (let i = 1; i < tables.length; i++) {
        const t = tables[i];
        const name = typeof t === 'string' ? t : t.name;
        const type = (t && t.type) ? t.type : joinTypeDefault;

        // se tiver cláusula ON corretamente, usa JOIN ... ON left = right
        if (t && t.on && t.on.left && t.on.right) {
          fromPart += ` ${type} ${name} ON ${t.on.left} = ${t.on.right}`;
        } else {
          // se não tiver on, faz CROSS JOIN (ou vírgula para compatibilidade com INNER JOIN)
          // prefira explicitar ON no front para evitar resultados cartesianos
          if (type.toUpperCase().includes('INNER')) {
            fromPart += `, ${name}`; // equivalente a CROSS JOIN/implicit join
          } else {
            fromPart += ` ${type} ${name}`; // e.g. "LEFT JOIN demografia" sem ON (não recomendado)
          }
        }
      }
    }

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

        // operadores especiais como LIKE: transforma valor
        // caso contrário a string fica com a primeira letra maiúscula
        let valToUse = f.value;
        
        if (typeof f.value === 'string' && f.operator && f.operator.toUpperCase() === 'LIKE') {
          valToUse = `%${f.value}%`;

        } else if (f.operator === '=') {
          valToUse = f.value.charAt(0).toUpperCase() + f.value.slice(1);
        }

        return `${f.column} ${f.operator} ${quoteValue(valToUse)}`;
      });
      wherePart = `WHERE ${conds.join(' AND ')}`;
    }

    // ----------------------------
    // 5) Montar GROUP BY (já em forma de string)
    // ----------------------------
    let groupByPart = '';
    if (Array.isArray(groupBy) && groupBy.length > 0) {
      groupByPart = `GROUP BY ${groupBy.join(', ')}`;
    } else if (groupBy && typeof groupBy === 'string') {
      groupByPart = `GROUP BY ${groupBy}`;
    }

    // ----------------------------
    // 6) Montar ORDER BY
    // ----------------------------
    let orderByPart = '';
    if (orderBy && orderBy.column) {
      const dir = orderBy.direction ? orderBy.direction.toUpperCase() : 'ASC';
      orderByPart = `ORDER BY ${orderBy.column} ${dir}`;
    } 

    // ----------------------------
    // 7) Retornar as partes para a rota
    // ----------------------------
    return {
      selectPart,
      fromPart,
      wherePart,
      groupByPart,
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