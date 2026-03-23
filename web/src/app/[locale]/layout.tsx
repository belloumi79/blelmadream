import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Image from "next/image";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { auth, signOut } from '@/auth';
import "./globals.css";

// Use Noto Kufi Arabic for beautiful Arabic typography
const notoKufi = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-noto-kufi'
});

export const metadata: Metadata = {
  title: "جمعية حلم البلالـمة | Blelma Dream Association",
  description: "نبض الريف التونسي. أصالة، صمود، وبناء. Empowering local farmers, celebrating vibrant heritage, and building sustainable futures.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();
  const t = await getTranslations('Navigation');
  const session = await auth();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={notoKufi.className}>
        <NextIntlClientProvider messages={messages}>
          <nav className="navbar">
            <div className="nav-container">
              <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Image src="/logo.jpg" alt="Association Blelma Dream Logo" width={50} height={50} style={{ borderRadius: '50%' }} />
                <div className="brand-name">
                  <span className="brand-ar">حلم البلالـمة</span>
                  <span className="brand-en">Blelma Dream</span>
                </div>
              </div>
              <div className="nav-links">
                <a href="#about">{t('about')}</a>
                <a href="#projects">{t('projects')}</a>
                <a href="#store">{t('store')}</a>
                <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="social-link">{t('facebook')}</a>
              </div>
              <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <LanguageSwitcher />
                {session?.user ? (
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <form action={async () => {
                      'use server';
                      await signOut();
                    }}>
                      <button type="submit" className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        {locale === 'ar' ? 'تسجيل الخروج' : locale === 'fr' ? 'Déconnexion' : 'Logout'}
                      </button>
                    </form>
                    {session.user.role === 'admin' && (
                      <a href={`/${locale}/admin`} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                        {locale === 'ar' ? 'لوحة التحكم' : locale === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                      </a>
                    )}
                  </div>
                ) : (
                  <a href="/api/auth/signin" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    {locale === 'ar' ? 'تسجيل الدخول' : locale === 'fr' ? 'Se connecter' : 'Login'}
                  </a>
                )}
              </div>
            </div>
          </nav>
          <main>{children}</main>
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-brand">جمعية حلم البلالـمة</div>
              <p>التنمية الريفية التونسية الأصيلة.</p>
              <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="social-link">تابعنا على فيسبوك</a>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
