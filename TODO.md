# Efektif — Yapılacaklar Listesi

**Proje Durumu**: Mimari scaffold tamamlandı, implementation aşamasına geçiliyor
**Son Güncelleme**: 2026-03-16
**GitHub**: https://github.com/lekesiz/Efektif

---

## ✅ TAMAMLANANLAR

### Faz 1 — Temel Altyapı
- [x] Turborepo monorepo scaffold
- [x] Neon PostgreSQL + Drizzle ORM şeması (21 tablo, index'li, relation'lı)
- [x] @efektif/shared paketi (types, constants, psychometric meta, future score)
- [x] @efektif/ai paketi (Caméléon profil, prompt sanitization, model routing)
- [x] Tooling (TypeScript, Prettier configs)
- [x] .env.example, .gitignore
- [x] Docker Compose (PostgreSQL 16 + Redis 7)

### Faz 2 — tRPC & Testler
- [x] tRPC altyapısı (6 procedure tipi, 14 router)
- [x] Psikometrik test soruları (RIASEC 30Q, BigFive 50Q, Values 30Q — 3 dil)
- [x] Skor hesaplama fonksiyonları (0-100 normalize)
- [x] Kariyer eşleştirme motoru (Euclidean distance + bonuslar)
- [x] DashboardLayout (collapsible sidebar, role-based nav, responsive)
- [x] Dashboard sayfası (journey tracker, test cards)
- [x] RIASEC test flow UI (auto-save, progress bar, Likert scale)
- [x] RIASEC Radar chart (Recharts)
- [x] Zustand auth store

### Faz 3 — AI & Sayfalar
- [x] AI prompt builders (debrief, diagnostic, admission)
- [x] Vercel AI SDK + Claude streaming endpoint
- [x] Debrief chat sayfası (useChat, 7 mesaj limiti)
- [x] ChatMessage bileşeni (markdown, typing indicator)
- [x] Results sayfası (RIASEC/BigFive/Values tabs)
- [x] BigFive bars + Values ranking charts
- [x] My Tracks sayfası (5 modüler tab — 1900 satır yerine 7 dosya)
- [x] CareerCard bileşeni
- [x] Kariyer detay sayfası (RIASEC overlay, AI impact)
- [x] Admission dossiers listesi
- [x] Messaging sayfası (split layout)

### Faz 4 — PDF, Ödeme, Admin
- [x] @efektif/pdf (React-PDF templates: diagnostic, test results)
- [x] PDF bileşenleri (Header, Footer, ScoreBar, RiasecTable)
- [x] Stripe entegrasyonu (checkout, webhook handler)
- [x] Login / Register / Pricing sayfaları
- [x] Profile sayfası (react-hook-form + zod)
- [x] Admin paneli (students, counselors, stats)
- [x] Counselor paneli (clients, appointments, reports)
- [x] @efektif/email (welcome, test-completed, diagnostic-ready templates)

### Faz 5 — Test & Production Hazırlığı
- [x] 35 unit test (RIASEC, BigFive, Values, career-matcher, sanitization)
- [x] Vitest config'leri
- [x] GitHub Actions CI pipeline
- [x] Yasal sayfalar (legal, privacy, terms — GDPR uyumlu)
- [x] Public layout (nav header, footer)
- [x] 404 sayfası
- [x] README.md

---

## 🔴 KRİTİK — Sonraki Oturumda Yapılacaklar (Öncelik: YÜKSEK)

### 1. Veritabanı Bağlantısı
- [ ] Neon PostgreSQL hesabı oluştur ve DATABASE_URL al
- [ ] `pnpm db:generate` ile migrasyon dosyalarını üret
- [ ] `pnpm db:push` ile şemayı veritabanına yaz
- [ ] DB bağlantısını tRPC context'e entegre et (`apps/web/lib/trpc/routers/_app.ts`)
- [ ] Tüm router'larda `createDb()` kullanarak gerçek query'leri yaz

### 2. Authentication (Better Auth)
- [ ] Better Auth paketini kur (`better-auth`)
- [ ] Auth config dosyası oluştur (`apps/web/lib/auth.ts`)
- [ ] Google OAuth provider ekle
- [ ] Email/password provider ekle
- [ ] Session middleware'ini tRPC context'e bağla
- [ ] Login/Register sayfalarını auth API'ye bağla
- [ ] Middleware'de auth guard'ları aktifleştir
- [ ] Logout fonksiyonunu implemente et

