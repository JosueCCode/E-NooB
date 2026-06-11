const { prisma } = require("../../lib/prisma");

function listTransactions(userId) {
  return prisma.transaction.findMany({
    where: { userId },
    include: { account: true, category: true },
    orderBy: { occurredAt: "desc" }
  });
}

async function createTransaction(userId, data) {
  const account = await prisma.account.findFirst({
    where: { id: data.accountId, userId }
  });

  if (!account) {
    const error = new Error("Conta invalida");
    error.status = 400;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId }
    });

    if (!category) {
      const error = new Error("Categoria invalida");
      error.status = 400;
      throw error;
    }
  }

  return prisma.transaction.create({
    data: { ...data, userId }
  });
}

module.exports = { listTransactions, createTransaction };
