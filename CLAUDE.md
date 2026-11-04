# CLAUDE.md — Öğretmen Bozok / Dijital Şehir

Bu dosya, Claude Code'un bu proje klasöründe çalışırken uyması gereken kalıcı proje talimatlarını içerir.

## 1. Projenin amacı

**Proje adı:** DİJİTAL ŞEHİR – Büyük Teknoloji Macerası  
**Marka:** ÖĞRETMEN BOZOK  
**Hedef kitle:** 5. sınıf Bilişim Teknolojileri ve Yazılım dersi öğrencileri  
**Kullanım:** Akıllı tahta, masaüstü bilgisayar ve tablet  
**Ana ekran hedef oranı:** 16:9  
**Öncelik:** Dokunmatik kullanım, okunaklı arayüz, kararlı çalışma ve çevrim dışı oynanabilme.

Bu proje, 5. sınıf Bilişim Teknolojileri ve Yazılım dersi 1. Tema tekrarını altı oyun bölgesi üzerinden gerçekleştiren etkileşimli bir eğitsel oyundur.

## 2. Çok önemli: Logo ve karakter referansları

**Bu proje klasöründe Öğretmen Bozok logosu ve Öğretmen Bozok karakterine ait referans görsel dosyaları bulunacaktır.** Projeye başlamadan önce klasördeki dosyaları tara; logo ve karakter görsellerini dosya adlarına, uzantılarına ve görsel içeriklerine bakarak tespit et.

Bu görseller, projenin resmî görsel referanslarıdır.

### Logo kullanımı
- Klasörde bulunan Öğretmen Bozok logosunu doğrudan referans al.
- Logonun tasarımını, harflerini, MB monogramını, mezuniyet kepi/devre ayrıntılarını, oranlarını veya renklerini yeniden tasarlama.
- Logoyu yeniden çizilmiş, yaklaşık veya benzer bir logo ile değiştirme.
- Mümkünse orijinal görsel dosyasını kullan; yalnızca yerleşim ve boyutlandırma için orantılı ölçekleme yap.
- Logoyu kırpma, esnetme, bozma veya üzerine başka öğe bindirme.
- Arka planı şeffaf bir logo dosyası varsa öncelikle onu kullan.
- Logo dosyası bulunamazsa yeni logo uydurma; eksikliği raporla ve geçici olarak yalnızca “ÖĞRETMEN BOZOK” metnini kullan.

### Karakter kullanımı
- Klasördeki Öğretmen Bozok karakter görselini ana karakter referansı olarak kullan.
- Karakterin yüz kimliğini, gözlüğünü (referans görselde varsa), saçını, sakalını, yüz şeklini, kıyafet kimliğini ve ayırt edici özelliklerini koru.
- Karakteri başka bir kişiye benzeyecek şekilde değiştirme.
- Yeni pozlar veya farklı sahneler gerekiyorsa aynı karakterin görünüşünü ve kimliğini koruyarak üret.
- Karakterin kıyafetlerinde ve aksesuarlarında marka kimliğiyle çelişen değişiklikler yapma.
- Referans karakter dosyası bulunamazsa rastgele bir öğretmen karakteri oluşturma; eksikliği bildir.
- Öğretmen Bozok karakterini çocuk karakterlerle karıştırma. Öğrenci rehber karakterleri gerekiyorsa ayrı ve özgün yardımcı karakterler olarak tasarla.

### Referans dosyalarının yönetimi
- İlk iş olarak proje kök klasöründeki görsel dosyalarını listele ve logo/karakter referanslarını tespit et.
- Dosyaları yeniden adlandırma, silme veya üzerine yazma.
- Görselleri mümkünse `src/assets/brand/` altına kopyala; kaynak dosyaları proje kökünde bırak ve değiştirme.
- Kullanılan gerçek dosya adlarını `README.md` içinde belirt.
- Görsellerin bulunup bulunmadığını varsayma; gerçekten kontrol et.
- Referans dosyalarının hangisinin logo, hangisinin karakter olduğunu kesin ayırt edemiyorsan kullanıcıya sor veya belirsizliği raporla.

