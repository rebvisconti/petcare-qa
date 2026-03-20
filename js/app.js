// app.js — Controlador principal da aplicação PetCare

// ===== REFERÊNCIAS DO DOM =====
const form = document.getElementById('form-agendamento');
const btnCancelar = document.getElementById('btn-cancelar');
const lista = document.getElementById('lista-agendamentos');
const contador = document.getElementById('contador');
const mensagem = document.getElementById('mensagem-global');
const inputBusca = document.getElementById('busca');
const filtroStatus = document.getElementById('filtro-status');
const template = document.getElementById('template-card');

// Campos do formulário
const campos = {
  nomePet: document.getElementById('nome-pet'),
  tutor: document.getElementById('tutor'),
  telefone: document.getElementById('telefone'),
  servico: document.getElementById('servico'),
  porte: document.getElementById('porte'),
  data: document.getElementById('data'),
  horario: document.getElementById('horario'),
  obs: document.getElementById('observacoes'),
};

// ===== ESTADO =====
let modoEdicao = false;
let idEmEdicao = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  // Exibe o nome do usuário logado no header
  const sessao = Auth.getSessao();
  const headerUsuario = document.getElementById('header-usuario');
  if (sessao && headerUsuario) {
    headerUsuario.textContent = '👤 ' + sessao.usuario;
  }

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    Auth.logout();
    window.location.replace('login.html');
  });

  renderizarLista();
  campos.data.min = new Date().toISOString().split('T')[0];
});

// ===== SUBMIT DO FORMULÁRIO =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  limparErros();

  const dados = coletarDados();
  const { valido, erros } = Validacao.validarFormulario(dados);

  if (!valido) {
    exibirErros(erros);
    return;
  }

  // Verificar conflito de horário
  if (Storage.horarioOcupado(dados.data, dados.horario, idEmEdicao)) {
    exibirMensagem('Já existe um agendamento para esta data e horário.', 'erro');
    campos.horario.classList.add('input--erro');
    document.getElementById('erro-horario').textContent = 'Horário indisponível.';
    return;
  }

  if (modoEdicao) {
    Storage.atualizar(idEmEdicao, dados);
    exibirMensagem('Agendamento atualizado com sucesso!', 'sucesso');
    sairEdicao();
  } else {
    Storage.criar(dados);
    exibirMensagem('Agendamento criado com sucesso!', 'sucesso');
    form.reset();
  }

  renderizarLista();
});

// ===== CANCELAR =====
btnCancelar.addEventListener('click', () => {
  form.reset();
  limparErros();
  sairEdicao();
  ocultarMensagem();
});

// ===== FILTROS =====
inputBusca.addEventListener('input', renderizarLista);
filtroStatus.addEventListener('change', renderizarLista);

// ===== RENDERIZAÇÃO DA LISTA =====
function renderizarLista() {
  const termoBusca = inputBusca.value.toLowerCase().trim();
  const statusFiltro = filtroStatus.value;
  let agendamentos = Storage.listar();

  // Filtrar
  if (termoBusca) {
    agendamentos = agendamentos.filter(a =>
      a.nomePet.toLowerCase().includes(termoBusca) ||
      a.tutor.toLowerCase().includes(termoBusca)
    );
  }
  if (statusFiltro) {
    agendamentos = agendamentos.filter(a => a.status === statusFiltro);
  }

  // Ordenar por data e horário
  agendamentos.sort((a, b) => {
    const da = new Date(a.data + 'T' + a.horario);
    const db = new Date(b.data + 'T' + b.horario);
    return da - db;
  });

  lista.innerHTML = '';

  if (agendamentos.length === 0) {
    lista.innerHTML = '<p class="lista__vazia" data-testid="lista-vazia">Nenhum agendamento encontrado.</p>';
    contador.textContent = '0 agendamentos';
    return;
  }

  contador.textContent = `${agendamentos.length} agendamento${agendamentos.length > 1 ? 's' : ''}`;

  agendamentos.forEach(ag => {
    const card = criarCard(ag);
    lista.appendChild(card);
  });
}

