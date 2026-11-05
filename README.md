# GAIL

## Setup Supabase

1. Buat proyek Supabase, aktifkan Email/Password di Authentication, lalu buat dan konfirmasi akun admin.
2. Ganti `GANTI_DENGAN_EMAIL_SUPER_ADMIN` di bagian akhir `supabase-schema.sql` dengan email akun tersebut. Jalankan seluruh isi SQL melalui SQL Editor Supabase untuk membuat tabel, kebijakan akses, dan role super admin.
3. Isi `url` dan `anonKey` di `supabase-config.js` menggunakan Project URL dan publishable/anon key dari pengaturan proyek. Jangan pernah masukkan service-role key ke frontend.
4. Jalankan situs melalui server lokal atau hosting statis. Dashboard Admin akan muncul setelah login jika profil pengguna memiliki role `super_admin`.

### Pemecahan masalah Supabase

- `PGRST205` atau `Could not find the table ... in the schema cache`: jalankan `supabase-schema.sql`. Jika tabel sudah ada, jalankan `notify pgrst, 'reload schema';` melalui SQL Editor untuk memuat ulang schema cache.
- Error `Invalid login credentials` (HTTP 400): pastikan email dan kata sandi benar, akun sudah dibuat di proyek yang sama, serta email akun sudah dikonfirmasi.
- Error `Email not confirmed`: konfirmasi email akun admin melalui tautan dari Supabase sebelum login.

Dashboard mengelola blok konten teks yang diterbitkan pada halaman, masukan pengguna, dan hasil riset. Konten yang sudah tertanam di halaman tidak dihapus atau diganti; blok terbitan ditambahkan setelah konten halaman. Progres murid tetap tersimpan lokal di perangkat.

Fasilitator dapat membuat kode kelas melalui **Asesmen → Rekap kelas**, lalu membagikannya kepada murid. Murid memasukkan kode pada saat masuk; kode kelas dicantumkan dalam laporan untuk membantu pengelompokan dan bukan mekanisme autentikasi.

Jika akun admin lain perlu ditambahkan, buat akun melalui Authentication lalu jalankan perintah berikut di SQL Editor dengan UUID akun yang benar:

```sql
insert into public.profiles (id, role)
values ('UUID_AKUN_AUTH', 'super_admin')
on conflict (id) do update set role = excluded.role;
```