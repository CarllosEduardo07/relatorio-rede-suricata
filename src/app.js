import fs from 'fs';
import { parse } from 'tldts'; // Biblioteca para processar domínios

function processJSON(data) {
  const parsedData = data
    .trim() // Remove espaços extras
    .split('\n') // Divide cada linha
    .map(line => JSON.parse(line)); // Parseia cada linha como JSON

  // Filtra os objetos que atendem aos critérios e mantém apenas os campos desejados
  const filteredData = parsedData
    .filter(item => item.dest_port === 53 && item.proto.toLowerCase() === 'udp' && item.src_ip && item.dest_ip && item.dns && item.dns.type === 'query')
    .map(item => ({
      src_ip: item.src_ip,
      dest_ip: item.dest_ip,
      proto: item.proto,
      dest_port: item.dest_port,
      type: item.dns.type,
      rrname: item.dns.rrname,
    }));

  // Consolida os dados por domínio raiz e IP de origem
  const consolidatedData = {};

  //Utilizei a biblioteca tldts(parse) para transformar nomes como www.youtube.com e m.youtube.com no domínio raiz youtube.com.
  filteredData.forEach(item => {
    const rootDomain = parse(item.rrname).domain || item.rrname; // Extrai domínio raiz
    const key = `${item.src_ip}-${rootDomain}`;

    if (!consolidatedData[key]) {
      consolidatedData[key] = {
        src_ip: item.src_ip,
        dest_ip: item.dest_ip,
        proto: item.proto,
        dest_port: item.dest_port,
        type: item.type,
        root_domain: rootDomain,
        count: 0,
      };
    }
    //Todos os subdomínios são agrupados sob o mesmo domínio raiz e a contagem de acessos é atualizada.
    consolidatedData[key].count += 1;
  });

  // Retorna os dados consolidados como array
  return Object.values(consolidatedData);
}

// Simula a leitura de um arquivo com os dados
fs.readFile('./eve.json', 'utf8', (err, content) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  try {
    const consolidatedData = processJSON(content);

    // Salva os dados filtrados e consolidados em um novo arquivo JSON
    fs.writeFile('./src/json-filtrado/filtered_data_minimal.json', JSON.stringify(consolidatedData, null, 2), writeErr => {
      if (writeErr) {
        console.error('Erro ao salvar o arquivo:', writeErr);
        return;
      }
      console.log('Dados filtrados e consolidados salvos em "filtered_data_minimal.json".');
    });
  } catch (e) {
    console.error('Erro ao processar os dados:', e);
  }
});
