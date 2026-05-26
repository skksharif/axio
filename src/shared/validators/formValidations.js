export const validators = {
  required: (val) =>
    (!val || !String(val).trim()) ? 'This field is required.' : null,

  email: (val) => {
    if (!val) return 'Email is required.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ? null
      : 'Enter a valid email address.';
  },

  phone: (val) => {
    if (!val) return 'Phone number is required.';
    return /^[\d\s+\-().]{8,}$/.test(val)
      ? null
      : 'Enter a valid phone number.';
  },

  password: (val) => {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    return null;
  },

  dob: (val) => {
    if (!val) return 'Date of birth is required.';
    return /^\d{2}\/\d{2}\/\d{4}$/.test(val)
      ? null
      : 'Use DD/MM/YYYY format.';
  },

  positiveNumber: (val) => {
    const n = Number(val);
    return (!val || isNaN(n) || n < 0)
      ? 'Enter a valid positive number.'
      : null;
  },

  minLength: (min) => (val) =>
    val && val.length >= min ? null : `Must be at least ${min} characters.`,

  maxLength: (max) => (val) =>
    !val || val.length <= max ? null : `Must be no more than ${max} characters.`,
};

export function validateField(name, value) {
  const rules = {
    email:     validators.email,
    mobile:    validators.phone,
    password:  validators.password,
    dob:       validators.dob,
    firstName: validators.required,
    lastName:  validators.required,
  };
  return rules[name] ? rules[name](value) : null;
}

export function sanitize(str) {
  return String(str || '').replace(/[<>'"]/g, '');
}
