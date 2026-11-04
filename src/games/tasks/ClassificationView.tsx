import { useMemo, useState } from 'react';
import type { ClassificationTask } from '../../types';
import type { TaskViewProps } from '../TaskRenderer';
import { stableShuffle } from '../../utils/shuffle';

export function ClassificationView({
  task,
  disabled,
  onSubmit,
}: TaskViewProps & { task: ClassificationTask }) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const items = useMemo(
    () => stableShuffle(task.items, `classify-${task.id}`),
    [task],
  );

  const assign = (itemId: string, categoryId: string) => {
    if (disabled) return;
    setAssignments((current) => ({ ...current, [itemId]: categoryId }));
    setSelectedItem(null);
  };

  const unassign = (itemId: string) => {
    if (disabled) return;
    setAssignments((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    setSelectedItem(null);
  };

  const pool = items.filter((item) => !assignments[item.id]);
  const allAssigned = items.every((item) => assignments[item.id]);
  const selectedLabel = items.find((item) => item.id === selectedItem)?.label;

  return (
    <div className="task-interaction">
      <p className="task-multi-note">
        Bir kart seç, ardından ait olduğu grubun “Bu gruba ekle” düğmesine dokun. İstersen
        kartı sürükleyip grup kutusuna bırakabilirsin.
      </p>

      <div className="classify-pool" aria-label="Yerleştirilecek kartlar">
        {pool.length === 0 ? (
          <p className="classify-pool__empty">Tüm kartlar yerleştirildi. Şimdi kontrol edebilirsin.</p>
        ) : (
          pool.map((item) => {
            const active = selectedItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                draggable={!disabled}
                onDragStart={(event) => {
                  setSelectedItem(item.id);
                  event.dataTransfer.setData('text/plain', item.id);
                  event.dataTransfer.effectAllowed = 'move';
                }}
                className={`classify-chip${active ? ' classify-chip--selected' : ''}`}
                aria-pressed={active}
                onClick={() => setSelectedItem(active ? null : item.id)}
                disabled={disabled}
              >
                {item.label}
              </button>
            );
          })
        )}
      </div>

      <p className="classify-selection" role="status">
        {selectedLabel
          ? `Seçili kart: ${selectedLabel}. Şimdi bir grup seç.`
          : 'Kart seçmek için dokun.'}
      </p>

      <div className="classify-grid">
        {task.categories.map((category) => {
          const categoryItems = items.filter(
            (item) => assignments[item.id] === category.id,
          );
          return (
            <section
              key={category.id}
              className={`classify-zone${selectedItem ? ' classify-zone--ready' : ''}`}
              aria-label={`${category.text} grubu`}
              onDragOver={(event) => {
                if (!disabled) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                const itemId = event.dataTransfer.getData('text/plain');
                if (itemId) assign(itemId, category.id);
              }}
              onDragEnter={(event) => event.preventDefault()}
            >
              <header className="classify-zone__head">
                <h3>{category.text}</h3>
                <span>{categoryItems.length}</span>
              </header>
              <div className="classify-zone__items">
                {categoryItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="classify-chip classify-chip--assigned"
                    onClick={() => unassign(item.id)}
                    disabled={disabled}
                    aria-label={`${item.label}, geri al`}
                  >
                    {item.label}
                    <span aria-hidden="true"> ×</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="btn btn--soft btn--small classify-zone__add"
                disabled={!selectedItem || disabled}
                onClick={() => {
                  if (selectedItem) assign(selectedItem, category.id);
                }}
              >
                Bu gruba ekle
              </button>
            </section>
          );
        })}
      </div>

      <div className="task-actions">
        <p className="task-actions__hint">
          {allAssigned
            ? 'Tüm kartlar yerleştirildi.'
            : `${items.length - pool.length} / ${items.length} kart yerleştirildi.`}
        </p>
        <button
          type="button"
          className="btn btn--primary btn--large"
          disabled={!allAssigned || disabled}
          onClick={() => onSubmit({ type: 'classify', assignments })}
        >
          Kontrol Et
        </button>
      </div>
    </div>
  );
}
