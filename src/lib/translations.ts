import { Locale, Translatable } from '@/types/api';

/**
 * Get translated text from backend translatable object
 * Falls back to title/description if no translation available
 * @param item - The translatable object from backend
 * @param field - Which field to translate ('title' | 'description')
 * @param locale - Current locale
 * @returns Translated text
 */
export function getTranslatedText<T extends Translatable>(
  item: T,
  field: 'title' | 'description',
  locale: Locale
): string {
  if (!item) return '';

  const translationsField = field === 'title' ? 'titleTranslations' : 'descriptionTranslations';
  const defaultField = field;

  // Get translations object
  const translations = item[translationsField];
  
  // If translations exist and locale is available, use it
  if (translations && translations[locale]) {
    return translations[locale];
  }

  // Fall back to default locale if available
  if (translations && item.defaultLocale && translations[item.defaultLocale]) {
    return translations[item.defaultLocale];
  }

  // Fall back to the default field value
  return item[defaultField] || '';
}

/**
 * Get translated title from backend object
 * @param item - Translatable object
 * @param locale - Current locale
 * @returns Translated title
 */
export function getTranslatedTitle<T extends Translatable>(
  item: T,
  locale: Locale
): string {
  return getTranslatedText(item, 'title', locale);
}

/**
 * Get translated description from backend object
 * @param item - Translatable object
 * @param locale - Current locale
 * @returns Translated description
 */
export function getTranslatedDescription<T extends Translatable>(
  item: T,
  locale: Locale
): string {
  return getTranslatedText(item, 'description', locale);
}

/**
 * Check if a locale is supported by the backend object
 * @param item - Translatable object
 * @param locale - Locale to check
 * @returns Whether locale is supported
 */
export function isLocaleSupported<T extends Translatable>(
  item: T,
  locale: Locale
): boolean {
  return item.supportedLocales?.includes(locale) || false;
}

/**
 * Get the best available locale for an object
 * Prioritizes: requested locale -> default locale -> first supported locale
 * @param item - Translatable object
 * @param requestedLocale - Preferred locale
 * @returns Best available locale
 */
export function getBestAvailableLocale<T extends Translatable>(
  item: T,
  requestedLocale: Locale
): Locale {
  // If requested locale is supported, use it
  if (isLocaleSupported(item, requestedLocale)) {
    return requestedLocale;
  }

  // Fall back to default locale if supported
  if (item.defaultLocale && isLocaleSupported(item, item.defaultLocale)) {
    return item.defaultLocale;
  }

  // Fall back to first supported locale
  if (item.supportedLocales && item.supportedLocales.length > 0) {
    return item.supportedLocales[0];
  }

  // Ultimate fallback
  return requestedLocale;
}

/**
 * Get direction for a translated item based on locale
 * @param item - Translatable object
 * @param locale - Current locale
 * @returns Text direction
 */
export function getTranslatedDirection<T extends Translatable>(
  item: T,
  locale: Locale
): 'ltr' | 'rtl' {
  const effectiveLocale = getBestAvailableLocale(item, locale);
  return effectiveLocale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Get all available translations for a field
 * @param item - Translatable object
 * @param field - Field to get translations for
 * @returns Object with locale-translation pairs
 */
export function getAllTranslations<T extends Translatable>(
  item: T,
  field: 'title' | 'description'
): Record<Locale, string> {
  const translationsField = field === 'title' ? 'titleTranslations' : 'descriptionTranslations';
  const translations = item[translationsField] || {};
  const defaultField = field;

  // Create result with all supported locales
  const result: Partial<Record<Locale, string>> = {};

  for (const locale of item.supportedLocales || []) {
    result[locale] = translations[locale] || item[defaultField] || '';
  }

  return result as Record<Locale, string>;
}

/**
 * Check if item has any translations
 * @param item - Translatable object
 * @returns Whether item has translation data
 */
export function hasTranslations<T extends Translatable>(item: T): boolean {
  return !!(
    (item.titleTranslations && Object.keys(item.titleTranslations).length > 0) ||
    (item.descriptionTranslations && Object.keys(item.descriptionTranslations).length > 0)
  );
}

/**
 * Get translation completeness for an item
 * @param item - Translatable object
 * @returns Object with completion status for each field
 */
export function getTranslationCompleteness<T extends Translatable>(item: T): {
  title: Record<Locale, boolean>;
  description: Record<Locale, boolean>;
  overall: number;
} {
  const supportedLocales = item.supportedLocales || [];
  const titleCompleteness: Partial<Record<Locale, boolean>> = {};
  const descriptionCompleteness: Partial<Record<Locale, boolean>> = {};

  let totalFields = supportedLocales.length * 2; // title + description for each locale
  let completedFields = 0;

  for (const locale of supportedLocales) {
    const hasTitle = !!(item.titleTranslations?.[locale]);
    const hasDescription = !!(item.descriptionTranslations?.[locale]);

    titleCompleteness[locale] = hasTitle;
    descriptionCompleteness[locale] = hasDescription;

    if (hasTitle) completedFields++;
    if (hasDescription) completedFields++;
  }

  return {
    title: titleCompleteness as Record<Locale, boolean>,
    description: descriptionCompleteness as Record<Locale, boolean>,
    overall: totalFields > 0 ? (completedFields / totalFields) * 100 : 0
  };
}
