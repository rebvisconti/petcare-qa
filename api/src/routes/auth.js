// routes/auth.js

const express = require('express');
const router  = express.Router();

const ADMIN = { usuario: 'admin', senha: 'petcare123', nome: 'Administrador PetCare' };

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Login do administrador
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do administrador
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usuario, senha]
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: admin
 *               senha:
 *                 type: string
 *                 example: petcare123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: Login realizado com sucesso
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     usuario: { type: string }
 *                     nome:    { type: string }
 *       400:
 *         description: Campos obrigatórios ausentes
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ mensagem: 'Usuário e senha são obrigatórios.' });
  }

  if (usuario !== ADMIN.usuario || senha !== ADMIN.senha) {
    return res.status(401).json({ mensagem: 'Usuário ou senha incorretos.' });
  }

  return res.status(200).json({
    mensagem: 'Login realizado com sucesso',
    usuario:  { usuario: ADMIN.usuario, nome: ADMIN.nome },
  });
});

module.exports = router;
