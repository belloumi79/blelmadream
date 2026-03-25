import { db } from '@/db';
import { projects } from '@/db/schema';
import { createProject, deleteProject } from '@/app/actions/projects';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const allProjects = await db.select().from(projects);

  return (
    <div dir="rtl">
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>إدارة المشاريع</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>قم بإضافة المشاريع الحالية والمخطط لها لعرضها بجميع اللغات.</p>

      {/* Form */}
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--brand-green)', marginBottom: '1.5rem' }}>إضافة مشروع جديد</h2>
        <form action={createProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المشروع (بالعربية)*</label>
              <input name="titleAr" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom du projet (Français)</label>
              <input name="titleFr" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Project Title (English)</label>
              <input name="titleEn" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التصنيف (مهرجان، تنمية، تراث...)</label>
              <input name="category" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>صورة المشروع (WebP)</label>
              <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingTop: '1.5rem' }}>
              <input type="checkbox" name="needsFunding" id="needsFunding" />
              <label htmlFor="needsFunding" style={{ fontWeight: 'bold' }}>يحتاج لدعم تمويلي</label>
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

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', border: 'none' }}>حفظ المشروع الجديد</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {allProjects.map((p) => (
          <div key={p.id} style={{ border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
            {p.imageUrl && <img src={p.imageUrl} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
            <div style={{ padding: '1.5rem' }}>
              <h3>{p.titleAr}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.descriptionAr?.substring(0, 80)}...</p>
              <form action={deleteProject} style={{ marginTop: '1rem' }}>
                 <input type="hidden" name="projectId" value={p.id} />
                 <button type="submit" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>حذف المشروع</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
