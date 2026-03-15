# FlowTask API

API RESTful do FlowTask – um sistema de gerenciamento de tarefas estilo Kanban. Desenvolvida com **NestJS**, **Prisma**, **PostgreSQL**, autenticação via **JWT** e hash de senhas com **Argon2** + **pepper** global.

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) – framework Node.js progressivo
- [Prisma](https://www.prisma.io/) – ORM para TypeScript e Node.js
- [PostgreSQL](https://www.postgresql.org/) – banco de dados relacional
- [JWT](https://jwt.io/) – autenticação baseada em tokens
- [Argon2](https://github.com/ranisalt/node-argon2) – algoritmo de hash de senhas (vencedor da PHC)
- [class-validator](https://github.com/typestack/class-validator) – validação de DTOs
- [Docker](https://www.docker.com/) – ambiente de desenvolvimento local

## 📦 Pré-requisitos

- Node.js (v18+)
- pnpm (ou npm/yarn)
- PostgreSQL (ou Docker)
- Conta no [Render](https://render.com/) para deploy (opcional)

## 🔧 Configuração do ambiente

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/flowtask-api.git
   cd flowtask-api
   ```

2. Instale as dependências:

   ```bash
   pnpm install
   ```

3. Crie um arquivo `.env` baseado no `.env.example`:

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/flowtask"
   JWT_SECRET="sua_chave_secreta_jwt"
   PASSWORD_PEPPER="seu_pepper_super_secreto"
   ```

4. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm start:dev
   ```

A API estará disponível em `http://localhost:3000`.

## 🐳 Desenvolvimento com Docker

Se preferir usar Docker, execute:

```bash
docker-compose up -d
```

## 📚 Documentação da API

### Autenticação

Todas as rotas protegidas exigem o envio do token JWT no header:

```
Authorization: Bearer <seu_token>
```

### Endpoints

#### Auth

| Método | Rota             | Descrição                       | Corpo (JSON)                                                         |
| ------ | ---------------- | ------------------------------- | -------------------------------------------------------------------- |
| POST   | `/auth/register` | Registra um novo usuário        | `{ "email": "user@mail.com", "name": "Nome", "password": "123456" }` |
| POST   | `/auth/login`    | Realiza login e retorna token   | `{ "email": "...", "password": "..." }`                              |
| GET    | `/auth/me`       | Retorna dados do usuário logado | _protegido_                                                          |

#### Workspaces

| Método | Rota          | Descrição                   |
| ------ | ------------- | --------------------------- |
| POST   | `/workspaces` | Cria um novo workspace      |
| GET    | `/workspaces` | Lista workspaces do usuário |

#### Boards

| Método | Rota                     | Descrição                          |
| ------ | ------------------------ | ---------------------------------- |
| POST   | `/boards`                | Cria um novo board em um workspace |
| GET    | `/workspaces/:id/boards` | Lista boards de um workspace       |

#### Tasks

| Método | Rota              | Descrição                                 |
| ------ | ----------------- | ----------------------------------------- |
| POST   | `/tasks`          | Cria uma nova tarefa em um board          |
| PATCH  | `/tasks/:id`      | Atualiza uma tarefa                       |
| DELETE | `/tasks/:id`      | Remove uma tarefa                         |
| PATCH  | `/tasks/:id/move` | Move tarefa entre colunas (drag-and-drop) |

### Exemplos de requisição

**Registro:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","name":"João","password":"SenhaForte123"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"SenhaForte123"}'
```

Resposta:

```json
{
  "id": "uuid",
  "email": "joao@email.com",
  "name": "João",
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## 🧪 Testes

- **Unitários:** `pnpm test`
- **E2E:** `pnpm test:e2e`

## 🚢 Deploy

A API está preparada para deploy no **Render** (ou similar). Basta conectar o repositório e definir as variáveis de ambiente no painel.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido por [WedDevMatias](https://github.com/webdevmatias)** – projeto de portfólio demonstrando arquitetura modular, boas práticas de segurança e design de APIs.
