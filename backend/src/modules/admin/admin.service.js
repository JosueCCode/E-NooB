const bcrypt = require("bcryptjs");
const { prisma } = require("../../lib/prisma");

const includeTransaction = { user: true, account: true, category: true };

function cleanUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

async function dashboard() {
  const [users, accounts, categories, transactions] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.account.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ include: { user: true }, orderBy: [{ type: "asc" }, { name: "asc" }] }),
    prisma.transaction.findMany({ include: includeTransaction, orderBy: { occurredAt: "desc" } })
  ]);

  return {
    users: users.map(cleanUser),
    accounts,
    categories,
    transactions
  };
}

async function createUser(data) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role
    }
  });

  return cleanUser(user);
}

async function updateUser(id, data) {
  const update = { ...data };
  if (update.email) update.email = update.email.toLowerCase();
  if (update.password) {
    update.passwordHash = await bcrypt.hash(update.password, 12);
    delete update.password;
  }

  const user = await prisma.user.update({ where: { id }, data: update });
  return cleanUser(user);
}

function deleteUser(id) {
  return prisma.user.delete({ where: { id } });
}

function createAccount(data) {
  return prisma.account.create({ data, include: { user: true } });
}

function updateAccount(id, data) {
  return prisma.account.update({ where: { id }, data, include: { user: true } });
}

function deleteAccount(id) {
  return prisma.account.delete({ where: { id } });
}

function createCategory(data) {
  return prisma.category.create({ data, include: { user: true } });
}

function updateCategory(id, data) {
  return prisma.category.update({ where: { id }, data, include: { user: true } });
}

function deleteCategory(id) {
  return prisma.category.delete({ where: { id } });
}

async function assertTransactionRelations(data) {
  const account = await prisma.account.findFirst({
    where: { id: data.accountId, userId: data.userId },
    select: { id: true }
  });

  if (!account) {
    const error = new Error("Conta invalida para o usuario selecionado");
    error.status = 400;
    throw error;
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, userId: data.userId },
      select: { id: true }
    });

    if (!category) {
      const error = new Error("Categoria invalida para o usuario selecionado");
      error.status = 400;
      throw error;
    }
  }
}

async function createTransaction(data) {
  await assertTransactionRelations(data);
  return prisma.transaction.create({ data, include: includeTransaction });
}

async function updateTransaction(id, data) {
  await assertTransactionRelations(data);
  return prisma.transaction.update({ where: { id }, data, include: includeTransaction });
}

function deleteTransaction(id) {
  return prisma.transaction.delete({ where: { id } });
}

module.exports = {
  dashboard,
  createUser,
  updateUser,
  deleteUser,
  createAccount,
  updateAccount,
  deleteAccount,
  createCategory,
  updateCategory,
  deleteCategory,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
