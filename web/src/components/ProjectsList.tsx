import { db } from '@/db';
import { projects } from '@/db/schema';
import { Heart, Landmark, Sprout } from 'lucide-react';

export default async function ProjectsList({ locale }: { locale: string }) {
  const allProjects = await db.select().from(projects);

  if (allProjects.length === 0) return null;

  return (
    <section className="section bg-secondary">
      <div className="nav-container">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--brand-blue)' }}>مشاريعنا والنشاطات الميدانية</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 4rem auto' }}>
          تعرف على المبادرات والمشاريع التي تقودها الجمعية في منطقة البلالـمة من أجل تنمية ريفية مستدامة وشاملة.
        </p>

        <div className="grid">
          {allProjects.map((project) => (
            <div key={project.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {project.imageUrl && (
                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                    <img 
                        src={project.imageUrl} 
                        alt={project.titleAr} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </div>
              )}
              <div style={{ padding: '2rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--brand-green)', fontWeight: 'bold' }}>{project.category}</span>
                    {project.needsFunding && (
                        <span style={{ fontSize: '0.8rem', color: '#dc2626', fontWeight: 'bold' }}>دعم مطلوب ❤️</span>
                    )}
                </div>
                <h3>{project.titleAr}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{project.descriptionAr}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .bg-secondary {
          background-color: var(--bg-secondary);
        }
      `}</style>
    </section>
  );
}
