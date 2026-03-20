# 🐾 PetCare QA

Sistema de agendamento de banho e tosa desenvolvido para **prática de automação de testes**. Frontend e API REST rodam juntos num único servidor Node.js com documentação Swagger.

---

## ✨ Funcionalidades

- **Login de administrador:** Acesso protegido com usuário e senha. Páginas protegidas redirecionam automaticamente para o login quando não há sessão ativa.
- **Criar agendamento:** Formulário completo com validações (campos obrigatórios, data futura, formato de telefone).
- **Listar agendamentos:** Lista dinâmica que atualiza automaticamente ao adicionar, editar ou excluir.
- **Editar agendamento:** Formulário pré-preenchido com os dados do agendamento selecionado e campo de status.
- **Excluir agendamento:** Remoção com diálogo de confirmação.
- **Filtros:** Busca por nome do pet e filtro por status (agendado, concluído, cancelado).
- **Conflito de horário:** O sistema impede dois agendamentos no mesmo dia e horário.
- **API REST:** Backend com todos os endpoints documentados via Swagger UI.
- **Estatísticas:** Endpoint que retorna totais por status em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS), sessionStorage
- **Backend:** Node.js, Express, CORS, Swagger UI Express, Swagger JSDoc
- **Hospedagem:** GitHub Pages (frontend estático, sem API)

---

## 🔑 Credenciais de Teste

| Campo   | Valor        |
|---------|--------------|
| Usuário | `admin`      |
| Senha   | `petcare123` |

---

## 🌐 Acessar o Frontend (sem instalar nada)

O frontend está no ar e pode ser acessado diretamente pelo navegador — sem API, apenas para explorar a interface:

👉 **https://rebvisconti.github.io/petcare-qa/**

> ⚠️ No GitHub Pages a API não está disponível. Um banner vermelho aparece indicando que o servidor precisa ser iniciado localmente para usar o sistema completo.

---

## 💻 Rodar o projeto completo localmente

Para praticar testes de API e frontend integrados, rode o projeto na sua máquina.

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão LTS recomendada — a versão com "LTS" escrito no site)
- Gerenciador de pacotes NPM (já vem junto com o Node.js)

> 💡 **Como saber se já tem o Node.js instalado?**
> Abra o terminal e digite:
> ```
> node --version
> ```
> Se aparecer um número como `v18.0.0`, está instalado! Se aparecer erro, acesse [nodejs.org](https://nodejs.org/) e instale.

---

### Passo a passo

**1. Clone o repositório:**

```bash
git clone https://github.com/rebvisconti/petcare-qa.git
cd petcare-qa
```

**2. Instale as dependências:**

```bash
npm install
```

> Esse comando baixa tudo que o projeto precisa para funcionar. Pode demorar alguns segundos.

**3. Inicie o servidor:**

```bash
npm start
```

Se tudo der certo, o terminal vai mostrar:

```
Servidor rodando em http://localhost:3001
Swagger: http://localhost:3001/docs
```

**4. Acesse no navegador:**

| O que acessar | Endereço |
|---|---|
| Sistema completo (login + agendamentos) | http://localhost:3001 |
| Swagger UI (documentação interativa da API) | http://localhost:3001/docs |
| JSON para importar no Postman | http://localhost:3001/docs.json |

> ⚠️ **Atenção:** O servidor precisa estar rodando no terminal para o sistema funcionar. Não feche o terminal enquanto estiver testando!

> 🔄 **Para parar o servidor:** pressione `Ctrl + C` no terminal.

> 🔄 **Para resetar os dados:** pare e inicie o servidor novamente (`Ctrl + C` → `npm start`). Os dados voltam para os 3 agendamentos de exemplo — ótimo para isolar testes!

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

## 📡 Endpoints da API

| Método | Rota                  | Descrição                              |
|--------|-----------------------|----------------------------------------|
| POST   | /auth/login           | Login do administrador                 |
| GET    | /agendamentos         | Listar todos (aceita filtros)          |
| POST   | /agendamentos         | Criar novo agendamento                 |
| GET    | /agendamentos/:id     | Buscar agendamento por ID              |
| PUT    | /agendamentos/:id     | Atualizar agendamento                  |
| DELETE | /agendamentos/:id     | Remover agendamento                    |
| GET    | /estatisticas         | Totais por status                      |
| GET    | /api                  | Status da API                          |

### Filtros disponíveis em GET /agendamentos

```
GET /agendamentos?status=agendado
GET /agendamentos?pet=bolinha
GET /agendamentos?status=concluido&pet=rex
```

---

## 🧪 Como importar a API no Postman

1. Abra o Postman
2. Clique em **Import**
3. Selecione **Link**
4. Cole: `http://localhost:3001/docs.json`
5. Clique em **Import**

Toda a coleção de endpoints será criada automaticamente! 🎉

---

## 📄 Documentação dos Casos de Teste

O arquivo `docs/petcare-qa-lab.pdf` contém o **Hands-on Lab** completo com:

- 16 casos de teste de API (CT-API-001 a CT-API-016)
- 15 casos de teste de frontend (CT-FE-001 a CT-FE-015)
- 5 casos de teste E2E (CT-E2E-001 a CT-E2E-005)
- Tabela completa de seletores `data-testid`
- Dicas de boas práticas para automação

---

## 🚀 Ferramentas sugeridas para automação

- [Playwright](https://playwright.dev/) (JavaScript) — frontend e API
- [Cypress](https://www.cypress.io/) (JavaScript) — frontend e API
- [Postman](https://www.postman.com/) — exploração manual e automação de API
- [Robot Framework](https://robotframework.org/) + Browser Library

---

## 🤝 Contribuições

Sinta-se à vontade para enviar sugestões, correções e melhorias através de pull requests.
