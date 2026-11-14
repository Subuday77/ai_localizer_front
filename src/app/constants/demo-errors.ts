/**
 * These messages are bundled locally, not added to the translated UI dictionary.
 * The public demo translates a fixed server-owned dictionary, so adding new keys
 * to its request payload would be rejected or out of sync.
 */
export const DEMO_LIMIT_MESSAGES: Record<string, { title: string; text: string }> = {
  en: {
    title: 'Demo limit reached',
    text: 'The public demo has reached a temporary request limit. Please try again later.'
  },
  ru: {
    title: 'Лимит демо исчерпан',
    text: 'Достигнут лимит запросов к демо. Попробуйте позже.'
  },
  de: {
    title: 'Demo-Limit erreicht',
    text: 'Das öffentliche Demo hat sein Anfragelimit erreicht. Bitte versuche es später erneut.'
  },
  fr: {
    title: 'Limite de la démo atteinte',
    text: 'La démo publique a atteint sa limite de requêtes. Veuillez réessayer plus tard.'
  },
  es: {
    title: 'Límite de la demo alcanzado',
    text: 'La demo pública ha alcanzado su límite de solicitudes. Inténtalo de nuevo más tarde.'
  },
  it: {
    title: 'Limite della demo raggiunto',
    text: 'La demo pubblica ha raggiunto il limite di richieste. Riprova più tardi.'
  },
  pt: {
    title: 'Limite da demonstração atingido',
    text: 'A demonstração pública atingiu o limite de pedidos. Tente novamente mais tarde.'
  },
  he: {
    title: 'הגעת למגבלת ההדגמה',
    text: 'ההדגמה הציבורית הגיעה למגבלת הבקשות. אפשר לנסות שוב מאוחר יותר.'
  },
  ar: {
    title: 'تم الوصول إلى حد العرض التجريبي',
    text: 'وصل العرض التجريبي العام إلى حد الطلبات. يُرجى المحاولة لاحقًا.'
  },
  ja: {
    title: 'デモの利用上限に達しました',
    text: '公開デモのリクエスト上限に達しました。しばらくしてから再度お試しください。'
  },
  zh: {
    title: '已达到演示使用上限',
    text: '公开演示已达到请求上限，请稍后再试。'
  }
};
