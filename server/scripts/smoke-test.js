// End-to-end check against a running API: node scripts/smoke-test.js
const base = process.env.API_URL || 'http://localhost:5000';
let failures = 0;

async function request(path, { method = 'GET', body, cookie } = {}) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  const cookieHeader = (response.headers.getSetCookie?.() || [])
    .map((item) => item.split(';')[0])
    .join('; ');
  return { status: response.status, data, cookie: cookieHeader || cookie };
}

function check(label, condition, detail = '') {
  const ok = Boolean(condition);
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`);
}

const health = await request('/health');
check('health endpoint', health.status === 200 && health.data.ok);

const list = await request('/prompts');
check('prompt list', list.data.prompts?.length > 0, `${list.data.prompts?.length} prompts`);
const freeSlug = list.data.prompts.find((p) => p.access === 'free')?.slug;
const free = await request(`/prompts/${freeSlug}`);
check('free prompt body visible', free.data.prompt?.body?.length > 20);

const proSlug = list.data.prompts.find((p) => p.access === 'pro')?.slug;
const locked = await request(`/prompts/${proSlug}`);
check('pro prompt locked for guests', locked.data.prompt?.body === null);

const lead = await request('/leads', {
  method: 'POST',
  body: { email: 'smoke@example.com', role: 'Marine engineer', source: 'contact' },
});
check('lead capture', lead.status === 201 && lead.data.ok);

const email = `smoke-${Date.now()}@example.com`;
const registered = await request('/auth/register', {
  method: 'POST',
  body: { name: 'Smoke Tester', email, password: 'smoke-test-pass' },
});
check('registration', registered.status === 201 && registered.data.user?.plan === 'free');
const userCookie = registered.cookie;

const me = await request('/auth/me', { cookie: userCookie });
check('authenticated me', me.status === 200 && me.data.user?.email === email);

const order = await request('/checkout/orders', { method: 'POST', cookie: userCookie });
check('mock order creation', order.status === 201 && order.data.order?.amount === 4900);

const confirmed = await request(`/checkout/orders/${order.data.order?.id}/confirm`, {
  method: 'POST',
  cookie: userCookie,
});
check('mock payment unlocks library', confirmed.data.user?.plan === 'pro');

const unlocked = await request(`/prompts/${proSlug}`, { cookie: userCookie });
check('pro prompt body visible after unlock', unlocked.data.prompt?.body?.length > 20);

const adminLogin = await request('/auth/login', {
  method: 'POST',
  body: { email: 'admin@marineaiq.local', password: process.env.ADMIN_PASSWORD || 'change-me-now' },
});
check('admin login', adminLogin.status === 200 && adminLogin.data.user?.role === 'admin');

const overview = await request('/admin/overview', { cookie: adminLogin.cookie });
check('admin overview', overview.status === 200 && overview.data.stats?.prompts > 0);

const denied = await request('/admin/overview', { cookie: userCookie });
check('admin route denies regular user', denied.status === 403);

await request('/auth/logout', { method: 'POST', cookie: userCookie });

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
