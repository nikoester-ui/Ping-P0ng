# Neon Ping Arena 1.20 — verification report

Build verification performed in this workspace. This is not a claim that the
public website was deployed, the previous Supabase service was repaired,
or the game was tested on physical Android/iPhone hardware.

## Results

- **19 shared-simulation tests: passed** (`npm test`).
- **13 server integration checks: passed** (`npm run test:online`).
- **12 Chromium UI checks: passed**, with zero JavaScript runtime exceptions.
- JavaScript syntax and packaged asset/cache references checked separately.

## Shared simulation: 19 tests

1. Countdown runs 3, 2, 1, GO; the ball does not move early.
2. Pause freezes the countdown and bomb timer.
3. Hard/Impossible retain ball speeds with slightly lower AI movement limits.
4. Maximum-speed projectile does not tunnel through the paddle.
5. Parry events report actual contact points and outgoing normals.
6. A goal counts once; the next round returns to countdown.
7. Boss victory waits for its 3.15-second death sequence.
8. Boss starts with 15 HP and returns a ball reaching its collision plane.
9. Rink Rush mallets remain inside their own halves.
10. Rink side rails reflect the puck outside the goal opening.
11. Rink goals build rewards; one concession ends the run.
12. Brick requires five hits.
13. Glass reflects one hit and then breaks.
14. TNT destroys nearby destructibles but not metal; the ball survives and accelerates.
15. Randomized geometry was checked across 100 seeds for overlap rules.
16. Hot Potato uses closed bounds and the correct half at timer expiry.
17. Rank thresholds produce the intended progression.
18. Name validation blocks defaults, common obfuscations, and markup.
19. Each of the six offline modes ran for 60 simulated seconds without invalid
    numeric state.

## Online service: 13 checks

An isolated server with a temporary SQLite database and two independent WebSocket
clients checks health, name rejection, registration/tokens, duplicate ownership,
real pairing, forged-score rejection, independent inputs, countdown snapshots,
server result persistence, leaderboard profiles, duplicate-award protection,
private-file isolation, and origin restrictions.

The result test places the SERVER game in a near-win fixture and advances its
physics to a real goal. No client sets a score. This proves settlement, not a
human-played full match or worldwide latency quality.

## Chromium UI: 12 checks

- Seven mode cards and migration of earlier coins/owned cosmetics.
- XP initializes without wiping coins.
- E/D and O/K operate independently in Local Duel.
- Simultaneous two-finger controls remain assigned to their halves.
- Pause freezes the live countdown.
- Eleven shop skins; Football costs 25 coins and can be purchased.
- Boss has no normal score label and pays nothing on the final hit itself.
- Boss rewards arrive after its crack/shard animation.
- Hot Potato declares the correct winner at expiry.
- Rink Rush banks a run exactly once after loss.
- Canvas stays inside an 844 x 390 landscape-phone viewport.
- No browser JavaScript runtime errors during these checks.

Browser networking/navigation was restricted in the execution environment, so
browser checks loaded the embedded offline edition with an in-memory storage
fixture. Online networking was tested separately using actual WebSocket clients.
Public HTTPS/WSS hosting and real-world mobile network latency were not tested.

## Remaining limitations

- Public matchmaking and verified leaderboard require deploying the included server.
- Previous Supabase records are untouched and are not migrated to the new board.
- Human feedback is still needed for difficulty, chaotic layouts, sound taste,
  and physical-device performance. Passing tests do not prove ideal balance.
- The name filter is not perfect multilingual moderation.
- New sounds are synthesized imitations, not real-world recordings.
- Offline saves are editable. Only server-settled online XP appears on the
  verified global leaderboard.
- The online backend is a single-process prototype with basic rate limiting and
  ownership checks, not a security-audited large-scale competitive service.
