# DZC-81 · Stabilizasyon Testi

**2099 Sistem Evreni** için tasarlanmış tek ekran denetim arayüzü — *Yazı ve Tipografi* vize projesi, Ürün 05.

DZC-81 Geçiş ve Kontrol Düğümü'ndeki görevlilerin kullandığı terminal: transit geçiş yapan personelin kimlik/yetki verilerini, Temel Çizgi Testi (biyometrik stabilizasyon) sonuçlarını, Nexus-X nöro-stabilizasyon protokolünü ve altyapı kayıtlarını eşzamanlı işler. Seyahat bileti, kimlik kartı, Nexus-X ambalajı ve SYNTEX-81 afişindeki veriler arayüzün içinde çapraz doğrulanır.

## Kullanım

- Kuyruktaki her yolcu için test otomatik ilerler (7 adım).
- **F1 / 1** Onayla · **F2 / 2** Beklet · **F3 / 3** Nexus-X uygula · **F4 / 4** Reddet / Karantina
- Karar süresi 30 sn; dolduğunda yolcu otomatik bekletmeye alınır.

## Yapı

Derleme gerektirmeyen statik site: `index.html`, `style.css`, `app.js`, `assets/`. Vercel'e doğrudan statik olarak yüklenir.

Fontlar (Türkçe karakter destekli): Tektur, Chakra Petch, Kode Mono, VT323, Audiowide, M PLUS 1 Code, Sedgwick Ave, IBM Plex Mono.

---
Said Numan Yücel · Görsel İletişim Tasarımı · İstanbul Medeniyet Üniversitesi
