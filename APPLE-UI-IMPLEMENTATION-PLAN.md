# Rencana Implementasi UI Apple-inspired untuk GAIL

## Tujuan

Menyegarkan antarmuka Green AI Literacy (GAIL) dengan prinsip visual yang terinspirasi dari Apple Human Interface Guidelines: fokus pada konten, tipografi yang jelas, ruang yang terukur, komponen konsisten, dan interaksi yang terasa responsif.

“Apple-inspired” di sini berarti mengambil prinsip desain, bukan menyalin produk, aset, ikon, atau identitas merek Apple. Identitas GAIL dan palet hijau tetap dipertahankan.

## Prinsip desain

- **Jelas:** setiap halaman memiliki judul, konteks, dan tindakan utama yang mudah dikenali.
- **Konsisten:** warna, tipografi, jarak, bentuk kontrol, dan state mengikuti token yang sama.
- **Fokus:** kurangi elemen dekoratif dan tampilkan fitur sesuai prioritas pengguna.
- **Responsif:** komposisi dan target sentuh nyaman pada desktop, tablet, dan ponsel.
- **Aksesibel:** navigasi keyboard, fokus terlihat, kontras memadai, label formulir jelas, dan dukungan `prefers-reduced-motion`.
- **Fungsional:** perubahan visual tidak mengubah alur bisnis, autentikasi, role, atau data.

## Cakupan perubahan

| Area | Rencana |
|---|---|
| Design system | Definisikan token warna terang/gelap, tipografi, spacing, radius, border, fokus, dan motion. |
| Navbar | Rapikan hierarki navigasi dan dropdown; pertahankan dukungan hover, klik, keyboard, dan layar sentuh. |
| Beranda | Selaraskan hero, simulasi prompt, tentang, pilihan jalur, ringkasan G-R-E-E-N, daftar fitur, dan footer. |
| Model dan Lab | Perbarui tab, panel, kontrol, dan state interaktif agar satu bahasa visual. |
| Misi dan aktivitas | Selaraskan misi, Kartu Komitmen, Pelacak 14 hari, serta Log penggunaan AI. |
| Panduan dan asesmen | Perjelas alur sesi, label INTI/BEBAS/ELASTIS, instrumen, rubrik, dan rekap kelas. |
| Riset, Saran, Tentang | Perbarui hirarki konten, formulir, pesan status, dan navigasi terkait. |
| Login dan admin | Selaraskan dialog masuk dan dashboard super admin tanpa mengubah proses auth maupun pengelolaan data. |
| State dan gerak | Standarkan hover, pressed, selected, loading, empty, error, sukses, serta transisi yang menghormati reduced motion. |

## Di luar cakupan

- Mengubah skema/database Supabase, kebijakan RLS, atau konfigurasi proyek.
- Mengubah autentikasi, pembatasan role, aturan misi, atau perhitungan asesmen.
- Mengganti framework atau menambahkan dependensi UI baru.
- Menggunakan logo, ikon, atau aset proprietari Apple.
- Mengisi hasil riset, foto, testimoni, atau statistik yang belum tersedia dan terverifikasi.

## Workflow implementasi

### 1. Audit dan baseline

- Petakan halaman, komponen bersama, breakpoint, dan state interaksi.
- Catat aturan yang bertumpuk antara `style.css`, `theme.css`, dan style inline di `index.html`.
- Dokumentasikan perilaku sekarang untuk navigasi, login role, simulasi, formulir, dan admin.
- Jalankan pemeriksaan sintaks, `git diff --check`, serta uji visual pada 1440, 768, dan 390 piksel.

**Hasil:** daftar komponen dan baseline yang dapat dibandingkan sebelum/sesudah.

### 2. Tetapkan design tokens

- Tentukan peran warna, bukan warna ad hoc: `background`, `surface`, `text`, `muted`, `accent`, dan `focus`.
- Tetapkan skala tipografi, jarak, ukuran kontrol, radius, border, serta durasi transisi.
- Pastikan pasangan warna memenuhi kontras dan tema terang/gelap tetap konsisten.

**Hasil:** token CSS yang menjadi sumber gaya utama seluruh halaman.

### 3. Bangun komponen dasar

- Rapikan tombol utama/sekunder, tautan, input, select, textarea, tab, kartu, badge, dropdown, dialog, dan pesan status.
- Tambahkan state hover, focus-visible, active, disabled, loading, error, dan success jika relevan.
- Pertahankan label semantik dan ukuran area sentuh yang memadai.

**Hasil:** komponen dasar teruji sebelum diterapkan ke seluruh halaman.

### 4. Terapkan pada beranda

- Pertahankan urutan: **Hero → Simulasi → Tentang → Pilih jalur → Ringkasan cara kerja → Fitur lainnya → Footer**.
- Perjelas tindakan utama dan jelaskan bahwa simulasi memperlihatkan alur/dampak, bukan mengirim prompt ke layanan AI.
- Pastikan pilihan murid, fasilitator, dan tamu tetap memicu alur yang benar.
- Tampilkan progres personal hanya untuk pengguna yang sudah masuk.

**Hasil:** beranda baru yang diuji di desktop, tablet, dan ponsel.

### 5. Terapkan pada halaman aplikasi

Kerjakan per kelompok agar regresi mudah dilacak:

