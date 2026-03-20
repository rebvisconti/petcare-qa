// app.js — Controlador principal da aplicação PetCare
// Versão com integração à API REST

// ===== REFERÊNCIAS DO DOM =====
const form         = document.getElementById('form-agendamento');
const btnCancelar  = document.getElementById('btn-cancelar');
const lista        = document.getElementById('lista-agendamentos');
const contador     = document.getElementById('contador');
const mensagem     = document.getElementById('mensagem-global');
const inputBusca   = document.getElementById('busca');
const filtroStatus = document.getElementById('filtro-status');
const template     = document.getElementById('template-card');

const campos = {
  nomePet:  document.getElementById('nome-pet'),
  tutor:    document.getElementById('tutor'),
  telefone: document.getElementById('telefone'),
  servico:  document.getElementById('servico'),
  porte:    document.getElementById('porte'),
  data:     document.getElementById('data'),
  horario:  document.getElementById('horario'),
  obs:      document.getElementById('observacoes'),
};

// ===== ESTADO =====
let modoEdicao = false;
let idEmEdicao = null;

// ===== BANNER API OFFLINE =====
function mostrarBannerOffline() {
  let banner = document.getElementById('banner-api');
  if (banner) return;
  banner = document.createElement('div');
  banner.id = 'banner-api';
  banner.setAttribute('data-testid', 'banner-api-offline');
  banner.style.cssText = `
    background:#FDEEEC; color:#C0392B; border-bottom:2px solid #f5b8b2;
    padding:0.75rem 1.5rem; text-align:center; font-size:0.88rem;
    font-weight:600; position:sticky; top:60px; z-index:99;
  `;
  banner.innerHTML = '⚠️ API offline — inicie o servidor com <code style="background:#f5b8b2;padding:2px 6px;border-radius:4px">npm start</code> na pasta <code style="background:#f5b8b2;padding:2px 6px;border-radius:4px">api/</code> para usar o sistema.';
  document.body.insertBefore(banner, document.querySelector('main') || document.body.firstChild);
  // Bloqueia o formulário
  document.getElementById('btn-agendar').disabled = true;
}

function esconderBannerOffline() {
  const banner = document.getElementById('banner-api');
  if (banner) banner.remove();
  document.getElementById('btn-agendar').disabled = false;
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async () => {
  const sessao = Auth.getSessao();
  const headerUsuario = document.getElementById('header-usuario');
  if (sessao && headerUsuario) {
    headerUsuario.textContent = '👤 ' + sessao.usuario;
  }

  document.getElementById('btn-logout').addEventListener('click', () => {
    Auth.logout();
    window.location.replace('login.html');
  });

  campos.data.min = new Date().toISOString().split('T')[0];

  // Verifica se API está no ar antes de carregar a lista
  const apiOk = await Storage.verificarAPI();
  if (!apiOk) {
    mostrarBannerOffline();
    lista.innerHTML = '<p class="lista__vazia" data-testid="lista-vazia">Inicie a API para visualizar os agendamentos.</p>';
    contador.textContent = '0 agendamentos';
    return;
  }

  await renderizarLista();
});

// ===== SUBMIT DO FORMULÁRIO =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparErros();

  const dados = coletarDados();
  const { valido, erros } = Validacao.validarFormulario(dados);

  if (!valido) {
    exibirErros(erros);
    return;
  }

  const btnAgendar = document.getElementById('btn-agendar');
  btnAgendar.disabled = true;
  btnAgendar.textContent = modoEdicao ? 'Salvando...' : 'Agendando...';

  try {
    if (modoEdicao) {
      await Storage.atualizar(idEmEdicao, dados);
      exibirMensagem('Agendamento atualizado com sucesso!', 'sucesso');
      sairEdicao();
      form.reset();
    } else {
      await Storage.criar(dados);
      exibirMensagem('Agendamento criado com sucesso!', 'sucesso');
      form.reset();
    }
    await renderizarLista();
  } catch (err) {
    // Verifica se é conflito de horário
    if (err.message.includes('data e horário')) {
      exibirMensagem(err.message, 'erro');
      campos.horario.classList.add('input--erro');
      document.getElementById('erro-horario').textContent = 'Horário indisponível.';
    } else if (err.message.includes('API') || err.message.includes('servidor') || err.message.includes('fetch')) {
      mostrarBannerOffline();
    } else {
      exibirMensagem(err.message, 'erro');
    }
  } finally {
    btnAgendar.disabled = false;
    btnAgendar.textContent = modoEdicao ? 'Salvar alterações' : 'Agendar';
  }
});