### 3. tRPC Router İmplementasyonları
- [ ] **auth.ts** — `me` query'sini Better Auth session'dan oku
- [ ] **profile.ts** — `get` ve `update` gerçek DB query'leri
- [ ] **tests.ts** — `submit`, `latest`, `results`, `saveDraft`, `loadDraft`, `canTake` DB query'leri
- [ ] **careers.ts** — `list`, `count`, `getByCode`, `categories`, `smartMatch` DB query'leri
- [ ] **favorites.ts** — `list`, `add`, `remove` DB query'leri (upsert ile race condition önleme)
- [ ] **priorities.ts** — `list`, `set` DB query'leri (transaction ile)
- [ ] **conversations.ts** — `list`, `messages`, `send` DB query'leri
- [ ] **notifications.ts** — `list`, `unreadCount`, `markRead`, `markAllRead` DB query'leri
- [ ] **diagnostic.ts** — `get`, `generate` (AI çağrısı + DB kayıt)
- [ ] **documents.ts** — `list`, `getUploadUrl`, `delete` (R2 entegrasyonu)
- [ ] **messaging.ts** — `threads`, `messages`, `send` DB query'leri
- [ ] **admin.ts** — `users`, `stats`, `updateUserRole` DB query'leri (JOIN ile, N+1 yok!)
- [ ] **counselor.ts** — `students`, `studentDetail`, `addNote` DB query'leri
- [ ] **stripe.ts** — Gerçek Stripe checkout session oluşturma

### 4. Hono API Route İmplementasyonları
- [ ] `/ai/match-careers` — Kariyer eşleştirme (Promise.all ile paralel query)
- [ ] `/ai/generate-diagnostic` — Diagnostic rapor üretimi (Claude Sonnet)
- [ ] `/ai/extract-insights` — Debrief insight çıkarma (Claude Haiku)
- [ ] `/ai/admission-advice` — Kabul tavsiyesi (Claude Sonnet)
- [ ] `/ai/search-formations` — Formasyon arama (Claude Haiku)
- [ ] `/pdf/report/:userId` — PDF üretimi (React-PDF render → R2 upload)
- [ ] `/pdf/admission/:dossierId` — Admission PDF üretimi

---

## 🟡 ORTA ÖNCELİK — İlk Hafta Sonrası

### 5. Eksik Test Sayfaları
- [ ] BigFive test sayfası (`/tests/bigfive/page.tsx`) — RIASEC pattern'i ile
- [ ] Values test sayfası (`/tests/values/page.tsx`) — RIASEC pattern'i ile
- [ ] Test sonrası otomatik debrief yönlendirmesi

### 6. Dosya Yükleme
- [ ] Cloudflare R2 hesabı oluştur
- [ ] Upload API endpoint'i (presigned URL)
- [ ] Dosya yükleme UI bileşeni (drag & drop)
- [ ] PDF metin çıkarma (pdf-parse)
- [ ] Dosya boyutu/MIME tipi validasyonu (MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES)

