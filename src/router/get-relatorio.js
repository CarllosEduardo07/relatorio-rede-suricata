import { Router } from 'express';
import { filterRelatorio } from './../controller/relatorio-controller.js';

const router = Router();

//ROTAS
router.get('/relatorio', filterRelatorio);

export default router;
