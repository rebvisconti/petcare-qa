// db.js — Banco de dados em memória (simula persistência durante a sessão do servidor)

let agendamentos = [
  {
    id: 1,
    nomePet: 'Bolinha',
    tutor: 'Ana Lima',
    telefone: '912345678',
    servico: 'banho-tosa',
    porte: 'pequeno',
    data: '2025-12-20',
    horario: '10:00',
    status: 'agendado',
    observacoes: 'Alérgico a shampoo com perfume',
    criadoEm: '2025-12-01T09:00:00.000Z',
  },
  {
    id: 2,
    nomePet: 'Rex',
    tutor: 'Carlos Souza',
    telefone: '961234567',
    servico: 'tosa',
    porte: 'grande',
    data: '2025-12-21',
    horario: '14:00',
    status: 'agendado',
    observacoes: '',
    criadoEm: '2025-12-01T10:00:00.000Z',
  },
  {
    id: 3,
    nomePet: 'Mimi',
    tutor: 'Joana Ferreira',
    telefone: '934567890',
    servico: 'banho',
    porte: 'medio',
    data: '2025-12-19',
    horario: '09:00',
    status: 'concluido',
    observacoes: '',
    criadoEm: '2025-12-01T08:00:00.000Z',
  },
];

let proximoId = 4;

const DB = {
  // ── Agendamentos ──────────────────────────────────────────────
  listarAgendamentos() {
    return [...agendamentos];
  },

  buscarAgendamentoPorId(id) {
    return agendamentos.find(a => a.id === Number(id)) || null;
  },

  criarAgendamento(dados) {
    const novo = {
      ...dados,
      id: proximoId++,
      status: 'agendado',
      criadoEm: new Date().toISOString(),
    };
    agendamentos.push(novo);
    return novo;
  },

  atualizarAgendamento(id, dados) {
    const idx = agendamentos.findIndex(a => a.id === Number(id));
    if (idx === -1) return null;
    agendamentos[idx] = { ...agendamentos[idx], ...dados, id: Number(id) };
    return agendamentos[idx];
  },

  excluirAgendamento(id) {
    const idx = agendamentos.findIndex(a => a.id === Number(id));
    if (idx === -1) return false;
    agendamentos.splice(idx, 1);
    return true;
  },

  horarioOcupado(data, horario, ignorarId = null) {
    return agendamentos.some(a =>
      a.data === data &&
      a.horario === horario &&
      a.status !== 'cancelado' &&
      a.id !== Number(ignorarId)
    );
  },

  // ── Estatísticas ──────────────────────────────────────────────
  estatisticas() {
    const total      = agendamentos.length;
    const agendado   = agendamentos.filter(a => a.status === 'agendado').length;
    const concluido  = agendamentos.filter(a => a.status === 'concluido').length;
    const cancelado  = agendamentos.filter(a => a.status === 'cancelado').length;
    const pets       = [...new Set(agendamentos.map(a => a.nomePet))].length;
    return { totalAgendamentos: total, agendados: agendado, concluidos: concluido, cancelados: cancelado, petsUnicos: pets };
  },
};

module.exports = DB;
