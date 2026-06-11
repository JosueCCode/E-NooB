require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { authRouter } = require("./modules/auth/auth.routes");
const { usersRouter } = require("./modules/users/users.routes");
const { accountsRouter } = require("./modules/accounts/accounts.routes");
const { categoriesRouter } = require("./modules/categories/categories.routes");
const { transactionsRouter } = require("./modules/transactions/transactions.routes");
const { notFoundHandler, errorHandler } = require("./shared/http/error-handler");

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "casa-clara-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/transactions", transactionsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
