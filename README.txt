NEON PING ARENA 1.20 — AFTERSHOCK
================================
Full game, all textures, generated sounds, and an optional online game server.

PLAY THE GAME
-------------
Open PLAY_OFFLINE.html. It contains every image, sound, and script in one file.
No installation, account service, or internet connection is needed for offline modes.
On a phone, open it in a browser that supports local HTML, or use the hosted website.
This is a browser game/PWA, not an APK or a Windows executable.

HOST THE WEBSITE / UPDATE GITHUB PAGES
-------------------------------------
Upload index.html, style.css, game.js, config.js, sw.js, manifest.webmanifest,
and the complete assets/, sounds/, and shared/ folders. Keep their folder names.
Do not upload only index.html. Do not upload an actual .env file or server database.
The website starts at index.html; the single-file edition is optional for hosting.
Reload the website after deployment so the new service worker can update the cache.
Your existing coins and purchased skins migrate from the neonPingSave browser save.
Use the same browser AND website address to retain that save. A downloaded file or
another website is a different storage location and may begin with a fresh profile.

IMPORTANT: PUBLIC ONLINE PLAY IS NOT ALREADY DEPLOYED
----------------------------------------------------
Online Duel and the verified global leaderboard use the included Node game server.
They are implemented and tested locally with two independent WebSocket clients.
They still require a publicly hosted server with HTTPS/WebSocket support.
GitHub Pages alone serves static files; it does not run this game server.
See ONLINE_SETUP.md. Offline play is ready without this step.
The old Supabase database is not modified and old global records are not imported.
There is no fake online opponent and no local leaderboard labelled as global.

CONTROLS
--------
P1: E = up, D = down.
P2 in Local Duel: O = up, K = down.
Rink Rush: mouse/touch moves the mallet freely inside your half.
Keyboard Rink Rush: E/D vertically, Q/F horizontally.
Mouse and touch control paddles. Local Duel supports two fingers simultaneously,
one starting on each half; each finger remains assigned to its own player.
Escape/P pauses offline games. Online matches cannot pause; leaving forfeits.

MODES
-----
Classic: first to five against the selected difficulty.
Boss Battle: 15 hits. The last hit triggers a 3.15-second cracking and falling-shard
animation. Only after that animation is victory awarded.
Local Duel: two people share one screen. First to five. No progression rewards.
Online Duel: real matchmaking, first to five; the server decides the simulation,
score, winner, and online rewards. Requires the separately hosted server.
Rink Rush: endless air hockey with circular mallets and narrow goal openings.
Every goal adds 8 coins and 20 XP to your run. Concede once and the run ends.
Earned run rewards are kept, including when you leave/restart through Pause.
Randomized: first to five, with newly arranged obstacles every match.
  Brick: 5 hits. Glass: 1 hit, reflecting the ball before breaking.
  Metal: unbreakable. TNT: destroys nearby destructible objects, triggers other
  TNT, and gives the ball a temporary speed boost that fades over 2.8 seconds.
Hot Potato: closed arena, larger slower bomb, 18 seconds of active play.
Whoever has the bomb in their half when the timer expires loses.

Every new round has a 3, 2, 1, GO countdown. Pausing freezes offline timers.

DIFFICULTY
----------
The fast starting speeds and speed ceilings from 1.10 are retained.
Hard AI movement: 445 -> 415. Impossible: 565 -> 525 (about 7% slower).
Prediction errors remain difficulty-specific. The bot uses a stable imperfect
estimate per return instead of constantly choosing a new random miss location.
Cosmetic skins never change the ball's collision size or competitive stats.

COINS, XP & RANKS
----------------
Coins buy cosmetics. Blue-star XP is permanent progress, not a spendable currency.
Classic/Randomized XP for each point you win:
  Easy 10, Normal 20, Hard 30, Impossible 40.
Classic/Randomized coins for a match win: 15 / 30 / 50 / 80 respectively.
Boss victory: 50 coins + 300 XP (largest single award).
Hot Potato victory: 30 coins + 60 XP.
Rink Rush: 8 coins + 20 XP per goal.
Online ranked match: 20 XP per point plus 80 XP for winning; winner gets 30 coins.
Early online exits before 10 seconds of active play do not earn ranked rewards.
Repeated pairing rewards are limited on the server.

Ranks (total XP):
  Beginner          0
  Intermediate    100  = five Normal points
  Skilled         600
  Expert        1,600
  Elite         3,200
  Master        5,200
  Champion      8,000
A "round" here means a scored point, not a complete first-to-five match.
Offline progress remains on your device. The verified global board counts only
server-awarded online XP, so editing a local save cannot forge a global rank.

NEW SKINS & EFFECTS
-------------------
Football 25 coins, Hockey Puck 90, Basketball 140, Skull Ball 250.
All earlier skins remain, including Devil Ball at 500 coins.
Parry bursts now originate at the contact point and travel into the arena.
Devil: black energy slashes with red edges. Plasma: blue/purple electric arcs.
Fire: separate rotating flame triangles. Smiley: short rubber-chicken-like squeak.
Basketball: bounce/net-like sound. Skull: bone-clack sound.
Lava meteors, jungle leaves/side wind, ice snow, and moving Cyber City notes.

Audio samples in sounds/ were generated for this build; they are synthesized
imitations, not recordings of a real chicken, basketball match, bones, or crowd.
Settings lets you disable sounds, crowd ambience, and background motion.

PLAYER NAMES & MODERATION
-------------------------
You must choose a nickname before playing. Use a nickname, not a real name.
Default names, markup, many common profanities, slurs, and common obfuscations are
blocked. The online server repeats validation; rejected names are not registered.
No finite word list catches every language or evasion. The server owner can ban
accounts using server/admin.cjs. This is a safeguard, not perfect moderation.
Country flags are chosen voluntarily; no geolocation or chat is used.

TESTING
-------
See TEST_REPORT.md for the 19 gameplay tests, 13 online integration checks, and
12 Chromium UI checks. No public server deployment or physical-phone performance
claim is made. Gameplay balance will still benefit from real-player feedback.
