# 🐾 PetCare QA Frontend

Código-fonte do frontend do sistema PetCare. Este repositório contém apenas os arquivos HTML, CSS e JavaScript da aplicação.

⚠️ O frontend não é executado de forma independente. Para executar o sistema completo utilize o repositório:

[PetCare SQL QA](https://github.com/rebvisconti/petcare-sql-qa)

---

## ✨ Funcionalidades

- **Login de administrador:** Acesso protegido com usuário e senha. Páginas protegidas redirecionam automaticamente para o login quando não há sessão ativa.
- **Criar agendamento:** Formulário completo com validações (campos obrigatórios, data futura, formato de telefone).
- **Listar agendamentos:** Lista dinâmica que atualiza automaticamente ao adicionar, editar ou excluir.
- **Editar agendamento:** Formulário pré-preenchido com os dados do agendamento selecionado e campo de status.
- **Excluir agendamento:** Remoção com diálogo de confirmação.
- **Filtros:** Busca por nome do pet e filtro por status (agendado, concluído, cancelado).
- **Conflito de horário:** O sistema impede dois agendamentos no mesmo dia e horário.
- **Persistência:** Dados salvos no banco SQLite via API REST.
- **Estatísticas:** Endpoint que retorna totais por status em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS), sessionStorage
- **Backend:** Node.js, Express — servido pelo `petcare-sql-qa`
- **Banco:** SQLite via `better-sqlite3` — servido pelo `petcare-sql-qa`

---

## 🔑 Credenciais de Teste

| Campo   | Valor        |
|---------|--------------|
| Usuário | `admin`      |
| Senha   | `petcare123` |

---

## 📦 Papel deste repositório

Este projeto existe para:

- Organização do código frontend
- Versionamento separado da interface
- Referência para estudos de automação frontend
- Evolução independente da camada visual

---

## 🚫 Este projeto não roda sozinho

O frontend é distribuído através do projeto `petcare-sql-qa`.

Você não precisa rodar este projeto separadamente.

**Para usar o sistema completo:**

```bash
# Na pasta petcare-sql-qa:
npm start
```

Acesse: **http://localhost:3002**

---

## 📁 Estrutura do Projeto

```
petcare-qa/
├── public/                 # Frontend (HTML, CSS, JS)
│   ├── css/
│   │   ├── style.css       # Estilos globais
│   │   └── login.css       # Estilos da tela de login
│   ├── js/
│   │   ├── auth.js         # Gerenciamento de sessão (login/logout)
│   │   ├── login.js        # Lógica da tela de login
│   │   ├── app.js          # Lógica principal (CRUD, filtros, lista)
│   │   ├── storage.js      # Camada de acesso à API via fetch()
│   │   └── validacao.js    # Regras de validação do formulário
│   ├── index.html          # Tela principal (agendamentos)
│   └── login.html          # Tela de login
├── routes/                 # Rotas da API REST
│   ├── auth.js             # POST /auth/login
│   ├── agendamentos.js     # CRUD /agendamentos
│   └── estatisticas.js     # GET /estatisticas
├── db.js                   # Banco de dados em memória com dados de exemplo
├── validacao.js            # Regras de validação dos endpoints
├── server.js               # Servidor Express + Swagger + frontend estático
├── package.json            # Configurações e dependências do projeto
├── .gitignore
├── docs/
│   └── petcare-qa-lab.pdf  # Hands-on Lab com todos os casos de teste
└── README.md
```

---

## 📄 Documentação dos Casos de Teste

O arquivo docs/petcare-qa-lab.pdf contém o Hands-on Lab completo com:

- 16 casos de teste de API (CT-API-001 a CT-API-016)
- 15 casos de teste de frontend (CT-FE-001 a CT-FE-015)
- 5 casos de teste E2E (CT-E2E-001 a CT-E2E-005)
- Tabela completa de seletores data-testid
- Dicas de boas práticas para automação

---

## 🗂️ Ecossistema PetCare

| Repositório | Descrição | Porta |
|---|---|---|
| **petcare-qa** | Frontend (este repo) | servido pelo sql-qa |
| **petcare-sql-qa** | API REST + SQLite + Frontend | `3002` |
| **petcare-sql-tests** | Playwright 38 testes | — |

---

## 🚀 Ferramentas sugeridas para automação

- [Playwright](https://playwright.dev/) — frontend e API
- [Cypress](https://www.cypress.io/) — frontend e API
- [Postman](https://www.postman.com/) / [Bruno](https://www.usebruno.com/) — API
- [Robot Framework](https://robotframework.org/) + Browser Library

---

## 🤝 Contribuições

Sinta-se à vontade para enviar sugestões e melhorias via pull requests.