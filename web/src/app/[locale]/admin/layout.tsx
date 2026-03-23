
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const session = await auth();
  
  // If not logged in, or not admin (we enforce belloumi to be admin in auth.ts callback)
  // We can let them log in, so redirect to Google signin path
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  if (session.user.role !== 'admin' && session.user.email !== 'belloumi.karim.professional@gmail.com') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>عذراً، هذا القسم مخصص للمشرفين فقط.</h2>
        <a href="/">العودة للرئيسية</a>
      </div>
    );
  }

  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <div dir={direction} style={{ display: 'flex', minHeight: '100vh', background: '#f4f5ef' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--brand-blue)', color: 'white', padding: '2rem' }}>
        <h2 style={{ color: 'var(--brand-yellow)', fontSize: '1.5rem', marginBottom: '2rem' }}>لوحة التحكم</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>الرئيسية</a></li>
          <li><a href="/admin/events" style={{ color: 'var(--brand-yellow)', textDecoration: 'none', fontWeight: 'bold' }}>الأحداث والمهرجانات</a></li>
          <li><a href="/admin/projects" style={{ color: 'white', textDecoration: 'none' }}>المشاريع</a></li>
          <li><a href="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>المنتجات المحلية</a></li>
          <li><a href="/" style={{ color: 'var(--brand-green)', textDecoration: 'none', marginTop: '2rem', display: 'block' }}>&larr; العودة للموقع</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
