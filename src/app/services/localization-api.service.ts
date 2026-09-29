import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { TranslateRequest, TranslateResponse } from '../models/localization.models';

@Injectable({ providedIn: 'root' })
export class LocalizationApiService {
  private readonly http = inject(HttpClient);

  /**
   * Load the language-code to native-name mapping exposed by the backend.
   *
   * @returns Observable containing the available language mapping.
   */
  getLanguages(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${API_BASE_URL}/languages`);
  }

  /**
   * Send the English UI dictionary and target-language selection to FastAPI.
   *
   * @param request Source dictionary and target-language identifiers.
   * @returns Observable containing the translated dictionary and fallback metadata.
   */
  translate(request: TranslateRequest): Observable<TranslateResponse> {
    return this.http.post<TranslateResponse>(`${API_BASE_URL}/translate`, request);
  }
}
