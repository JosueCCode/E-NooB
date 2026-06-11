const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const { asyncHandler } = require("../../shared/http/async-handler");
const { validate } = require("../../shared/http/validate");
const { transactionSchema } = require("./transactions.schemas");
const transactionsService = require("./transactions.service");

const transactionsRouter = Router();

transactionsRouter.use(requireAuth);

transactionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const transactions = await transactionsService.listTransactions(req.user.id);
    res.json({ transactions });
  })
);

transactionsRouter.post(
  "/",
  validate(transactionSchema),
  asyncHandler(async (req, res) => {
    const transaction = await transactionsService.createTransaction(req.user.id, req.body);
    res.status(201).json({ transaction });
  })
);

module.exports = { transactionsRouter };
