import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { COOKIE_NAME, cookieOptions, signToken } from '../middleware/auth.js';
import { store } from '../store.js';
import { AppError, asyncHandler, publicUser } from '../utils/index.js';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const register = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const email = input.email.toLowerCase();

  if (await store.users.findByEmail(email)) {
    throw new AppError('An account with that email already exists.', 409);
  }

  const user = await store.users.create({
    name: input.name,
    email,
    passwordHash: await bcrypt.hash(input.password, 12),
    role: 'user',
    plan: 'free',
    unlockedPrompts: [],
  });

  res.cookie(COOKIE_NAME, signToken(user), cookieOptions);
  res.status(201).json({ user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const user = await store.users.findByEmail(input.email.toLowerCase());

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError('Incorrect email or password.', 401);
  }

  res.cookie(COOKIE_NAME, signToken(user), cookieOptions);
  res.json({ user: publicUser(user) });
});

export const logout = (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
};

export const me = (req, res) => {
  res.json({ user: publicUser(req.user) });
};
