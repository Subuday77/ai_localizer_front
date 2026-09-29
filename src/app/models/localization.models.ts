export interface LanguageOption {
  code: string;
  name: string;
}

export interface TranslateRequest {
  dictionary: Record<string, string>;
  language_code?: string;
  language_name?: string;
}

export interface TranslateResponse {
  dictionary: Record<string, string>;
  language: string;
  language_recognized: boolean | null;
  fallback: boolean;
  error: string | null;
}
