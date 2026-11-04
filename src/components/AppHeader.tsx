import type { Mode } from '../types';
import logo from '../assets/brand/ogretmen-bozok-logo.png';

interface Props {
  mode: Mode;
  onChangeMode: (mode: Mode) => void;
  score: number;
  stars: number;
  maxStars: number;
  badges: number;
  maxBadges: number;
  onHome: () => void;
  onOpenTeams: () => void;
  onOpenHowTo: () => void;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function AppHeader({
  mode,
  onChangeMode,
  score,
  stars,
  maxStars,
  badges,
  maxBadges,
  onHome,
  onOpenTeams,
  onOpenHowTo,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen,
}: Props) {
  return (
    <header className="app-header">
      <button type="button" className="brand" onClick={onHome} aria-label="Ana ekrana dön">
        <img src={logo} alt="Öğretmen Bozok logosu" className="brand__logo" />
        <span className="brand__text">
          <strong>DİJİTAL ŞEHİR</strong>
          <small>ÖĞRETMEN BOZOK</small>
        </span>
      </button>

      <div className="mode-switch" role="group" aria-label="Oyun modu">
        <button
          type="button"
          className={mode === 'individual' ? 'is-active' : ''}
          aria-pressed={mode === 'individual'}
          onClick={() => onChangeMode('individual')}
        >
          Bireysel
        </button>
        <button
          type="button"
          className={mode === 'team' ? 'is-active' : ''}
          aria-pressed={mode === 'team'}
          onClick={() => onChangeMode('team')}
        >
          Takım
        </button>
      </div>

      <div className="hud" aria-label="Oyun durumu">
        <div className="hud__item hud__item--score">
          <span className="hud__label">Puan</span>
          <strong>{score}</strong>
        </div>
        <div className="hud__item">
          <span className="hud__label">Yıldız</span>
          <strong className="hud__star">
            ★ {stars}<span className="hud__muted">/{maxStars}</span>
          </strong>
        </div>
        <div className="hud__item">
          <span className="hud__label">Rozet</span>
          <strong>
            {badges}<span className="hud__muted">/{maxBadges}</span>
          </strong>
        </div>
      </div>

      <div className="header-actions">
        {mode === 'team' && (
          <button type="button" className="btn btn--soft btn--small" onClick={onOpenTeams}>
            Takımlar
          </button>
        )}
        <button type="button" className="btn btn--icon" onClick={onOpenHowTo} aria-label="Nasıl oynanır?">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2-2.5 3.6" />
            <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </button>
        <button type="button" className="btn btn--icon" onClick={onOpenSettings} aria-label="Ayarlar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3.2" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
          </svg>
        </button>
        <button
          type="button"
          className="btn btn--icon"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
          title={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFullscreen ? (
              <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
            ) : (
              <path d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5" />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
}
