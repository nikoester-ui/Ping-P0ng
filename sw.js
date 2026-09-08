const CACHE='neon-ping-v5';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./coin.png", "./shop-white.png", "./theme-space.png", "./theme-jungle.png", "./theme-lava.png", "./theme-ice.png", "./theme-cyber.png", "./ball-classic.png", "./ball-fire.png", "./ball-ice.png", "./ball-eight.png", "./ball-plasma.png", "./skull-easy.png", "./skull-normal.png", "./skull-hard.png", "./skull-impossible.png", "./boss-skull.png"];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).then(r=>{let c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(x=>x||caches.match('./index.html')))));
