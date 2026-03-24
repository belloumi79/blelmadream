'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navigation');
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
          <a href="#about" onClick={closeMenu}>{t('about')}</a>
          <a href="#projects" onClick={closeMenu}>{t('projects')}</a>
          <a href="#store" onClick={closeMenu}>{t('store')}</a>
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
