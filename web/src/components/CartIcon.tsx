'use client';

import { useCart } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const items = useCart((state) => state.items);
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link 
      href={`/${locale}/cart`} 
      style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--brand-blue)' }}
    >
      <ShoppingCart size={24} />
      {count > 0 && (
        <span style={{ 
          position: 'absolute', 
          top: '-5px', 
          right: '-5px', 
          background: 'var(--brand-yellow)', 
          color: 'var(--brand-blue)', 
          borderRadius: '50%', 
          width: '20px', 
          height: '20px', 
          fontSize: '0.7rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: 'bold',
          border: '2px solid white'
        }}>
          {count}
        </span>
      )}
    </Link>
  );
}
