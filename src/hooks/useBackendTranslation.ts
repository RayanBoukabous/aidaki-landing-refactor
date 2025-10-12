'use client';

import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { Locale, Translatable } from '@/types/api';
import {
  getTranslatedTitle,
  getTranslatedDescription,
  getTranslatedDirection,
  getBestAvailableLocale,
  isLocaleSupported,
  hasTranslations,
  getTranslationCompleteness
} from '@/lib/translations';

/**
 * Hook for handling backend translations with next-intl integration
 * @param item - Translatable object from backend
 * @returns Translation utilities and translated content
 */
export function useBackendTranslation<T extends Translatable>(item?: T | null) {
  const locale = useLocale() as Locale;

  const translationData = useMemo(() => {
    if (!item) {
      return {
        title: '',
        description: '',
        direction: 'ltr' as const,
        isSupported: false,
        hasTranslations: false,
        bestLocale: locale,
        completeness: {
          title: {} as Record<Locale, boolean>,
          description: {} as Record<Locale, boolean>,
          overall: 0
        }
      };
    }

    return {
      title: getTranslatedTitle(item, locale),
      description: getTranslatedDescription(item, locale),
      direction: getTranslatedDirection(item, locale),
      isSupported: isLocaleSupported(item, locale),
      hasTranslations: hasTranslations(item),
      bestLocale: getBestAvailableLocale(item, locale),
      completeness: getTranslationCompleteness(item)
    };
  }, [item, locale]);

  return {
    ...translationData,
    locale,
    item
  };
}

/**
 * Hook for translating multiple items at once
 * @param items - Array of translatable objects
 * @returns Array of translated items with metadata
 */
export function useBackendTranslations<T extends Translatable>(items?: T[] | null) {
  const locale = useLocale() as Locale;

  const translatedItems = useMemo(() => {
    if (!items) return [];

    return items.map(item => ({
      original: item,
      title: getTranslatedTitle(item, locale),
      description: getTranslatedDescription(item, locale),
      direction: getTranslatedDirection(item, locale),
      isSupported: isLocaleSupported(item, locale),
      hasTranslations: hasTranslations(item),
      bestLocale: getBestAvailableLocale(item, locale)
    }));
  }, [items, locale]);

  return {
    items: translatedItems,
    locale,
    totalCount: items?.length || 0,
    translatedCount: translatedItems.filter(item => item.hasTranslations).length
  };
}

/**
 * Hook for getting translation by specific locale (useful for admin interfaces)
 * @param item - Translatable object
 * @param targetLocale - Specific locale to get translation for
 * @returns Translation for specific locale
 */
export function useSpecificTranslation<T extends Translatable>(
  item?: T | null,
  targetLocale?: Locale
) {
  const currentLocale = useLocale() as Locale;
  const effectiveLocale = targetLocale || currentLocale;

  const translation = useMemo(() => {
    if (!item) {
      return {
        title: '',
        description: '',
        direction: 'ltr' as const,
        isSupported: false
      };
    }

    return {
      title: getTranslatedTitle(item, effectiveLocale),
      description: getTranslatedDescription(item, effectiveLocale),
      direction: getTranslatedDirection(item, effectiveLocale),
      isSupported: isLocaleSupported(item, effectiveLocale)
    };
  }, [item, effectiveLocale]);

  return {
    ...translation,
    locale: effectiveLocale,
    item
  };
}
