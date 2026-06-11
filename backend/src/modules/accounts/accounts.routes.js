const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const { asyncHandler } = require("../../shared/http/async-handler");
const { validate } = require("../../shared/http/validate");
const { accountSchema } = require("./accounts.schemas");
const accountsService = require("./accounts.service");

const accountsRouter = Router();

accountsRouter.use(requireAuth);

accountsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const accounts = await accountsService.listAccounts(req.user.id);
    res.json({ accounts });
  })
);

accountsRouter.post(
  "/",
  validate(accountSchema),
  asyncHandler(async (req, res) => {
    const account = await accountsService.createAccount(req.user.id, req.body);
    res.status(201).json({ account });
  })
);

module.exports = { accountsRouter };
