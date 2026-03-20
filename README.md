# 🐾 PetCare — Sistema de Agendamento de Banho & Tosa
**Projeto de prática para automação de testes | QA Mentorship**

---

## Como rodar

```bash
# Opção 1: extensão Live Server no VS Code (recomendado)
# Clique com botão direito em index.html → "Open with Live Server"

# Opção 2: Python (sem instalação extra)
python3 -m http.server 3000

# Opção 3: Node.js
npx serve .
```

Depois abra: `http://localhost:3000`

---

## Estrutura de arquivos

```
petshop-qa/
├── index.html         # Estrutura e template do card
├── css/
│   └── style.css      # Estilos com variáveis CSS
└── js/
    ├── storage.js     # Camada de persistência (localStorage)
    ├── validacao.js   # Regras de validação isoladas
    └── app.js         # Controlador principal
```

---

## Seletores para automação (data-testid)

| Elemento               | Seletor                                  |
|------------------------|------------------------------------------|
| Campo nome do pet      | `[data-testid="input-nome-pet"]`         |
| Campo tutor            | `[data-testid="input-tutor"]`            |
| Campo telefone         | `[data-testid="input-telefone"]`         |
| Select serviço         | `[data-testid="select-servico"]`         |
| Select porte           | `[data-testid="select-porte"]`           |
| Campo data             | `[data-testid="input-data"]`             |
| Select horário         | `[data-testid="select-horario"]`         |
| Botão Agendar          | `[data-testid="btn-agendar"]`            |
| Botão Cancelar         | `[data-testid="btn-cancelar"]`           |
| Mensagem global        | `[data-testid="mensagem-global"]`        |
| Lista de agendamentos  | `[data-testid="lista-agendamentos"]`     |
| Card individual        | `[data-testid="card-agendamento"]`       |
| Botão editar (card)    | `[data-testid="btn-editar"]`             |
| Botão excluir (card)   | `[data-testid="btn-excluir"]`            |
| Contador               | `[data-testid="contador-agendamentos"]`  |
| Busca                  | `[data-testid="input-busca"]`            |
| Filtro status          | `[data-testid="filtro-status"]`          |
| Erro nome pet          | `[data-testid="erro-nome-pet"]`          |
| Erro tutor             | `[data-testid="erro-tutor"]`             |
| Erro telefone          | `[data-testid="erro-telefone"]`          |
| Erro serviço           | `[data-testid="erro-servico"]`           |
| Erro porte             | `[data-testid="erro-porte"]`             |
| Erro data              | `[data-testid="erro-data"]`              |
| Erro horário           | `[data-testid="erro-horario"]`           |
| Lista vazia            | `[data-testid="lista-vazia"]`            |

---

## Cenários de teste sugeridos

### Formulário — Campos obrigatórios
- [ ] Submeter formulário vazio → todos os erros devem aparecer
- [ ] Preencher só o nome do pet e submeter → demais erros aparecem
- [ ] Nome do pet com 1 caractere → erro de tamanho mínimo
- [ ] Telefone com letras → erro de formato
- [ ] Data no passado → erro de data inválida
- [ ] Todos os campos válidos → agendamento criado, mensagem de sucesso

### Conflito de horário
- [ ] Criar dois agendamentos na mesma data/horário → segundo deve falhar

### Lista dinâmica
- [ ] Criar agendamento → card aparece na lista
- [ ] Contador atualiza ao criar e excluir
- [ ] Lista vazia exibe mensagem correta
- [ ] Buscar por nome filtra a lista em tempo real

### Edição
- [ ] Clicar em Editar → formulário preenche com dados do card
- [ ] Salvar alterações → card atualiza na lista
- [ ] Cancelar edição → formulário limpa

### Exclusão
- [ ] Confirmar exclusão → card removido da lista
- [ ] Cancelar exclusão → card permanece

### Persistência
- [ ] Criar agendamento → recarregar página → agendamento ainda existe
