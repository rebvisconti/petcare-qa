// auth.js — Gerenciamento de sessão do administrador
// Login validado via API REST

const CHAVE_SESSAO = 'petcare_sessao';

const Auth = {

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

  /** Tenta autenticar via API. Retorna { ok, erro?, campo? } */
  async login(usuario, senha) {
    if (!usuario || usuario.trim().length === 0)
      return { ok: false, campo: 'usuario', erro: 'Informe o usuário.' };
    if (!senha || senha.length === 0)
      return { ok: false, campo: 'senha', erro: 'Informe a senha.' };

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario.trim(), senha }),
        signal: AbortSignal.timeout(5000),
      });

      const json = await res.json();

      if (res.status === 401 || res.status === 400) {
        return { ok: false, campo: 'geral', erro: json.mensagem || 'Usuário ou senha incorretos.' };
      }

      if (!res.ok) {
        return { ok: false, campo: 'geral', erro: 'Erro ao conectar com o servidor.' };
      }

      sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({
        autenticado: true,
        usuario: json.usuario.usuario,
        loginEm: new Date().toISOString(),
      }));

      return { ok: true };

    } catch (err) {
      // API offline ou timeout
      return {
        ok: false,
        campo: 'geral',
        erro: '⚠️ Não foi possível conectar à API. Verifique se o servidor está rodando em http://localhost:3001',
      };
    }
  },

  logout() {
    sessionStorage.removeItem(CHAVE_SESSAO);
  },

  getSessao() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
    } catch {
      return null;
    }
  },

  exigirLogin() {
    if (!this.estaLogado()) {
      window.location.replace('login.html');
    }
  },

  redirecinarSeLogado() {
    if (this.estaLogado()) {
      window.location.replace('index.html');
    }
  },
};
