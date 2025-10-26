import axios from 'axios';

import { PrismaClient, categoria as CategoriaEnum } from '@prisma/client';

const prisma = new PrismaClient();

// Definindo os indicadores por categoria
const indicadores = {
  saude: [
    { id: 'SP.DYN.LE00.IN', nome: 'Expectativa de vida' },
    { id: 'SH.DYN.MORT', nome: 'Taxa de mortalidade infantil' },
    { id: 'SH.MED.BEDS.ZS', nome: 'Leitos hospitalares' }
  ],
  economia: [
    { id: 'NY.GDP.MKTP.CD', nome: 'PIB corrente' },
    { id: 'NY.GDP.PCAP.PP.CD', nome: 'PIB per capita' },
    { id: 'FP.CPI.TOTL.ZG', nome: 'Inflação' },
    { id: 'SL.UEM.TOTL.ZS', nome: 'Taxa de desemprego' }
  ],
  ambiente: [
    { id: 'AG.LND.FRST.ZS', nome: 'Área florestal' },
    { id: 'ER.H2O.FWTL.ZS', nome: 'Consumo de água doce' }
  ],
  tecnologia: [
    { id: 'EG.ELC.ACCS.ZS', nome: 'Acesso a eletricidade' }
  ],
  demografia: [
    { id: 'SP.POP.TOTL', nome: 'População total' },
    { id: 'SP.DYN.CBRT.IN', nome: 'Taxa de natalidade' }
  ]
};

async function fetchWorldBankData(indicatorId: string) {
  const baseUrl = `https://api.worldbank.org/v2/country/all/indicator/${indicatorId}?format=json&per_page=20000`;
  let allData: any[] = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      const url = `${baseUrl}&page=${page}`;
      const response = await axios.get(url);
      
      if (response.status !== 200) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const metadata = response.data[0];
      const data = response.data[1];

      if (page === 1) {
        totalPages = metadata.pages;
      }

      if (data && Array.isArray(data)) {
        allData.push(...data);
      }

      page++;
    }
  } catch (error) {
    console.error(`Erro ao buscar dados para o indicador ${indicatorId}:`, error);
  }

  return allData;
}

function getValidIso3code(code: string): string | null {
  return code && code.length === 3 ? code : null;
}

async function ensurePaisAndIndicador(item: any, indicadorNome: string, indicador_: string) {
  // Criar ou atualizar país
  await prisma.pais.upsert({
    where: { id: item.country.id },
    update: {
      nome: item.country.value,
      iso3: item.countryiso3code || 'XXX'
    },
    create: {
      id: item.country.id,
      nome: item.country.value,
      iso3: item.countryiso3code || 'XXX'
    }
  });

  const categoria = Object.entries(indicadores).find(([_, inds]) =>
    inds.some(i => i.id === indicador_)
  )?.[0];

  const categoriaFormatada = categoria
    ? categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase()
    : 'Economia'; // valor padrão (ajuste conforme quiser)

  // converte para o enum do Prisma
  const categoriaEnum = categoriaFormatada as CategoriaEnum;


  await prisma.indicador.upsert({
    where: { id: indicador_ },
    update: {
      nome: indicadorNome,
      categoria: categoriaEnum,
    },
    create: {
      id: indicador_,
      nome: indicadorNome,
      categoria: categoriaEnum,
    },
  });
}

async function upsertByCompositeKey(model: any, record: any) {
  const existing = await model.findFirst({
    where: {
      pais_id: record.pais_id,
      indicador_id: record.indicador_id,
      ano: record.ano
    }
  });

  if (existing) {
    await model.update({
      where: { id: existing.id },
      data: { valor: record.valor }
    });
  } else {
    await model.create({ data: record });
  }
}

async function insertData(categoria: string, data: any[], indicadorNome: string, indicador_id: string) {
  for (const item of data) {
    // Ignorar registros incompletos
    if (item.value === null || !item.country || !item.country.id || !item.date) continue;

    const isoCode = getValidIso3code(item.countryiso3code);
    if (!isoCode) continue;

    try {
      // Garante que o país e o indicador existam
      await ensurePaisAndIndicador(item, indicadorNome, indicador_id);

      const record = {
        valor: item.value,
        ano: parseInt(item.date),
        pais_id: item.country.id,
        indicador_id: indicador_id
      };

      // Faz o insert/update conforme categoria
      switch (categoria) {
        case 'saude':
          await upsertByCompositeKey(prisma.saude, record);
          break;
        case 'economia':
          await upsertByCompositeKey(prisma.economia, record);
          break;
        case 'ambiente':
          await upsertByCompositeKey(prisma.ambiente, record);
          break;
        case 'tecnologia':
          await upsertByCompositeKey(prisma.tecnologia, record);
          break;
        case 'demografia':
          await upsertByCompositeKey(prisma.demografia, record);
          break;
        default:
          console.warn(`Categoria desconhecida: ${categoria}`);
      }
    } catch (error) {
      console.error(`Erro ao inserir dados para ${item.country.id} - ${item.date}:`, error);
    }
  }
}


async function main() {
  console.log('Iniciando coleta de dados do World Bank...\n');

  for (const [categoria, indicadoresCategoria] of Object.entries(indicadores)) {
    console.log(`Processando categoria: ${categoria}\n`);
    
    for (const indicador of indicadoresCategoria) {
      console.log(`Buscando dados para o indicador: ${indicador.id} - ${indicador.nome}\n`);
      
      const data = await fetchWorldBankData(indicador.id);
      console.log(`Encontrados ${data.length} registros para ${indicador.id}\n`);
      
      await insertData(categoria, data, indicador.nome, indicador.id);
      console.log(`Dados inseridos para ${indicador.id}\n`);
    }
  }

  console.log('Processo concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('Erro durante a execução:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });