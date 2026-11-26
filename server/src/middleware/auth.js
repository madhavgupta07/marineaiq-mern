import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { store } from '../store.js';
import { AppError, asyncHandler } from '../utils/index.js';

export const COOKIE_NAME = 'maiq_token';

export const cookieOptions = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const tokenFrom = (req) => {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;
  return bearer || req.cookies?.[COOKIE_NAME] || null;
};

// Public routes use this to personalise results without requiring a session.
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = tokenFrom(req);
  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = (await store.users.findById(decoded.sub)) || undefined;
    } catch {
      req.user = undefined;
    }
  }
  next();
});

export const protect = asyncHandler(async (req, _res, next) => {
  const token = tokenFrom(req);

  if (!token) throw new AppError('Please sign in to continue.', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError('Your session has expired. Please sign in again.', 401);
  }

  const user = await store.users.findById(decoded.sub);
  if (!user) throw new AppError('Account not found. Please sign in again.', 401);

  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') return next(new AppError('Admin access required.', 403));
  next();
};
