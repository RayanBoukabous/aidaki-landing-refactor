import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { Locale, getDirection } from '../../i18n';
import DirectionManager from '../../components/DirectionManager';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  const titles = {
    en: 'AIDAKI - Learning Platform for Students',
    fr: "AIDAKI - Plateforme d'apprentissage pour élèves",
    ar: 'أيداكي - منصة التعلم للطلاب',
  };

  const descriptions = {
    en: 'An interactive educational platform for high school students',
    fr: 'Une plateforme éducative interactive pour les élèves du baccalauréat',
    ar: 'منصة تعليمية تفاعلية لطلاب  الثانوية',
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = getDirection(locale);
  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={direction}>
      <body
        className={`${
          isArabic ? cairo.variable + ' font-cairo' : inter.variable + ' font-inter'
        } ${direction === 'rtl' ? 'rtl' : 'ltr'}`}
      >
        <DirectionManager />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }, { locale: 'ar' }];
}
