import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return <div>Unauthorized</div>;
  }

  const allUsers = await db.select().from(users);

  async function updateRole(userId: string, formData: FormData) {
    'use server';
    const role = formData.get('role') as string;
    await db.update(users).set({ role }).where(eq(users.id, userId));
    revalidatePath('/[locale]/admin/users', 'page');
  }

  return (
    <div dir="rtl">
      <h1>إدارة الأعضاء</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ padding: '1rem', textAlign: 'right' }}>الاسم</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>البريد الإلكتروني</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>الدور الحالي</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>تغيير الدور</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{u.name}</td>
              <td style={{ padding: '1rem' }}>{u.email}</td>
              <td style={{ padding: '1rem' }}>{u.role}</td>
              <td style={{ padding: '1rem' }}>
                <form action={updateRole.bind(null, u.id)}>
                  <select name="role" defaultValue={u.role}>
                    <option value="user">مستخدم (User)</option>
                    <option value="friend">صديق الجمعية (Friend)</option>
                    <option value="subscriber">مشترك (Subscriber)</option>
                    <option value="coadmin">مشرف (Co-Admin)</option>
                    <option value="admin">مدير (Admin)</option>
                  </select>
                  <button type="submit" style={{ marginRight: '0.5rem' }}>حفظ</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
