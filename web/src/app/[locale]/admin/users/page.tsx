import { db } from '@/db';
import { users } from '@/db/schema';
import { updateUserRole, deleteUser } from '@/app/actions/users';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(users);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'المشرف العام (Admin)';
      case 'subscriber': return 'مشترك في الجمعية (Subscriber)';
      case 'friend': return 'صديق الجمعية (Friend)';
      default: return 'مستخدم عادي (User)';
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>إدارة المستخدمين</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        قم بإدارة صلاحيات المستخدمين، حيث يمكنك تعيين الأعضاء كمشتركين أو كأصدقاء للجمعية.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {allUsers.map((u) => (
          <div key={u.id} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--brand-blue)' }}>{u.name || '(بدون اسم)'}</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>{u.email}</p>
              <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'var(--bg-secondary)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--brand-green)' }}>
                {getRoleLabel(u.role)}
              </div>
            </div>

            {/* Admin has a fixed role, do not allow changing belloumi.karim.professional@gmail.com */}
            {u.email !== 'belloumi.karim.professional@gmail.com' && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <form action={updateUserRole} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="hidden" name="userId" value={u.id} />
                  <select 
                    name="role" 
                    defaultValue={u.role} 
                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                  >
                    <option value="user">مستخدم عادي</option>
                    <option value="subscriber">مشترك في الجمعية</option>
                    <option value="friend">صديق الجمعية</option>
                  </select>
                  <button type="submit" className="btn-secondary btn-sm" style={{ padding: '0.5rem 1rem' }}>تحديث الدور</button>
                </form>

                <form action={deleteUser}>
                  <input type="hidden" name="userId" value={u.id} />
                  <button type="submit" className="btn-secondary btn-sm" style={{ background: '#fee2e2', color: '#dc2626', padding: '0.5rem 1rem' }}>
                    حذف
                  </button>
                </form>
              </div>
            )}
            
            {u.email === 'belloumi.karim.professional@gmail.com' && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                مدير النظام
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
