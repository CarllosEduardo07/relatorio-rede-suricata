import fs from 'fs';
import path from 'path';

// Rota para servir o JSON filtrado
//rota///
export const filterRelatorio = (req, res) => {
  const filePath = path.resolve('./src/json-filtrado/filtered_data_minimal.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo JSON:', err);
      return res.status(500).json({ error: 'Erro ao carregar os dados' });
    }

    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData); // Envia o JSON como resposta
    } catch (parseError) {
      console.error('Erro ao parsear o JSON:', parseError);
      res.status(500).json({ error: 'Erro ao processar os dados' });
    }
  });
};
