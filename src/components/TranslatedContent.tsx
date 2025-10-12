'use client';

import { ReactNode } from 'react';
import { Translatable } from '@/types/api';
import { useBackendTranslation } from '@/hooks/useBackendTranslation';

interface TranslatedTextProps<T extends Translatable> {
  item: T;
  field: 'title' | 'description';
  fallback?: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Component for displaying translated text from backend objects
 */
export function TranslatedText<T extends Translatable>({
  item,
  field,
  fallback = null,
  className = '',
  as: Component = 'span'
}: TranslatedTextProps<T>) {
  const { title, description, direction } = useBackendTranslation(item);
  
  const text = field === 'title' ? title : description;
  
  if (!text && fallback) {
    return <>{fallback}</>;
  }

  return (
    <Component 
      className={className}
      dir={direction}
    >
      {text}
    </Component>
  );
}

interface TranslatedTitleProps<T extends Translatable> {
  item: T;
  fallback?: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

/**
 * Component specifically for displaying translated titles
 */
export function TranslatedTitle<T extends Translatable>({
  item,
  fallback = null,
  className = '',
  as: Component = 'h2'
}: TranslatedTitleProps<T>) {
  return (
    <TranslatedText
      item={item}
      field="title"
      fallback={fallback}
      className={className}
      as={Component}
    />
  );
}

interface TranslatedDescriptionProps<T extends Translatable> {
  item: T;
  fallback?: ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * Component specifically for displaying translated descriptions
 */
export function TranslatedDescription<T extends Translatable>({
  item,
  fallback = null,
  className = '',
  as: Component = 'p'
}: TranslatedDescriptionProps<T>) {
  return (
    <TranslatedText
      item={item}
      field="description"
      fallback={fallback}
      className={className}
      as={Component}
    />
  );
}

interface TranslatedCardProps<T extends Translatable> {
  item: T;
  titleProps?: Omit<TranslatedTitleProps<T>, 'item'>;
  descriptionProps?: Omit<TranslatedDescriptionProps<T>, 'item'>;
  className?: string;
  children?: ReactNode;
}

/**
 * Complete card component with translated title and description
 */
export function TranslatedCard<T extends Translatable>({
  item,
  titleProps = {},
  descriptionProps = {},
  className = '',
  children
}: TranslatedCardProps<T>) {
  const { direction } = useBackendTranslation(item);

  return (
    <div className={className} dir={direction}>
      <TranslatedTitle 
        item={item} 
        {...titleProps}
      />
      <TranslatedDescription 
        item={item} 
        {...descriptionProps}
      />
      {children}
    </div>
  );
}

interface TranslationIndicatorProps<T extends Translatable> {
  item: T;
  showCompleteness?: boolean;
  className?: string;
}

/**
 * Component showing translation status and completeness
 */
export function TranslationIndicator<T extends Translatable>({
  item,
  showCompleteness = false,
  className = ''
}: TranslationIndicatorProps<T>) {
  const { isSupported, hasTranslations, locale, completeness } = useBackendTranslation(item);

  if (!hasTranslations) {
    return (
      <span className={`text-gray-500 text-sm ${className}`}>
        No translations available
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className={`inline-block w-2 h-2 rounded-full ${
          isSupported ? 'bg-green-500' : 'bg-yellow-500'
        }`}
        title={isSupported ? `Available in ${locale}` : `Fallback language used`}
      />
      <span className="text-sm text-gray-600">
        {isSupported ? `Available in ${locale}` : 'Using fallback'}
      </span>
      {showCompleteness && (
        <span className="text-xs text-gray-500">
          ({Math.round(completeness.overall)}% complete)
        </span>
      )}
    </div>
  );
}

interface LanguageSelectorProps<T extends Translatable> {
  item: T;
  onLanguageChange?: (locale: string) => void;
  currentLocale?: string;
  className?: string;
}

/**
 * Language selector for items with multiple translations
 */
export function LanguageSelector<T extends Translatable>({
  item,
  onLanguageChange,
  currentLocale,
  className = ''
}: LanguageSelectorProps<T>) {
  const { locale: contextLocale } = useBackendTranslation(item);
  const activeLocale = currentLocale || contextLocale;

  if (!item.supportedLocales || item.supportedLocales.length <= 1) {
    return null;
  }

  const languageNames: Record<string, string> = {
    en: 'English',
    fr: 'Français',
    ar: 'العربية'
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {item.supportedLocales.map((locale) => (
        <button
          key={locale}
          onClick={() => onLanguageChange?.(locale)}
          className={`px-3 py-1 text-sm rounded ${
            activeLocale === locale
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {languageNames[locale] || locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
