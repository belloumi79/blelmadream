import { db } from '@/db';
import { events } from '@/db/schema';
import { createEvent } from '@/app/actions/events';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const allEvents = await db.select().from(events);

  return (
    <div>
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>إدارة الأحداث والمهرجانات</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>قم بإضافة الفعاليات التي تنظمها الجمعية لعرضها على الموقع.</p>

      {/* Form */}
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--brand-green)', marginBottom: '1.5rem' }}>إضافة حدث جديد</h2>
        <form action={createEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>عنوان الحدث (بالعربية)</label>
            <input name="titleAr" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تاريخ الحدث</label>
            <input name="date" type="date" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
          </div>
           <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تحميل صورة للحدث</label>
            <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            <small style={{ color: 'var(--brand-blue)', display: 'block', marginTop: '0.5rem' }}>
              * اختر صورة من جهازك بصيغة JPG، PNG أو WebP.
            </small>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التفاصيل (بالعربية)</label>
            <textarea name="contentAr" required rows={5} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', resize: 'vertical' }}></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '1rem', border: 'none' }}>حفظ الحدث الجديد</button>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 style={{ color: 'var(--brand-blue)', marginBottom: '1.5rem' }}>الأحداث الحالية</h2>
        {allEvents.length === 0 ? (
          <p>لا توجد أحداث مضافة بعد.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {allEvents.map((evt) => (
              <div key={evt.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white' }}>
                {evt.imageUrl ? (
                  <img src={evt.imageUrl} alt={evt.titleAr} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <div style={{ width: '120px', height: '120px', background: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>بدون صورة</div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--brand-blue)' }}>{evt.titleAr}</h3>
                  <p style={{ color: 'var(--brand-green)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{evt.date}</p>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {evt.contentAr.length > 150 ? evt.contentAr.substring(0, 150) + '...' : evt.contentAr}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
