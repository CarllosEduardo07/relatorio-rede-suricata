import fs from 'fs';

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

  return filteredData;
}

// Simula a leitura de um arquivo com os dados
fs.readFile('./eve.json', 'utf8', (err, content) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  try {
    const filteredData = processJSON(content);

    // Salva os dados filtrados e reduzidos em um novo arquivo JSON
    fs.writeFile('./filtered_data_minimal.json', JSON.stringify(filteredData, null, 2), writeErr => {
      if (writeErr) {
        console.error('Erro ao salvar o arquivo:', writeErr);
        return;
      }
      console.log('Dados filtrados e reduzidos salvos em "filtered_data_minimal.json".');
    });
  } catch (e) {
    console.error('Erro ao processar os dados:', e);
  }
});