## 3. Tasarım referansı ve görsel dil

Kullanıcı tarafından sağlanan “Dijital Şehir” ana ekran görselini tasarım referansı olarak kullan. Bu görselin amacı genel yerleşimi, renk dilini, şehir atmosferini ve bileşen hiyerarşisini göstermektir.

- Görseli etkileşimsiz tek parça arka plan olarak kullanma.
- Harita, binalar, butonlar, sayaçlar ve menüler gerçek arayüz bileşenleri olmalı.
- Altı bölge ayrı ayrı tıklanabilir ve klavye/dokunmatik erişilebilir olmalı.
- Ana ekran 16:9 yatay ekranlarda taşma yapmadan görünmeli.
- Renkler canlı ama uzun süreli sınıf kullanımında gözü yormayacak dengede olmalı.
- Yazılar öğrencilerin sınıfın arkasından okuyabileceği büyüklükte olmalı.
- Butonlar akıllı tahtada parmakla kolayca seçilebilecek büyüklükte olmalı.
- Animasyonlar performansı düşürmemeli; azaltılabilir veya kapatılabilir olmalı.

Önerilen görsel yaklaşım:
- Renkli, kaliteli, çocuk dostu 2D/2.5D veya izometrik dijital şehir.
- Turkuaz, açık mavi, mor ve sarı vurgular.
- Her bölge için ayırt edilebilir renk ve simge.
- Yumuşak geçişler, anlaşılır geri bildirimler ve tutarlı ikon dili.

## 4. Müfredat ve altı oyun bölgesi

Aşağıdaki kazanım adlarını ve kodlarını koru. Kullanıcı yeni veya düzeltilmiş kazanım metni verirse en güncel kullanıcı metni önceliklidir.

1. **TEKNOLOJİ MERKEZİ — BTY.5.1.1**  
   Günlük yaşamda kullanılan bilişim teknolojilerini sınıflandırabilme.

2. **TOPLUM MEYDANI — BTY.5.1.2**  
   Bilişim teknolojilerinin birey ve toplum üzerindeki etkilerini özetleyebilme.

3. **DİJİTAL GÜVENLİK MERKEZİ — BTY.5.1.3**  
   Dijital vatandaşlık uygulamalarını sınıflandırabilme.

4. **YAPAY ZEKÂ LABORATUVARI — BTY.5.1.4**  
   Yapay zekâ ile ilgili temel kavramları ve özellikleri sorgulayabilme.

5. **BİLGİSAYAR ATÖLYESİ — BTY.5.1.5**  
   Bilgisayar sistemlerini çözümleyebilme.

6. **DOSYA YÖNETİM MERKEZİ — BTY.5.1.6**  
   Dosya ve klasör yönetimi ile ilgili temel işlemlerle çalışabilme.

Her bölgede başlangıç hedefi 10 görev, toplam 60 görevdir. Soru sayısını tamamlamak uğruna tekrar eden veya kazanımla ilgisiz sorular yazma. Nitelik, sayısal hedeften önemlidir.

## 5. İçerik doğruluğu ve soru yazma ilkeleri

- Sorular 5. sınıf seviyesinde, açık ve anlaşılır Türkçe ile yazılmalı.
- Ezber sorularının yanında günlük yaşam senaryoları, sınıflandırma, eşleştirme, sıralama, görsel yorumlama ve problem çözme kullanılmalı.
- Aynı soruyu farklı kelimelerle tekrar etme.
- Her sorunun kazanım kodu, soru metni, cevap(lar)ı, açıklaması ve puan değeri tanımlı olmalı.
- Birden fazla kabul edilebilir doğru cevap varsa bunları veri modelinde belirt.
- Açık uçlu yanıtları öğretmen değerlendirmesi gerektirebilecek şekilde işaretle; belirsiz cevapları otomatik olarak kesin yanlış sayma.
- Kaynak materyaller veya kullanıcının verdiği ders notları mevcutsa öncelikle onları esas al.
- Kaynakta bulunmayan bir bilgiyi kaynakta varmış gibi sunma.
- Müfredat kapsamını aşan teknik ayrıntılar ekleme.
- BTY.5.1.5 bilgisayar sistemleri ile BTY.5.1.6 dosya/klasör yönetimi konularını birbirine karıştırma.
- Yapay zekâ sorularını 5. sınıf düzeyinde tut.

