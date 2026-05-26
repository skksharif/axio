import { API_BASE_URL } from '@app/config/env';

export const authService = {
  async signUp({ email, password, firstName, lastName }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password, firstName, lastName }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async signIn({ email, password }) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async signOut() {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  },
};
