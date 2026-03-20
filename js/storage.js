// storage.js — Camada de persistência com localStorage
// Simula um banco de dados simples para fins de prática em automação

const CHAVE = 'petcare_agendamentos';

const Storage = {

  /** Retorna todos os agendamentos */
  listar() {
    const dados = localStorage.getItem(CHAVE);
    return dados ? JSON.parse(dados) : [];
  },

  /** Salva um novo agendamento e retorna o objeto com ID gerado */
  criar(dados) {
    const lista = this.listar();
    const novo = {
      ...dados,
      id: 'ag-' + Date.now(),
      status: 'agendado',
      criadoEm: new Date().toISOString(),
    };
    lista.push(novo);
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return novo;
  },

  /** Atualiza um agendamento pelo ID. Retorna o objeto atualizado ou null se não encontrado */
  atualizar(id, dadosAtualizados) {
    const lista = this.listar();
    const index = lista.findIndex(a => a.id === id);
    if (index === -1) return null;
    lista[index] = { ...lista[index], ...dadosAtualizados };
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return lista[index];
  },

  /** Remove um agendamento pelo ID. Retorna true se removido, false se não encontrado */
  excluir(id) {
    const lista = this.listar();
    const nova = lista.filter(a => a.id !== id);
    if (nova.length === lista.length) return false;
    localStorage.setItem(CHAVE, JSON.stringify(nova));
    return true;
  },

  /** Verifica se já existe agendamento para a mesma data e horário */
  horarioOcupado(data, horario, ignorarId = null) {
    return this.listar().some(a =>
      a.data === data &&
      a.horario === horario &&
      a.status !== 'cancelado' &&
      a.id !== ignorarId
    );
  },

  /** Limpa todos os dados (útil para reset em testes) */
  limpar() {
    localStorage.removeItem(CHAVE);
  },
};
