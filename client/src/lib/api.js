const api = (token) => {
  console.log('[VITE_API_URL en runtime]', import.meta.env.VITE_API_URL);

  const base = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  return {
    get:  (p) => fetch(base + p, { headers }),
    post: (p, body) => fetch(base + p, { method: 'POST', headers, body: JSON.stringify(body) }),
    patch:(p, body) => fetch(base + p, { method: 'PATCH', headers, body: JSON.stringify(body) }),
    del:  (p) => fetch(base + p, { method: 'DELETE', headers })
  };
}

export default api;
