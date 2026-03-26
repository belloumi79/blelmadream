import { db } from '@/db';
import { events } from '@/db/schema';
import { createEvent, deleteEvent } from '@/app/actions/events';
import { desc } from 'drizzle-orm';
import { Pencil, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const allEvents = await db.select().from(events).orderBy(desc(events.date));

  return (
    <div dir="rtl">
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>إدارة الأحداث والمهرجانات</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>قم بإضافة الفعاليات التي تنظمها الجمعية لعرضها على الموقع بجميع اللغات.</p>

      {/* Form */}
      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--brand-green)', marginBottom: '1.5rem' }}>إضافة حدث جديد</h2>
        <form action={createEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم الحدث (بالعربية)*</label>
              <input name="titleAr" type="text" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom de l'évènement (Français)</label>
              <input name="titleFr" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event Title (English)</label>
              <input name="titleEn" type="text" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تاريخ الحدث</label>
               <input name="date" type="date" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
             </div>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>صورة الحدث (WebP تلقائياً)</label>
               <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التفاصيل (بالعربية)*</label>
              <textarea name="contentAr" required rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (Français)</label>
              <textarea name="contentFr" rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (English)</label>
              <textarea name="contentEn" rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', border: 'none' }}>حفظ الحدث الجديد</button>
        </form>
      </div>
      <div>
        <h2 style={{ color: 'var(--brand-blue)', marginBottom: '1.5rem' }}>الأحداث الحالية</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {allEvents.map((evt) => (
            <div key={evt.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'white', alignItems: 'center' }}>
              {evt.imageUrl && <img src={evt.imageUrl} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{evt.titleAr}</h3>
                <p style={{ color: 'var(--brand-green)', fontSize: '0.8rem' }}>{evt.date}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{evt.contentAr.substring(0, 100)}...</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={`/${locale}/admin/events/edit/${evt.id}`} style={{ color: 'var(--brand-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pencil size={18} />
                  تعديل
                </a>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={evt.id} />
                  <button type="submit" style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trash2 size={18} />
                    حذف
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