## 6. Oyun modları ve işlevler

### Bireysel mod
- Öğrenci altı bölgeyi oynayabilmeli.
- Puan, doğru/yanlış sayısı, tamamlanan görev, yıldız ve rozetler gösterilmeli.
- İlerleme sayfa yenilendiğinde korunmalı.

### Takım modu
- 2, 3 veya 4 takım seçilebilmeli.
- Takım isimleri düzenlenebilmeli.
- Aktif takım belirgin gösterilmeli.
- Soru sonrası sıra doğru takıma geçmeli.
- Takım puanları anlık güncellenmeli.

### Puanlama
- Normal görev: 100 puan.
- Zor görev: 150 puan.
- Bonus görev: 200 puan.
- Yanlış cevap: 0 puan.
- İpucu puanı etkiliyorsa kuralı arayüzde açıkça göster.
- Bölge tamamlandığında ilgili rozet verilmeli.
- Altı rozet tamamlandığında final/başarı ekranı açılmalı.

### Etkileşim
- Çoktan seçmeli, eşleştirme, sınıflandırma, sürükle-bırak, sıralama ve senaryo görevleri gerçek işlevli olmalı.
- Sürükle-bırak görevleri dokunmatik ekranda da çalışmalı; mümkünse sürüklemeye alternatif dokun-seç/dokun-hedef davranışı sun.
- Cevap verilmeden görev tamamlanmış sayılmamalı.
- Aynı oturumda tamamlanan görevler tekrar edilmemeli; yeni oyunda karıştırma seçeneği olmalı.
- Sıfırlama işlemi kullanıcı onayı istemeli.

## 7. Teknik mimari ve geliştirme tercihleri

Tercih edilen teknoloji:
- React
- TypeScript
- Vite
- CSS veya CSS Modules
- SVG tabanlı arayüz/görseller
- PWA / Service Worker
- LocalStorage veya IndexedDB

Önerilen klasörler:
- `src/components/`
- `src/pages/`
- `src/districts/`
- `src/games/`
- `src/data/`
- `src/hooks/`
- `src/utils/`
- `src/styles/`
- `src/assets/brand/`
- `public/`

Mimari ilkeler:
- Soru verileri arayüzden ayrı tutulmalı.
- Puanlama ve oyun mantığı UI bileşenlerinden ayrılmalı.
- Bileşenler küçük, tekrar kullanılabilir ve anlaşılır olmalı.
- Gereksiz bağımlılık ekleme.
- Harici API, ücretli servis veya çalışma anında internet zorunluluğu oluşturma.
- Görselleri yerel dosyalardan yükle.
- Mevcut projeyi incelemeden framework değiştirme veya dosyaları topluca silme.
- Kullanıcı onayı olmadan yıkıcı komut çalıştırma.

## 8. Akıllı tahta ve erişilebilirlik

Hedef ekranlar:
- 1920×1080
- 1366×768
- 1024×768
- Tablet ekranları

Gereksinimler:
- 16:9 ana görünüm öncelikli.
- Dikey ekranlarda da içerik kullanılabilir kalmalı.
- Dokunmatik ve fare girişi desteklenmeli.
- Klavye ile temel gezinme mümkün olmalı.
- Büyük tıklama/dokunma alanları kullanılmalı.
- Renk tek başına doğru/yanlış göstergesi olmamalı; simge ve metin de kullan.
- Hareket azaltma seçeneği sun.
- Tam ekran açma/kapatma işlevi ekle.
- Sayfa kaydırması gereksiz yere oluşmamalı.

