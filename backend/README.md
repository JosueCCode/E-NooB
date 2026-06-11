# Backend

API Node/Express para cadastro, login e dados financeiros.

## Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT + bcrypt
- Zod para validacao

## Estrutura

- `src/app.js`: aplica middlewares e rotas.
- `src/server.js`: sobe servidor local.
- `src/modules/*`: rotas, schemas e servicos por dominio.
- `src/middleware`: autenticacao.
- `src/shared/http`: validacao, async handler e erros.

## Rotas

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET|POST /api/accounts`
- `GET|POST /api/categories`
- `GET|POST /api/transactions`

Rotas financeiras usam `Authorization: Bearer TOKEN`.
