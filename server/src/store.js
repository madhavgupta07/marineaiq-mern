import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { Lead, Order, Prompt, User } from './db/models.js';
import { seedPrompts } from './data/seedPrompts.js';

// On Vercel the filesystem is read-only, so the JSON fallback lives in the
// ephemeral temp directory. Data there does not survive cold starts — set
// MONGO_URI for any real deployment.
const isServerless = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const filePath = isServerless
  ? path.join(os.tmpdir(), 'marineaiq-db.json')
  : fileURLToPath(new URL('../data/db.json', import.meta.url));
const fileUrl = pathToFileURL(filePath);
const collections = { users: User, prompts: Prompt, leads: Lead, orders: Order };

let mode = 'file';
let initPromise = null;
let db = { users: [], prompts: [], leads: [], orders: [] };

const now = () => new Date().toISOString();
const newId = () => crypto.randomUUID();

const normalize = (doc) => {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  return { ...rest, id: String(_id ?? rest.id) };
};

function readFileDb() {
  try {
    const parsed = JSON.parse(fs.readFileSync(fileUrl, 'utf8'));
    db = {
      users: parsed.users || [],
      prompts: parsed.prompts || [],
      leads: parsed.leads || [],
      orders: parsed.orders || [],
    };
  } catch {
    db = { users: [], prompts: [], leads: [], orders: [] };
  }
}

function writeFileDb() {
  if (!isServerless) fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
}

function matches(item, filter) {
  return Object.entries(filter)
    .filter(([, value]) => value !== undefined)
    .every(([key, value]) => String(item[key]) === String(value));
}

// Controllers always filter by the public `id` field; MongoDB stores it as `_id`.
function mongoFilter(filter) {
  const { id, ...rest } = filter;
  if (id === undefined) return rest;
  if (!mongoose.Types.ObjectId.isValid(String(id))) return null;
  return { ...rest, _id: id };
}

async function list(collection, filter = {}) {
  if (mode === 'mongo') {
    const query = mongoFilter(filter);
    if (query === null) return [];
    return (await collections[collection].find(query).lean()).map(normalize);
  }
  return db[collection].filter((item) => matches(item, filter)).map(normalize);
}

async function findOne(collection, filter) {
  if (mode === 'mongo') {
    const query = mongoFilter(filter);
    if (query === null) return null;
    return normalize(await collections[collection].findOne(query).lean());
  }
  const found = db[collection].find((item) => matches(item, filter));
  return normalize(found);
}

async function create(collection, data) {
  if (mode === 'mongo') {
    return normalize(await collections[collection].create(data));
  }
  const doc = { id: newId(), ...data, createdAt: now(), updatedAt: now() };
  db[collection].push(doc);
  writeFileDb();
  return normalize(doc);
}

async function update(collection, id, patch) {
  if (mode === 'mongo') {
    return normalize(
      await collections[collection].findByIdAndUpdate(id, patch, { new: true, runValidators: true }).lean(),
    );
  }
  const index = db[collection].findIndex((item) => item.id === String(id));
  if (index === -1) return null;
  db[collection][index] = { ...db[collection][index], ...patch, updatedAt: now() };
  writeFileDb();
  return normalize(db[collection][index]);
}

async function remove(collection, id) {
  if (mode === 'mongo') {
    return normalize(await collections[collection].findByIdAndDelete(id).lean());
  }
  const index = db[collection].findIndex((item) => item.id === String(id));
  if (index === -1) return null;
  const [deleted] = db[collection].splice(index, 1);
  writeFileDb();
  return normalize(deleted);
}

async function seedDefaults() {
  const existing = await findOne('users', { email: env.adminEmail });
  if (!existing) {
    await create('users', {
      name: 'MarineAIQ Admin',
      email: env.adminEmail,
      passwordHash: await bcrypt.hash(env.adminPassword, 12),
      role: 'admin',
      plan: 'pro',
      unlockedPrompts: [],
    });
  }

  for (const prompt of seedPrompts) {
    const found = await findOne('prompts', { slug: prompt.slug });
    if (found) await update('prompts', found.id, prompt);
    else await create('prompts', prompt);
  }
}

export const store = {
  async init() {
    if (!initPromise) {
      initPromise = (async () => {
        if (env.mongoUri) {
          await mongoose.connect(env.mongoUri, {
            maxPoolSize: 20,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
          });
          mode = 'mongo';
          console.log('[db] Connected to MongoDB');
        } else {
          readFileDb();
          mode = 'file';
          console.log(
            `[db] No MONGO_URI set — using JSON store (${
              isServerless ? 'ephemeral temp directory' : 'server/data/db.json'
            })`,
          );
        }
        await seedDefaults();
      })().catch((error) => {
        initPromise = null; // allow a retry after a failed connection
        throw error;
      });
    }
    return initPromise;
  },
  close() {
    return mongoose.connection.close();
  },
  mode: () => mode,
  users: {
    findByEmail: (email) => findOne('users', { email: String(email).toLowerCase() }),
    findById: (id) => findOne('users', { id }),
    list: () => list('users'),
    create: (data) => create('users', data),
    update: (id, patch) => update('users', id, patch),
  },
  prompts: {
    list: () => list('prompts'),
    findById: (id) => findOne('prompts', { id }),
    findBySlug: (slug) => findOne('prompts', { slug }),
    create: (data) => create('prompts', data),
    update: (id, patch) => update('prompts', id, patch),
    remove: (id) => remove('prompts', id),
  },
  leads: {
    create: (data) => create('leads', data),
    list: () => list('leads'),
  },
  orders: {
    create: (data) => create('orders', data),
    findById: (id) => findOne('orders', { id }),
    list: () => list('orders'),
    update: (id, patch) => update('orders', id, patch),
  },
};
