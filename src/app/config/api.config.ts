/**
 * API base URL used by the localization client.
 *
 * Local development keeps the existing Angular dev proxy (/api -> localhost:8080).
 * The deployed static site calls the public Render backend directly.
 */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

export const API_BASE_URL = LOCAL_HOSTS.has(window.location.hostname)
  ? '/api'
  : 'https://ai-localizer-api.onrender.com';
