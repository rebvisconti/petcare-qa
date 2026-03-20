const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const swaggerUi    = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes         = require('./routes/auth');
const agendamentosRoutes = require('./routes/agendamentos');
const estatisticasRoutes = require('./routes/estatisticas');

const app  = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // ← igual ao da biblioteca!

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: '🐾 PetCare API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));

// Rotas da API
app.use('/auth',         authRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/estatisticas', estatisticasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/docs`);
});

module.exports = app;