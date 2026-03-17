const { z } = require('zod');

const createContestSchema = z.object({
  title: z.string().trim().min(3).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  startTime: z.string().datetime(),
  duration: z.number().int().min(30).max(3600),
  maxAttempts: z.number().int().min(1).max(10).default(3),
  passagePool: z.array(z.string()).min(1, 'Please select at least one passage'),
  rankingMethod: z.enum(['best', 'last', 'average']).default('best'),
  maxParticipants: z.number().int().min(2).max(10000).default(100),
});

module.exports = { createContestSchema };
