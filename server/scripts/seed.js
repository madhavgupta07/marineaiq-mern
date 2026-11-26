import { store } from '../src/store.js';
import { env } from '../src/config/env.js';

await store.init();
console.log(`Seeded ${(await store.prompts.list()).length} prompts and admin ${env.adminEmail}.`);
console.log(`Storage mode: ${store.mode()}`);
await store.close();
process.exit(0);
