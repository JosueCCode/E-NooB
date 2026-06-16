# E-NooB

## Estrutura local

- `frontend/`: interface do site (`index.html`, `styles.css`, `script.js`)
- `backend/`: API Node/Express com cadastro, login e rotas financeiras
- `database/`: schema Prisma e migrations PostgreSQL
- `docs/`: relatorios, notas e ideias iniciais do projeto

## Backend local

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL` e `JWT_SECRET`.
2. Rode `npm install`.
3. Rode `npm run db:generate`.
4. Rode `npm run db:migrate`.
5. Rode `npm run db:seed` para criar o admin e dados ficticios.
6. Rode `npm run dev`.

## Variaveis de ambiente

- `DATABASE_URL`: conexao PostgreSQL usada pelo Prisma.
- `JWT_SECRET`: chave longa e segura para assinar JWT.
- `JWT_EXPIRES_IN`: validade do token, por padrao `7d`.
- `CORS_ORIGIN`: origens permitidas separadas por virgula.
- `PORT`: porta local da API, por padrao `3001`.
- `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`: credenciais criadas pelo seed.

## Admin

A area `/admin` usa o login existente e exige JWT de usuario com `role` `ADMIN`.
O painel consome `/api/admin` e permite criar, editar e excluir `Users`, `Accounts`,
`Categories` e `Transactions` para testes com dados volateis/ficticios.

Credencial local padrao do seed:

- E-mail: `admin@casaclara.test`
- Senha: `admin12345`

## Prisma

- Gerar client: `npm run db:generate`
- Criar/aplicar migration local: `npm run db:migrate`
- Aplicar migrations em producao/Vercel: `npm run db:deploy`
- Popular dados ficticios: `npm run db:seed`

## Deploy Vercel

1. Configure as variaveis de ambiente no projeto da Vercel.
2. Use PostgreSQL acessivel pela Vercel em `DATABASE_URL`.
3. Rode `npm run db:deploy` antes ou durante o deploy para aplicar migrations.
4. Rode `npm run db:seed` uma vez para criar o usuario admin.
5. O `vercel.json` redireciona `/api/*` para a API serverless e `/admin` para o frontend.
