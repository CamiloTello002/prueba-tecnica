export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log({ API_BASE_URL })
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SIGNUP: `${API_BASE_URL}/user/register`,
};

export const COMPANY_ENDPOINTS = {
  BASE: `${API_BASE_URL}/company`,
  DETAIL: (id: string) => `${API_BASE_URL}/company/${id}`,
};

export const PRODUCT_ENDPOINTS = {
  BASE: `${API_BASE_URL}/products`,
  DETAIL: (id: string) => `${API_BASE_URL}/products/${id}`,
  AI_DESCRIPTION: `${API_BASE_URL}/ai/generate-description`
};

export const INVENTORY_ENDPOINTS = {
  BASE: `${API_BASE_URL}/inventory`,
  DETAIL: (id: string) => `${API_BASE_URL}/inventory/${id}`,
};
