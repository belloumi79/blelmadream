import { db } from '@/db';
import { projects } from '@/db/schema';
import { Heart, Activity, Construction } from 'lucide-react';

export default async function ProjectsList({ locale }: { locale: string }) {
  const allProjects = await db.select().from(projects);

  if (allProjects.length === 0) return null;

  const labels = {
    ar: { title: 'مبادراتنا ومشاريعنا', subtitle: 'تعرف على المبادرات والمشاريع التي تقودها الجمعية في منطقة البلالـمة من أجل تنمية ريفية مستدامة وشاملة.', fund: 'دعم مطلوب' },
    fr: { title: 'Nos Initiatives & Projets', subtitle: 'Découvrez les projets portés par l’association dans la région de Blelma pour un développement rural durable.', fund: 'Soutien Requis' },
    en: { title: 'Our Initiatives & Projects', subtitle: 'Explore the projects led by the association in the Blelma region for sustainable rural development.', fund: 'Support Required' }
  }[locale] || { title: 'Projects', subtitle: '', fund: 'Required' };

  return (
    <section id="projects" className="section" style={{ background: '#f8fafc', padding: '6rem 0' }}>
      <div className="nav-container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--brand-blue)', marginBottom: '1.2rem' }}>{labels.title}</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            {labels.subtitle}
          </p>
        </div>

        <div className="grid">
          {allProjects.map((project) => {
            const title = locale === 'en' ? (project.titleEn || project.titleAr) : locale === 'fr' ? (project.titleFr || project.titleAr) : project.titleAr;
            const desc = locale === 'en' ? (project.descriptionEn || project.descriptionAr) : locale === 'fr' ? (project.descriptionFr || project.descriptionAr) : project.descriptionAr;

            return (
              <div key={project.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }}>
                <div style={{ position: 'relative', height: '240px' }}>
                  {project.imageUrl ? (
                    <img 
                        src={project.imageUrl} 
                        alt={title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Construction size={48} color="#94a3b8" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--brand-blue)', color: 'white', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {project.category}
                  </div>
                </div>
                
                <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--brand-green)' }}>
                        <Activity size={16} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Active</span>
                      </div>
                      {project.needsFunding && (
                        <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          <Heart size={16} fill="#ef4444" />
                          <span>{labels.fund}</span>
                        </div>
                      )}
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--brand-blue)' }}>{title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', flex: 1 }}>
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
