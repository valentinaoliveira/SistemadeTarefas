# Sistema de Tarefas

Aplicação **full stack** para gerenciamento de tarefas, com autenticação, controle de acesso por perfil, acompanhamento de prazos e painel de indicadores.

O projeto utiliza **React** no frontend, **ASP.NET Core (C#)** no backend e **SQLite** para persistência dos dados. A comunicação ocorre por uma API REST protegida com JWT.

## Funcionalidades

- **Autenticação:** login com JWT e armazenamento seguro de hashes de senha com BCrypt.
- **Controle de acesso:** perfis `User` e `Admin`, com rotas e operações administrativas protegidas.
- **Tarefas:** criação, consulta, edição e exclusão; título, descrição, status e prioridade.
- **Prazos:** vencimento opcional com data e hora; identificação visual de tarefas atrasadas ou próximas do vencimento.
- **Dashboard:** totais por status, quantidade de tarefas atrasadas, vencimentos nas próximas 24 horas, progresso e listas de atividades recentes e próximos prazos.
- **Meu Perfil:** consulta e atualização de dados pessoais e alteração de senha mediante confirmação da senha atual.
- **Administração de usuários:** listagem e gerenciamento de contas e perfis por administradores.
- **Interface:** tema claro/escuro, animações e componentes reutilizáveis.

> Os indicadores de prazo são calculados a partir das tarefas retornadas pela API. Uma tarefa pode, por exemplo, estar **Pendente** e **Atrasada** simultaneamente.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, JavaScript, React Router, Axios, Lucide React, Motion |
| Backend | C#, ASP.NET Core, .NET 10, Entity Framework Core |
| Banco de dados | SQLite |
| Autenticação e segurança | JWT Bearer, BCrypt, autorização por papéis |
| Documentação e testes da API | Swagger / OpenAPI |

## Arquitetura

O backend é organizado em responsabilidades separadas:

- **API / Controllers:** recebe requisições HTTP, valida o acesso e devolve respostas.
- **Application / DTOs:** define os dados de entrada e saída da API.
- **Application / Services:** concentra as regras de negócio.
- **Domain / Entities e Enums:** representa usuários, tarefas, status, prioridades e perfis.
- **Infrastructure / Data e Repositories:** gerencia o acesso ao SQLite por meio do Entity Framework Core.

Fluxo simplificado:

```text
React (interface)
    |
    | HTTP / JSON + JWT
    v
ASP.NET Core (Controllers)
    |
    v
Services (regras de negócio)
    |
    v
Repositories / Entity Framework Core
    |
    v
SQLite
```

### Organização do projeto

```text
SistemaTarefas/
├── Backend/
│   ├── API/
│   │   └── Controllers/
│   ├── Application/
│   │   ├── DTOs/
│   │   ├── Interfaces/
│   │   └── Services/
│   ├── Domain/
│   │   ├── Entities/
│   │   └── Enums/
│   ├── Infrastructure/
│   │   ├── Data/
│   │   └── Repositories/
│   ├── Migrations/
│   └── Program.cs
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   └── styles/
    └── package.json
```

## Modelo de tarefas

Cada tarefa possui os seguintes campos principais:

| Campo | Descrição |
| --- | --- |
| `titulo` | Nome da tarefa |
| `descricao` | Detalhes opcionais |
| `status` | Pendente, Em andamento ou Concluída |
| `prioridade` | Baixa, Média ou Alta |
| `dataCriacao` | Data de criação |
| `dataConclusao` | Data de conclusão, quando informada |
| `dataVencimento` | Prazo opcional |
| `usuarioId` | Usuário associado à tarefa |

Os valores numéricos utilizados pela API são:

| Valor | Status | Prioridade |
| --- | --- | --- |
| `1` | Pendente | Baixa |
| `2` | Em andamento | Média |
| `3` | Concluída | Alta |

## Segurança e permissões

A API utiliza **JWT Bearer** para autenticação e **BCrypt** para verificação de senhas. O backend valida o usuário e consulta seu papel atual no banco durante a autenticação de cada requisição, de modo que alterações de perfil tenham efeito sem depender de um novo login.

- Usuários autenticados podem gerenciar suas próprias tarefas e informações de perfil.
- Operações administrativas de usuários são restritas ao perfil `Admin`.
- A interface oculta opções sem permissão, mas a **autorização efetiva é aplicada no backend**.
- Respostas `401` indicam ausência ou invalidade de autenticação; `403` indicam falta de permissão.

> **Nota:** a alteração de senha não implica, por si só, revogação de todos os tokens JWT já emitidos. Revogação de sessões é uma possível evolução de segurança.

## API REST

Principais rotas implementadas:

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| `POST` | `/api/Auth/login` | Autenticar usuário |
| `GET` | `/api/Tarefas` | Listar tarefas acessíveis ao usuário |
| `POST` | `/api/Tarefas` | Criar tarefa |
| `GET` | `/api/Tarefas/{id}` | Consultar tarefa |
| `PUT` | `/api/Tarefas/{id}` | Atualizar tarefa |
| `DELETE` | `/api/Tarefas/{id}` | Excluir tarefa |
| `GET` | `/api/Usuarios/{id}` | Consultar dados do usuário autorizado |
| `PUT` | `/api/Usuarios/{id}` | Atualizar dados do usuário autorizado |
| `PATCH` | `/api/Usuarios/me/senha` | Alterar a própria senha |
| `GET` | `/api/Usuarios` | Listar usuários (Admin) |
| `PATCH` | `/api/Usuarios/{id}/role` | Alterar perfil (Admin) |

Outras operações de usuários estão disponíveis nos respectivos controllers. Consulte o Swagger para a especificação completa.

### Exemplo de criação de tarefa

```json
{
  "titulo": "Estudar React",
  "descricao": "Revisar componentes e Context API",
  "status": 1,
  "prioridade": 2,
  "dataVencimento": "2026-10-20T23:59:00Z"
}
```

O campo `dataVencimento` é opcional. O frontend converte o horário local informado pelo usuário para um instante UTC antes de enviá-lo à API.

## Como executar localmente

### Pré-requisitos

- **.NET SDK 10**
- **Node.js e npm**
- **dotnet-ef** (ferramenta CLI do Entity Framework Core)

### 1. Clonar o repositório

```bash
git clone 
cd SistemaTarefas
```

### 2. Configurar o backend

Entre na pasta `Backend` e restaure as dependências:

```bash
cd Backend
dotnet restore
```

Configure os valores de `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` e a conexão `ConnectionStrings:DefaultConnection` por meio de configuração local ou variáveis de ambiente, conforme a configuração do `Program.cs`.

**Não publique chaves JWT reais, credenciais ou bancos de dados com informações pessoais no repositório.** Para desenvolvimento local, utilize segredos próprios e uma chave JWT suficientemente longa e aleatória.

Instale a ferramenta de migração, se necessário:

```bash
dotnet tool install --global dotnet-ef
```

Se a ferramenta já estiver instalada, não é necessário repetir a instalação.

Aplique as migrações existentes e execute a API:

```bash
dotnet ef database update
dotnet run
```

Na configuração de desenvolvimento utilizada neste projeto, a API atende em `http://localhost:5070` e o Swagger em `http://localhost:5070/swagger`. A porta pode variar conforme `launchSettings.json`.

### 3. Configurar o frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173` (porta padrão do Vite, caso esteja livre).

O cliente Axios está configurado para usar `http://localhost:5070/api`. Se a API utilizar outra porta, ajuste a `baseURL` em `frontend/src/services/api.js`.

## Testes realizados durante o desenvolvimento

Foram verificados manualmente os seguintes fluxos:

- Login e acesso às rotas protegidas.
- Criação, listagem, edição e exclusão de tarefas.
- Persistência dos dados após recarregar a página.
- Isolamento de tarefas por usuário.
- Promoção e rebaixamento entre os perfis `User` e `Admin`.
- Respostas `401` e `403` para sessões inválidas e acesso não autorizado.
- Alteração de senha com validação da senha atual.
- Cadastro e atualização de prazos de vencimento.
- Indicadores de tarefas atrasadas e próximas do vencimento.

Esses testes foram **manuais**; não representam uma suíte automatizada de testes.

## Possíveis evoluções

- Filtros e ordenação avançados por prazo, status e prioridade.
- Notificações de vencimento.
- Paginação e otimização para grandes volumes de tarefas.
- Testes automatizados de frontend e backend.
- Revogação de sessões após alterações sensíveis de credenciais.
- Aplicativo mobile com Expo, integrado à mesma API.

## Status

**Versão web funcional em desenvolvimento**, com backend, frontend e banco de dados integrados. O aplicativo mobile permanece como evolução futura.

---

Projeto desenvolvido para prática de desenvolvimento full stack, arquitetura em camadas, APIs REST, autenticação e persistência de dados.
