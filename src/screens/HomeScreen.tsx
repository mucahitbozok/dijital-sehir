import type { CSSProperties } from 'react';
import type { AppData, DistrictId, Mode } from '../types';
import { DISTRICTS } from '../data/districts';
import { districtStats, overallStats } from '../game/progress';
import type { DistrictStats } from '../game/progress';
import { CityMap } from '../components/CityMap';
import { CharacterGuide } from '../components/CharacterGuide';
import { BadgeIcon } from '../components/BadgeIcon';
import { DistrictIcon } from '../components/DistrictIcon';
import { Stars } from '../components/Stars';

interface Props {
  data: AppData;
  mode: Mode;
  onSelectDistrict: (id: DistrictId) => void;
  onOpenFinal: () => void;
}

export function HomeScreen({ data, mode, onSelectDistrict, onOpenFinal }: Props) {
  const statsById = DISTRICTS.reduce(
    (acc, district) => {
      acc[district.id] = districtStats(data, mode, district.id);
      return acc;
    },
    {} as Record<DistrictId, DistrictStats>,
  );
  const overall = overallStats(data, mode);

  const guideMessage =
    overall.badges === 0
      ? 'Merhaba! Ben Öğretmen Bozok. Şehirdeki altı binadan birine dokunarak maceraya başla.'
      : overall.allComplete
        ? 'Tebrikler! Altı bölgenin rozetini de topladın. Ödül töreni seni bekliyor!'
        : `${overall.badges} rozet kazandın! Kalan bölgeleri tamamlayıp altı rozeti toplayabilirsin.`;

  return (
    <main className="home-screen">
      <CityMap stats={statsById} onSelect={onSelectDistrict} />

      <div className="home-badge-shelf" aria-label="Rozetler">
        <span className="home-badge-shelf__title">Rozetlerin</span>
        <div className="home-badge-shelf__list">
          {DISTRICTS.map((district) => (
            <BadgeIcon
              key={district.id}
              icon={district.icon}
              color={district.color}
              size={34}
              earned={statsById[district.id].completed}
              title={`${district.name} rozeti${statsById[district.id].completed ? ' kazanıldı' : ' kazanılmadı'}`}
            />
          ))}
        </div>
        <span className="home-badge-shelf__count">{overall.badges}/6</span>
      </div>

      <CharacterGuide message={guideMessage} />

      {overall.allComplete && (
        <button type="button" className="final-banner" onClick={onOpenFinal}>
          <span className="final-banner__icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
              <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5M12 12v4M9 20h6M10 16h4v4h-4z" />
            </svg>
          </span>
          <span>
            <strong>Altı rozet tamam!</strong>
            <small>Ödül törenine git</small>
          </span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      <div className="mobile-home">
        <div className="mobile-home__guide">
          <CharacterGuide message={guideMessage} compact />
        </div>
        <div className="mobile-home__intro">
          <p className="eyebrow">5. SINIF BİLİŞİM TEKNOLOJİLERİ · 1. TEMA</p>
          <h1>Dijital Şehir</h1>
          <p>Altı bölge, 60 görev. Bir bölge seçerek başla.</p>
        </div>
        <div className="mobile-district-grid">
          {DISTRICTS.map((district) => {
            const stat = statsById[district.id];
            return (
              <button
                key={district.id}
                type="button"
                className="mobile-district-card"
                style={{ '--district-color': district.color } as unknown as CSSProperties}
                onClick={() => onSelectDistrict(district.id)}
              >
                <span className="mobile-district-card__icon" style={{ color: district.dark, background: district.light }}>
                  <DistrictIcon icon={district.icon} size={30} />
                </span>
                <span className="mobile-district-card__body">
                  <strong>{district.name}</strong>
                  <small>{district.outcome}</small>
                  <span className="mobile-district-card__meta">
                    <span>{stat.answered}/{stat.total} görev</span>
                    <Stars value={stat.stars} size={15} />
                  </span>
                </span>
                {stat.completed && <span className="mobile-district-card__done" aria-label="Tamamlandı">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
