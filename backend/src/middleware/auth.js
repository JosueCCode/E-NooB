const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { prisma } = require("../lib/prisma");

async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      const error = new Error("Token ausente");
      error.status = 401;
      throw error;
    }

    const payload = jwt.verify(token, env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    if (!user) {
      const error = new Error("Usuario nao encontrado");
      error.status = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}

function requireAdmin(req, _res, next) {
  if (req.user?.role !== "ADMIN") {
    const error = new Error("Acesso admin necessario");
    error.status = 403;
    next(error);
    return;
  }

  next();
}

module.exports = { requireAuth, requireAdmin };
