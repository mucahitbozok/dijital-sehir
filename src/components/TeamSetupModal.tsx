import { useState } from 'react';
import type { Team } from '../types';
import { Modal } from './Modal';

interface Props {
  teams: Team[];
  hasResults: boolean;
  onClose: () => void;
  onSave: (names: string[]) => void;
}

export function TeamSetupModal({ teams, hasResults, onClose, onSave }: Props) {
  const initialCount = Math.min(4, Math.max(2, teams.length || 3));
  const [count, setCount] = useState(initialCount);
  const [names, setNames] = useState<string[]>(() => {
    const base = Array.from({ length: 4 }, (_, index) => teams[index]?.name ?? `Takım ${index + 1}`);
    return base;
  });

  const visibleNames = names.slice(0, count);
  const valid = visibleNames.every((name) => name.trim().length > 0);

  const updateName = (index: number, value: string) => {
    setNames((current) => current.map((name, i) => (i === index ? value : name)));
  };

  const save = () => {
    if (!valid) return;
    onSave(visibleNames.map((name) => name.trim()));
  };

  return (
    <Modal
      title="Takımları hazırla"
      subtitle="2, 3 veya 4 takım seç. Takım adlarını istediğin gibi değiştirebilirsin."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Vazgeç
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={save}
            disabled={!valid}
          >
            {hasResults ? 'Kaydet ve takım puanlarını sıfırla' : 'Takımları kaydet'}
          </button>
        </>
      }
    >
      <div className="team-count" role="group" aria-label="Takım sayısı">
        {[2, 3, 4].map((value) => (
          <button
            key={value}
            type="button"
            className={`team-count__btn${count === value ? ' is-active' : ''}`}
            aria-pressed={count === value}
            onClick={() => setCount(value)}
          >
            {value} Takım
          </button>
        ))}
      </div>

      <div className="team-name-list">
        {visibleNames.map((name, index) => (
          <label className="team-name-row" key={index}>
            <span className={`team-name-color team-name-color--${index + 1}`} aria-hidden="true">
              {index + 1}
            </span>
            <span className="team-name-row__label">Takım {index + 1}</span>
            <input
              type="text"
              value={name}
              maxLength={18}
              onChange={(event) => updateName(index, event.target.value)}
              placeholder={`Takım ${index + 1}`}
              aria-label={`${index + 1}. takımın adı`}
            />
          </label>
        ))}
      </div>

      {hasResults && (
        <p className="notice notice--warning">
          Takım sayısını veya adları değiştirip kaydedersen mevcut takım puanları ve takım
          ilerlemesi sıfırlanır. Bireysel ilerleme korunur.
        </p>
      )}
    </Modal>
  );
}
