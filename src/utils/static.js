import { API_CONFIG } from "../config/api";

export const getStaticUrl = (path) => {
  return `${API_CONFIG.BASE_URL}/static/${path}`;
};

export const getImageUrl = (filename) => {
  return getStaticUrl(`img/${filename}`);
};
