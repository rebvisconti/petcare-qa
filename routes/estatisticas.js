// routes/estatisticas.js

const express = require('express');
const router  = express.Router();
const DB      = require('../db');

/**
 * @swagger
 * tags:
 *   name: Estatísticas
 *   description: Totais e resumos do sistema
 */

/**
 * @swagger
 * /estatisticas:
 *   get:
 *     summary: Retorna estatísticas gerais do sistema
 *     tags: [Estatísticas]
 *     responses:
 *       200:
 *         description: Estatísticas calculadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalAgendamentos: { type: integer, example: 3 }
 *                 agendados:         { type: integer, example: 2 }
 *                 concluidos:        { type: integer, example: 1 }
 *                 cancelados:        { type: integer, example: 0 }
 *                 petsUnicos:        { type: integer, example: 3 }
 */
router.get('/', (req, res) => {
  res.json(DB.estatisticas());
});

module.exports = router;
