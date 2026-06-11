const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");

const usersRouter = Router();

usersRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = { usersRouter };
