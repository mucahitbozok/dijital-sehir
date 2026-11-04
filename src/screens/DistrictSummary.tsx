import type { CSSProperties } from 'react';
import type { AppData, DistrictId, Mode } from '../types';
import { DISTRICT_BY_ID } from '../data/districts';
import { taskById } from '../data/tasks';
import {
  districtStats,
  districtTaskSequence,
  overallStats,
  progressFor,
  teamScores,
} from '../game/progress';
import { BadgeIcon } from '../components/BadgeIcon';
import { Stars } from '../components/Stars';

interface Props {
  data: AppData;
  districtId: DistrictId;
  mode: Mode;
  onExit: () => void;
  onOpenFinal: () => void;
}

export function DistrictSummary({ data, districtId, mode, onExit, onOpenFinal }: Props) {
  const district = DISTRICT_BY_ID[districtId];
  const stats = districtStats(data, mode, districtId);
  const overall = overallStats(data, mode);
  const progress = progressFor(data, mode);
  const sequence = districtTaskSequence(data, mode, districtId);
  const teams = mode === 'team' ? teamScores(data) : [];

  return (
    <main className="summary-screen" style={{ '--district-color': district.color } as unknown as CSSProperties}>
      <div className="summary-card">
        <div className="summary-confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <span key={index} className={`confetti confetti--${(index % 5) + 1}`} />
          ))}
        </div>

        <div className="summary-head">
          <div className="summary-badge">
            <BadgeIcon
              icon={district.icon}
              color={district.color}
              size={92}
              earned={stats.completed}
              title={`${district.name} rozeti`}
            />
          </div>
          <p className="summary-eyebrow">{district.outcome}</p>
          <h1>{district.name} tamamlandı!</h1>
          <p className="summary-sub">
            {stats.completed
              ? 'Bu bölgenin tüm görevlerini bitirdin ve rozetini kazandın.'
              : 'Bölgedeki görevleri tamamlamaya devam edebilirsin.'}
          </p>
          <div className="summary-stars">
            <Stars value={stats.stars} size={44} />
          </div>
        </div>

        <div className="summary-metrics">
          <div className="summary-metric">
            <span>Doğru cevap</span>
            <strong>{stats.correct} / {stats.total}</strong>
          </div>
          <div className="summary-metric">
            <span>Bölge puanı</span>
            <strong>{stats.score}</strong>
          </div>
          <div className="summary-metric">
            <span>Toplam rozet</span>
            <strong>{overall.badges} / 6</strong>
          </div>
        </div>

        {mode === 'team' && teams.length > 0 && (
          <section className="summary-teams">
            <h2>Takım sıralaması</h2>
            <ol>
              {[...teams]
                .sort((a, b) => b.score - a.score)
                .map(({ team, score }, index) => (
                  <li key={team.id}>
                    <span className="summary-teams__rank">{index + 1}</span>
                    <span className="summary-teams__name">{team.name}</span>
                    <strong>{score} puan</strong>
                  </li>
                ))}
            </ol>
          </section>
        )}

        <section className="summary-tasks">
          <h2>Görev özeti</h2>
          <ul>
            {sequence.map((id) => {
              const task = taskById(id);
              const result = progress.results[id];
              if (!task) return null;
              const isFull = result && result.correct && (!result.ratio || result.ratio >= 0.999);
              const isPart = result && result.earned > 0 && result.ratio && result.ratio < 0.999;
              return (
                <li
                  key={id}
                  className={
                    result
                      ? isFull
                        ? 'is-correct'
                        : isPart
                          ? 'is-partial'
                          : 'is-wrong'
                      : 'is-pending'
                  }
                >
                  <span className="summary-task__status" aria-hidden="true">
                    {isFull ? '✓' : isPart ? '★' : result ? '✕' : '–'}
                  </span>
                  <span className="summary-task__title">{task.title}</span>
                  <span className="summary-task__points">
                    {result ? `${result.earned} puan` : 'Yapılmadı'}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="summary-actions">
          <button type="button" className="btn btn--ghost btn--large" onClick={onExit}>
            ← Şehre dön
          </button>
          {overall.allComplete ? (
            <button type="button" className="btn btn--primary btn--large" onClick={onOpenFinal}>
              🏆 Büyük ödül töreni
            </button>
          ) : (
            <button type="button" className="btn btn--primary btn--large" onClick={onExit}>
              Başka bölge seç
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
