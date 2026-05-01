/**
 * services/api.js
 * Thin fetch wrapper that injects the JWT from localStorage automatically.
 * All other JSX files import from this module via window.api.
 */

const BASE_URL = '';  // Same origin (Express serves both API and client)

const getToken = () => localStorage.getItem('dispensary_token');

const request = async (method, path, body = null, isFormData = false) => {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const opts = { method, headers };
  if (body) opts.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
};

window.api = {
  get:    (path)              => request('GET',    path),
  post:   (path, body)        => request('POST',   path, body),
  patch:  (path, body)        => request('PATCH',  path, body),
  delete: (path)              => request('DELETE', path),
  upload: (path, formData)    => request('POST',   path, formData, true),

  // Auth helpers
  setToken: (token) => localStorage.setItem('dispensary_token', token),
  getToken,
  clearToken: () => localStorage.removeItem('dispensary_token'),

  setUser: (user) => localStorage.setItem('dispensary_user', JSON.stringify(user)),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('dispensary_user')); }
    catch { return null; }
  },
  clearUser: () => localStorage.removeItem('dispensary_user'),
};
