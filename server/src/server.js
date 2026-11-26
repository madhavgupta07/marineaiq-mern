import app from './app.js';
import { env } from './config/env.js';
import { store } from './store.js';

await store.init();

app.listen(env.port, () => {
  console.log(`[api] http://localhost:${env.port}`);
  console.log(`[api] storage: ${store.mode()}`);
});