## 9. Çevrim dışı kullanım

- Uygulama ilk yüklemeden sonra internet olmadan oynanabilmeli.
- Soru verileri, ikonlar ve gerekli görseller yerel olmalı.
- PWA/Service Worker önbelleği doğru yapılandırılmalı.
- Çevrim dışı durum gerçekten test edilmeli.
- İnternet olmadan çalışmayan bir özellik varsa bunu açıkça belirt.

## 10. Geliştirme yöntemi

Projeyi tek seferde ve plansız biçimde oluşturma.

1. Önce proje klasörünü ve görsel varlıkları incele.
2. Logo ve karakter referanslarını tespit et.
3. Mevcut kodu ve proje durumunu analiz et.
4. Mimari ve aşamalı geliştirme planı sun.
5. Kullanıcı onayı olmadan büyük kapsamlı değişikliklere başlama.
6. Her aşamada çalışan uygulamayı koru.
7. Bir aşamanın testini tamamlamadan sonraki aşamaya geçme.
8. Değişikliklerden sonra ilgili testleri ve build işlemini çalıştır.
9. Hata varsa düzelt ve yeniden test et.
10. Test edilmemiş özelliği tamamlandı olarak bildirme.

Önerilen aşamalar:
1. Proje ve referans varlıklarını inceleme.
2. Ana ekran ve şehir haritası.
3. Altı bölgenin sayfa yapısı.
4. Soru veri modeli ve 60 görevlik içerik havuzu.
5. Soru türleri ve etkileşimler.
6. Bireysel/takım modları.
7. Puan, ilerleme, yıldız ve rozet sistemi.
8. Ses, animasyon ve ayarlar.
9. PWA/çevrim dışı çalışma.
10. Test, hata düzeltme ve son kontrol.

## 11. Test ve teslim kuralları

Gerçekten çalıştırmadan “çalışıyor” deme.

Kontrol et:
- Ana ekran ve altı bölge açılıyor mu?
- Her bölgenin görevleri mevcut mu?
- Soru-cevap eşleşmeleri doğru mu?
- Puanlama doğru mu?
- Takım sırası ve takım puanları doğru mu?
- Bireysel ilerleme kaydediliyor mu?
- Sürükle-bırak ve dokunmatik alternatifler çalışıyor mu?
- Yıldız/rozet ve final ekranı doğru mu?
- Sıfırlama doğru çalışıyor mu?
- Tam ekran modu çalışıyor mu?
- 16:9 çözünürlüklerde taşma var mı?
- Çevrim dışı kullanım doğrulandı mı?
- Logo ve karakter referansları bozulmadan kullanılıyor mu?

Uygun olduğunda:
- `npm run build`
- ilgili lint komutu
- ilgili test komutu
- tarayıcı üzerinden manuel test

çalıştır.

Teslimde şunları belirt:
- Oluşturulan/değiştirilen dosyalar
- Tamamlanan özellikler
- Gerçekten çalıştırılan testler
- Başarısız veya henüz test edilmemiş noktalar
- Projeyi yerelde çalıştırma komutları

## 12. Marka ve içerik konusunda son kural

Öğretmen Bozok logosu ve karakteri bu projenin kimliğinin parçasıdır. Klasörde bulunan gerçek referans görselleri esas al. Bunları yeniden tasarlama, başka bir logoyla veya rastgele bir karakterle değiştirme. Referans varlıkları bulamazsan bunu açıkça bildir ve kullanıcıdan dosyaları sağlamasını iste.

**Öncelik sırası:** İçerik doğruluğu → gerçek işlevsellik → akıllı tahta kullanılabilirliği → marka tutarlılığı → görsel süslemeler.
