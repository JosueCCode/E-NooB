const { prisma } = require("../../lib/prisma");

function listAccounts(userId) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

function createAccount(userId, data) {
  return prisma.account.create({
    data: { ...data, userId }
  });
}

module.exports = { listAccounts, createAccount };
