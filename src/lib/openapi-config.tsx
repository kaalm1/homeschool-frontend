import { OpenAPI } from '@/generated-api';

export function initOpenAPI() {
  OpenAPI.BASE = import.meta.env.VITE_API_URL;

  OpenAPI.TOKEN = async (): Promise<string> => {
    // Return empty string if no token; the client will skip Authorization header
    return localStorage.getItem('token') || '';
  };
}
