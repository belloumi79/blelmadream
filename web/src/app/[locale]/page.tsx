import { getTranslations } from 'next-intl/server';
import { Heart } from 'lucide-react';
import EventsList from '@/components/EventsList';
import ProjectsList from '@/components/ProjectsList';
import ProductsList from '@/components/ProductsList';
import SignupForm from '@/components/SignupForm';
import WeatherWidget from '@/components/WeatherWidget';

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
            <a href="#signup" className="btn-secondary">{locale === 'ar' ? 'انضم إلينا' : 'Rejoignez-nous'}</a>
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

      <section className="section bg-blue-tint" style={{ padding: '0 0 4rem 0' }}>
        <div className="nav-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <WeatherWidget />
        </div>
      </section>

      <EventsList locale={locale} />
      <ProjectsList locale={locale} />
      <ProductsList />
      
      <section id="signup" style={{ padding: '4rem 0', background: '#fff' }}>
        <SignupForm />
      </section>
    </>
  );
}
