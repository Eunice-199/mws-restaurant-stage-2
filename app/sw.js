self.addEventListener('install', function(event) {
    // Perform install steps
});
var CACHE_NAME = 'restaurant-static-v2';
var urlsToCache = [
    '/',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './data/restaurants.json',
    './images/1.jpg',
    './images/2.jpg',
    './images/3.jpg',
    './images/4.jpg',
    './images/5.jpg',
    './images/6.jpg',
    './images/7.jpg',
    './images/8.jpg',
    './images/9.jpg',
    './images/10.jpg',
    './images/no-image.svg',
    './images/icon-food-1x.png',
    './images/icon-food-2x.png',
    './images/icon-food-4x.png',
    './images/icon-food-10x.png',
    ' ./sw.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request);
        })
        .catch(err => console.log(err, event.request))
    );
});
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request).then((response) => {
                caches.open(staticCacheName).then(function(cache) {
                    cache.put(e.request, response.clone());
                    return response;
                })
            })
        })
    );
});