# Online Duel and verified leaderboard setup

**This package does not come with an already-running public server.** The online
client and authoritative server are included, and two-client integration tests
pass locally. Someone must host the server for players on different networks.
A teacher/project owner can do this without installing anything on a school laptop.

## Recommended structure: one hosted service

Use a host that can run a long-lived Node process or the included Dockerfile, accept
WebSocket connections, provide HTTPS, and retain a persistent disk. The server
serves both the game website and its matchmaking/leaderboard API. Leave
`window.NPA_CONFIG = {serverUrl: ''};` in `config.js` for this same-origin setup.

Runtime: Node 22.16 or later with `node:sqlite`; the Dockerfile uses Node 24.
There are **no external npm dependencies**. No database password or Supabase key
belongs in the client.

Start command:

```sh
npm start
```

The server listens on `PORT` (default 3000). Set `DATA_DIR` to the persistent disk
path, for example `/data`. The SQLite database will be `/data/arena.sqlite`.
An ephemeral disk would lose online names and scores on redeployment.

`.env.example` documents environment variables. It is not loaded automatically:
set variables using the hosting service's environment settings or your shell.

### Local test on an authorized computer

```sh
node --version
npm test
npm run test:online
npm start
```

Open `http://localhost:3000` in two independent browser profiles/devices connected
to that computer's reachable address, choose two different nicknames, and select
Online Duel in both. A second tab with the same stored profile is not a second
player. HTTPS is needed for a public site and secure WebSocket transport.

### Container option

```sh
docker build -t neon-ping-arena .
docker volume create neon-ping-data
docker run --rm -p 3000:3000 \
  -v neon-ping-data:/data \
  -e DATA_DIR=/data \
  neon-ping-arena
```

Configure the host/reverse proxy for HTTPS and WebSocket upgrades, forwarding
`/arena` as well as ordinary HTTP routes. The included server itself speaks HTTP
behind that HTTPS endpoint; do not embed TLS private keys in the game files.

## Keep GitHub Pages for the website

A separate server is necessary if the frontend stays on GitHub Pages.

1. Deploy the included Node server with a persistent disk and an HTTPS URL.
2. On the server, set `ALLOWED_ORIGINS` to the exact frontend origin, for example
   `https://YOUR-USER.github.io` (no repository path or trailing slash).
3. Put the server's HTTPS root URL in `config.js` or the game's Settings screen:

```js
window.NPA_CONFIG = {serverUrl: 'https://YOUR-ARENA-SERVER.example'};
```

4. Upload the full website, including `shared/`, `assets/`, and `sounds/`.
5. Open Settings and save/check the server URL. Then register a nickname and queue
   for Online Duel. Test with a second person or a different browser profile.

Multiple permitted frontend origins can be comma-separated in `ALLOWED_ORIGINS`.
Do not use `*`. The server permits its own origin automatically. If the standalone
local-file game must connect to your server, explicitly set `ALLOW_FILE_ORIGIN=true`;
this permits `Origin: null`, so leave it false when it is not needed.

## What the server does

- Matches two distinct, connected, named players from a FIFO queue.
- Runs the shared simulation at a fixed 120 Hz and sends snapshots at 30 Hz.
- Accepts paddle targets, not client claims about score, XP, or wins.
- Persists match outcomes once and returns server-calculated rewards.
- Stores only a hash of each opaque browser profile token in SQLite.
- Rejects default/inappropriate names and disallowed web origins.
- Bounds message sizes, input values, and request rates; disconnects stale peers.
- Does not create a bot when no real opponent is available.
- Distinguishes a real verified online leaderboard from device-local results.

Verified online rewards require at least 10 seconds of active play, and rewards
for the same pair are limited to eight matches per hour. These are basic abuse
controls, not a complete anti-cheat or commercial security guarantee.

The prototype has a 64-connection cap and one server process. There is no
cross-region matchmaking, reconnect/resume, email login, automatic account
recovery, load balancer coordination, or multi-server database synchronization.

## Profiles and privacy

Names and optional two-letter country selections are public on the leaderboard.
No email, real name, precise location, chat, or automatic country lookup is needed.
The browser stores a profile token. Clearing that token loses access to the
registered nickname; account recovery is not implemented in this version.
Do not share tokens or expose the SQLite database. Back up the persistent disk.

Offline XP can still be earned in single-player modes but is not uploaded to the
verified board. This avoids trusting scores from editable browser saves.

## Moderation

A shared filter runs in both the browser and server. It handles common bad words,
placeholders, and some leetspeak, but it cannot guarantee every language/evasion.
The server owner can inspect and ban profiles from the hosting console:

```sh
node server/admin.cjs list
node server/admin.cjs ban "Nickname"
node server/admin.cjs unban "Nickname"
```

Use the same `DATA_DIR` as the running server. Restart after banning to close any
existing session immediately. These commands are never exposed as public routes.

## The earlier Supabase leaderboard

This release deliberately does not write to or alter the old Supabase table.
The earlier project address could not be resolved from the build environment;
that does not prove the project was deleted. Its availability/schema/policies
were not verified. A game-side retry cannot repair an unavailable backend.

The new verified board is backed by this included server and begins with its own
records. Migrating old records, provisioning a host, and making the new service
public have **not** been performed for you.

## Troubleshooting

- **Cannot connect:** confirm `/api/health` responds at your server URL.
- **Origin not allowed:** add the exact frontend origin to `ALLOWED_ORIGINS`.
- **Queue waits:** another real player must join; no AI substitutes online.
- **Nickname already registered:** use the original browser/token or a new name.
- **Scores reset after deploy:** attach persistent storage and set `DATA_DIR`.
- **GitHub Pages shows an old version:** deploy every file, reload, and allow the
  new service worker to activate. Keep the site's origin unchanged for save data.
- **Works locally but not publicly:** verify HTTPS, WebSocket upgrade forwarding,
  host sleep settings, and disk persistence on the hosting service.
