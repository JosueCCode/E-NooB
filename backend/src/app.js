require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const { authRouter } = require("./modules/auth/auth.routes");
const { usersRouter } = require("./modules/users/users.routes");
const { accountsRouter } = require("./modules/accounts/accounts.routes");
const { categoriesRouter } = require("./modules/categories/categories.routes");
const { transactionsRouter } = require("./modules/transactions/transactions.routes");
const { adminRouter } = require("./modules/admin/admin.routes");
const { notFoundHandler, errorHandler } = require("./shared/http/error-handler");

const app = express();

app.use(cors({
  origin(origin, callback) {
    if (env.CORS_ORIGIN === true || !origin || env.CORS_ORIGIN.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origem nao permitida pelo CORS"));
  },
  credentials: true
}));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "casa-clara-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
