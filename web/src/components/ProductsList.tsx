import { db } from '@/db';
import { products } from '@/db/schema';
import { ShoppingBag, Leaf, Award } from 'lucide-react';
import { getLocale } from 'next-intl/server';

export default async function ProductsList() {
  const locale = await getLocale();
  const allProducts = await db.select().from(products);
  
  if (allProducts.length === 0) return null;

  return (
    <section id="store" className="section" style={{ background: '#fff', padding: '6rem 0' }}>
      <div className="nav-container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--brand-blue)', marginBottom: '1.2rem' }}>
            {locale === 'ar' ? 'منتجات ريف بلمة' : locale === 'fr' ? 'Produits du Terroir' : 'Local Products'}
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            {locale === 'ar' 
              ? 'اكتشف أجود المنتجات الطبيعية من زيت الزيتون والعسل من قلب المزارع التقليدية بالمنطقة، مباشرة من المنتج إلى مائدتكم.' 
              : locale === 'fr' 
              ? 'Découvrez les meilleurs produits naturels, de l’huile d’olive au miel, directement des fermes traditionnelles de notre région à votre table.' 
              : 'Discover the finest natural products, from olive oil to honey, straight from our traditional local farms to your table.'}
          </p>
        </div>
        
        <div className="grid">
          {allProducts.map(p => {
             const name = locale === 'ar' ? p.nameAr : locale === 'fr' ? (p.nameFr || p.nameAr) : (p.nameEn || p.nameAr);
             const desc = locale === 'ar' ? p.descriptionAr : locale === 'fr' ? (p.descriptionFr || p.descriptionAr) : (p.descriptionEn || p.descriptionAr);
             const producer = locale === 'ar' ? p.producerNameAr : locale === 'fr' ? (p.producerNameFr || p.producerNameAr) : (p.producerNameEn || p.producerNameAr);

             return (
               <div key={p.id} className="card" style={{ padding: 0, borderRadius: '20px', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
                 <div style={{ position: 'relative' }}>
                   {p.imageUrl ? (
                     <img src={p.imageUrl} alt={name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                   ) : (
                     <div style={{ width: '100%', height: '240px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Leaf color="#e2e8f0" size={60} />
                     </div>
                   )}
                   <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.9)', padding: '0.4rem 0.8rem', borderRadius: '40px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                     <Award size={14} />
                     {locale === 'ar' ? 'طبيعي 100%' : '100% Naturel'}
                   </div>
                 </div>
                 
                 <div style={{ padding: '2rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                     <div>
                       <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-blue)', marginBottom: '0.4rem' }}>{name}</h3>
                       {producer && <p style={{ fontSize: '0.85rem', color: 'var(--brand-green)', fontWeight: 'bold' }}>{producer}</p>}
                     </div>
                     <span style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--brand-blue)' }}>
                       {(p.price / 1000).toFixed(3)} <span style={{ fontSize: '0.7rem' }}>DT</span>
                     </span>
                   </div>
                   
                   <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem', height: '3.2rem', overflow: 'hidden' }}>
                     {desc}
                   </p>
                   
                   <button className="btn-primary" style={{ width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                     <ShoppingBag size={20} />
                     {locale === 'ar' ? 'اطلب الآن' : locale === 'fr' ? 'Commander' : 'Order Now'}
                   </button>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
}
