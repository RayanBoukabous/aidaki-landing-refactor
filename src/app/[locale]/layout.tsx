import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Poppins, Cairo } from 'next/font/google';
import Script from 'next/script';
import '../globals.css';
import { Locale, getDirection } from '../../i18n';
import DirectionManager from '../../components/DirectionManager';

// ID Google Tag Manager
const GTM_ID = 'GTM-WGM222ZH';

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
      <head>
        {/* Google Tag Manager - Script dans le head */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${
          isArabic ? cairo.variable + ' font-cairo' : poppins.variable + ' font-poppins'
        } ${direction === 'rtl' ? 'rtl' : 'ltr'}`}
      >
        {/* Google Tag Manager - Noscript juste après l'ouverture du body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
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
