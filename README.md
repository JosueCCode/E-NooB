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
5. Rode `npm run dev`.
