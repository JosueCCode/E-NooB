const { z } = require("zod");

const transactionSchema = z.object({
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  amount: z.number().positive(),
  description: z.string().min(2),
  occurredAt: z.coerce.date(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]).default("CONFIRMED"),
  notes: z.string().optional()
});

module.exports = { transactionSchema };
