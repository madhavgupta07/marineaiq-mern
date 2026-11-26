import { z } from 'zod';
import { store } from '../store.js';
import { asyncHandler } from '../utils/index.js';

const leadSchema = z.object({
  name: z.string().trim().max(80).optional().default(''),
  email: z.string().trim().email(),
  role: z.string().trim().max(80).optional().default(''),
  interest: z.string().trim().max(120).optional().default(''),
  source: z.enum(['free-prompts', 'contact']).optional().default('contact'),
  message: z.string().trim().max(4000).optional().default(''),
});

export const createLead = asyncHandler(async (req, res) => {
  const input = leadSchema.parse(req.body);
  await store.leads.create({
    name: input.name,
    email: input.email.toLowerCase(),
    role: input.role,
    interest: input.interest,
    source: input.source,
    message: input.message,
  });

  res.status(201).json({
    ok: true,
    message: 'Thanks — your details have been saved. We will be in touch.',
  });
});
