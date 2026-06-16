const { Router } = require("express");
const { requireAuth, requireAdmin } = require("../../middleware/auth");
const { asyncHandler } = require("../../shared/http/async-handler");
const { validate } = require("../../shared/http/validate");
const schemas = require("./admin.schemas");
const adminService = require("./admin.service");

const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/", asyncHandler(async (_req, res) => {
  res.json(await adminService.dashboard());
}));

adminRouter.post("/users", validate(schemas.userCreateSchema), asyncHandler(async (req, res) => {
  res.status(201).json({ user: await adminService.createUser(req.body) });
}));

adminRouter.put("/users/:id", validate(schemas.userUpdateSchema), asyncHandler(async (req, res) => {
  res.json({ user: await adminService.updateUser(req.params.id, req.body) });
}));

adminRouter.delete("/users/:id", asyncHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id);
  res.status(204).end();
}));

adminRouter.post("/accounts", validate(schemas.accountSchema), asyncHandler(async (req, res) => {
  res.status(201).json({ account: await adminService.createAccount(req.body) });
}));

adminRouter.put("/accounts/:id", validate(schemas.accountSchema), asyncHandler(async (req, res) => {
  res.json({ account: await adminService.updateAccount(req.params.id, req.body) });
}));

adminRouter.delete("/accounts/:id", asyncHandler(async (req, res) => {
  await adminService.deleteAccount(req.params.id);
  res.status(204).end();
}));

adminRouter.post("/categories", validate(schemas.categorySchema), asyncHandler(async (req, res) => {
  res.status(201).json({ category: await adminService.createCategory(req.body) });
}));

adminRouter.put("/categories/:id", validate(schemas.categorySchema), asyncHandler(async (req, res) => {
  res.json({ category: await adminService.updateCategory(req.params.id, req.body) });
}));

adminRouter.delete("/categories/:id", asyncHandler(async (req, res) => {
  await adminService.deleteCategory(req.params.id);
  res.status(204).end();
}));

adminRouter.post("/transactions", validate(schemas.transactionSchema), asyncHandler(async (req, res) => {
  res.status(201).json({ transaction: await adminService.createTransaction(req.body) });
}));

adminRouter.put("/transactions/:id", validate(schemas.transactionSchema), asyncHandler(async (req, res) => {
  res.json({ transaction: await adminService.updateTransaction(req.params.id, req.body) });
}));

adminRouter.delete("/transactions/:id", asyncHandler(async (req, res) => {
  await adminService.deleteTransaction(req.params.id);
  res.status(204).end();
}));

module.exports = { adminRouter };
