const CACHE_NAME = 'ecl-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/no-connection',
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Removing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
  // تخطي طلبات التحقق من الاتصال
  if (event.request.url.includes('chrome-extension') || 
      event.request.url.includes('sockjs-node')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا وجد الملف في الكاش، استخدمه
        if (response) {
          return response;
        }

        // إذا لم يجده، حمله من الشبكة
        return fetch(event.request)
          .then((response) => {
            // تحقق أن الاستجابة صالحة
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // استنسخ الاستجابة
            const responseToCache = response.clone();

            // افتح الكاش وأضف الاستجابة
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // في حالة عدم الاتصال، يمكنك إرجاع صفحة offline
            if (event.request.destination === 'document') {
              return caches.match('/no-connection');
            }
          });
      })
  );
});