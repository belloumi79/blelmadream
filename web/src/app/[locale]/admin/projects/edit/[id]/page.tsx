import { db } from '@/db';
import { projects } from '@/db/schema';
import { updateProject } from '@/app/actions/projects';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ 
  params 
}: { 
  params: Promise<{ locale: string, id: string }> 
}) {
  const { id, locale } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, id));

  if (!project) {
    notFound();
  }

  return (
    <div dir="rtl" style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>تعديل المشروع</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>قم بتعديل بيانات المشروع الحالي.</p>

      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px' }}>
        <form action={updateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="id" value={project.id} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المشروع (بالعربية)*</label>
              <input name="titleAr" type="text" defaultValue={project.titleAr} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom du projet (Français)</label>
              <input name="titleFr" type="text" defaultValue={project.titleFr || ''} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Project Title (English)</label>
              <input name="titleEn" type="text" defaultValue={project.titleEn || ''} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التصنيف</label>
              <input name="category" type="text" defaultValue={project.category} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تغيير الصورة (WebP تلقائياً)</label>
              <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
              {project.imageUrl && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>الصورة الحالية: <a href={project.imageUrl} target="_blank">رابط</a></p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>رابط خارجي</label>
              <input name="externalLink" type="url" defaultValue={project.externalLink || ''} placeholder="https://..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', paddingTop: '1.5rem' }}>
              <input type="checkbox" name="needsFunding" id="needsFunding" defaultChecked={project.needsFunding || false} />
              <label htmlFor="needsFunding" style={{ fontWeight: 'bold' }}>يحتاج لدعم تمويلي</label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الوصف (Ar)</label>
              <textarea name="descriptionAr" defaultValue={project.descriptionAr || ''} rows={5} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (Fr)</label>
              <textarea name="descriptionFr" defaultValue={project.descriptionFr || ''} rows={5} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (En)</label>
              <textarea name="descriptionEn" defaultValue={project.descriptionEn || ''} rows={5} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ border: 'none' }}>تحديث المشروع</button>
            <a href={`/${locale}/admin/projects`} className="btn-secondary" style={{ textDecoration: 'none' }}>إلغاء</a>
          </div>
        </form>
      </div>
    </div>
  );
}
