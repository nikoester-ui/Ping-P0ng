const CACHE='neon-ping-arena-1.07-global-1';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./leaderboard-config.js", "./ball-classic.png", "./ball-eight.png", "./ball-fire.png", "./ball-ice.png", "./ball-plasma.png", "./boss-skull-0.png", "./boss-skull-1.png", "./boss-skull-2.png", "./boss-skull-3.png", "./boss-skull-4.png", "./boss-skull.png", "./coin.png", "./icon-192.png", "./icon-512.png", "./shop-white.png", "./skull-easy.png", "./skull-hard.png", "./skull-impossible.png", "./skull-normal.png", "./theme-cyber.png", "./theme-ice.png", "./theme-jungle.png", "./theme-lava.png", "./theme-space.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.endsWith('.supabase.co')){e.respondWith(fetch(e.request));return;}
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(x=>x||caches.match('./index.html'))));
});
