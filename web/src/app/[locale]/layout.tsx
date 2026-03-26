import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Image from "next/image";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileMenu from '@/components/MobileMenu';
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

import CartIcon from '@/components/CartIcon';

import { Providers } from '@/components/Providers';

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
  const footer = await getTranslations('Footer');
  const auth_t = await getTranslations('Auth');
  const session = await auth();

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body className={notoKufi.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <nav className="navbar">
              <div className="nav-container">
                <div className="logo-container">
                  <Image src="/logo.jpg" alt="Association Blelma Dream Logo" width={50} height={50} style={{ borderRadius: '50%' }} />
                  <div className="brand-name">
                    <span className="brand-ar">حلم البلالـمة</span>
                    <span className="brand-en">Blelma Dream</span>
                  </div>
                </div>

                {/* Desktop nav links */}
                <div className="nav-links">
                  <a href={`/${locale}#about`}>{t('about')}</a>
                  <a href={`/${locale}#projects`}>{t('projects')}</a>
                  <a href={`/${locale}#store`}>{t('store')}</a>
                  <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="social-link">{t('facebook')}</a>
                </div>

                <div className="nav-actions">
                  <CartIcon />
                  <LanguageSwitcher />
                  {session?.user ? (
                    <div className="auth-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--brand-green)', fontWeight: 'bold', background: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '15px' }}>
                        {auth_t(`role_${session.user.role || 'user'}` as any)}
                      </span>
                      <form action={async () => {
                        'use server';
                        await signOut();
                      }}>
                        <button type="submit" className="btn-secondary btn-sm">
                          {auth_t('logout')}
                        </button>
                      </form>
                      {(session.user.role === 'admin' || session.user.role === 'coadmin') && (
                        <a href={`/${locale}/admin`} className="btn-primary btn-sm">
                          {auth_t('dashboard')}
                        </a>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <a href="#signup" className="btn-primary btn-sm">
                        {locale === 'ar' ? 'إنشاء حساب' : 'S\'inscrire'}
                      </a>
                      <a href={`/${locale}/login`} className="btn-secondary btn-sm" style={{ border: '1px solid #ddd' }}>
                        {auth_t('login')}
                      </a>
                    </div>
                  )}

                  {/* Hamburger for mobile */}
                  <MobileMenu user={session?.user} />
                </div>
              </div>
            </nav>
            <main>{children}</main>
            <footer className="footer">
              <div className="footer-content">
                <div className="footer-brand">{footer('brand')}</div>
                <p>{footer('tagline')}</p>
                <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="social-link">{footer('facebook')}</a>
                <p style={{ marginTop: '2rem', fontSize: '0.85rem', opacity: 0.6 }}>
                  &copy; {new Date().getFullYear()} {footer('brand')} — {footer('rights')}
                </p>
              </div>
            </footer>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
