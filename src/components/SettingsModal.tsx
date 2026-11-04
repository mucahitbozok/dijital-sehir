import { useState } from 'react';
import type { Settings } from '../types';
import { Modal } from './Modal';

interface Props {
  settings: Settings;
  onToggleSound: () => void;
  onToggleMotion: () => void;
  onReset: () => void;
  onClose: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenTeams: () => void;
  teamMode: boolean;
}

export function SettingsModal({
  settings,
  onToggleSound,
  onToggleMotion,
  onReset,
  onClose,
  isFullscreen,
  onToggleFullscreen,
  onOpenTeams,
  teamMode,
}: Props) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Modal
      title="Ayarlar"
      subtitle="Oyunu sınıfına göre uyarla."
      onClose={onClose}
      footer={
        <button type="button" className="btn btn--primary" onClick={onClose}>
          Tamam
        </button>
      }
    >
      <div className="settings-list">
        <div className="setting-row">
          <div>
            <h3>Ses efektleri</h3>
            <p>Doğru ve yanlış cevaplarda kısa geri bildirim sesleri çal.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.sound}
            className={`switch${settings.sound ? ' is-on' : ''}`}
            onClick={onToggleSound}
          >
            <span className="switch__thumb" />
            <span className="sr-only">{settings.sound ? 'Sesi kapat' : 'Sesi aç'}</span>
          </button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Hareketi azalt</h3>
            <p>Bulut, yıldız ve geçiş animasyonlarını en aza indirir.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.reducedMotion}
            className={`switch${settings.reducedMotion ? ' is-on' : ''}`}
            onClick={onToggleMotion}
          >
            <span className="switch__thumb" />
            <span className="sr-only">
              {settings.reducedMotion ? 'Hareketi aç' : 'Hareketi azalt'}
            </span>
          </button>
        </div>

        <div className="setting-row">
          <div>
            <h3>Tam ekran</h3>
            <p>Akıllı tahtada daha geniş bir oyun alanı açar.</p>
          </div>
          <button type="button" className="btn btn--soft btn--small" onClick={onToggleFullscreen}>
            {isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran aç'}
          </button>
        </div>

        {teamMode && (
          <div className="setting-row">
            <div>
              <h3>Takımlar</h3>
              <p>Takım sayısını ve adlarını düzenle.</p>
            </div>
            <button type="button" className="btn btn--soft btn--small" onClick={onOpenTeams}>
              Takımları düzenle
            </button>
          </div>
        )}
      </div>

      <div className="settings-reset">
        <h3>İlerlemeyi sıfırla</h3>
        <p>
          Puanlar, yıldızlar, rozetler ve tamamlanan görevler silinir. Bu işlem geri alınamaz.
        </p>
        {confirmReset ? (
          <div className="settings-reset__confirm">
            <span>Emin misin? Tüm ilerleme silinecek.</span>
            <div>
              <button type="button" className="btn btn--ghost btn--small" onClick={() => setConfirmReset(false)}>
                Vazgeç
              </button>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                  onClose();
                }}
              >
                Evet, sıfırla
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--danger-soft btn--small"
            onClick={() => setConfirmReset(true)}
          >
            İlerlemeyi sıfırla
          </button>
        )}
      </div>

      <p className="settings-note">
        Tüm ilerleme bu cihazda saklanır. İlk açılıştan sonra oyun internet olmadan çalışır.
      </p>
    </Modal>
  );
}
