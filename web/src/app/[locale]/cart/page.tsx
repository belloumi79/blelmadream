'use client';

import { useCart } from '@/store/cart';
import { useTranslations, useLocale } from 'next-intl';
import { Trash2, Plus, Minus, CreditCard, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const t = useTranslations('Store');
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod' as 'cod' | 'stripe'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill user data if session exists
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email
      }));
    }
  }, [session]);

  if (!mounted) return null;

  const total = getTotal();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !session) return;

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          ...formData,
          locale
        })
      });

      const data = await response.json();

      if (formData.paymentMethod === 'stripe' && data.url) {
        window.location.href = data.url;
      } else if (data.orderId) {
        clearCart();
        router.push(`/${locale}/order-success?id=${data.orderId}`);
      }
    } catch (error) {
      console.error(error);
      alert(t('orderError'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <h2 style={{ color: 'var(--brand-blue)', marginBottom: '1rem' }}>{t('empty')}</h2>
        <a href={`/${locale}#store`} className="btn-primary" style={{textDecoration: 'none'}}>{locale === 'ar' ? 'العودة للمتجر' : 'Retour à la boutique'}</a>
      </div>
    );
  }

  return (
    <div className="nav-container" style={{ padding: '4rem 1rem', minHeight: '80vh' }} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <h1 style={{ fontSize: '2.5rem', color: 'var(--brand-blue)', marginBottom: '3rem' }}>{t('cart')}</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
        {/* Items List */}
        <div>
          {items.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid #eee', alignItems: 'center' }}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, color: 'var(--brand-blue)', fontSize: '1.1rem' }}>{item.name}</h3>
                <p style={{ color: 'var(--brand-green)', fontWeight: 'bold' }}>{(item.price / 1000).toFixed(3)} DT</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}><Minus size={14} /></button>
                  <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}><Plus size={14} /></button>
                  <button type="button" onClick={() => removeItem(item.id)} style={{ color: 'red', [locale === 'ar' ? 'marginRight' : 'marginLeft']: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Form or Login Prompt */}
        <div style={{ background: '#f9f9f9', padding: '2rem', borderRadius: '20px', height: 'fit-content' }}>
          {!session ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--brand-blue)' }}>
                {locale === 'ar' ? 'يرجى تسجيل الدخول لإتمام الطلب' : locale === 'fr' ? 'Veuillez vous connecter pour passer commande' : 'Please login to checkout'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                {locale === 'ar' 
                  ? 'يجب أن يكون لديك حساب لتتمكن من متابعة عملية الشراء وتتبع طلباتك.' 
                  : 'Un compte est nécessaire pour finaliser votre achat et suivre vos commandes.'}
              </p>
              <button 
                onClick={() => router.push(`/${locale}/login`)} 
                className="btn-primary" 
                style={{ width: '100%', border: 'none', padding: '1rem' }}
              >
                {locale === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Se connecter / Créer un compte'}
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{t('checkout')}</h2>
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t('name')} *</label>
                  <input required name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t('email')} *</label>
                  <input required type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t('phone')} *</label>
                  <input required name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{t('address')} *</label>
                  <textarea required rows={3} name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}></textarea>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 'bold' }}>{t('paymentMethod')}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: formData.paymentMethod === 'cod' ? '#edfcf2' : 'white' }}>
                      <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={() => setFormData({...formData, paymentMethod: 'cod'})} />
                      <Truck size={20} />
                      <span>{t('cod')}</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: formData.paymentMethod === 'stripe' ? '#eff6ff' : 'white' }}>
                      <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === 'stripe'} onChange={() => setFormData({...formData, paymentMethod: 'stripe'})} />
                      <CreditCard size={20} />
                      <span>{t('stripe')}</span>
                    </label>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{t('total')}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--brand-blue)' }}>{(total / 1000).toFixed(3)} DT</span>
                  </div>
                  <button disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', border: 'none' }}>
                    {loading ? '...' : t('checkout')}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
