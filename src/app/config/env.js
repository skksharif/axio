export const ENV = {
  isDev:  import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode:   import.meta.env.MODE,
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const FEATURE_FLAGS = {
  enableAI:           true,
  enableBankConnect:  true,
  enableDocUpload:    true,
  enableJointApplicant: true,
};
