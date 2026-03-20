// login.js — Controlador da página de login

// Se já estiver logado, vai direto pro sistema
Auth.redirecinarSeLogado();

// ===== REFERÊNCIAS =====
const formLogin    = document.getElementById('form-login');
const inputUsuario = document.getElementById('login-usuario');
const inputSenha   = document.getElementById('login-senha');
const erroUsuario  = document.getElementById('erro-usuario');
const erroSenha    = document.getElementById('erro-senha');
const mensagem     = document.getElementById('mensagem-login');
const btnVer       = document.getElementById('btn-ver-senha');
const iconeSenha   = document.getElementById('icone-senha');
const btnEntrar    = document.getElementById('btn-entrar');

// ===== MOSTRAR / OCULTAR SENHA =====
btnVer.addEventListener('click', () => {
  const visivel = inputSenha.type === 'text';
  inputSenha.type = visivel ? 'password' : 'text';
  iconeSenha.textContent = visivel ? '👁' : '🙈';
  btnVer.setAttribute('aria-label', visivel ? 'Mostrar senha' : 'Ocultar senha');
});

// ===== LIMPAR ERRO AO DIGITAR =====
inputUsuario.addEventListener('input', () => {
  inputUsuario.classList.remove('input--erro');
  erroUsuario.textContent = '';
  ocultarMensagem();
});

inputSenha.addEventListener('input', () => {
  inputSenha.classList.remove('input--erro');
  erroSenha.textContent = '';
  ocultarMensagem();
});

// ===== SUBMIT =====
formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  limparErros();

  const usuario = inputUsuario.value;
  const senha   = inputSenha.value;

  // Feedback visual de carregamento
  btnEntrar.textContent = 'Entrando...';
  btnEntrar.disabled = true;

  // Pequeno delay para simular latência (bom para praticar waitFor no Playwright)
  setTimeout(() => {
    const resultado = Auth.login(usuario, senha);

    if (resultado.ok) {
      btnEntrar.textContent = '✓ Acesso liberado!';
      setTimeout(() => {
        window.location.replace('index.html');
      }, 600);
      return;
    }

    // Restaura botão
    btnEntrar.textContent = 'Entrar';
    btnEntrar.disabled = false;

    if (resultado.campo === 'usuario') {
      inputUsuario.classList.add('input--erro');
      erroUsuario.textContent = resultado.erro;
      inputUsuario.focus();
    } else if (resultado.campo === 'senha') {
      inputSenha.classList.add('input--erro');
      erroSenha.textContent = resultado.erro;
      inputSenha.focus();
    } else {
      // Erro geral: credenciais erradas
      exibirMensagem(resultado.erro);
      inputUsuario.classList.add('input--erro');
      inputSenha.classList.add('input--erro');
      inputSenha.value = '';
      inputUsuario.focus();
    }
  }, 500);
});

// ===== AUXILIARES =====
function limparErros() {
  erroUsuario.textContent = '';
  erroSenha.textContent = '';
  inputUsuario.classList.remove('input--erro');
  inputSenha.classList.remove('input--erro');
  ocultarMensagem();
}

function exibirMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.className = 'mensagem mensagem--erro';
}

function ocultarMensagem() {
  mensagem.textContent = '';
  mensagem.className = 'mensagem';
}
