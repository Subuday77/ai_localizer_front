/**
 * Local development keeps the Angular dev proxy to localhost FastAPI.
 * Render's public static frontend talks to the existing HTTPS VPS host.
 * No paid API keys or OpenAI credentials may ever be placed in browser code.
 */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
export const IS_LOCAL_DEV = LOCAL_HOSTS.has(window.location.hostname);

export const API_BASE_URL = IS_LOCAL_DEV
  ? '/api'
  : 'https://v2202611457040557919.quicksrv.de';
