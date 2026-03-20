// auth.js — Gerenciamento de sessão do administrador
// Usado por login.html e index.html

const CHAVE_SESSAO = 'petcare_sessao';

// Credenciais fixas (em produção ficaria no backend)
const CREDENCIAIS = {
  usuario: 'admin',
  senha:   'petcare123',
};

const Auth = {

  /** Verifica se há uma sessão ativa */
  estaLogado() {
    const sessao = sessionStorage.getItem(CHAVE_SESSAO);
    if (!sessao) return false;
    try {
      const dados = JSON.parse(sessao);
      return dados.autenticado === true && !!dados.usuario;
    } catch {
      return false;
    }
  },

  /** Tenta autenticar. Retorna { ok: boolean, erro?: string } */
  login(usuario, senha) {
    if (!usuario || usuario.trim().length === 0) {
      return { ok: false, campo: 'usuario', erro: 'Informe o usuário.' };
    }
    if (!senha || senha.length === 0) {
      return { ok: false, campo: 'senha', erro: 'Informe a senha.' };
    }
    if (
      usuario.trim() !== CREDENCIAIS.usuario ||
      senha !== CREDENCIAIS.senha
    ) {
      return { ok: false, campo: 'geral', erro: 'Usuário ou senha incorretos.' };
    }

    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({
      autenticado: true,
      usuario:     usuario.trim(),
      loginEm:     new Date().toISOString(),
    }));

    return { ok: true };
  },

  /** Encerra a sessão sem apagar os dados de agendamento */
  logout() {
    sessionStorage.removeItem(CHAVE_SESSAO);
  },

  /** Retorna os dados da sessão atual ou null */
  getSessao() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
    } catch {
      return null;
    }
  },

  /**
   * Proteção de rota: redireciona para login.html se não autenticado.
   * Chame no topo de cada página protegida.
   */
  exigirLogin() {
    if (!this.estaLogado()) {
      window.location.replace('login.html');
    }
  },

  /**
   * Redireciona para index.html se já estiver logado.
   * Chame no topo da página de login.
   */
  redirecinarSeLogado() {
    if (this.estaLogado()) {
      window.location.replace('index.html');
    }
  },
};
