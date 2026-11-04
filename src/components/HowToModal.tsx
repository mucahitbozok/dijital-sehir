import { Modal } from './Modal';

interface Props {
  onClose: () => void;
}

export function HowToModal({ onClose }: Props) {
  return (
    <Modal
      title="Nasıl oynanır?"
      subtitle="Altı bölgeyi tamamla, rozetleri topla!"
      onClose={onClose}
      wide
      footer={
        <button type="button" className="btn btn--primary" onClick={onClose}>
          Anladım, başlayalım!
        </button>
      }
    >
      <div className="howto-grid">
        <section className="howto-card">
          <h3>1. Bölge seç</h3>
          <p>
            Şehir haritasındaki altı binadan birine dokun. Her bölge farklı bir kazanıma
            aittir ve 10 görev içerir.
          </p>
        </section>
        <section className="howto-card">
          <h3>2. Görevi çöz</h3>
          <p>
            Çoktan seçmeli, eşleştirme, sınıflandırma ve sıralama görevleri vardır.
            Sürükle-bırak yerine dokun-seç yöntemini de kullanabilirsin.
          </p>
        </section>
        <section className="howto-card">
          <h3>3. Puan topla</h3>
          <ul>
            <li>Normal görev: <strong>100 puan</strong></li>
            <li>Zor görev: <strong>150 puan</strong></li>
            <li>Bonus görev: <strong>200 puan</strong></li>
            <li>Yanlış cevap: <strong>0 puan</strong></li>
          </ul>
          <p className="howto-note">İpucu kullanırsan doğru cevaptan 25 puan düşülür.</p>
        </section>
        <section className="howto-card">
          <h3>4. Rozetleri kazan</h3>
          <p>
            Bir bölgedeki 10 görevi bitirdiğinde o bölgenin rozetini alırsın. Altı rozeti
            tamamlayınca büyük ödül ekranı açılır.
          </p>
        </section>
        <section className="howto-card">
          <h3>Takım modu</h3>
          <p>
            2–4 takım oluştur. Her sorudan sonra sıra bir sonraki takıma geçer. Takımların
            puanları üstteki takım panelinde anlık görünür.
          </p>
        </section>
        <section className="howto-card">
          <h3>Kısayollar</h3>
          <p>
            Klavye ile sekmeye basıp seçeneklere ulaşabilir, <kbd>Enter</kbd> veya{' '}
            <kbd>Boşluk</kbd> ile seçim yapabilirsin. <kbd>Esc</kbd> açık pencereyi kapatır.
          </p>
        </section>
      </div>
    </Modal>
  );
}
