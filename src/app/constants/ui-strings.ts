export const ENGLISH_UI = {
  brand: 'AI Localizer',
  welcome: 'Welcome',
  hero_title: 'Make this page speak your language.',
  explanation: 'Choose a language below and let AI localize the interface in seconds. English always remains available as a safe fallback.',
  language_label: 'Choose a language',
  language_placeholder: 'Select a language',
  custom_language_label: "Can't find your language in the list? Enter its native name here. For example, {russian} or {german}.",
  custom_language_placeholder: 'Type the native language name',
  localize_button: 'Localize this page',
  spinner_text: 'Localizing with AI…',
  feedback_title: 'How does it look?',
  like_button: 'I like it',
  love_button: 'I really like it',
  dislike_button: "I don't like it",
  thank_you: 'Thank you!',
  big_thanks: 'Thank you very much!',
  missing_language_title: 'Choose a language',
  missing_language_text: 'Select a language or enter its native name first.',
  language_not_recognized_title: 'Language not recognized',
  language_not_recognized_text: "We couldn't identify that language. Please enter the name of a real language, preferably in that language itself.",
  localization_error_title: 'Localization unavailable',
  localization_error_text: "We couldn't translate the page. The English version is still available.",
  server_error_title: 'Server error',
  server_error_text: "We couldn't reach the localization service. Please try again.",
  language_list_error_title: 'Language list unavailable',
  language_list_error_text: 'The server language list could not be loaded. You can still type a language name below.'
} as const;

export type UiStringKey = keyof typeof ENGLISH_UI;

export const FALLBACK_LANGUAGES = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  he: 'עברית',
  ar: 'العربية',
  ja: '日本語',
  zh: '中文'
} as const;
