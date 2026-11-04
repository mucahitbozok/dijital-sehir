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
      <div className="smartboard-guide-banner" role="status">
        <span className="smartboard-guide-banner__icon" aria-hidden="true">🖐️</span>
        <div className="smartboard-guide-banner__content">
          <strong>Akıllı Tahta İpucu:</strong>
          <span> Karta dokunup ardından grubun kutusuna dokunabilir ya da kartı doğrudan kutunun içine sürükleyebilirsin.</span>
        </div>
      </div>

      <div className="classify-pool" aria-label="Yerleştirilecek kartlar">
        {pool.length === 0 ? (
          <p className="classify-pool__empty">✓ Tüm kavramlar yerleştirildi! Sıra kontrol etmede.</p>
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
                <span className="classify-chip__grip" aria-hidden="true">⠿</span>
                <span>{item.label}</span>
              </button>
            );
          })
        )}
      </div>

      <p className="classify-selection" role="status">
        {selectedLabel ? (
          <>
            <strong>Seçili Kavram:</strong> «{selectedLabel}» → Şimdi aşağıdaki kutulardan birine dokun!
          </>
        ) : (
          'Yerleştirmek istediğin karta dokun veya sürükle.'
        )}
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
              onClick={() => {
                if (selectedItem && !disabled) {
                  assign(selectedItem, category.id);
                }
              }}
              onDragOver={(event) => {
                if (!disabled) event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                const itemId = event.dataTransfer.getData('text/plain') || selectedItem;
                if (itemId) assign(itemId, category.id);
              }}
              onDragEnter={(event) => event.preventDefault()}
            >
              <header className="classify-zone__head">
                <h3>{category.text}</h3>
                <span className="classify-zone__counter">{categoryItems.length}</span>
              </header>
              <div className="classify-zone__items">
                {categoryItems.length === 0 ? (
                  <div className="classify-zone__placeholder">
                    {selectedItem ? 'Dokunarak buraya ekle' : 'Kavramları buraya bırak'}
                  </div>
                ) : (
                  categoryItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="classify-chip classify-chip--assigned"
                      onClick={(e) => {
                        e.stopPropagation();
                        unassign(item.id);
                      }}
                      disabled={disabled}
                      aria-label={`${item.label}, geri al`}
                      title="Geri almak için dokun"
                    >
                      <span>{item.label}</span>
                      <span className="chip-remove" aria-hidden="true">✕</span>
                    </button>
                  ))
                )}
              </div>
              <button
                type="button"
                className="btn btn--soft btn--small classify-zone__add"
                disabled={!selectedItem || disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (selectedItem) assign(selectedItem, category.id);
                }}
              >
                + Bu gruba ekle
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
