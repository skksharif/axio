import { API_BASE_URL } from '@app/config/env';
import { LENDERS }      from '@shared/data/lenders';

export const lenderService = {
  /** Returns mock lender matches (replace with real API call when available). */
  async getMatches({ loanAmount, loanType, securityType }) {
    if (API_BASE_URL) {
      const res = await fetch(`${API_BASE_URL}/lenders/match`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ loanAmount, loanType, securityType }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
    // Mock fallback
    return LENDERS;
  },

  async getLenderById(id) {
    return LENDERS.find((l) => l.id === id) ?? null;
  },
};
