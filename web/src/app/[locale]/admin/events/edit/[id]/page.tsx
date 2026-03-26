import { db } from '@/db';
import { events } from '@/db/schema';
import { updateEvent } from '@/app/actions/events';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ 
  params 
}: { 
  params: Promise<{ locale: string, id: string }> 
}) {
  const { id, locale } = await params;
  const [event] = await db.select().from(events).where(eq(events.id, id));

  if (!event) {
    notFound();
  }

  return (
    <div dir="rtl" style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--brand-blue)', fontSize: '2rem', marginBottom: '1rem' }}>تعديل الحدث</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>قم بتعديل بيانات الحدث الحالي.</p>

      <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px' }}>
        <form action={updateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="hidden" name="id" value={event.id} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>اسم الحدث (بالعربية)*</label>
              <input name="titleAr" type="text" defaultValue={event.titleAr} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nom de l'évènement (Français)</label>
              <input name="titleFr" type="text" defaultValue={event.titleFr || ''} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Event Title (English)</label>
              <input name="titleEn" type="text" defaultValue={event.titleEn || ''} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تاريخ الحدث</label>
               <input name="date" type="date" defaultValue={event.date || ''} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
             </div>
             <div>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>تغيير الصورة (اتركها فارغة للحفاظ على الحالية)</label>
               <input name="imageFile" type="file" accept="image/*" style={{ width: '100%', padding: '0.5rem' }} />
               {event.imageUrl && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>الصورة الحالية: <a href={event.imageUrl} target="_blank">رابط</a></p>}
             </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>التفاصيل (بالعربية)*</label>
              <textarea name="contentAr" defaultValue={event.contentAr} required rows={6} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (Français)</label>
              <textarea name="contentFr" defaultValue={event.contentFr || ''} rows={6} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
            <div dir="ltr">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description (English)</label>
              <textarea name="contentEn" defaultValue={event.contentEn || ''} rows={6} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ border: 'none' }}>تحديث الحدث</button>
            <a href={`/${locale}/admin/events`} className="btn-secondary" style={{ textDecoration: 'none' }}>إلغاء</a>
          </div>
        </form>
      </div>
    </div>
  );
}
