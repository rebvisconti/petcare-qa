// app.js — Servidor Express com Swagger UI

const express       = require('express');
const cors          = require('cors');
const swaggerUi     = require('swagger-ui-express');
const swaggerJsDoc  = require('swagger-jsdoc');

const authRoutes          = require('./routes/auth');
const agendamentosRoutes  = require('./routes/agendamentos');
const estatisticasRoutes  = require('./routes/estatisticas');

const app  = express();
const PORT = 3001;

// ── Middlewares ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Swagger ────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🐾 PetCare API',
      version: '1.0.0',
      description:
        'API REST do sistema de agendamento de banho e tosa PetCare. ' +
        'Desenvolvida para prática de automação de testes com Playwright, Cypress ou Postman.',
      contact: {
        name: 'PetCare QA',
        url:  'https://rebvisconti.github.io/petcare-qa/',
      },
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: 'Servidor local de desenvolvimento' },
    ],
    tags: [
      { name: 'Autenticação',  description: 'Login do administrador' },
      { name: 'Agendamentos',  description: 'CRUD de agendamentos de banho e tosa' },
      { name: 'Estatísticas',  description: 'Totais e resumos do sistema' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: '🐾 PetCare API Docs',
  customCss: `
    .swagger-ui .topbar { background-color: #3D2314; }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::before {
      content: '🐾 PetCare API';
      color: white;
      font-size: 1.2rem;
      font-weight: bold;
      padding-left: 1rem;
    }
    .swagger-ui .info .title { color: #3D2314; }
    .swagger-ui .btn.execute  { background: #E8622A; border-color: #E8622A; }
    .swagger-ui .btn.execute:hover { background: #c94e1e; }
  `,
}));

// Rota para baixar o JSON do Swagger (útil para importar no Postman/Insomnia)
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Rotas ──────────────────────────────────────────────────────
app.use('/auth',         authRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/estatisticas', estatisticasRoutes);

// ── Rota raiz ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    mensagem:   '🐾 PetCare API está no ar!',
    versao:     '1.0.0',
    docs:       `http://localhost:${PORT}/docs`,
    endpoints:  {
      login:         'POST /auth/login',
      agendamentos:  'GET | POST /agendamentos',
      agendamento:   'GET | PUT | DELETE /agendamentos/:id',
      estatisticas:  'GET /estatisticas',
    },
  });
});

// ── 404 ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ mensagem: `Rota não encontrada: ${req.method} ${req.path}` });
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  🐾  PetCare API rodando!');
  console.log(`  ➜  API:    http://localhost:${PORT}`);
  console.log(`  ➜  Docs:   http://localhost:${PORT}/docs`);
  console.log(`  ➜  JSON:   http://localhost:${PORT}/docs.json`);
  console.log('');
});

module.exports = app;
