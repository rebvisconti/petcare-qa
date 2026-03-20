# 🐾 PetCare API

API REST para o sistema de agendamento de banho e tosa PetCare.  
Desenvolvida para **prática de automação de testes** com Playwright, Cypress ou Postman.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior

---

## Como rodar

```bash
# 1. Instalar as dependências (só na primeira vez)
npm install

# 2. Iniciar o servidor
npm start
```

O terminal vai exibir:

```
  🐾  PetCare API rodando!
  ➜  API:    http://localhost:3001
  ➜  Docs:   http://localhost:3001/docs
  ➜  JSON:   http://localhost:3001/docs.json
```

Abra **http://localhost:3001/docs** para ver e testar os endpoints pelo Swagger UI.

---

## Endpoints

| Método | Rota                  | Descrição                        |
|--------|-----------------------|----------------------------------|
| POST   | /auth/login           | Login do administrador           |
| GET    | /agendamentos         | Listar todos (filtros opcionais) |
| POST   | /agendamentos         | Criar agendamento                |
| GET    | /agendamentos/:id     | Buscar por ID                    |
| PUT    | /agendamentos/:id     | Atualizar agendamento            |
| DELETE | /agendamentos/:id     | Remover agendamento              |
| GET    | /estatisticas         | Totais por status                |

---

## Credenciais de teste

| Campo   | Valor       |
|---------|-------------|
| usuario | `admin`     |
| senha   | `petcare123`|

---

## Filtros disponíveis em GET /agendamentos

```
GET /agendamentos?status=agendado
GET /agendamentos?pet=bolinha
GET /agendamentos?status=concluido&pet=rex
```

---

## Importar no Postman ou Insomnia

Acesse `http://localhost:3001/docs.json` e importe o JSON diretamente no Postman:  
**Import → Raw Text** ou **Import → Link** → cole a URL.

---

## Observação sobre persistência

Os dados ficam em memória enquanto o servidor está rodando.  
Ao reiniciar o servidor, os dados voltam para o estado inicial com 3 agendamentos de exemplo.  
Isso é intencional — facilita o reset entre execuções de testes.
