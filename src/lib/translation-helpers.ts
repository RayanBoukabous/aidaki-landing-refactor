import { Locale, Translatable } from '@/types/api';
import { getTranslatedTitle, getTranslatedDescription } from '@/lib/translations';

/**
 * Simple helper to get translated content for display
 * This can be used in components that don't need the full hook functionality
 */
export function getDisplayText<T extends Translatable>(
  item: T | null | undefined,
  field: 'title' | 'description',
  locale: Locale
): string {
  if (!item) return '';
  
  return field === 'title' 
    ? getTranslatedTitle(item, locale)
    : getTranslatedDescription(item, locale);
}

/**
 * Get both title and description for an item
 */
export function getDisplayTexts<T extends Translatable>(
  item: T | null | undefined,
  locale: Locale
): { title: string; description: string } {
  if (!item) return { title: '', description: '' };
  
  return {
    title: getTranslatedTitle(item, locale),
    description: getTranslatedDescription(item, locale)
  };
}

/**
 * Map an array of translatable items to include display texts
 */
export function mapWithTranslations<T extends Translatable>(
  items: T[] | null | undefined,
  locale: Locale
): Array<T & { displayTitle: string; displayDescription: string }> {
  if (!items) return [];
  
  return items.map(item => ({
    ...item,
    displayTitle: getTranslatedTitle(item, locale),
    displayDescription: getTranslatedDescription(item, locale)
  }));
}
