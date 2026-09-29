/**
 * Relative API prefix used during local development.
 * Angular's dev proxy forwards /api/* to the FastAPI backend on port 8080.
 * Replace this value with the deployed backend URL when frontend/backend live on separate origins.
 */
export const API_BASE_URL = '/api';
