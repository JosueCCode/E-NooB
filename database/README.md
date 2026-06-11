# Database

Banco PostgreSQL modelado com Prisma.

## Estrutura

- `prisma/schema.prisma`: modelos Users, Accounts, Categories e Transactions.
- `prisma/migrations/20260611170000_init/migration.sql`: migration inicial para nuvem.
- `migrations/001_init.sql`: copia SQL direta para consulta/manual.

Use `DATABASE_URL` nas variaveis da Vercel antes de rodar migrations.
