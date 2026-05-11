# TODO - Push, PWA Offline, IndexedDB

## Step 1: Preparasi

- [x] Buat service worker `src/scripts/sw.js`
- [x] Buat web app manifest `src/public/manifest.webmanifest`
- [x] Update `src/index.html` untuk link manifest + register SW

## Step 2: Push Notification (Basic→Advanced)

- [ ] Buat util push: `src/scripts/utils/push.js`
- [ ] Implement permission + subscribe/unsubscribe + simpan status
- [ ] Tambahkan UI toggle langganan push di Home (atau halaman global)
- [ ] Pastikan payload notifikasi tampil dinamis (title/icon/message) dari data event SW
- [ ] Implement notification click navigasi ke halaman detail data terkait

## Step 3: PWA Offline (App shell + caching)

- [ ] Implement caching app shell on install
- [ ] Cache respons dinamis `GET_STORIES` untuk offline (serve stale-while-revalidate)
- [ ] Cek manifest warnings di Chrome DevTools (tanpa warning)

## Step 4: IndexedDB (Create/Read/Delete + Interactivity)

- [ ] Buat util IndexedDB: `src/scripts/utils/idb.js`
- [ ] Create: simpan story saat submit add-story (offline-safe)
- [ ] Read: Home baca dari IndexedDB pertama, lalu dari API jika online
- [ ] Delete: tambahkan tombol hapus story lokal (UI)
- [ ] Sorting/filtering/searching pada data dari IndexedDB

## Step 5: Sync offline→online

- [ ] Queue story yang dibuat saat offline
- [ ] Ketika online, sync queue ke API lalu refresh home

## Step 6: Testing

- [ ] Jalankan `npm run dev`
- [ ] Verifikasi install prompt, offline mode, push toggle, push reception, dan IndexedDB CRUD + sync
