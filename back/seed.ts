import { PrismaClient } from '@prisma/client';
import axios from 'axios';

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

async function ensurePaisAndIndicador(item: any, indicadorNome: string, indicadorId: string) {
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

  // Criar ou atualizar indicador
  const categoria = Object.entries(indicadores).find(([_, inds]) => 
    inds.some(i => i.id === indicadorId)
  )?.[0]?.toUpperCase() as 'SAUDE' | 'ECONOMIA' | 'AMBIENTE' | 'TECNOLOGIA' | 'DEMOGRAFIA';

  await prisma.indicador.upsert({
    where: { id: indicadorId },
    update: {
      nome: indicadorNome,
      categoria
    },
    create: {
      id: indicadorId,
      nome: indicadorNome,
      categoria
    }
  });
}

async function insertData(categoria: string, data: any[], indicadorNome: string, indicadorId: string) {
  for (const item of data) {
    if (item.value === null || !item.country || !item.country.id || !item.date) {
      continue;
    }

    const isoCode = getValidIso3code(item.countryiso3code);
    if (!isoCode) {
      continue;
    }

    try {
      await ensurePaisAndIndicador(item, indicadorNome, indicadorId);

      const record = {
        valor: item.value,
        ano: parseInt(item.date),
        paisId: item.country.id,
        indicadorId: indicadorId
      };

      const where = {
        paisId_indicadorId_ano: {
          paisId: record.paisId,
          indicadorId: record.indicadorId,
          ano: record.ano
        }
      };

      switch (categoria) {
        case 'saude':
          await prisma.saude.upsert({
            where,
            update: { valor: record.valor },
            create: record
          });
          break;
        case 'economia':
          await prisma.economia.upsert({
            where,
            update: { valor: record.valor },
            create: record
          });
          break;
        case 'ambiente':
          await prisma.ambiente.upsert({
            where,
            update: { valor: record.valor },
            create: record
          });
          break;
        case 'tecnologia':
          await prisma.tecnologia.upsert({
            where,
            update: { valor: record.valor },
            create: record
          });
          break;
        case 'demografia':
          await prisma.demografia.upsert({
            where,
            update: { valor: record.valor },
            create: record
          });
          break;
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