import dotenv from 'dotenv';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

const number = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: number(process.env.PORT, 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-change-me-before-deploying',
  jwtExpiresIn: '7d',
  mongoUri: process.env.MONGO_URI || '',
  cookieSameSite: process.env.COOKIE_SAMESITE || 'lax',
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@marineaiq.local').toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || 'change-me-now',
  isProduction: process.env.NODE_ENV === 'production',
};
