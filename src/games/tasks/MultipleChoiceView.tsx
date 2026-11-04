import { useState } from 'react';
import type { MultipleChoiceTask } from '../../types';
import type { TaskViewProps } from '../TaskRenderer';

export function MultipleChoiceView({
  task,
  disabled,
  onSubmit,
}: TaskViewProps & { task: MultipleChoiceTask }) {
  const [selected, setSelected] = useState<string>('');

  return (
    <div className="task-interaction">
      <div className="options-grid" role="radiogroup" aria-label="Cevap seçenekleri">
        {task.options.map((option, index) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`option-card${active ? ' option-card--selected' : ''}`}
              onClick={() => setSelected(option.id)}
              disabled={disabled}
            >
              <span className="option-card__letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-card__text">{option.text}</span>
              {active && (
                <span className="option-card__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="task-actions">
        <p className="task-actions__hint">Bir seçenek seçtikten sonra “Kontrol Et”e dokun.</p>
        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled={!selected || disabled}
          onClick={() => onSubmit({ type: 'mc', optionId: selected })}
        >
          Kontrol Et
        </button>
      </div>
    </div>
  );
}
