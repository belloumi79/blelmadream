'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

interface MobileMenuProps {
  user?: {
    role?: string;
  } | null;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navigation');
  const auth_t = useTranslations('Auth');
  const locale = useLocale();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className="hamburger-btn"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span className={`hamburger-line ${isOpen ? 'open-1' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open-2' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open-3' : ''}`}></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="mobile-overlay" onClick={closeMenu} />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'drawer-open' : ''}`}>
        <div className="mobile-nav-links">
          {user && (
            <div style={{ padding: '0 1.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand-green)', fontWeight: 'bold', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>
                {auth_t(`role_${user.role || 'user'}` as any)}
              </span>
            </div>
          )}
          <a href="#about" onClick={closeMenu}>{t('about')}</a>
          <a href="#projects" onClick={closeMenu}>{t('projects')}</a>
          <a href="#store" onClick={closeMenu}>{t('store')}</a>
          {(user?.role === 'admin' || user?.role === 'coadmin') && (
            <a href={`/${locale}/admin`} onClick={closeMenu} style={{ color: 'var(--brand-green)', fontWeight: 'bold' }}>
              {auth_t('dashboard')}
            </a>
          )}
          <a
            href="https://www.facebook.com/profile.php?id=100066988150540"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            onClick={closeMenu}
          >
            {t('facebook')}
          </a>
        </div>
      </div>
    </>
  );
}
