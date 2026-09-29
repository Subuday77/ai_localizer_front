# AI Localizer Front

Angular frontend for the AI Localizer FastAPI backend.

## Stack

- Angular 21 (standalone application)
- SweetAlert2 for feedback and error popups
- ngx-spinner for the full-screen localization loader
- FastAPI backend expected on `127.0.0.1:8080` during local development

## Local run

Start the backend first on port 8080, then:

```bash
npm install
npm start
```

Open `http://localhost:4200`.

The Angular dev server proxies `/api/*` to `http://127.0.0.1:8080/*`, so local development does not require CORS changes in FastAPI.

## Localization flow

The page keeps one English source dictionary in `src/app/constants/ui-strings.ts`. The frontend sends that dictionary to `POST /translate` together with the selected language code and/or a manually typed native language name. A typed name takes precedence on the backend.

On a successful response the current UI dictionary is replaced with the translated one. If the backend reports `fallback=true`, the English dictionary stays active and SweetAlert2 shows the error. While a translation request is in progress, ngx-spinner covers the page and the inputs are disabled. The spinner uses the `ball-triangle-path` animation, with its CSS loaded explicitly in `angular.json`. If the backend returns `language_recognized=false`, SweetAlert2 reports that the language could not be identified and the English UI remains active.

## Production API URL

For localhost, `src/app/config/api.config.ts` contains:

```ts
export const API_BASE_URL = '/api';
```

Before deploying the frontend separately from the backend, replace it with the public FastAPI origin (or configure an equivalent reverse proxy) and enable the corresponding CORS origin in FastAPI.