// ===== CRIAR CARD A PARTIR DO TEMPLATE =====
function criarCard(ag) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector('.card');
  card.dataset.id = ag.id;

  const servicoLabel = {
    'banho': 'Banho',
    'tosa': 'Tosa',
    'banho-tosa': 'Banho + Tosa',
  };
  const porteLabel = {
    'pequeno': 'Pequeno', 'medio': 'Médio', 'grande': 'Grande',
  };
  const dataFormatada = ag.data
    ? new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-PT', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
    : '—';

  card.querySelector('[data-field="nome-pet"]').textContent = ag.nomePet;
  card.querySelector('[data-field="tutor"]').textContent = '👤 ' + ag.tutor;
  card.querySelector('[data-field="servico"]').textContent = servicoLabel[ag.servico] || ag.servico;
  card.querySelector('[data-field="porte"]').textContent = porteLabel[ag.porte] || ag.porte;
  card.querySelector('[data-field="data-horario"]').textContent = `📅 ${dataFormatada} às ${ag.horario}`;
  card.querySelector('[data-field="telefone"]').textContent = '📞 ' + ag.telefone;

  const statusEl = card.querySelector('[data-field="status"]');
  statusEl.textContent = ag.status.charAt(0).toUpperCase() + ag.status.slice(1);
  statusEl.dataset.status = ag.status;

  const obsEl = card.querySelector('[data-field="observacoes"]');
  if (ag.obs) {
    obsEl.textContent = ag.obs;
  } else {
    obsEl.remove();
  }

  // Ações
  card.querySelector('[data-action="editar"]').addEventListener('click', () => entrarEdicao(ag));
  card.querySelector('[data-action="excluir"]').addEventListener('click', () => confirmarExclusao(ag.id));

  return clone;
}

// ===== EDIÇÃO =====
function entrarEdicao(ag) {
  modoEdicao = true;
  idEmEdicao = ag.id;

  campos.nomePet.value = ag.nomePet;
  campos.tutor.value = ag.tutor;
  campos.telefone.value = ag.telefone;
  campos.servico.value = ag.servico;
  campos.porte.value = ag.porte;
  campos.data.value = ag.data;
  campos.horario.value = ag.horario;
  campos.obs.value = ag.obs || '';

  document.getElementById('btn-agendar').textContent = 'Salvar alterações';
  document.getElementById('cadastro').scrollIntoView({ behavior: 'smooth' });
  limparErros();

  document.getElementById('grupo-status').style.display = 'flex';
  document.getElementById('status').value = ag.status || 'agendado';
}

function sairEdicao() {
  modoEdicao = false;
  idEmEdicao = null;
  document.getElementById('btn-agendar').textContent = 'Agendar';
  document.getElementById('grupo-status').style.display = 'none';
}

// ===== EXCLUSÃO =====
function confirmarExclusao(id) {
  if (confirm('Tem certeza que deseja excluir este agendamento?')) {
    Storage.excluir(id);
    renderizarLista();
    exibirMensagem('Agendamento excluído.', 'sucesso');
  }
}

// ===== AUXILIARES =====
function coletarDados() {
  const grupoStatus = document.getElementById('grupo-status');
  return {
    nomePet:  campos.nomePet.value.trim(),
    tutor:    campos.tutor.value.trim(),
    telefone: campos.telefone.value.trim(),
    servico:  campos.servico.value,
    porte:    campos.porte.value,
    data:     campos.data.value,
    horario:  campos.horario.value,
    obs:      campos.obs.value.trim(),
    status:   grupoStatus.style.display !== 'none'
                ? document.getElementById('status').value
                : undefined,
  };
}

function exibirErros(erros) {
  const mapa = {
    nomePet: 'erro-nome-pet',
    tutor: 'erro-tutor',
    telefone: 'erro-telefone',
    servico: 'erro-servico',
    porte: 'erro-porte',
    data: 'erro-data',
    horario: 'erro-horario',
  };
  const camposMapa = {
    nomePet: campos.nomePet, tutor: campos.tutor, telefone: campos.telefone,
    servico: campos.servico, porte: campos.porte, data: campos.data, horario: campos.horario,
  };

  Object.entries(erros).forEach(([campo, msg]) => {
    const errEl = document.getElementById(mapa[campo]);
    if (errEl) errEl.textContent = msg;
    if (camposMapa[campo]) camposMapa[campo].classList.add('input--erro');
  });
}

function limparErros() {
  document.querySelectorAll('.form__error').forEach(el => el.textContent = '');
  document.querySelectorAll('.input--erro').forEach(el => el.classList.remove('input--erro'));
  ocultarMensagem();
}

function exibirMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = `mensagem mensagem--${tipo}`;
  setTimeout(() => ocultarMensagem(), 4000);
}

function ocultarMensagem() {
  mensagem.textContent = '';
  mensagem.className = 'mensagem';
}