1. **Belajar:** Model G-R-E-E-N, Laboratorium, dan Misi.
2. **Kebiasaan:** Kartu Komitmen, Pelacak, dan Log AI.
3. **Fasilitator:** Panduan, Toolkit Asesmen, dan rekap kelas.
4. **Informasi:** Hasil Riset, Saran, dan Tentang.

**Hasil:** halaman memiliki pola visual konsisten tanpa mengurangi konten maupun fungsi.

### 6. Terapkan pada login dan admin

- Selaraskan dialog masuk, validasi, error, status, tabel, editor konten, dan tindakan admin.
- Verifikasi bahwa pembatasan role dan akses data tetap sama.

**Hasil:** pengalaman admin konsisten dengan UI baru, tanpa perubahan backend.

### 7. Validasi dan iterasi

- Uji rute dan dropdown dengan mouse, keyboard, dan layar sentuh.
- Uji role tamu, murid, dan fasilitator serta akses admin.
- Uji simulasi, tab, misi, progres, formulir, dan state error/loading.
- Uji overflow dan keterbacaan pada lebar 1440, 1024, 768, dan 390 piksel.
- Uji fokus keyboard, kontras, label aksesibel, reduced motion, serta tampilan tanpa JavaScript bila relevan.
- Jalankan pemeriksaan sintaks dan `git diff --check`; tinjau perubahan agar tidak ada file atau aset hasil audit yang ikut terkomit.

**Hasil:** daftar hasil uji, regresi yang diperbaiki, serta catatan batasan yang masih tersisa.

## File yang kemungkinan disentuh

- `theme.css` — token, komponen, layout, breakpoint, state, dan motion.
- `style.css` — aturan lama yang perlu dirapikan atau dikonsolidasikan.
- `index.html` — markup semantik dan struktur komponen bila diperlukan.
- `main.js` — penyesuaian state tampilan yang bergantung pada role/interaksi; tanpa mengubah logika bisnis.
- `scroll.js` — perilaku navigasi, dropdown, dan reveal bila perlu.
- `admin.js` — hanya jika UI admin memerlukan integrasi tampilan; operasi data tetap dipertahankan.

## Kriteria selesai

- Semua halaman utama menggunakan token dan pola komponen yang konsisten.
- Tidak ada perubahan tak disengaja pada autentikasi, role, Supabase, atau alur bisnis.
- Navigasi dan kontrol dapat digunakan dengan keyboard serta layar sentuh.
- Tidak ada overflow horizontal pada ukuran uji.
- Reduced motion menonaktifkan gerak non-esensial tanpa menyembunyikan konten.
- Pemeriksaan sintaks, pemeriksaan whitespace, serta uji interaksi utama lulus.
- Setiap perubahan dapat ditinjau per tahap dan tidak menyertakan artefak audit sementara.

## Urutan rilis yang disarankan

1. Design tokens dan komponen dasar.
2. Beranda.
3. Halaman belajar dan aktivitas murid.
4. Panduan dan asesmen fasilitator.
5. Login dan dashboard admin.
6. Validasi regresi menyeluruh dan penyempurnaan aksesibilitas.

┌────────────────────────────────────────────────────────────────────────┐
│                   WORKPLAN PENGEMBANGAN ADMIN PANEL                    │
├─────────────────┬──────────────────────────────────────────────────────┤
│ FASE            │ RUANG LINGKUP & TARGET FITUR                         │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Fase 1:         │ • Segmented tab bar Apple-style (Ikhtisar, Konten,   │
│ Navigasi & Tata │   Masukan, Hasil Riset, Pengaturan).                 │
│ Letak Dashboard │ • Metric cards KPI di bagian atas (Total Feedback,   │
│                 │   Konten Terbit, Partisipan Riset, Status Supabase). │
│                 │ • Tampilan responsif untuk desktop dan tablet.       │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Fase 2:         │ • Filter dan pencarian masukan berdasarkan kategori  │
│ Inbox Masukan   │   (Konten, Game, Tampilan, Asesmen, Teknis).         │
│ Pengguna        │ • Status tindak lanjut: [Baru] [Dibaca] [Diarsipkan].│
│ (User Feedback) │ • Tombol "Ekspor CSV" untuk arsip laporan riset.     │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Fase 3:         │ • Pratinjau langsung (Live Preview) blok teks        │
│ Editor Konten   │   sebelum dipublikasikan ke halaman tujuan.          │
│ Situs (CMS)     │ • Pengurutan urutan tampil (drag/up-down reorder).   │
│                 │ • Badge status terbit: [Aktif / Draft].              │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Fase 4:         │ • Visualisasi komparasi skor awal (pre-test) vs skor │
│ Analitik & Data │   akhir (post-test) untuk 6 dimensi G-R-E-E-N.       │
│ Hasil Riset     │ • Kalkulasi kenaikan (delta/gain score) otomatis.    │
│                 │ • Ringkasan naratif otomatis untuk bahan publikasi.  │
├─────────────────┼──────────────────────────────────────────────────────┤
│ Fase 5:         │ • Banner koneksi Supabase & panduan migrasi skema.   │
│ Keamanan &      │ • Validasi formulir sisi klien dengan pesan error    │
│ Autentikasi     │   yang informatif dan ramah pengguna.                │
│                 │ • Mekanisme auto-refresh session token aman.         │
└─────────────────┴──────────────────────────────────────────────────────┘