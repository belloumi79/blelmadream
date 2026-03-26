'use client';

import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const t = useTranslations('Store');
  const locale = useLocale();

  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <CheckCircle size={80} color="var(--brand-green)" style={{ marginBottom: '2rem' }} />
      <h1 style={{ color: 'var(--brand-blue)', marginBottom: '1rem' }}>{t('orderSuccess')}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '500px' }}>
        {locale === 'ar' 
          ? 'تم استلام طلبكم. سنتصل بكم لتأكيد التوصيل في أقرب وقت.' 
          : 'Nous avons reçu votre commande. Nous vous contacterons prochainement pour confirmer la livraison.'}
      </p>
      <Link href={`/${locale}`} className="btn-primary" style={{ textDecoration: 'none' }}>
        {locale === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
      </Link>
    </div>
  );
}
