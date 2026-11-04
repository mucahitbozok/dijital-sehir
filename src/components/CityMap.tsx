import type { DistrictId } from '../types';
import { DISTRICTS, DISTRICT_BY_ID } from '../data/districts';
import type { DistrictStats } from '../game/progress';
import mapBackground from '../assets/brand/dijital-sehir-harita.jpg';

interface Props {
  stats: Record<DistrictId, DistrictStats>;
  onSelect: (id: DistrictId) => void;
}

interface BuildingTarget {
  id: DistrictId;
  x: number;
  y: number;
  w: number;
  h: number;
  badgeX: number;
  badgeY: number;
  glowColor: string;
}

const BUILDINGS: BuildingTarget[] = [
  {
    id: 'teknoloji',
    x: 235,
    y: 115,
    w: 195,
    h: 200,
    badgeX: 332,
    badgeY: 310,
    glowColor: '#00e5ff',
  },
  {
    id: 'toplum',
    x: 475,
    y: 110,
    w: 200,
    h: 185,
    badgeX: 575,
    badgeY: 285,
    glowColor: '#ff9100',
  },
  {
    id: 'guvenlik',
    x: 730,
    y: 125,
    w: 205,
    h: 195,
    badgeX: 832,
    badgeY: 312,
    glowColor: '#2979ff',
  },
  {
    id: 'yapayzeka',
    x: 230,
    y: 285,
    w: 210,
    h: 200,
    badgeX: 335,
    badgeY: 480,
    glowColor: '#d500f9',
  },
  {
    id: 'atolye',
    x: 500,
    y: 335,
    w: 210,
    h: 200,
    badgeX: 605,
    badgeY: 528,
    glowColor: '#ffd600',
  },
  {
    id: 'dosya',
    x: 750,
    y: 300,
    w: 210,
    h: 205,
    badgeX: 855,
    badgeY: 498,
    glowColor: '#00e676',
  },
];

export function CityMap({ stats, onSelect }: Props) {
  return (
    <div className="city-map-wrap">
      <svg
        className="city-map"
        viewBox="0 0 1024 576"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Dijital Şehir haritası. Altı oyun bölgesi."
      >
        <defs>
          <filter id="cityBuildingGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ffffff" floodOpacity="0.8" />
          </filter>
          <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 16:9 Canlı Dijital Şehir Arka Planı */}
        <image
          href={mapBackground}
          width="1024"
          height="576"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* 6 İnteraktif Bina Alanı */}
        {BUILDINGS.map((b) => {
          const district = DISTRICT_BY_ID[b.id];
          const stat = stats[b.id];
          const isDone = stat?.completed;
          const starsCount = stat?.stars || 0;
          const answeredCount = stat?.answered || 0;
          const totalCount = stat?.total || 10;

          return (
            <g
              key={b.id}
              className={`city-building-hotspot${isDone ? ' city-building-hotspot--done' : ''}`}
              role="button"
              tabIndex={0}
              aria-label={`${district.name}, ${district.outcome}. ${answeredCount} / ${totalCount} görev tamamlandı. ${
                isDone ? 'Bölge tamamlandı.' : 'Bölgeye git.'
              }`}
              onClick={() => onSelect(b.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(b.id);
                }
              }}
            >
              <title>{`${district.name} (${district.outcome}) — ${answeredCount}/${totalCount} görev`}</title>

              {/* Tıklanabilir ve parlayan bina çerçevesi */}
              <rect
                className="city-building-hitbox"
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="20"
                ry="20"
                style={{ '--glow-color': b.glowColor } as React.CSSProperties}
              />

              {/* Dinamik Başarı Rozeti (Yıldızlar ve Tamamlandı Durumu) */}
              <g
                className="city-building-badge"
                transform={`translate(${b.badgeX}, ${b.badgeY})`}
                filter="url(#badgeShadow)"
                pointerEvents="none"
              >
                <rect
                  x="-55"
                  y="-12"
                  width="110"
                  height="24"
                  rx="12"
                  className="city-building-badge-bg"
                />
                <text
                  x="-42"
                  y="4"
                  className="city-building-badge-text"
                >
                  {isDone ? '✓ TAMAM' : `${answeredCount}/${totalCount}`}
                </text>
                <text
                  x="26"
                  y="4.5"
                  className="city-building-badge-stars"
                >
                  ★ {starsCount}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Alt Açıklama / Lejant */}
      <div className="map-legend" aria-hidden="true">
        {DISTRICTS.map((district) => (
          <span key={district.id} className="map-legend__item">
            <span className="map-legend__dot" style={{ background: district.color }} />
            {district.shortName}
          </span>
        ))}
      </div>
    </div>
  );
}
