import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define supported locales
export const locales = ['en', 'fr', 'ar'] as const;
export type Locale = typeof locales[number];

// Default locale changed to Arabic
export const defaultLocale: Locale = 'ar';

// RTL locales
export const rtlLocales = ['ar'] as const;
export type RTLLocale = typeof rtlLocales[number];

// Check if a locale is RTL
export function isRTL(locale: string): boolean {
    return rtlLocales.includes(locale as RTLLocale);
}

// Get text direction for a locale
export function getDirection(locale: string): 'ltr' | 'rtl' {
    return isRTL(locale) ? 'rtl' : 'ltr';
}

export default getRequestConfig(async ({ requestLocale }) => {
    // Get the locale from the request
    const locale = await requestLocale;
    
    // Validate locale
    if (!locale || !locales.includes(locale as Locale)) {
        notFound();
    }

    return {
        messages: (await import(`./messages/${locale}.json`)).default
    };
});