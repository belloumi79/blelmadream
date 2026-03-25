'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', {
      email,
      password,
      callbackUrl: `/${locale}`,
    });
    setLoading(false);
  };

  return (
    <div className="login-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="login-card" style={{ background: 'white', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Image src="/logo.jpg" alt="Logo" width={80} height={80} style={{ borderRadius: '50%', marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '0.5rem', color: 'var(--brand-green)' }}>{t('login')}</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Blelma Dream Association</p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error === 'CredentialsSignin' ? 'Email ou mot de passe incorrect' : 'Une erreur est survenue'}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', direction: 'ltr' }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="votre@email.com"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Mot de passe</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem' }}
          >
            {loading ? '...' : t('login')}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
          <span style={{ padding: '0 1rem', fontSize: '0.8rem', opacity: 0.5 }}>OU</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl: `/${locale}` })}
          style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <img src="https://authjs.dev/img/providers/google.svg" width="20" height="20" alt="Google" />
          Continuer avec Google
        </button>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          Pas encore de compte ? <Link href="/#signup" style={{ color: 'var(--brand-green)', fontWeight: 'bold' }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
