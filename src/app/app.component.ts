import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { ENGLISH_UI, FALLBACK_LANGUAGES, UiStringKey } from './constants/ui-strings';
import { LanguageOption, TranslateRequest } from './models/localization.models';
import { AnalyticsApiService } from './services/analytics-api.service';
import { LocalizationApiService } from './services/localization-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly localizationApi = inject(LocalizationApiService);
  private readonly analyticsApi = inject(AnalyticsApiService);
  private readonly spinner = inject(NgxSpinnerService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @ViewChild('feedbackArea') private feedbackArea?: ElementRef<HTMLElement>;
  @ViewChild('positiveActions') private positiveActions?: ElementRef<HTMLElement>;
  @ViewChild('dislikeButton') private dislikeButton?: ElementRef<HTMLButtonElement>;

  readonly originalDictionary: Record<string, string> = { ...ENGLISH_UI };

  strings: Record<string, string> = { ...ENGLISH_UI };
  languageOptions: LanguageOption[] = this.toLanguageOptions(FALLBACK_LANGUAGES);
  selectedLanguageCode = '';
  customLanguageName = '';
  isLocalized = false;
  isLoading = false;
  pageDirection: 'ltr' | 'rtl' = 'ltr';

  dislikeMoved = false;
  dislikeX = 0;
  dislikeY = 0;

  /**
   * Record the page view and load the server-owned language list.
   *
   * @returns Nothing.
   */
  ngOnInit(): void {
    this.trackPageView();

    this.localizationApi.getLanguages().subscribe({
      next: (languages) => {
        this.languageOptions = this.toLanguageOptions(languages);
      },
      error: () => {
        void Swal.fire({
          title: this.t('language_list_error_title'),
          text: this.t('language_list_error_text'),
          icon: 'warning',
          confirmButtonColor: '#168a50'
        });
      }
    });
  }

  /**
   * Resolve one UI string from the currently active dictionary.
   *
   * @param key Stable English dictionary key.
   * @returns Current translated value, falling back to the original English value.
   */
  t(key: UiStringKey): string {
    const value = this.strings[key] ?? ENGLISH_UI[key];
    return value
      .replace('{russian}', 'Русский')
      .replace('{german}', 'Deutsch');
  }

  /**
   * Request localization from FastAPI and replace the page dictionary on success.
   * A manually entered native language name is sent alongside the dropdown choice;
   * the backend already gives that custom name precedence.
   *
   * @returns Nothing.
   */
  localize(): void {
    const customLanguage = this.customLanguageName.trim();
    if (!this.selectedLanguageCode && !customLanguage) {
      void Swal.fire({
        title: this.t('missing_language_title'),
        text: this.t('missing_language_text'),
        icon: 'info',
        confirmButtonColor: '#168a50'
      });
      return;
    }

    const request: TranslateRequest = {
      dictionary: this.originalDictionary
    };

    if (this.selectedLanguageCode) {
      request.language_code = this.selectedLanguageCode;
    }
    if (customLanguage) {
      request.language_name = customLanguage;
    }

    this.isLoading = true;
    this.spinner.show();

    this.localizationApi.translate(request)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.spinner.hide();
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (response) => {
          if (response.language_recognized === false) {
            this.strings = { ...ENGLISH_UI };
            this.pageDirection = 'ltr';
            this.isLocalized = false;
            this.dislikeMoved = false;

            void Swal.fire({
              title: this.t('language_not_recognized_title'),
              text: this.t('language_not_recognized_text'),
              icon: 'warning',
              confirmButtonColor: '#168a50'
            });
            return;
          }

          if (response.fallback) {
            this.strings = { ...ENGLISH_UI };
            this.pageDirection = 'ltr';
            this.isLocalized = false;
            void Swal.fire({
              title: this.t('localization_error_title'),
              text: response.error || this.t('localization_error_text'),
              icon: 'error',
              confirmButtonColor: '#168a50'
            });
            return;
          }

          this.strings = {
            ...ENGLISH_UI,
            ...response.dictionary
          };
          this.pageDirection = this.detectDirection(this.strings);
          this.isLocalized = true;
          this.dislikeMoved = false;

          // Schedule a normal Angular refresh instead of forcing a nested
          // change-detection pass while the current pass may still be running.
          this.changeDetector.markForCheck();
        },
        error: () => {
          void Swal.fire({
            title: this.t('server_error_title'),
            text: this.t('server_error_text'),
            icon: 'error',
            confirmButtonColor: '#168a50'
          });
        }
      });
  }

  /**
   * Show the normal positive feedback message.
   *
   * @returns Promise resolved when SweetAlert2 closes.
   */
  like(): Promise<unknown> {
    return Swal.fire({
      title: this.t('thank_you'),
      icon: 'success',
      timer: 1800,
      showConfirmButton: false
    });
  }

  /**
   * Show the stronger positive fedback message.
   *
   * @returns Promise resolved when SweetAlert2 closes.
   */
  love(): Promise<unknown> {
    return Swal.fire({
      title: this.t('big_thanks'),
      icon: 'success',
      timer: 2100,
      showConfirmButton: false
    });
  }

  /**
   * Move the negative-feedback button to a random safe position before the pointer lands on it.
   *
   * @param event Mouse/pointer event used to keep the new button rectangle away from the cursor.
   * @returns Nothing.
   */
  moveDislikeButton(event?: MouseEvent): void {
    const area = this.feedbackArea?.nativeElement;
    const positiveActions = this.positiveActions?.nativeElement;
    const button = this.dislikeButton?.nativeElement;
    if (!area || !positiveActions || !button) {
      return;
    }

    const areaRect = area.getBoundingClientRect();
    const positiveRect = positiveActions.getBoundingClientRect();
    const edgePadding = 12;
    const safetyMargin = 16;
    const maxX = Math.max(edgePadding, area.clientWidth - button.offsetWidth - edgePadding);
    const maxY = Math.max(edgePadding, area.clientHeight - button.offsetHeight - edgePadding);
    const pointerX = event ? event.clientX - areaRect.left : -1000;
    const pointerY = event ? event.clientY - areaRect.top : -1000;

    const blockedLeft = positiveRect.left - areaRect.left - safetyMargin;
    const blockedTop = positiveRect.top - areaRect.top - safetyMargin;
    const blockedRight = positiveRect.right - areaRect.left + safetyMargin;
    const blockedBottom = positiveRect.bottom - areaRect.top + safetyMargin;

    let nextX = edgePadding;
    let nextY = maxY;

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidateX = edgePadding + Math.random() * Math.max(0, maxX - edgePadding);
      const candidateY = edgePadding + Math.random() * Math.max(0, maxY - edgePadding);
      const candidateRight = candidateX + button.offsetWidth;
      const candidateBottom = candidateY + button.offsetHeight;

      const overlapsPositiveActions =
        candidateX < blockedRight &&
        candidateRight > blockedLeft &&
        candidateY < blockedBottom &&
        candidateBottom > blockedTop;

      const pointerWouldTouchButton =
        pointerX >= candidateX - safetyMargin &&
        pointerX <= candidateRight + safetyMargin &&
        pointerY >= candidateY - safetyMargin &&
        pointerY <= candidateBottom + safetyMargin;

      if (!overlapsPositiveActions && !pointerWouldTouchButton) {
        nextX = candidateX;
        nextY = candidateY;
        break;
      }
    }

    this.dislikeX = nextX;
    this.dislikeY = nextY;
    this.dislikeMoved = true;
  }

  /**
   * Record the current page view without interrupting the user if analytics fails.
   *
   * @returns Nothing.
   */
  private trackPageView(): void {
    this.analyticsApi
      .trackPageView(window.location.pathname || '/', this.getReferrerOrigin())
      .subscribe({
        error: () => {
          // Analytics must never affect the application experience.
        }
      });
  }

  /**
   * Reduce the browser referrer to its origin before sending it to the backend.
   *
   * @returns Referrer origin, or null for direct/invalid referrers.
   */
  private getReferrerOrigin(): string | null {
    if (!document.referrer) {
      return null;
    }

    try {
      return new URL(document.referrer).origin;
    } catch {
      return null;
    }
  }

  /**
   * Convert a backend language mapping into sorted dropdown options.
   *
   * @param languages Mapping of language codes to self-names.
   * @returns Alphabetically sorted language options.
   */
  private toLanguageOptions(languages: Readonly<Record<string, string>>): LanguageOption[] {
    return Object.entries(languages)
      .map(([code, name]) => ({ code, name }))
      .sort((left, right) => left.name.localeCompare(right.name));
  }

  /**
   * Detect whether the translated UI is predominantly Hebrew/Arabic-script text.
   *
   * @param dictionary Current translated UI dictionary.
   * @returns RTL when right-to-left script characters dominate; otherwise LTR.
   */
  private detectDirection(dictionary: Record<string, string>): 'ltr' | 'rtl' {
    const text = Object.values(dictionary).join(' ');
    const rtlCount = (text.match(/[\u0590-\u08FF]/g) ?? []).length;
    const latinCount = (text.match(/[A-Za-z0À-ž]/g) ?? []).length;
    return rtlCount > latinCount ? 'rtl' : 'ltr';
  }
}
