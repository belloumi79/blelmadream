export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5ef' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--brand-blue)', color: 'white', padding: '2rem' }}>
        <h2 style={{ color: 'var(--brand-yellow)', fontSize: '1.5rem', marginBottom: '2rem' }}>لوحة التحكم</h2>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>الرئيسية</a></li>
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
