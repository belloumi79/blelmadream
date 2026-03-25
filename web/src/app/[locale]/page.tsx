import { getTranslations } from 'next-intl/server';
import { HardHat, Leaf, Code, Globe2, Sparkles, Heart } from "lucide-react";
import EventsList from '@/components/EventsList';
import ProjectsList from '@/components/ProjectsList';
import ProductsList from '@/components/ProductsList';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations('Hero');
  const impact = await getTranslations('Impact');
  const pillars = await getTranslations('Pillars');

  return (
    <>
      <section className="hero">
        <div className="hero-decoration"></div>
        <div className="hero-content">
          <span className="hero-subtitle">{t('subtitle')}</span>
          <h1 dangerouslySetInnerHTML={{ __html: t('title') }}></h1>
          <p>{t('description')}</p>
          <div className="hero-actions">
            <a href="#about" className="btn-primary">{t('cta_discover')}</a>
            <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="btn-secondary">{t('cta_contact')}</a>
          </div>
        </div>
      </section>

      <section id="about" className="section bg-blue-tint">
        <div className="nav-container" style={{ textAlign: "center" }}>
          <h2>{impact('title')}</h2>
          <p>{impact('subtitle')}</p>
          <div className="grid">
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Heart size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>{impact('stat1_title')}</h3>
              <p>{impact('stat1_desc')}</p>
            </div>
            {/* ... other stats */}
          </div>
        </div>
      </section>

      <EventsList locale={locale} />
      <ProjectsList locale={locale} />
      <ProductsList />
    </>
  );
}
