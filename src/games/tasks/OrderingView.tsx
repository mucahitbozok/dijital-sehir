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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length || disabled) return;
    setItems((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const swap = (idA: string, idB: string) => {
    if (disabled || idA === idB) return;
    setItems((current) => {
      const idxA = current.findIndex((i) => i.id === idA);
      const idxB = current.findIndex((i) => i.id === idB);
      if (idxA === -1 || idxB === -1) return current;
      const next = [...current];
      [next[idxA], next[idxB]] = [next[idxB], next[idxA]];
      return next;
    });
  };

  const reorderTo = (sourceId: string, targetId: string) => {
    if (disabled || sourceId === targetId) return;
    setItems((current) => {
      const fromIndex = current.findIndex((i) => i.id === sourceId);
      const toIndex = current.findIndex((i) => i.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const handleCardClick = (id: string) => {
    if (disabled) return;
    if (!selectedId) {
      setSelectedId(id);
    } else if (selectedId === id) {
      setSelectedId(null);
    } else {
      swap(selectedId, id);
      setSelectedId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (disabled) return;
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (disabled) return;
    e.preventDefault();
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    if (sourceId && sourceId !== targetId) {
      reorderTo(sourceId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="task-interaction">
      <div className="smartboard-guide-banner" role="status">
        <span className="smartboard-guide-banner__icon" aria-hidden="true">🖐️</span>
        <div className="smartboard-guide-banner__content">
          <strong>Akıllı Tahta İpucu:</strong>
          <span> Kartları sürükleyip bırakabilir, başındaki oklara basabilir veya iki karta dokunarak yerlerini değiştirebilirsin.</span>
        </div>
      </div>

      <ol className="order-list" aria-label="Sıralanacak adımlar">
        {items.map((item, index) => {
          const isSelected = selectedId === item.id;
          const isTarget = selectedId !== null && !isSelected;
          const isDragging = draggedId === item.id;
          const isOver = dragOverId === item.id;

          let itemClass = 'order-item';
          if (isSelected) itemClass += ' order-item--selected';
          if (isDragging) itemClass += ' order-item--dragging';
          if (isOver) itemClass += ' order-item--over';

          return (
            <li
              key={item.id}
              className={itemClass}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleCardClick(item.id)}
              aria-selected={isSelected}
            >
              <div className="order-item__front">
                {/* Sürükleme Tutacağı (Grip) */}
                <div
                  className="order-item__grip"
                  title="Sürükleyip bırakmak için basılı tutun"
                  aria-hidden="true"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="9" cy="6" r="2" />
                    <circle cx="15" cy="6" r="2" />
                    <circle cx="9" cy="12" r="2" />
                    <circle cx="15" cy="12" r="2" />
                    <circle cx="9" cy="18" r="2" />
                    <circle cx="15" cy="18" r="2" />
                  </svg>
                </div>

                {/* Baştaki Kolay Ok Butonları */}
                <div className="order-item__front-controls">
                  <button
                    type="button"
                    className="order-btn order-btn--up"
                    onClick={(e) => {
                      e.stopPropagation();
                      move(index, -1);
                    }}
                    disabled={index === 0 || disabled}
                    aria-label={`${item.text} adımını yukarı taşı`}
                    title="Yukarı taşı"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="order-btn order-btn--down"
                    onClick={(e) => {
                      e.stopPropagation();
                      move(index, 1);
                    }}
                    disabled={index === items.length - 1 || disabled}
                    aria-label={`${item.text} adımını aşağı taşı`}
                    title="Aşağı taşı"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                {/* Sıra Numarası Rozeti */}
                <span className="order-item__index" aria-hidden="true">
                  {index + 1}
                </span>
              </div>

              {/* Kart İçerik Metni */}
              <span className="order-item__text">{item.text}</span>

              {/* Akıllı Tahta Dokunma Durumu Göstergesi */}
              <div className="order-item__swap-badge" aria-hidden="true">
                {isSelected ? (
                  <span className="swap-badge is-active">📍 Seçildi</span>
                ) : isTarget ? (
                  <span className="swap-badge is-target">⇄ Değiştir</span>
                ) : (
                  <span className="swap-badge is-idle">⠿ Taşı</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="task-actions">
        <p className="task-actions__hint">
          {selectedId
            ? 'Bir karta dokundun. Yer değiştirmek istediğin 2. karta dokun!'
            : 'Adımları doğru sıraya koyduktan sonra “Kontrol Et”e dokun.'}
        </p>
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
