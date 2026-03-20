const express      = require('express');
const path         = require('path');
const cors         = require('cors');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes         = require('./routes/auth');
const agendamentosRoutes = require('./routes/agendamentos');
const estatisticasRoutes = require('./routes/estatisticas');

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🐾 PetCare API',
      version: '1.0.0',
      description: 'API REST do sistema de agendamento de banho e tosa PetCare.',
      contact: { name: 'PetCare QA', url: 'https://rebvisconti.github.io/petcare-qa/' },
    },
    servers: [{ url: `http://localhost:${PORT}`, description: 'Servidor local' }],
    tags: [
      { name: 'Autenticação',  description: 'Login do administrador' },
      { name: 'Agendamentos',  description: 'CRUD de agendamentos' },
      { name: 'Estatísticas',  description: 'Totais e resumos' },
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
      color: white; font-size: 1.2rem; font-weight: bold; padding-left: 1rem;
    }
    .swagger-ui .info .title { color: #3D2314; }
    .swagger-ui .btn.execute { background: #E8622A; border-color: #E8622A; }
    .swagger-ui .btn.execute:hover { background: #c94e1e; }
  `,
}));

app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/api', (req, res) => {
  res.json({ mensagem: '🐾 PetCare API está no ar!', versao: '1.0.0', docs: `http://localhost:${PORT}/docs` });
});

app.use('/auth',         authRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/estatisticas', estatisticasRoutes);

const frontendPath = path.resolve(__dirname, '../../');
console.log('Servindo frontend de:', frontendPath);
console.log('Arquivos:', require('fs').readdirSync(frontendPath));
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'login.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  🐾  PetCare rodando!');
  console.log(`  ➜  App:   http://localhost:${PORT}`);
  console.log(`  ➜  API:   http://localhost:${PORT}/api`);
  console.log(`  ➜  Docs:  http://localhost:${PORT}/docs`);
  console.log(`  ➜  JSON:  http://localhost:${PORT}/docs.json`);
  console.log('');
});

module.exports = app;