import { API_BASE_URL } from '@app/config/env';

export const onboardingService = {
  async saveProgress(screenId, data) {
    if (!API_BASE_URL) return;
    await fetch(`${API_BASE_URL}/onboarding/progress`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ screenId, data }),
    });
  },

  async submitApplication(applicationData) {
    if (!API_BASE_URL) return { id: 'mock-application-id' };
    const res = await fetch(`${API_BASE_URL}/onboarding/submit`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(applicationData),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
