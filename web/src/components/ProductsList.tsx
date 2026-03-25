import { db } from '@/db';
import { products } from '@/db/schema';
import { ShoppingBag } from 'lucide-react';

export default async function ProductsList() {
  const allProducts = await db.select().from(products);
  if (allProducts.length === 0) return null;

  return (
    <section id="store" className="section" style={{ background: 'linear-gradient(180deg, #fff 0%, #f9fafb 100%)' }}>
      <div className="nav-container">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>منتجات ريف بلمة</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem' }}>اكتشف أجود المنتجات الطبيعية من زيت الزيتون والعسل من قلب المزارع التقليدية بالمنطقة.</p>
        
        <div className="grid">
          {allProducts.map(p => (
            <div key={p.id} className="card" style={{ padding: 0 }}>
              {p.imageUrl && <img src={p.imageUrl} alt={p.nameAr} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{p.nameAr}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{p.descriptionAr}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--brand-green)' }}>{p.price} د.ت</span>
                  <ShoppingBag size={20} color="var(--brand-blue)" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
