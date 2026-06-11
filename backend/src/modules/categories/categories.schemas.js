const { z } = require("zod");

const categorySchema = z.object({
  name: z.string().min(2),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
  icon: z.string().optional()
});

module.exports = { categorySchema };
