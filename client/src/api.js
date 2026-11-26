export async function api(path, { method = 'GET', body, headers = {}, ...options } = {}) {
  let response;

  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the API. Is the server running?');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data;
}
