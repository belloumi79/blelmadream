import { getTranslations } from 'next-intl/server';
import { HardHat, Leaf, Code, Globe2, Sparkles, Heart } from "lucide-react";
import EventsList from '@/components/EventsList';
import ProjectsList from '@/components/ProjectsList';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const t = await getTranslations('Hero');
  const impact = await getTranslations('Impact');
  const pillars = await getTranslations('Pillars');

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-decoration"></div>
        <div className="hero-content">
          <span className="hero-subtitle">{t('subtitle')}</span>
          <h1 dangerouslySetInnerHTML={{ __html: t('title') }}></h1>
          <p>
            {t('description')}
          </p>
          <div className="hero-actions">
            <a href="#about" className="btn-primary">
              {t('cta_discover')}
            </a>
            <a href="https://www.facebook.com/profile.php?id=100066988150540" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              {t('cta_contact')}
            </a>
          </div>
        </div>
      </section>

      {/* IMPACT / STATS */}
      <section id="about" className="section bg-blue-tint">
        <div className="nav-container" style={{ textAlign: "center" }}>
          <h2>{impact('title')}</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto", opacity: 0.9 }}>
            {impact('subtitle')}
          </p>
          
          <div className="grid">
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Heart size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>{impact('stat1_title')}</h3>
              <p>{impact('stat1_desc')}</p>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Sparkles size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>{impact('stat2_title')}</h3>
              <p>{impact('stat2_desc')}</p>
            </div>
            <div className="card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
              <div className="card-icon"><Globe2 size={48} color="var(--brand-yellow)" /></div>
              <h3 style={{ color: "white" }}>{impact('stat3_title')}</h3>
              <p>{impact('stat3_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS & FESTIVALS */}
      <EventsList locale={locale} />

      {/* CORE PILLARS */}
      <section id="projects" className="section">
        <div className="nav-container">
            <h2 style={{ textAlign: 'center' }}>{pillars('title')}</h2>
            <p style={{ textAlign: "center", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 3rem auto" }}>
            {pillars('subtitle')}
            </p>

            <div className="grid">
            <div className="card">
                <div className="card-icon">
                <Leaf size={40} color="var(--brand-green)" />
                </div>
                <h3>{pillars('pillar1_title')}</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                {pillars('pillar1_desc')}
                </p>
            </div>
            <div className="card">
                <div className="card-icon">
                <HardHat size={40} color="var(--brand-blue)" />
                </div>
                <h3>{pillars('pillar2_title')}</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                {pillars('pillar2_desc')}
                </p>
            </div>
            <div className="card">
                <div className="card-icon">
                <Code size={40} color="var(--brand-yellow)" />
                </div>
                <h3>{pillars('pillar3_title')}</h3>
                <p style={{ color: "var(--text-secondary)" }}>
                {pillars('pillar3_desc')}
                </p>
            </div>
            </div>
        </div>
      </section>

      {/* REAL PROJECTS LIST FROM DB */}
      <ProjectsList locale={locale} />
    </>
  );
}
