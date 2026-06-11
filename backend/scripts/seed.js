require("dotenv").config();

const { prisma } = require("../src/lib/prisma");

async function main() {
  console.log("Seed pronto. Categorias padrao sao criadas no cadastro do usuario.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
