import { useState } from 'react';
import type { MultiSelectTask } from '../../types';
import type { TaskViewProps } from '../TaskRenderer';

export function MultiSelectView({
  task,
  disabled,
  onSubmit,
}: TaskViewProps & { task: MultiSelectTask }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="task-interaction">
      <p className="task-multi-note">
        Birden fazla seçenek işaretleyebilirsin. Hazır olduğunda kontrol et.
      </p>
      <div className="options-grid options-grid--multi" role="group" aria-label="Cevap seçenekleri">
        {task.options.map((option, index) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              className={`option-card option-card--multi${active ? ' option-card--selected' : ''}`}
              onClick={() => toggle(option.id)}
              disabled={disabled}
            >
              <span className="option-card__letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-card__text">{option.text}</span>
              <span className={`option-card__box${active ? ' is-checked' : ''}`} aria-hidden="true">
                {active ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>

      <div className="task-actions">
        <p className="task-actions__hint">
          {selected.length === 0
            ? 'En az bir seçenek işaretle.'
            : `${selected.length} seçenek işaretledin.`}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled={selected.length === 0 || disabled}
          onClick={() => onSubmit({ type: 'multi', optionIds: selected })}
        >
          Kontrol Et
        </button>
      </div>
    </div>
  );
}
