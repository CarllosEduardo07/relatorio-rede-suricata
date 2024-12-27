import express from 'express';
import router from './router/get-relatorio.js';

const app = express();
const PORT = 3000;

app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;
