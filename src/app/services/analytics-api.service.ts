import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_BASE_URL, IS_LOCAL_DEV } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private readonly http = inject(HttpClient);

  /**
   * The public demo's HTTPS ingress intentionally does not expose analytics.
   * Keep the legacy dev-only endpoint without sending extra requests from
   * Render to VPS or depending on the old Render backend.
   */
  trackPageView(path: string, referrer: string | null): Observable<void> {
    if (!IS_LOCAL_DEV) {
      return of(undefined);
    }
    return this.http.post<void>(`${API_BASE_URL}/analytics/pageview`, {path, referrer});
  }
}
