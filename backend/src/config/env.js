const splitList = (value) => {
  if (!value) return true;
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

const DATABASE_URL = process.env.DATABASE_URL
  || process.env.POSTGRES_PRISMA_URL
  || process.env.POSTGRES_URL
  || process.env.POSTGRES_URL_NON_POOLING;

const env = {
  DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CORS_ORIGIN: splitList(process.env.CORS_ORIGIN),
  PORT: Number(process.env.PORT || 3001)
};

module.exports = { env };