### 7. Seed Data
- [ ] `packages/db/seed/index.ts` — Seed script oluştur
- [ ] Kariyer veritabanı (Reflektif'ten 1143 kariyer migrate et)
- [ ] Kariyer kategorileri (23 kategori, 3 dil)
- [ ] Test kullanıcıları (1 admin, 2 counselor, 5 student)
- [ ] Örnek test sonuçları
- [ ] Örnek bildirimler

### 8. Real-time Mesajlaşma
- [ ] Socket.io server kurulumu (Hono veya ayrı servis)
- [ ] Redis adapter (scaling için)
- [ ] Client-side Socket.io bağlantısı
- [ ] Typing indicator
- [ ] Online/offline presence
- [ ] Polling'den Socket.io'ya geçiş

### 9. Background Jobs
- [ ] Trigger.dev hesabı oluştur
- [ ] Job tanımları:
  - [ ] `generate-diagnostic` — Diagnostic rapor üretim workflow'u
  - [ ] `send-email` — Asenkron email gönderimi
  - [ ] `generate-pdf` — PDF üretimi + R2 upload
  - [ ] `extract-document` — Belge metin çıkarma
  - [ ] `enrich-career` — Kariyer verisi zenginleştirme (AI)
- [ ] Job tetikleme noktalarını router'lara bağla

### 10. Rate Limiting
- [ ] Upstash Redis hesabı oluştur
- [ ] `apps/api/src/middleware/rate-limit.ts` → Gerçek implementasyon
- [ ] Auth endpoint'leri: 5 req/15dk/IP
- [ ] AI endpoint'leri: 10 req/dk/user
- [ ] Upload endpoint'leri: 20 req/dk/user
- [ ] Genel API: 100 req/dk/user

---

## 🟢 DÜŞÜK ÖNCELİK — Sürekli İyileştirme

### 11. Testler & QA
- [ ] tRPC router unit testleri (mock DB ile)
- [ ] Component testleri (React Testing Library)
- [ ] E2E testler (Playwright):
  - [ ] Kayıt → Login → Test → Sonuçlar akışı
  - [ ] Ödeme akışı (Stripe test mode)
  - [ ] Danışman → Öğrenci detay akışı
  - [ ] Admin → Kullanıcı yönetimi akışı
- [ ] Accessibility testleri (axe-core)
- [ ] Lighthouse CI

### 12. Monitoring & Observability
- [ ] Sentry entegrasyonu (Next.js + Hono)
- [ ] Better Stack log yönetimi
- [ ] Error boundary'ler (sayfa bazlı)
- [ ] Performance monitoring (Core Web Vitals)
- [ ] Uptime monitoring

### 13. UI Polish
- [ ] shadcn/ui bileşenlerini kur (Button, Input, Select, Dialog, etc.)
- [ ] Loading skeleton'lar (Dashboard, Results, Careers)
- [ ] React.memo optimizasyonları
- [ ] Framer Motion animasyonları (sayfa geçişleri, kart hover)
- [ ] Dark mode tema iyileştirmesi
- [ ] Mobile responsive son kontrol
- [ ] Accessibility (WCAG AA — aria-labels, focus management, skip links)
- [ ] Favicon ve OG meta tags

### 14. SEO & Marketing
- [ ] Landing page içerik zenginleştirme
- [ ] Sitemap.xml oluşturma
- [ ] Robots.txt
- [ ] Open Graph meta tags
- [ ] Google Search Console kayıt
- [ ] Google Analytics 4 entegrasyonu

### 15. i18n Tamamlama
- [ ] Tüm çeviri anahtarlarını 3 dilde tamamla
- [ ] Yasal sayfaları 3 dilde oluştur
- [ ] Email template'lerini İngilizce'ye çevir
- [ ] PDF rapor çevirilerini tamamla
- [ ] Test sorularında İngilizce doğruluğunu kontrol et

### 16. Production Deployment
- [ ] Vercel projesi oluştur (apps/web)
- [ ] Railway projesi oluştur (apps/api)
- [ ] Neon production veritabanı
- [ ] Upstash Redis production
- [ ] Cloudflare R2 bucket
- [ ] Domain yapılandırması (efektif.net)
- [ ] SSL sertifikası
- [ ] Environment variables (tüm servisler)
- [ ] Stripe production mode
- [ ] Resend domain doğrulama
- [ ] DNS kayıtları

---

## 📊 İLERLEME TAKİBİ

```
Tamamlanan Görevler : 62
Kalan Görevler      : 89
Toplam              : 151
İlerleme            : %41

Mimari              : %100 ✅
Frontend Sayfaları  : %90  (BigFive/Values test sayfaları eksik)
Backend Router'lar  : %30  (Yapı var, DB bağlantısı yok)
Auth                : %10  (Placeholder)
Veritabanı          : %80  (Şema tam, bağlantı/migrasyon eksik)
AI Entegrasyonu     : %70  (Prompt'lar tam, streaming var, router bağlantısı eksik)
PDF                 : %80  (Template'ler tam, render endpoint eksik)
Email               : %80  (Template'ler tam, send bağlantısı eksik)
Testler             : %40  (Unit var, integration/E2E yok)
Deployment          : %10  (CI var, hosting yok)
```

---

## 🗓️ ÖNERİLEN ÇALIŞMA SIRASI

### Oturum 2 (Sonraki)
1. Neon DB bağlantısı + migrasyon
2. Better Auth entegrasyonu
3. Auth router + profile router implementasyonu
4. Tests router implementasyonu
5. İlk `pnpm dev` çalıştırma

### Oturum 3
6. Careers + favorites + priorities router'ları
7. Seed data (kariyerler + kategoriler)
8. SmartMatch endpoint bağlantısı
9. BigFive + Values test sayfaları

### Oturum 4
10. Conversations + diagnostic router'ları
11. AI debrief + diagnostic bağlantısı
12. PDF render endpoint
13. Notification sistemi

### Oturum 5
14. Admin + counselor router'ları
15. Messaging router + Socket.io
16. Stripe gerçek entegrasyon
17. R2 dosya yükleme

### Oturum 6
18. E2E testler (Playwright)
19. Sentry + monitoring
20. UI polish + accessibility
21. Production deployment

---

*Bu dosya her oturumda güncellenecektir.*
