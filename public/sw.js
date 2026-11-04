/* Dijital Şehir – çevrim dışı önbellek.
   Uygulama kabuğu ve derleme çıktısındaki dosyalar ilk kurulumda önbelleğe
   alınır. Harici istek yoktur; tüm varlıklar aynı kaynaktandır. */

const CACHE_VERSION = 'dijital-sehir-v8';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest'];

async function precacheBuild(cache) {
  let html;
  try {
    const response = await fetch('./index.html', { cache: 'reload' });
    if (!response.ok) return;
    html = await response.text();
  } catch {
    return;
  }

  const scope = self.registration.scope;
  const assetUrls = new Set();

  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const value = match[1];
    if (!value || value.startsWith('#') || value.startsWith('data:')) continue;
    try {
      const url = new URL(value, scope);
      if (url.origin === self.location.origin) assetUrls.add(url.href);
    } catch {
      // Geçersiz adresleri atla.
    }
  }

  await Promise.allSettled([...assetUrls].map((url) => cache.add(url)));

  // JavaScript paketinin işaret ettiği görselleri de önbelleğe al.
  const imageUrls = new Set();
  await Promise.allSettled(
    [...assetUrls]
      .filter((url) => /\.js(\?|$)/.test(url))
      .map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) return;
          const code = await response.text();
          for (const match of code.matchAll(
            /assets\/[A-Za-z0-9._-]+\.(?:png|jpe?g|svg|webp|woff2?)/g,
          )) {
            imageUrls.add(new URL(match[0], scope).href);
          }
        } catch {
          // Paket okunamazsa diğer varlıklarla devam et.
        }
      }),
  );

  await Promise.allSettled([...imageUrls].map((url) => cache.add(url)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(async (cache) => {
        await cache.addAll(APP_SHELL);
        await precacheBuild(cache);
        await self.skipWaiting();
      }),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Sayfa gezinmelerinde önce ağ, çevrim dışıysa önbellekteki kabuk.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('./index.html')),
        ),
    );
    return;
  }

  // Statik varlıklarda önce önbellek, yoksa ağdan al ve önbelleğe ekle.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
