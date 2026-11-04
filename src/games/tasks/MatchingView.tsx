import { useMemo, useState } from 'react';
import type { Answer, MatchingTask } from '../../types';
import type { TaskViewProps } from '../TaskRenderer';
import { stableShuffle } from '../../utils/shuffle';

export function MatchingView({
  task,
  disabled,
  onSubmit,
}: TaskViewProps & { task: MatchingTask }) {
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const rightOrder = useMemo(
    () => stableShuffle(task.right, `match-right-${task.id}`),
    [task],
  );

  const assign = (leftId: string, rightId: string) => {
    setPairs((current) => {
      const next: Record<string, string> = {};
      for (const [key, value] of Object.entries(current)) {
        if (value !== rightId) next[key] = value;
      }
      next[leftId] = rightId;
      return next;
    });
    setActiveLeft(null);
  };

  const unassignLeft = (leftId: string) => {
    if (disabled) return;
    setPairs((current) => {
      const next = { ...current };
      delete next[leftId];
      return next;
    });
  };

  const handleLeft = (leftId: string) => {
    if (disabled) return;
    setActiveLeft((current) => (current === leftId ? null : leftId));
  };

  const handleRight = (rightId: string) => {
    if (disabled || !activeLeft) return;
    assign(activeLeft, rightId);
  };

  const allPaired = task.left.every((left) => pairs[left.id]);
  const pairedCount = Object.keys(pairs).length;

  const submit = () => {
    if (!allPaired) return;
    const answer: Answer = { type: 'match', pairs };
    onSubmit(answer);
  };

  return (
    <div className="task-interaction">
      <div className="smartboard-guide-banner" role="status">
        <span className="smartboard-guide-banner__icon" aria-hidden="true">🖐️</span>
        <div className="smartboard-guide-banner__content">
          <strong>Akıllı Tahta İpucu:</strong>
          <span> Soldaki bir karta dokunup seç, ardından sağdaki eşine dokunarak eşleştir.</span>
        </div>
      </div>

      <div className="match-layout">
        <div className="match-column" role="group" aria-label="Eşleştirilecek ifadeler">
          <h3 className="match-column__title">1. İfade / Tanım</h3>
          {task.left.map((left) => {
            const pairId = pairs[left.id];
            const pairText = task.right.find((right) => right.id === pairId)?.text;
            const isActive = activeLeft === left.id;
            return (
              <div
                key={left.id}
                className={`match-card-wrapper${isActive ? ' is-active' : ''}${
                  pairId ? ' is-paired' : ''
                }`}
              >
                <button
                  type="button"
                  className={`match-card${isActive ? ' match-card--active' : ''}${
                    pairId ? ' match-card--paired' : ''
                  }`}
                  onClick={() => handleLeft(left.id)}
                  aria-pressed={isActive}
                  disabled={disabled}
                >
                  <span className="match-card__label">{left.text}</span>
                  {pairText ? (
                    <span className="match-card__pair">↔ {pairText}</span>
                  ) : (
                    <span className="match-card__empty">
                      {isActive ? '👉 Şimdi sağdan eşini seç' : 'Dokunarak seç'}
                    </span>
                  )}
                </button>
                {pairId && (
                  <button
                    type="button"
                    className="match-card__clear-btn"
                    onClick={() => unassignLeft(left.id)}
                    disabled={disabled}
                    title="Eşleştirmeyi kaldır"
                    aria-label={`${left.text} eşleştirmesini kaldır`}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="match-column" role="group" aria-label="Eşleşme seçenekleri">
          <h3 className="match-column__title">2. Karşılık / Açıklama</h3>
          {rightOrder.map((right) => {
            const owner = Object.entries(pairs).find(([, value]) => value === right.id);
            const isUsed = Boolean(owner);
            return (
              <button
                key={right.id}
                type="button"
                className={`match-card match-card--right${isUsed ? ' match-card--used' : ''}`}
                onClick={() => handleRight(right.id)}
                disabled={disabled || (!activeLeft && !isUsed)}
                title={
                  !activeLeft && !isUsed
                    ? 'Eşleştirmek için önce soldan bir ifade seç'
                    : right.text
                }
              >
                <span className="match-card__label">{right.text}</span>
                {isUsed && <span className="match-card__badge">✓ Eşleşti</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="task-actions">
        <p className="task-actions__hint">
          {allPaired
            ? 'Tüm eşleşmeler tamamlandı.'
            : `${pairedCount} / ${task.left.length} eşleşme yapıldı.`}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled={!allPaired || disabled}
          onClick={submit}
        >
          Kontrol Et
        </button>
      </div>
    </div>
  );
}
