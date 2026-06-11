const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../lib/prisma");
const { env } = require("../../config/env");

function signToken(userId) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_EXPIRES_IN
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function register(data) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      categories: {
        create: [
          { name: "Alimentacao", type: "EXPENSE", color: "#16a34a", icon: "cart", isDefault: true },
          { name: "Moradia", type: "EXPENSE", color: "#2563eb", icon: "home", isDefault: true },
          { name: "Transporte", type: "EXPENSE", color: "#f59e0b", icon: "car", isDefault: true },
          { name: "Saude", type: "EXPENSE", color: "#dc2626", icon: "heart", isDefault: true },
          { name: "Salario", type: "INCOME", color: "#059669", icon: "wallet", isDefault: true }
        ]
      }
    }
  });

  return { user: publicUser(user), token: signToken(user.id) };
}

async function login(data) {
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  const validPassword = user ? await bcrypt.compare(data.password, user.passwordHash) : false;

  if (!validPassword) {
    const error = new Error("Credenciais invalidas");
    error.status = 401;
    throw error;
  }

  return { user: publicUser(user), token: signToken(user.id) };
}

module.exports = { register, login };
