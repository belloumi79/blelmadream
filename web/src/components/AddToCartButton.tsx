'use client';

import { useCart } from '@/store/cart';
import { ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const t = useTranslations('Store');

  return (
    <button 
      onClick={() => addItem(product)}
      className="btn-primary" 
      style={{ width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
    >
      <ShoppingBag size={20} />
      {t('addToCart')}
    </button>
  );
}
