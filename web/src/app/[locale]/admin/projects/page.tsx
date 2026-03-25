import { db } from '@/db';
import { projects } from '@/db/schema';
import { createProject, deleteProject } from '@/app/actions/projects';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const allProjects = await db.select().from(projects);

  return (
    <div>
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>إدارة المشاريع</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        أضف المشاريع الحالية المقتبسة من نشاطات الجمعية على فيسبوك لعرضها في الموقع.
      </p>

      {/* Suggestion Box */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h3 style={{ color: '#166534', marginTop: 0, marginBottom: '0.5rem' }}>أفكار لمشاريع (من فيسبوك):</h3>
        <ul style={{ fontSize: '0.9rem', color: '#14532d', paddingRight: '1.2rem' }}>
          <li><b>ماراطون الشلالات (4):</b> تظاهرة رياضية سياحية كبرى (12 أفريل 2026).</li>
          <li><b>تهيئة المسار الريفي:</b> بناء استراحات وممرات لهواة الطبيعة والرياضيين.</li>
          <li><b>الخيمة النموذجية:</b> معرض قار للمنتجات المحلية (زيت، عسل، صناعات يدوية).</li>
          <li><b>مهرجان التراث والفروسية:</b> احتفال بالخيول والتقاليد في أواخر أوت.</li>
          <li><b>دعم ريادة الأعمال الريفية:</b> تأطير الشباب والتمكين الاقتصادي للعائلات.</li>
        </ul>
      </div>

      {/* Form */}
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--brand-green)', marginBottom: '1.5rem' }}>إضافة مشروع جديد</h2>
        <form action={createProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم المشروع (بالعربية)</label>
              <input name="titleAr" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التصنيف (الرياضة، التنمية، التراث...)</label>
              <input name="category" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الاسم بالفرنسية (Title FR)</label>
               <input name="titleFr" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
             </div>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>رابط الصورة (URL)</label>
               <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
             </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>الوصف المختصر (بالعربية)</label>
            <textarea name="descriptionAr" rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <input type="checkbox" name="needsFunding" id="needsFunding" style={{ width: '1.2rem', height: '1.2rem' }} />
            <label htmlFor="needsFunding" style={{ fontWeight: 'bold', userSelect: 'none' }}>مشروع يحتاج لدعم تمويلي</label>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1.5rem', border: 'none' }}>حفظ المشروع الجديد</button>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 style={{ color: 'var(--brand-blue)', marginBottom: '1.5rem' }}>المشاريع المضافة</h2>
        {allProjects.length === 0 ? (
          <p>لا توجد مشاريع مضافة حتى الآن.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {allProjects.map((p) => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.titleAr} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--brand-green)', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                      {p.category}
                    </span>
                    {p.needsFunding && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#dc2626', background: '#fef2f2', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                        يحتاج تمويل
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--brand-blue)' }}>{p.titleAr}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, minHeight: '60px' }}>
                    {p.descriptionAr}
                  </p>
                  
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <form action={deleteProject}>
                      <input type="hidden" name="projectId" value={p.id} />
                      <button type="submit" style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 'bold' }}>
                        حذف المشروع
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
