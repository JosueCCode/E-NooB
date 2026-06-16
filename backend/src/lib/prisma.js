const { PrismaClient } = require("@prisma/client");
const { env } = require("../config/env");

const globalForPrisma = globalThis;

if (env.DATABASE_URL && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.DATABASE_URL;
}

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "production" ? ["error"] : ["warn", "error"]
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
