const { prisma } = require("../../lib/prisma");

function listCategories(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: "asc" }, { name: "asc" }]
  });
}

function createCategory(userId, data) {
  return prisma.category.create({
    data: { ...data, userId }
  });
}

module.exports = { listCategories, createCategory };
