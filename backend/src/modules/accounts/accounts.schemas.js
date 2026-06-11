const { z } = require("zod");

const accountSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["CHECKING", "SAVINGS", "CASH", "CREDIT_CARD", "INVESTMENT"]),
  balance: z.number().default(0),
  institution: z.string().optional()
});

module.exports = { accountSchema };
