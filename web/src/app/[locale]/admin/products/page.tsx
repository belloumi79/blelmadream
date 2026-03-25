import { db } from '@/db';
import { products } from '@/db/schema';
import { createProduct, deleteProduct } from '@/app/actions/products';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <div dir="rtl">
      <h1 style={{ color: 'var(--brand-blue)', marginBottom: '1rem', fontSize: '2rem' }}>إدارة المنتجات المحلية</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>أضف المنتجات للبيع (زيت زيتون، عسل...) وعرّف بالمنتجين بجميع اللغات.</p>
      
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--brand-green)' }}>إضافة منتج جديد</h2>
        <form action={createProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المنتج (بالعربية)*</label>
              <input name="nameAr" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom du produit (Français)</label>
              <input name="nameFr" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Name (English)</label>
              <input name="nameEn" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>السعر بالدينار (د.ت)*</label>
              <input name="price" type="number" step="0.001" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>حالة المخزون</label>
              <select name="stockStatus" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <option value="in_stock">متوفر (In Stock)</option>
                <option value="out_of_stock">نفذ (Out of Stock)</option>
                <option value="on_order">بالطلب (On Order)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>صورة المنتج (WebP)</label>
              <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المنتج/المزارع (Ar)</label>
              <input name="producerNameAr" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Producteur (Fr)</label>
              <input name="producerNameFr" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Producer (En)</label>
              <input name="producerNameEn" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الوصف (Ar)</label>
              <textarea name="descriptionAr" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (Fr)</label>
              <textarea name="descriptionFr" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (En)</label>
              <textarea name="descriptionEn" rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', border: 'none' }}>حفظ المنتج</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {allProducts.map(p => (
          <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white' }}>
            {p.imageUrl && <img src={p.imageUrl} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{p.nameAr}</h3>
              <p style={{ color: 'var(--brand-green)', fontWeight: 'bold', fontSize: '1.1rem' }}>{(p.price / 1000).toFixed(3)} د.ت</p>
              <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{p.stockStatus}</span>
              <form action={deleteProduct} style={{ marginTop: '0.8rem' }}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>حذف المنتج</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