// ===== CANCELAR =====
btnCancelar.addEventListener('click', () => {
  form.reset();
  limparErros();
  sairEdicao();
  ocultarMensagem();
});

// ===== FILTROS =====
inputBusca.addEventListener('input',    renderizarLista);
filtroStatus.addEventListener('change', renderizarLista);

// ===== RENDERIZAÇÃO DA LISTA =====
async function renderizarLista() {
  const termoBusca  = inputBusca.value.toLowerCase().trim();
  const statusFiltro = filtroStatus.value;

  try {
    let agendamentos = await Storage.listar({
      status: statusFiltro || undefined,
      pet:    termoBusca   || undefined,
    });

    esconderBannerOffline();

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
    agendamentos.forEach(ag => lista.appendChild(criarCard(ag)));

  } catch {
    mostrarBannerOffline();
  }
}

// ===== CRIAR CARD =====
function criarCard(ag) {
  const clone = template.content.cloneNode(true);
  const card  = clone.querySelector('.card');
  card.dataset.id = ag.id;

  const servicoLabel = { 'banho': 'Banho', 'tosa': 'Tosa', 'banho-tosa': 'Banho + Tosa' };
  const porteLabel   = { 'pequeno': 'Pequeno', 'medio': 'Médio', 'grande': 'Grande' };
  const dataFormatada = ag.data
    ? new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-PT', { day:'2-digit', month:'2-digit', year:'numeric' })
    : '—';

  card.querySelector('[data-field="nome-pet"]').textContent    = ag.nomePet;
  card.querySelector('[data-field="tutor"]').textContent       = '👤 ' + ag.tutor;
  card.querySelector('[data-field="servico"]').textContent     = servicoLabel[ag.servico] || ag.servico;
  card.querySelector('[data-field="porte"]').textContent       = porteLabel[ag.porte]     || ag.porte;
  card.querySelector('[data-field="data-horario"]').textContent = `📅 ${dataFormatada} às ${ag.horario}`;
  card.querySelector('[data-field="telefone"]').textContent    = '📞 ' + ag.telefone;

  const statusEl = card.querySelector('[data-field="status"]');
  statusEl.textContent   = ag.status.charAt(0).toUpperCase() + ag.status.slice(1);
  statusEl.dataset.status = ag.status;

  const obsEl = card.querySelector('[data-field="observacoes"]');
  if (ag.obs) obsEl.textContent = ag.obs;
  else        obsEl.remove();

  card.querySelector('[data-action="editar"]').addEventListener('click', () => entrarEdicao(ag));
  card.querySelector('[data-action="excluir"]').addEventListener('click', () => confirmarExclusao(ag.id));

  return clone;
}

// ===== EDIÇÃO =====
function entrarEdicao(ag) {
  modoEdicao = true;
  idEmEdicao = ag.id;

  campos.nomePet.value  = ag.nomePet;
  campos.tutor.value    = ag.tutor;
  campos.telefone.value = ag.telefone;
  campos.servico.value  = ag.servico;
  campos.porte.value    = ag.porte;
  campos.data.value     = ag.data;
  campos.horario.value  = ag.horario;
  campos.obs.value      = ag.obs || '';

  document.getElementById('titulo-formulario').textContent = 'Editar Agendamento';
  document.getElementById('btn-agendar').textContent       = 'Salvar alterações';
  document.getElementById('grupo-status').style.display   = 'flex';
  document.getElementById('status').value                  = ag.status || 'agendado';

  document.getElementById('cadastro').scrollIntoView({ behavior: 'smooth' });
  limparErros();
}

function sairEdicao() {
  modoEdicao = false;
  idEmEdicao = null;
  document.getElementById('titulo-formulario').textContent = 'Novo Agendamento';
  document.getElementById('btn-agendar').textContent       = 'Agendar';
  document.getElementById('grupo-status').style.display   = 'none';
}

// ===== EXCLUSÃO =====
async function confirmarExclusao(id) {
  if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;
  try {
    await Storage.excluir(id);
    await renderizarLista();
    exibirMensagem('Agendamento excluído.', 'sucesso');
  } catch (err) {
    exibirMensagem(err.message, 'erro');
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
    nomePet: 'erro-nome-pet', tutor: 'erro-tutor', telefone: 'erro-telefone',
    servico: 'erro-servico',  porte: 'erro-porte', data: 'erro-data', horario: 'erro-horario',
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
  mensagem.className   = `mensagem mensagem--${tipo}`;
  setTimeout(() => ocultarMensagem(), 4000);
}

function ocultarMensagem() {
  mensagem.textContent = '';
  mensagem.className   = 'mensagem';
}
