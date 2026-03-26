import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // Double check admin role
  if (session.user.role !== 'admin' && session.user.role !== 'coadmin' && session.user.email !== 'belloumi.karim.professional@gmail.com') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>عذراً، هذا القسم مخصص للمشرفين فقط.</h2>
        <a href="/">العودة للرئيسية</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'white' }} dir="rtl">
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--brand-blue)', color: 'white', padding: '2rem' }}>
        <h2 style={{ color: 'var(--brand-yellow)', fontSize: '1.5rem', marginBottom: '2rem' }}>لوحة التحكم</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0 }}>
          <li><a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>الرئيسية</a></li>
          {(session.user.role === 'admin' || session.user.email === 'belloumi.karim.professional@gmail.com') && (
            <li><a href="/admin/users" style={{ color: 'white', textDecoration: 'none' }}>إدارة المستخدمين</a></li>
          )}
          <li><a href="/admin/events" style={{ color: 'white', textDecoration: 'none' }}>الأحداث والمهرجانات</a></li>
          <li><a href="/admin/projects" style={{ color: 'white', textDecoration: 'none' }}>المشاريع</a></li>
          <li><a href="/admin/products" style={{ color: 'white', textDecoration: 'none' }}>المنتجات المحلية</a></li>
          <li><a href="/" style={{ color: 'var(--brand-green)', textDecoration: 'none', marginTop: '2rem', display: 'block' }}>&larr; العودة للموقع</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', maxWidth: '1200px' }}>
        {children}
      </main>
    </div>
  );
}
