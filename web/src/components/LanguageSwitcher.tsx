'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select 
        defaultValue={locale} 
        onChange={onSelectChange}
        style={{
          padding: '0.4rem 2rem 0.4rem 0.8rem',
          borderRadius: '999px',
          border: '1px solid var(--border-color)',
          background: 'rgba(255, 255, 255, 0.8)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          outline: 'none',
          appearance: 'none',
        }}
      >
        <option value="ar">العربية</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
      <div 
        style={{
          position: 'absolute',
          right: '8px', /* For RTL or LTR depending on text direction */
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-secondary)'
        }}
      >
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
    </div>
  );
}
