# LENZ ANIME NONTON

Website streaming anime modern berbasis **HTML5 + CSS3 + Vanilla JavaScript** (tanpa framework).

## Identitas
- **Nama:** LENZ ANIME NONTON
- **Tagline:** Nonton Anime Lebih Mudah, Cepat, dan Nyaman

## Sumber Data
- **API Utama:** https://shivraapi.my.id/otd
- **API Poster:** https://api.jikan.moe/v4 (fallback otomatis → API utama → placeholder lokal)

## Cara Pakai
1. Ekstrak ZIP.
2. Karena memakai `fetch` ke API eksternal, jalankan lewat HTTP server (bukan `file://`).
   ```bash
   # Pilihan cepat:
   npx serve .
   # atau:
   python3 -m http.server 8080
   ```
3. Buka `http://localhost:8080`.

## Struktur Project
```
LENZ-ANIME-NONTON/
├── index.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── config.js        # SEMUA URL API di sini
│   ├── cache.js         # localStorage TTL
│   ├── error-handler.js
│   ├── api.js           # Client fetch + cache
│   ├── image-loader.js  # Jikan→API→Placeholder
│   ├── ui.js            # Komponen reusable
│   ├── player.js        # MP4 / M3U8 / iframe
│   ├── router.js        # Hash router
│   └── app.js           # Bootstrap
├── pages/
│   ├── home.js / ongoing.js / completed.js
│   ├── anime.js / episode.js / batch.js
│   ├── genre.js / search.js / schedule.js / list.js
└── assets/
    ├── logo.png  favicon.ico  no-image.webp
    └── icons/
```

## Mengganti API
Edit hanya `js/config.js` → `API_BASE`. Tidak ada hardcode URL di file lain.

## Fitur
- Hero auto-slider + manual + swipe (mobile)
- Skeleton loading di semua halaman
- Cache localStorage (5 menit data, 24 jam poster)
- Infinite scroll & pagination
- Real-time search dengan debounce 500ms + suggestion
- Player MP4 / M3U8 / iframe + Theater / PiP / Fullscreen / Auto-Next
- Pilih server + Refresh Player saat error
- Batch download multi-mirror
- Schedule per hari (Senin–Minggu) tanpa reload
- Anime List A–Z + filter pencarian
- Mobile-first, Bottom Navigation, Glassmorphism
- SEO: meta, Open Graph, Twitter Card, JSON-LD, sitemap, robots, manifest (PWA-ready)

## Error Handling
- Tidak ada koneksi → toast otomatis
- API gagal → state error + tombol muat ulang
- Poster gagal → otomatis fallback ke `assets/no-image.webp`
- Video gagal → tombol Refresh Player + Pilih Server Lain

