import type { DistrictId } from '../types';
import { DISTRICTS, DISTRICT_BY_ID } from '../data/districts';
import type { DistrictStats } from '../game/progress';
import { DistrictIcon } from './DistrictIcon';

interface Props {
  stats: Record<DistrictId, DistrictStats>;
  onSelect: (id: DistrictId) => void;
}

const PX: Record<
  DistrictId,
  { x: number; y: number; rx: number; ry: number; h: number }
> = {
  yapayzeka: { x: 800, y: 355, rx: 108, ry: 54, h: 176 },
  teknoloji: { x: 330, y: 420, rx: 112, ry: 54, h: 142 },
  dosya: { x: 1120, y: 390, rx: 104, ry: 50, h: 152 },
  toplum: { x: 520, y: 700, rx: 116, ry: 56, h: 126 },
  guvenlik: { x: 1000, y: 700, rx: 106, ry: 52, h: 168 },
  atolye: { x: 1330, y: 700, rx: 110, ry: 52, h: 136 },
};

const PALETTE: Record<
  DistrictId,
  { top: string; right: string; left: string; glow: string }
> = {
  teknoloji: { top: '#67e8f9', right: '#06b6d4', left: '#0e7490', glow: '#22d3ee' },
  toplum: { top: '#fdba74', right: '#f97316', left: '#c2410c', glow: '#fb923c' },
  guvenlik: { top: '#93c5fd', right: '#3b82f6', left: '#1d4ed8', glow: '#60a5fa' },
  yapayzeka: { top: '#c4b5fd', right: '#8b5cf6', left: '#6d28d9', glow: '#a78bfa' },
  atolye: { top: '#fde047', right: '#eab308', left: '#a16207', glow: '#facc15' },
  dosya: { top: '#86efac', right: '#22c55e', left: '#15803d', glow: '#4ade80' },
};

const RENDER_ORDER: DistrictId[] = [
  'yapayzeka',
  'teknoloji',
  'dosya',
  'toplum',
  'guvenlik',
  'atolye',
];

