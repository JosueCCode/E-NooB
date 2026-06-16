const { z } = require("zod");

const emptyToNull = (value) => value === "" ? null : value;

const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER", "ADMIN"]).default("USER")
});

const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["USER", "ADMIN"]).optional()
});

const accountSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"]),
  balance: z.coerce.number().default(0),
  institution: z.preprocess(emptyToNull, z.string().nullable().optional())
});

const categorySchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.preprocess(emptyToNull, z.string().nullable().optional()),
  icon: z.preprocess(emptyToNull, z.string().nullable().optional()),
  isDefault: z.coerce.boolean().default(false)
});

const transactionSchema = z.object({
  userId: z.string().uuid(),
  accountId: z.string().uuid(),
  categoryId: z.preprocess(emptyToNull, z.string().uuid().nullable().optional()),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  amount: z.coerce.number().positive(),
  description: z.string().min(2),
  occurredAt: z.coerce.date(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]).default("CONFIRMED"),
  notes: z.preprocess(emptyToNull, z.string().nullable().optional())
});

module.exports = {
  userCreateSchema,
  userUpdateSchema,
  accountSchema,
  categorySchema,
  transactionSchema
};
