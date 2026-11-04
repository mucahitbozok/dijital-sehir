import { useState } from 'react';
import type { Option, OrderingTask } from '../../types';
import type { TaskViewProps } from '../TaskRenderer';
import { stableShuffle } from '../../utils/shuffle';

export function OrderingView({
  task,
  disabled,
  onSubmit,
}: TaskViewProps & { task: OrderingTask }) {
  const [items, setItems] = useState<Option[]>(() => {
    const shuffled = stableShuffle(task.items, `order-${task.id}`);
    const alreadyCorrect = shuffled.every(
      (item, position) => item.id === task.correctOrder[position],
    );
    if (!alreadyCorrect || shuffled.length < 2) return shuffled;
    // Karıştırma tesadüfen doğru sırayı verdiyse ilk iki kartın yerini değiştir.
    return [shuffled[1], shuffled[0], ...shuffled.slice(2)];
  });

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length || disabled) return;
    setItems((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="task-interaction">
      <p className="task-multi-note">
        Adımları doğru sıraya koy. Yukarı ve aşağı oklarını kullanarak kartların yerini
        değiştir.
      </p>

      <ol className="order-list" aria-label="Sıralanacak adımlar">
        {items.map((item, index) => (
          <li key={item.id} className="order-item">
            <span className="order-item__index" aria-hidden="true">
              {index + 1}
            </span>
            <span className="order-item__text">{item.text}</span>
            <span className="order-item__controls">
              <button
                type="button"
                className="btn btn--icon btn--tiny"
                onClick={() => move(index, -1)}
                disabled={index === 0 || disabled}
                aria-label={`${item.text} adımını yukarı taşı`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 14 6-6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="btn btn--icon btn--tiny"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1 || disabled}
                aria-label={`${item.text} adımını aşağı taşı`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m6 10 6 6 6-6" />
                </svg>
              </button>
            </span>
          </li>
        ))}
      </ol>

      <div className="task-actions">
        <p className="task-actions__hint">Sıra hazır olduğunda kontrol et.</p>
        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled={disabled}
          onClick={() => onSubmit({ type: 'order', order: items.map((item) => item.id) })}
        >
          Kontrol Et
        </button>
      </div>
    </div>
  );
}
