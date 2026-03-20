// storage.js — Camada de acesso à API REST
// Substitui o localStorage pelo fetch() para o backend Node.js

const API_URL = '';

const Storage = {

  // ── Verificação de saúde da API ────────────────────────────────
  async verificarAPI() {
    try {
      const res = await fetch(`${API_URL}/agendamentos`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // ── Agendamentos ───────────────────────────────────────────────
  async listar(filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.pet)    params.append('pet', filtros.pet);
    const query = params.toString() ? '?' + params.toString() : '';
    const res = await fetch(`${API_URL}/agendamentos${query}`);
    if (!res.ok) throw new Error('Erro ao listar agendamentos.');
    return res.json();
  },

  async criar(dados) {
    const res = await fetch(`${API_URL}/agendamentos`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(dados),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || 'Erro ao criar agendamento.');
    return json;
  },

  async atualizar(id, dados) {
    const res = await fetch(`${API_URL}/agendamentos/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(dados),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || 'Erro ao atualizar agendamento.');
    return json;
  },

  async excluir(id) {
    const res = await fetch(`${API_URL}/agendamentos/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.mensagem || 'Erro ao excluir agendamento.');
    return json;
  },
};
