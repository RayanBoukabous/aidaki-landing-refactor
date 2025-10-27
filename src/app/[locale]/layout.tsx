import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Poppins, Cairo } from 'next/font/google';
import '../globals.css';
import { Locale, getDirection } from '../../i18n';
import DirectionManager from '../../components/DirectionManager';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
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
          isArabic ? cairo.variable + ' font-cairo' : poppins.variable + ' font-poppins'
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
