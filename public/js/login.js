// login.js — Controlador da página de login
 
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
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  limparErros();
 
  const usuario = inputUsuario.value;
  const senha   = inputSenha.value;
 
  btnEntrar.textContent = 'Entrando...';
  btnEntrar.disabled = true;
 
  await new Promise(r => setTimeout(r, 500));
 
  const resultado = await Auth.login(usuario, senha);
 
  if (resultado.ok) {
    btnEntrar.textContent = '✓ Acesso liberado!';
    setTimeout(() => {
      window.location.replace('/index.html');
    }, 600);
    return;
  }
 
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
    exibirMensagem(resultado.erro);
    inputUsuario.classList.add('input--erro');
    inputSenha.classList.add('input--erro');
    inputSenha.value = '';
    inputUsuario.focus();
  }
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
