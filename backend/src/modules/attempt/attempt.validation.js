const { z } = require('zod');

const submitSchema = z.object({
  attemptId: z.string().min(1),
  correctChars: z.number().int().min(0),
  totalTyped: z.number().int().min(1),
  errors: z.number().int().min(0),
});

module.exports = { submitSchema };
