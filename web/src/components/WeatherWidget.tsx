import { getTranslations } from 'next-intl/server';
import { Cloud, Wind, Thermometer, Leaf } from 'lucide-react';

export default async function WeatherWidget() {
  const t = await getTranslations('Weather');

  let weatherData = null;
  let aqData = null;

  try {
    const [weatherRes, aqRes] = await Promise.all([
      fetch("https://api.open-meteo.com/v1/forecast?latitude=36.9957222&longitude=9.3860589&current_weather=true&timezone=auto", {
        next: { revalidate: 3600 } // Cache for 1 hour
      }),
      fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=36.9957222&longitude=9.3860589&current=european_aqi&timezone=auto", {
        next: { revalidate: 3600 } // Cache for 1 hour
      })
    ]);

    if (weatherRes.ok) weatherData = await weatherRes.json();
    if (aqRes.ok) aqData = await aqRes.json();
  } catch (err) {
    console.error("Failed to fetch weather or air quality", err);
  }

  if (!weatherData?.current_weather) {
    return null;
  }

  const current = weatherData.current_weather;
  const aqi = aqData?.current?.european_aqi;

  let aqiColor = "var(--brand-green, #10b981)";
  if (aqi !== undefined) {
    if (aqi > 40) aqiColor = "var(--brand-yellow, #f59e0b)";
    if (aqi > 60) aqiColor = "#ef4444"; // red
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginTop: '2rem', maxWidth: '800px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--brand-yellow)', padding: '1rem', borderRadius: '50%', color: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Cloud size={32} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{t('title')}</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{current.time.replace('T', ' ')}</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Thermometer size={28} color="var(--brand-green, #10b981)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--text-secondary)' }}>{t('temperature')}</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{current.temperature}°C</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <Wind size={28} color="#3b82f6" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--text-secondary)' }}>{t('wind')}</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{current.windspeed} km/h</span>
          </div>
        </div>
        {aqi !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Leaf size={28} color={aqiColor} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--text-secondary)' }}>{t('aqi')}</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--text-primary)' }}>{aqi}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
