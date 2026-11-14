import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, IS_LOCAL_DEV } from '../config/api.config';
import { TranslateRequest, TranslateResponse } from '../models/localization.models';

@Injectable({ providedIn: 'root' })
export class LocalizationApiService {
  private readonly http = inject(HttpClient);

  getLanguages(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${API_BASE_URL}/languages`);
  }

  translate(request: TranslateRequest): Observable<TranslateResponse> {
    // Local dev keeps the existing FastAPI /translate contract.
    if (IS_LOCAL_DEV) {
      return this.http.post<TranslateResponse>(`${API_BASE_URL}/translate`, request);
    }

    // The public endpoint accepts ONLY language choice and uses a fixed
    // server-owned source dictionary. No browser API key, no arbitrary text.
    return this.http.post<TranslateResponse>(`${API_BASE_URL}/public-demo/translate`, {
      language_code: request.language_code,
      language_name: request.language_name,
    });
  }
}
