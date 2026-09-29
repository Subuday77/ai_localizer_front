import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private readonly http = inject(HttpClient);

  /**
   * Record one anonymous page view without blocking the UI.
   *
   * @param path Current frontend path.
   * @param referrer Referrer origin, or null for a direct visit.
   * @returns Observable that completes after the backend records the event.
   */
  trackPageView(path: string, referrer: string | null): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/analytics/pageview`, {
      path,
      referrer
    });
  }
}
