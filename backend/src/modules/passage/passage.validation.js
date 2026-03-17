const { z } = require('zod');

const passageSchema = z.object({
  text: z.string().trim().min(10).max(5000),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  language: z.string().trim().default('english'),
});

module.exports = { passageSchema };
