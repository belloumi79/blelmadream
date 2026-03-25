import { db } from '@/db';
import { products } from '@/db/schema';
import { createProduct, deleteProduct } from '@/app/actions/products';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <div dir="rtl">
      <h1 style={{ color: 'var(--brand-blue)', marginBottom: '1rem' }}>إدارة منتجات الجمعية</h1>
      
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--brand-green)' }}>إضافة منتج جديد</h2>
        <form action={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>اسم المنتج</label>
              <input name="nameAr" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>السعر (د.ت)</label>
              <input name="price" type="number" step="0.01" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>صورة المنتج</label>
            <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.8rem' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>الوصف</label>
            <textarea name="descriptionAr" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px' }}></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ border: 'none' }}>حفظ المنتج</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {allProducts.map(p => (
          <div key={p.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
            {p.imageUrl && <img src={p.imageUrl} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />}
            <div style={{ padding: '1rem' }}>
              <h3>{p.nameAr}</h3>
              <p>{p.price} د.ت</p>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>حذف</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
