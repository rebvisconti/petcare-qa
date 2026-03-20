// routes/agendamentos.js

const express  = require('express');
const router   = express.Router();
const DB       = require('../db');
const { validarAgendamento } = require('../validacao');

/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: Gerenciamento de agendamentos de banho e tosa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento:
 *       type: object
 *       properties:
 *         id:          { type: integer, example: 1 }
 *         nomePet:     { type: string,  example: Bolinha }
 *         tutor:       { type: string,  example: Ana Lima }
 *         telefone:    { type: string,  example: "912345678" }
 *         servico:
 *           type: string
 *           enum: [banho, tosa, banho-tosa]
 *           example: banho-tosa
 *         porte:
 *           type: string
 *           enum: [pequeno, medio, grande]
 *           example: pequeno
 *         data:        { type: string, format: date, example: "2025-12-20" }
 *         horario:
 *           type: string
 *           enum: ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"]
 *           example: "10:00"
 *         status:
 *           type: string
 *           enum: [agendado, concluido, cancelado]
 *           example: agendado
 *         observacoes: { type: string, example: Alérgico a shampoo com perfume }
 *         criadoEm:    { type: string, format: date-time }
 *
 *     AgendamentoInput:
 *       type: object
 *       required: [nomePet, tutor, telefone, servico, porte, data, horario]
 *       properties:
 *         nomePet:     { type: string,  example: Bolinha }
 *         tutor:       { type: string,  example: Ana Lima }
 *         telefone:    { type: string,  example: "912345678" }
 *         servico:
 *           type: string
 *           enum: [banho, tosa, banho-tosa]
 *         porte:
 *           type: string
 *           enum: [pequeno, medio, grande]
 *         data:        { type: string, format: date, example: "2025-12-20" }
 *         horario:
 *           type: string
 *           enum: ["08:00","09:00","10:00","11:00","14:00","15:00","16:00","17:00"]
 *         observacoes: { type: string, example: "" }
 *
 *     Erro:
 *       type: object
 *       properties:
 *         mensagem: { type: string }
 *         erros:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               campo:    { type: string }
 *               mensagem: { type: string }
 */

// ── GET /agendamentos ─────────────────────────────────────────────
/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [agendado, concluido, cancelado]
 *         description: Filtrar por status
 *       - in: query
 *         name: pet
 *         schema:
 *           type: string
 *         description: Filtrar por nome do pet (parcial, case-insensitive)
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agendamento'
 */
router.get('/', (req, res) => {
  let lista = DB.listarAgendamentos();
  if (req.query.status) {
    lista = lista.filter(a => a.status === req.query.status);
  }
  if (req.query.pet) {
    const termo = req.query.pet.toLowerCase();
    lista = lista.filter(a => a.nomePet.toLowerCase().includes(termo));
  }
  res.json(lista);
});

// ── GET /agendamentos/:id ─────────────────────────────────────────
/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Busca agendamento por ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Agendamento' }
 *       404:
 *         description: Agendamento não encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Erro' }
 */
router.get('/:id', (req, res) => {
  const ag = DB.buscarAgendamentoPorId(req.params.id);
  if (!ag) return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
  res.json(ag);
});

// ── POST /agendamentos ────────────────────────────────────────────
/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgendamentoInput' }
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:     { type: string, example: Agendamento criado com sucesso }
 *                 agendamento:  { $ref: '#/components/schemas/Agendamento' }
 *       400:
 *         description: Dados inválidos ou horário ocupado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Erro' }
 */
router.post('/', (req, res) => {
  const erros = validarAgendamento(req.body);
  if (erros.length > 0) {
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  }

  if (DB.horarioOcupado(req.body.data, req.body.horario)) {
    return res.status(400).json({
      mensagem: 'Já existe um agendamento para esta data e horário.',
      erros: [{ campo: 'horario', mensagem: 'Horário indisponível.' }],
    });
  }

  const novo = DB.criarAgendamento(req.body);
  res.status(201).json({ mensagem: 'Agendamento criado com sucesso', agendamento: novo });
});

// ── PUT /agendamentos/:id ─────────────────────────────────────────
/**
 * @swagger
 * /agendamentos/{id}:
 *   put:
 *     summary: Atualiza um agendamento existente
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgendamentoInput' }
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:    { type: string }
 *                 agendamento: { $ref: '#/components/schemas/Agendamento' }
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', (req, res) => {
  const ag = DB.buscarAgendamentoPorId(req.params.id);
  if (!ag) return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });

  const erros = validarAgendamento(req.body, true);
  if (erros.length > 0) {
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  }

  if (
    (req.body.data || req.body.horario) &&
    DB.horarioOcupado(
      req.body.data    || ag.data,
      req.body.horario || ag.horario,
      req.params.id
    )
  ) {
    return res.status(400).json({
      mensagem: 'Já existe um agendamento para esta data e horário.',
      erros: [{ campo: 'horario', mensagem: 'Horário indisponível.' }],
    });
  }

  const atualizado = DB.atualizarAgendamento(req.params.id, req.body);
  res.json({ mensagem: 'Agendamento atualizado com sucesso', agendamento: atualizado });
});

// ── DELETE /agendamentos/:id ──────────────────────────────────────
/**
 * @swagger
 * /agendamentos/{id}:
 *   delete:
 *     summary: Remove um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem: { type: string, example: Agendamento removido com sucesso }
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', (req, res) => {
  const removido = DB.excluirAgendamento(req.params.id);
  if (!removido) return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
  res.json({ mensagem: 'Agendamento removido com sucesso' });
});

module.exports = router;
