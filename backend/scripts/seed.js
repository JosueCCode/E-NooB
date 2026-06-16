require("dotenv").config();

const bcrypt = require("bcryptjs");
const { prisma } = require("../src/lib/prisma");

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@casaclara.test").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: process.env.ADMIN_NAME || "Admin Casa Clara",
      passwordHash,
      role: "ADMIN"
    },
    create: {
      name: process.env.ADMIN_NAME || "Admin Casa Clara",
      email: adminEmail,
      passwordHash,
      role: "ADMIN"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@casaclara.test" },
    update: {},
    create: {
      name: "Familia Demo",
      email: "demo@casaclara.test",
      passwordHash: await bcrypt.hash("demo12345", 12),
      role: "USER"
    }
  });

  const account = await prisma.account.upsert({
    where: { id: "11111111-1111-4111-8111-111111111111" },
    update: {},
    create: {
      id: "11111111-1111-4111-8111-111111111111",
      userId: user.id,
      name: "Conta Corrente Demo",
      type: "CHECKING",
      balance: 8742.18,
      institution: "Banco Demo"
    }
  });

  const category = await prisma.category.upsert({
    where: {
      userId_name_type: {
        userId: user.id,
        name: "Alimentacao",
        type: "EXPENSE"
      }
    },
    update: {},
    create: {
      userId: user.id,
      name: "Alimentacao",
      type: "EXPENSE",
      color: "#16a34a",
      icon: "cart",
      isDefault: true
    }
  });

  await prisma.transaction.upsert({
    where: { id: "22222222-2222-4222-8222-222222222222" },
    update: {},
    create: {
      id: "22222222-2222-4222-8222-222222222222",
      userId: user.id,
      accountId: account.id,
      categoryId: category.id,
      type: "EXPENSE",
      amount: 248.9,
      description: "Mercado Boa Compra",
      occurredAt: new Date(),
      status: "CONFIRMED",
      notes: "Dado ficticio para testes admin"
    }
  });

  console.log(`Seed pronto. Admin: ${admin.email} / ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
