import { db } from '@/db';
import { projects, products } from '@/db/schema';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const activeProjects = await db.select().from(projects);
  const activeProducts = await db.select().from(products);

  return (
    <div>
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2.5rem', marginBottom: '2rem' }}>مرحباً بك في لوحة التحكم!</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
        من هنا يمكنك إضافة مشاريع جديدة للجمعية أو طرح منتجات محلية (زيت، عسل) للبيع أو الدعم.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--brand-green)', fontSize: '3rem', margin: 0 }}>{activeProjects.length}</h3>
          <p style={{ margin: '1rem 0 0 0', fontWeight: 'bold' }}>مشاريع الجمعية</p>
        </div>
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--brand-yellow)', fontSize: '3rem', margin: 0 }}>{activeProducts.length}</h3>
          <p style={{ margin: '1rem 0 0 0', fontWeight: 'bold' }}>منتجات ريفية</p>
        </div>
      </div>
    </div>
  );
}
