# STARFALL: REACH STARS
Game arkade space shooter 2D (HTML5, CSS3, JavaScript Vanilla, Canvas). Pengembang: Lazio Putra Kurniansyah Kesikmaan. Guru Pembimbing: Nurhayatul Fadilla dan Virgiawan Listiyanto.

## Menjalankan
`python3 -m http.server` di folder ini, lalu buka http://localhost:8000. Web Crypto butuh HTTPS atau localhost (GitHub Pages dan Vercel memakai HTTPS).

## Catatan
- Akun hanya username + password (PBKDF2 dengan salt unik). Ini simulasi belajar di browser, bukan keamanan produksi.
- Data (akun, sesi, statistik, leaderboard) ada di LocalStorage browser ini; leaderboard bersifat lokal, bukan online.
- Setelah login, Dashboard adalah Beranda.
- Atlas sprite: `assets/sprites/atlas.png`, koordinat di `js/assets.js`.

## Deploy (GitHub Pages)
Unggah isi folder ke repo GitHub, aktifkan Pages dari branch utama (root), lalu uji situs yang sudah terbit.
