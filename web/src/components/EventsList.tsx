import { getTranslations } from 'next-intl/server';
import { db } from '@/db';
import { events } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { Calendar } from 'lucide-react';

export default async function EventsList({ locale }: { locale: string }) {
  const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));
  const t = await getTranslations({ locale, namespace: 'EventsList' });

  if (allEvents.length === 0) return null;

  return (
    <section className="section bg-light">
      <div className="nav-container" style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: "1rem" }}>{t('title')}</h2>
        <p style={{ maxWidth: "600px", margin: "0 auto 3rem auto", color: "var(--text-secondary)" }}>
          {t('subtitle')}
        </p>
        
        <div className="grid">
          {allEvents.map((evt) => {
            // Determine which language fields to show depending on locale
            const title = locale === 'en' ? (evt.titleEn || evt.titleAr) : locale === 'fr' ? (evt.titleFr || evt.titleAr) : evt.titleAr;
            const content = locale === 'en' ? (evt.contentEn || evt.contentAr) : locale === 'fr' ? (evt.contentFr || evt.contentAr) : evt.contentAr;

            return (
              <div key={evt.id} className="card" style={{ padding: 0, overflow: 'hidden', textAlign: 'start' }}>
                {evt.imageUrl && (
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                    <img 
                      src={evt.imageUrl} 
                      alt={title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                <div style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--brand-blue)' }}>{title}</h3>
                  {evt.date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-green)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      <Calendar size={18} />
                      <span>{evt.date}</span>
                    </div>
                  )}
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>{content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