function Windows({
  face,
  rx,
  ry,
  h,
}: {
  face: 'left' | 'right';
  rx: number;
  ry: number;
  h: number;
}) {
  const placements =
    face === 'right' ? [0.18, 0.46, 0.18, 0.52] : [0.22, 0.52, 0.22];
  const wt = 0.16;
  const top = h * 0.22;
  const wh = h * 0.2;

  return (
    <g>
      {placements.map((t, index) => {
        const x1 = face === 'right' ? t * rx : -rx + t * rx;
        const y1 = face === 'right' ? ry * (1 - t) : ry * t;
        const x2 = face === 'right' ? (t + wt) * rx : -rx + (t + wt) * rx;
        const y2 =
          face === 'right' ? ry * (1 - t - wt) : ry * (t + wt);
        const points = `${x1},${y1 - top} ${x2},${y2 - top} ${x2},${y2 - top - wh} ${x1},${y1 - top - wh}`;
        return (
          <polygon
            key={index}
            points={points}
            fill="rgba(255,255,255,0.82)"
            stroke="rgba(15,23,42,0.12)"
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}

function RoofDecor({
  district,
  rx,
  h,
}: {
  district: DistrictId;
  rx: number;
  h: number;
}) {
  const palette = PALETTE[district];

  switch (district) {
    case 'teknoloji':
      return (
        <g>
          <line x1="34" y1={-h - 8} x2="34" y2={-h - 78} stroke="#334155" strokeWidth="5" />
          <circle className="city-blink" cx="34" cy={-h - 82} r="7" fill={palette.glow} />
          <g transform={`translate(-44 ${-h - 34}) rotate(-18)`}>
            <ellipse cx="0" cy="0" rx="30" ry="12" fill="#e0f2fe" stroke="#0e7490" strokeWidth="3" />
            <line x1="0" y1="10" x2="0" y2="34" stroke="#0e7490" strokeWidth="3" />
            <circle cx="0" cy="-2" r="4" fill="#0e7490" />
          </g>
          <g opacity="0.9">
            <circle cx="-46" cy={-h + 22} r="5" fill="#ecfeff" />
            <circle cx="58" cy={-h + 38} r="4" fill="#ecfeff" />
          </g>
        </g>
      );
    case 'toplum':
      return (
        <g>
          <line x1="-26" y1={-h - 6} x2="-26" y2={-h - 96} stroke="#78350f" strokeWidth="5" />
          <path
            d={`M -26 ${-h - 96} L 34 ${-h - 82} L -26 ${-h - 64} Z`}
            fill="#fb923c"
            stroke="#c2410c"
            strokeWidth="2"
          />
          <g fill="rgba(255,255,255,0.85)" stroke="#fed7aa" strokeWidth="1">
            <rect x="-54" y={-h + 34} width="10" height={h * 0.5} rx="3" />
            <rect x="-18" y={-h + 54} width="10" height={h * 0.45} rx="3" />
            <rect x="20" y={-h + 74} width="10" height={h * 0.4} rx="3" />
          </g>
          <path
            d={`M -${rx - 12} 6 L -${rx - 12} 20 L ${rx + 10} 20 L ${rx + 10} 6`}
            fill="none"
            stroke="#fed7aa"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      );
    case 'guvenlik':
      return (
        <g>
          <g transform={`translate(44 ${-h * 0.44})`}>
            <polygon
              points="0,-34 26,-21 26,12 0,27 -26,12 -26,-21"
              fill="#eff6ff"
              stroke="#1d4ed8"
              strokeWidth="3"
            />
            <path d="m-12 -2 8 8 17 -17" fill="none" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <circle cx="-48" cy={-h + 6} r="7" fill="#fef08a" stroke="#a16207" strokeWidth="2" />
          <rect x="-54" y={-h + 13} width="12" height="18" rx="3" fill="#1e3a8a" />
        </g>
      );
    case 'yapayzeka':
      return (
        <g>
          <path
            d={`M -68 ${-h - 2} C -68 ${-h - 74} 68 ${-h - 74} 68 ${-h - 2} Z`}
            fill="#f5f3ff"
            stroke="#7c3aed"
            strokeWidth="3.5"
          />
          <path d="M 0 -h-58 v 26 M -16 -h-38 h 32" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
          <g>
            <circle cx="-96" cy={-h - 30} r="8" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
            <circle cx="100" cy={-h - 44} r="6" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="2" />
            <circle cx="64" cy={-h - 92} r="5" fill="#f0abfc" />
            <circle cx="-50" cy={-h - 86} r="4" fill="#c4b5fd" />
          </g>
          <g opacity="0.85">
            <line x1="-68" y1={-h - 40} x2="-88" y2={-h - 38} stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 5" />
            <line x1="68" y1={-h - 44} x2="92" y2={-h - 40} stroke="#a78bfa" strokeWidth="2" strokeDasharray="3 5" />
          </g>
        </g>
      );
    case 'atolye':
      return (
        <g transform={`translate(0 ${-h - 4})`}>
          <path d="M -64 0 L -64 -58 L 64 -58 L 64 0 Z" fill="#78350f" stroke="#451a03" strokeWidth="3" />
          <path d="M -52 -7 L -52 -48 L 52 -48 L 52 -7 Z" fill="#0f766e" />
          <path d="M -40 -18 h 22 M -40 -30 h 34 M -40 -41 h 16" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
          <rect x="-12" y="-58" width="24" height="9" rx="4" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
          <circle cx="46" cy="-20" r="11" fill="#fde68a" stroke="#a16207" strokeWidth="2.5" />
          <path d="M 46 -31 v 22 M 35 -20 h 22" stroke="#a16207" strokeWidth="2.5" />
        </g>
      );
    case 'dosya':
      return (
        <g>
          {[0, 1, 2].map((layer) => (
            <g key={layer} transform={`translate(0 ${-h - 12 - layer * 22})`}>
              <path
                d={`M -62 ${layer * 3} L 0 ${-26 + layer * 3} L 62 ${layer * 3} L 62 ${10 + layer * 3} L 0 ${36 + layer * 3} L -62 ${10 + layer * 3} Z`}
                fill={layer === 2 ? '#dcfce7' : '#f0fdf4'}
                stroke="#15803d"
                strokeWidth="3"
              />
              <path
                d={`M -40 ${5 + layer * 3} l 18 -8 l 22 9`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          ))}
          <g transform={`translate(48 ${-h - 88}) rotate(8)`}>
            <rect x="0" y="0" width="34" height="44" rx="4" fill="#ffffff" stroke="#15803d" strokeWidth="2.5" />
            <path d="M 8 12 h 18 M 8 21 h 18 M 8 30 h 11" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      );
    default:
      return null;
  }
}

function Building({
  districtId,
  stats,
  onSelect,
}: {
  districtId: DistrictId;
  stats: DistrictStats;
  onSelect: (id: DistrictId) => void;
}) {
  const district = DISTRICT_BY_ID[districtId];
  const { x, y, rx, ry, h } = PX[districtId];
  const palette = PALETTE[districtId];
  const plaqueTop = ry + 16;

  return (
    <g
      transform={`translate(${x} ${y})`}
      className={`city-building${stats.completed ? ' city-building--done' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${district.name}, ${district.outcome}. ${stats.answered} / ${stats.total} görev tamamlandı. ${
        stats.completed ? 'Bölge tamamlandı.' : 'Bölgeye git.'
      }`}
      onClick={() => onSelect(districtId)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(districtId);
        }
      }}
    >
      <title>{`${district.name} — ${stats.answered}/${stats.total} görev`}</title>

      <ellipse cx="0" cy={ry + 6} rx={rx * 1.35} ry={ry * 0.55} fill="rgba(15,23,42,0.18)" />

      <polygon
        points={`${-rx},0 0,${ry} 0,${ry - h} ${-rx},${-h}`}
        fill={palette.left}
      />
      <polygon
        points={`0,${ry} ${rx},0 ${rx},${-h} 0,${ry - h}`}
        fill={palette.right}
      />
      <polygon
        points={`0,${-ry - h} ${rx},${-h} 0,${ry - h} ${-rx},${-h}`}
        fill={palette.top}
      />

      <polygon
        points={`${-rx},0 0,${ry} 0,${ry - h} ${-rx},${-h}`}
        fill="url(#buildingShade)"
        opacity="0.25"
      />
      <polygon
        points={`0,${-ry - h} ${rx},${-h} 0,${ry - h} ${-rx},${-h}`}
        fill="url(#buildingGlow)"
        opacity="0.2"
      />

      <Windows face="left" rx={rx} ry={ry} h={h} />
      <Windows face="right" rx={rx} ry={ry} h={h} />

      <g transform={`translate(0 ${ry})`}>
        <line x1={-rx + 10} y1={-h * 0.52} x2={rx - 10} y2={-h * 0.52} stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      </g>

      <RoofDecor district={districtId} rx={rx} h={h} />

      <g transform={`translate(0 ${plaqueTop})`}>
        <rect
          x="-142"
          y="0"
          width="284"
          height="62"
          rx="16"
          fill="rgba(255,255,255,0.97)"
          stroke={palette.right}
          strokeWidth="2.5"
        />
        <circle cx="-108" cy="31" r="18" fill={district.light} stroke={palette.right} strokeWidth="2" />
        <g transform="translate(-119 20)" style={{ color: district.dark }}>
          <DistrictIcon icon={district.icon} size={22} />
        </g>
        <text x="-82" y="27" className="city-label-title" fill="#0f172a">
          {district.shortName}
        </text>
        <text x="-82" y="46" className="city-label-sub" fill="#64748b">
          {stats.answered}/{stats.total} görev · {district.outcome}
        </text>
        <text x="130" y="46" textAnchor="end" className="city-stars" fill="#f59e0b" aria-hidden="true">
          ★ {stats.stars}
        </text>
        {stats.completed && (
          <g>
            <circle cx="112" cy="20" r="10" fill="#22c55e" />
            <text x="112" y="24.5" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">
              ✓
            </text>
          </g>
        )}
      </g>

      <rect
        className="city-focus-ring"
        x="-150"
        y={-h - 46}
        width="300"
        height={h + ry + 128}
        rx="22"
        fill="none"
        pointerEvents="none"
      />
    </g>
  );
}

export function CityMap({ stats, onSelect }: Props) {
  return (
    <div className="city-map-wrap">
      <svg
        className="city-map"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        role="group"
        aria-label="Dijital Şehir haritası. Altı oyun bölgesi."
      >
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="55%" stopColor="#e0f7ff" />
            <stop offset="100%" stopColor="#ecfeff" />
          </linearGradient>
          <linearGradient id="grassGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="55%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="buildingShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="buildingGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="plazaGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="80%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          <filter id="softBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill="url(#skyGradient)" />

        <g className="map-sun">
          <circle cx="1372" cy="128" r="128" fill="url(#sunGlow)" opacity="0.75" />
          <circle cx="1372" cy="128" r="46" fill="#fde047" />
          <circle cx="1372" cy="128" r="64" fill="none" stroke="#fef08a" strokeWidth="3" opacity="0.8" />
        </g>

        <g className="map-cloud map-cloud--1" fill="#ffffff" opacity="0.93">
          <ellipse cx="250" cy="120" rx="78" ry="34" />
          <ellipse cx="310" cy="100" rx="58" ry="30" />
          <ellipse cx="190" cy="104" rx="48" ry="26" />
        </g>
        <g className="map-cloud map-cloud--2" fill="#ffffff" opacity="0.85">
          <ellipse cx="1040" cy="84" rx="66" ry="28" />
          <ellipse cx="1092" cy="70" rx="46" ry="24" />
          <ellipse cx="992" cy="74" rx="38" ry="20" />
        </g>
        <g className="map-cloud map-cloud--3" fill="#ffffff" opacity="0.75">
          <ellipse cx="640" cy="190" rx="52" ry="22" />
          <ellipse cx="680" cy="178" rx="36" ry="18" />
        </g>

        <g opacity="0.55">
          <path d="M0 300 Q 180 210 380 290 T 760 270 T 1120 300 T 1600 260 V 360 H0 Z" fill="#a7f3d0" />
          <path d="M0 330 Q 240 250 470 320 T 980 310 T 1600 330 V 390 H0 Z" fill="#6ee7b7" />
        </g>

        <rect y="300" width="1600" height="600" fill="url(#grassGradient)" />
        <g opacity="0.22" stroke="#047857" strokeWidth="1.5">
          {Array.from({ length: 13 }, (_, index) => (
            <line key={`h-${index}`} x1="0" y1={330 + index * 50} x2="1600" y2={330 + index * 50} />
          ))}
          {Array.from({ length: 17 }, (_, index) => (
            <line key={`v-${index}`} x1={index * 100} y1="300" x2={index * 100 - 140} y2="900" />
          ))}
        </g>

        <g className="map-roads" fill="none" strokeLinecap="round">
          <ellipse cx="800" cy="568" rx="166" ry="88" fill="url(#plazaGradient)" stroke="#e2e8f0" strokeWidth="8" />
          <path d="M318 436 L 800 568" stroke="#cbd5e1" strokeWidth="54" />
          <path d="M800 372 L 800 568" stroke="#cbd5e1" strokeWidth="54" />
          <path d="M1282 436 L 800 568" stroke="#cbd5e1" strokeWidth="54" />
          <path d="M424 700 L 800 568" stroke="#cbd5e1" strokeWidth="54" />
          <path d="M884 705 L 800 568" stroke="#cbd5e1" strokeWidth="54" />
          <path d="M1270 700 L 800 568" stroke="#cbd5e1" strokeWidth="54" />
          <path d="M318 436 L 800 568" stroke="#f8fafc" strokeWidth="3" strokeDasharray="14 16" />
          <path d="M800 372 L 800 568" stroke="#f8fafc" strokeWidth="3" strokeDasharray="14 16" />
          <path d="M1282 436 L 800 568" stroke="#f8fafc" strokeWidth="3" strokeDasharray="14 16" />
          <path d="M424 700 L 800 568" stroke="#f8fafc" strokeWidth="3" strokeDasharray="14 16" />
          <path d="M884 705 L 800 568" stroke="#f8fafc" strokeWidth="3" strokeDasharray="14 16" />
          <path d="M1270 700 L 800 568" stroke="#f8fafc" strokeWidth="3" strokeDasharray="14 16" />
        </g>

        <g className="map-plaza">
          <circle cx="800" cy="568" r="44" fill="#e2e8f0" opacity="0.8" />
          <path
            d="M800 534 C 816 552 816 570 800 584 C 784 570 784 552 800 534 Z"
            fill="#38bdf8"
            stroke="#0284c7"
            strokeWidth="3"
          />
          <circle cx="800" cy="558" r="5" fill="#e0f2fe" />
        </g>

        <g className="map-trees">
          {[
            [196, 556, 0.9],
            [152, 742, 1.1],
            [615, 468, 0.8],
            [1010, 806, 1],
            [1438, 610, 0.9],
            [1190, 812, 0.75],
            [530, 848, 0.85],
            [1058, 388, 0.8],
          ].map(([tx, ty, scale], index) => (
            <g key={index} transform={`translate(${tx} ${ty}) scale(${scale})`}>
              <rect x="-5" y="-8" width="10" height="30" rx="4" fill="#92400e" />
              <circle cx="0" cy="-26" r="24" fill="#16a34a" />
              <circle cx="-16" cy="-12" r="18" fill="#22c55e" />
              <circle cx="16" cy="-14" r="17" fill="#15803d" />
            </g>
          ))}
        </g>

        {RENDER_ORDER.map((id) => (
          <Building key={id} districtId={id} stats={stats[id]} onSelect={onSelect} />
        ))}

        <g className="map-decor" aria-hidden="true">
          <path d="M 60 880 Q 240 820 420 880" stroke="#10b981" strokeWidth="4" fill="none" opacity="0.4" />
          <path d="M 1170 890 Q 1330 830 1540 880" stroke="#10b981" strokeWidth="4" fill="none" opacity="0.4" />
        </g>
      </svg>

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
