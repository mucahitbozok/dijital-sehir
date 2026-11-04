# Dijital Şehir – Büyük Teknoloji Macerası

Öğretmen Bozok markasıyla hazırlanmış, 5. sınıf **Bilişim Teknolojileri ve Yazılım** dersi
1. tema tekrar oyunu. Altı bölge, her bölgede 10 görev olmak üzere toplam 60 görev içerir.

## Kullanılan marka dosyaları

Proje kökünde bulunan ve **değiştirilmeden** kullanılan kaynak dosyalar:

| Kaynak dosya (proje kökü) | Projede kullanılan kopya | Kullanım |
| --- | --- | --- |
| `Öğretmen Bozok Teknoloji Logosu.png` | `src/assets/brand/ogretmen-bozok-logo.png` | Üst çubuk, final ekranı, PWA simgeleri |
| `Dijital Öğretmen Bozok Karakteri.png` | `src/assets/brand/ogretmen-bozok-karakter.png` | Ana ekran rehberi, görev ekranı rehberi, final ekranı |

Kaynak dosyalar yerinde korunmuştur. Logo kopyasındaki damalı arka plan, kaynak dosya
değiştirilmeden `scripts/build_brand_assets.py` ile saydamlaştırılmıştır; logo çizimi,
renkleri, MB monogramı ve tüm ayrıntıları korunmuştur. Karakterin saydamlığı kaynak
dosyadan geldiği gibi bırakılmıştır.

## Çalıştırma

```bash
npm install
npm run dev        # geliştirme sunucusu
npm run build      # tsc --noEmit + üretim derlemesi
npm run preview    # üretim derlemesini önizleme
npm test           # Vitest birim testleri
npm run typecheck  # yalnızca TypeScript denetimi
```

Üretim derlemesi `dist/` altına yazılır. Statik sunucuda yayınlanabilir; `base: './'`
sayesinde alt klasörde de çalışır. PWA service worker'ı yalnızca üretim derlemesinde
kaydedilir ve ilk açılışta derleme varlıklarını önbelleğe alacak şekilde yapılandırılmıştır;
bu davranış henüz gerçek çevrim dışı testiyle doğrulanmamıştır.

## Bölgeler ve kazanımlar

| Bölge | Kazanım |
| --- | --- |
| Teknoloji Merkezi | BTY.5.1.1 |
| Toplum Meydanı | BTY.5.1.2 |
| Dijital Güvenlik Merkezi | BTY.5.1.3 |
| Yapay Zekâ Laboratuvarı | BTY.5.1.4 |
| Bilgisayar Atölyesi | BTY.5.1.5 |
| Dosya Yönetim Merkezi | BTY.5.1.6 |

## Görev türleri

- Çoktan seçmeli (`mc`)
- Çoklu seçim (`multi`)
- Eşleştirme (`match`)
- Sınıflandırma (`classify`) — sürükle-bırak ve dokun-seç/dokun-hedef
- Sıralama (`order`) — dokunmatikte yukarı/aşağı düğmeleri

Puanlama: normal 100, zor 150, bonus 200. Yanlış cevap 0 puandır. İpucu kullanıldığında
doğru cevaptan 25 puan düşülür ve bu kural arayüzde açıkça gösterilir.

Yıldız: bölgede %90 ve üzeri doğru → 3, %70 ve üzeri → 2, %40 ve üzeri → 1 yıldız.
Bölgedeki 10 görevin tamamı cevaplanınca rozet kazanılır; altı rozet tamamlanınca final
ekranı açılır.

## Özellikler

- Bireysel ve takım modu (2–4 takım, düzenlenebilir adlar, sıra takibi, anlık puanlar)
- Görev sırası oturum başına karıştırılır; aynı oturumda tamamlanan görev tekrar sorulmaz
- İlerleme, ayarlar ve takım bilgileri `localStorage` içinde saklanır
- Onay isteyen sıfırlama
- Tam ekran düğmesi
- Ses efektleri ve azaltılmış hareket seçeneği
- Klavye ile bölge seçimi, modal odak tuzağı, dokunmatik uyumlu hedefler
- Renk tek başına anlam taşımaz; simge ve metinle birlikte kullanılır
- PWA manifest ve service worker ile çevrim dışı çalışma

## Doğrulama durumu

Bu ortamda `npm install` adımı izin/otomatik sınıflandırma hatası nedeniyle tamamlanamadı.
Bu nedenle aşağıdaki kontroller **henüz çalıştırılmamıştır**: `npm run typecheck`,
`npm run build`, `npm test`, tarayıcıda manuel test ve gerçek çevrim dışı (PWA) testi.
Bu adımlar başarılı sayılmamalıdır; yerelde `npm install` sonrasında çalıştırılmalıdır.

Gerçekten çalıştırılan kontroller:

- `node --experimental-strip-types --experimental-loader ./scripts/ts-loader.mjs scripts/verify_logic.mjs`
  (bağımlılıksız): 60 görev, 6 bölge, benzersiz kimlikler,
  kazanım/puan eşleşmeleri, tüm görev türlerinde doğru cevap denetimi, yanlış cevapta 0 puan,
  yıldız eşikleri, bireysel kayıt, takım sırası ve bozuk veri temizliği doğrulandı.
- `node --check public/sw.js`: service worker sözdizimi doğrulandı.
- CSS süslü parantez/parantez dengesi ve JSX'te kullanılan sınıfların tanımları statik olarak
  karşılaştırıldı.

## Klasör yapısı

```text
src/
  assets/brand/     marka görselleri
  components/       harita, başlık, modal, rozet, yıldız, rehber
  data/             bölgeler ve 60 görevlik içerik havuzu
  game/             cevap denetimi, puanlama, ilerleme
  games/            görev türü arayüzleri
  screens/          ana ekran, oyun ekranı, bölge özeti, final
  styles/           global stil dosyası
  utils/            karıştırma ve ses yardımcıları
public/             manifest, service worker, simgeler
scripts/            marka görseli işleme, CSS denetimi ve bağımlılıksız mantık doğrulama betikleri
```
