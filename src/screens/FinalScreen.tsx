import { useState } from 'react';
import type { AppData, Mode } from '../types';
import { DISTRICTS } from '../data/districts';
import { districtStats, overallStats, teamScores } from '../game/progress';
import { BadgeIcon } from '../components/BadgeIcon';
import { Stars } from '../components/Stars';
import character from '../assets/brand/ogretmen-bozok-karakter.png';
import logo from '../assets/brand/ogretmen-bozok-logo.png';

interface Props {
  data: AppData;
  mode: Mode;
  onHome: () => void;
  onReset: () => void;
}

export function FinalScreen({ data, mode, onHome, onReset }: Props) {
  const overall = overallStats(data, mode);
  const teams = mode === 'team' ? [...teamScores(data)].sort((a, b) => b.score - a.score) : [];
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <main className="final-screen">
      <div className="final-confetti" aria-hidden="true">
        {Array.from({ length: 26 }, (_, index) => (
          <span key={index} className={`confetti confetti--${(index % 5) + 1}`} />
        ))}
      </div>

      <div className="final-card">
        <div className="final-hero">
          <img src={logo} alt="Öğretmen Bozok logosu" className="final-logo" />
          <div className="final-trophy" aria-hidden="true">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
              <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5M12 12v4M9 20h6M10 16h4v4h-4z" />
            </svg>
          </div>
          <img src={character} alt="Öğretmen Bozok karakteri" className="final-character" />
        </div>

        <p className="eyebrow">DİJİTAL ŞEHİR TAMAMLANDI</p>
        <h1>Harikasın, şehrin kahramanısın!</h1>
        <p className="final-sub">
          Öğretmen Bozok’un altı bölgesini de tamamladın. Artık bilişim teknolojileri
          dünyasında güvenle dolaşabilirsin.
        </p>

        <div className="final-stats">
          <div>
            <span>Toplam puan</span>
            <strong>{overall.score}</strong>
          </div>
          <div>
            <span>Doğru cevap</span>
            <strong>{overall.correct} / {overall.total}</strong>
          </div>
          <div>
            <span>Yıldız</span>
            <strong className="final-stars">
              <Stars value={Math.round(overall.stars / 6)} max={3} size={24} />
              <span>{overall.stars} / 18</span>
            </strong>
          </div>
        </div>

        <div className="final-badges" aria-label="Kazanılan rozetler">
          {DISTRICTS.map((district) => (
            <div key={district.id} className="final-badge">
              <BadgeIcon
                icon={district.icon}
                color={district.color}
                size={54}
                earned={districtStats(data, mode, district.id).completed}
                title={`${district.name} rozeti`}
              />
              <span>{district.shortName}</span>
            </div>
          ))}
        </div>

        {mode === 'team' && teams.length > 0 && (
          <section className="final-ranking">
            <h2>Takım sıralaması</h2>
            <ol>
              {teams.map(({ team, score }, index) => (
                <li key={team.id} className={index === 0 ? 'is-winner' : ''}>
                  <span className="final-ranking__medal" aria-hidden="true">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <span className="final-ranking__name">{team.name}</span>
                  <strong>{score} puan</strong>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="final-actions">
          <button type="button" className="btn btn--ghost btn--large" onClick={onHome}>
            ← Şehre dön
          </button>
          {confirmReset ? (
            <span className="final-confirm">
              <span>Tüm ilerleme silinsin mi?</span>
              <button type="button" className="btn btn--danger btn--small" onClick={onReset}>
                Evet, yeni oyun
              </button>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmReset(false)}>
                Vazgeç
              </button>
            </span>
          ) : (
            <button type="button" className="btn btn--primary btn--large" onClick={() => setConfirmReset(true)}>
              Yeni oyun başlat
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
