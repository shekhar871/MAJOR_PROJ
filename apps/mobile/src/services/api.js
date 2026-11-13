let token = null;
let baseUrl = 'http://localhost:4000/api';

export function configureApi(newToken, newUrl) {
  if (newToken) token = newToken;
  if (newUrl) baseUrl = newUrl;
}

export async function apiRequest(endpoint, options = {}) {
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!options.isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Request failed');
  return data;
}
