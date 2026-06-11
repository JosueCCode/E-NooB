const { Router } = require("express");
const { asyncHandler } = require("../../shared/http/async-handler");
const { validate } = require("../../shared/http/validate");
const { loginSchema, registerSchema } = require("./auth.schemas");
const authService = require("./auth.service");

const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  })
);

authRouter.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json(result);
  })
);

module.exports = { authRouter };
