import { z } from 'zod';
import { store } from '../store.js';
import { AppError, asyncHandler, slugify } from '../utils/index.js';

const promptSchema = z.object({
  title: z.string().trim().min(3).max(140),
  slug: z.string().trim().max(160).optional(),
  category: z.string().trim().min(2).max(60),
  summary: z.string().trim().min(10).max(400),
  body: z.string().trim().min(20),
  tags: z.array(z.string().trim().min(1)).max(12).optional().default([]),
  access: z.enum(['free', 'pro']).optional().default('free'),
  featured: z.boolean().optional().default(false),
  order: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

export const overview = asyncHandler(async (_req, res) => {
  const [prompts, users, leads, orders] = await Promise.all([
    store.prompts.list(),
    store.users.list(),
    store.leads.list(),
    store.orders.list(),
  ]);

  const byDate = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  const paid = orders.filter((o) => o.status === 'paid');

  res.json({
    stats: {
      prompts: prompts.length,
      freePrompts: prompts.filter((p) => p.access === 'free').length,
      users: users.length,
      leads: leads.length,
      orders: orders.length,
      revenueCents: paid.reduce((total, o) => total + Number(o.amount || 0), 0),
    },
    recentLeads: [...leads].sort(byDate).slice(0, 6),
    recentOrders: [...orders].sort(byDate).slice(0, 6),
  });
});

export const adminListPrompts = asyncHandler(async (_req, res) => {
  const prompts = await store.prompts.list();
  res.json({ prompts: prompts.sort((a, b) => (a.order || 0) - (b.order || 0)) });
});

export const adminCreatePrompt = asyncHandler(async (req, res) => {
  const input = promptSchema.parse(req.body);
  const slug = slugify(input.slug || input.title);
  if (await store.prompts.findBySlug(slug)) throw new AppError('That slug is already in use.', 409);

  const prompt = await store.prompts.create({ ...input, slug });
  res.status(201).json({ prompt });
});

export const adminUpdatePrompt = asyncHandler(async (req, res) => {
  const input = promptSchema.parse(req.body);
  const existing = await store.prompts.findById(req.params.id);
  if (!existing) throw new AppError('Prompt not found.', 404);

  const slug = slugify(input.slug || input.title);
  const clash = await store.prompts.findBySlug(slug);
  if (clash && clash.id !== existing.id) throw new AppError('That slug is already in use.', 409);

  const prompt = await store.prompts.update(existing.id, { ...input, slug });
  res.json({ prompt });
});

export const adminDeletePrompt = asyncHandler(async (req, res) => {
  const prompt = await store.prompts.remove(req.params.id);
  if (!prompt) throw new AppError('Prompt not found.', 404);
  res.json({ ok: true });
});

export const adminListLeads = asyncHandler(async (_req, res) => {
  const leads = await store.leads.list();
  res.json({ leads: leads.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) });
});

export const adminListOrders = asyncHandler(async (_req, res) => {
  const orders = await store.orders.list();
  res.json({ orders: orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) });
});
