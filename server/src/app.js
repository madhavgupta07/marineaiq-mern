import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import routes from './routes/index.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down.' },
  }),
);

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'marineaiq-api' }));
app.use('/api', routes);
app.use('/api', notFound);

// Serve the built React app when running a single process or a Vercel function.
const distCandidates = [
  fileURLToPath(new URL('../../client/dist/', import.meta.url)),
  path.join(process.cwd(), 'client/dist'),
  path.join(process.cwd(), '../client/dist'),
];
const distPath = distCandidates.find((candidate) => fs.existsSync(path.join(candidate, 'index.html')));

if (distPath) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.use(errorHandler);

export default app;
