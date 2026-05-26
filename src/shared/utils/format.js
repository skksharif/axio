export function fmt(n) {
  return '$' + Math.round(n).toLocaleString();
}

export function calcRepay(amt, termMonths, rateAnnual) {
  const r = rateAnnual / 12;
  const n = termMonths || 0;
  if (n === 0 || amt === 0) return 0;
  return Math.round((amt * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export function getRate(loanType, vehicleCondition, securityType) {
  if (loanType === 'car') {
    return { new: 0.0599, used: 0.0699, demo: 0.0629 }[vehicleCondition] || 0.0599;
  }
  return securityType === 'secured' ? 0.0649 : 0.0849;
}

export function getRateLabel(loanType, vehicleCondition, securityType) {
  if (loanType === 'car') {
    return (({ new: '5.99', used: '6.99', demo: '6.29' }[vehicleCondition]) || '5.99') + '% p.a.';
  }
  return (securityType === 'secured' ? 'Secured from 6.49%' : 'Unsecured from 8.49%') + ' p.a.';
}

export function getInitials(firstName, lastName) {
  return ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || '?';
}

export function formatCurrency(value, currency = 'AUD', locale = 'en-AU') {
  return new Intl.NumberFormat(locale, {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

export function formatTerm(months) {
  if (months < 12) return `${months} mo`;
  const years = months / 12;
  return years % 1 === 0 ? `${years} yr` : `${years.toFixed(1)} yr`;
}
