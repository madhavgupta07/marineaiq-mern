import { store } from '../store.js';
import { AppError, asyncHandler } from '../utils/index.js';

const canRead = (prompt, user) =>
  prompt.access === 'free' ||
  user?.plan === 'pro' ||
  Boolean(user?.unlockedPrompts?.includes(prompt.id));

const shape = (prompt, user) => {
  const unlocked = canRead(prompt, user);
  return {
    id: prompt.id,
    title: prompt.title,
    slug: prompt.slug,
    category: prompt.category,
    summary: prompt.summary,
    tags: prompt.tags || [],
    access: prompt.access,
    featured: Boolean(prompt.featured),
    order: prompt.order || 0,
    unlocked,
    body: unlocked ? prompt.body : null,
  };
};

export const listPrompts = asyncHandler(async (req, res) => {
  let prompts = await store.prompts.list();
  const { category, search, access } = req.query;

  if (category && category !== 'All') {
    prompts = prompts.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (access === 'free' || access === 'pro') {
    prompts = prompts.filter((p) => p.access === access);
  }
  if (search) {
    const term = String(search).toLowerCase();
    prompts = prompts.filter((p) =>
      [p.title, p.summary, p.category, ...(p.tags || [])].join(' ').toLowerCase().includes(term),
    );
  }

  prompts.sort((a, b) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
  res.json({
    prompts: prompts.map((p) => shape(p, req.user)),
    categories: [...new Set(prompts.map((p) => p.category))].sort(),
  });
});

export const getPrompt = asyncHandler(async (req, res) => {
  const prompt = await store.prompts.findBySlug(req.params.slug);
  if (!prompt) throw new AppError('Prompt not found.', 404);

  res.json({ prompt: shape(prompt, req.user) });
});
