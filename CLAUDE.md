# lag-mappa instructions

## Outcome

Demo single-page 3D voxel event map ("Dove succede cosa?") for L'Agro ai Giovani at Cascina Marasco, Cremona. Andrea is the event organizer. Crossy Road-style, sunset lighting, clickable zone labels plus a walkable character. Italian only.

## Current architecture

- Read `.forge/PROJECT_PROFILE.md` first for approved understanding, Git baseline and change records.
- Runtime: static HTML/CSS/ES modules; Three.js 0.186.1 vendored in `vendor/three/` (no CDN, no bundler). Base code derived from `../ecovillaggio-valdiluce`.
- Event data source of truth: LAG app (`../lag_app`, https://andreasalami.github.io/lag_app/). This site links to its sections (`#biglietti`, `#programma`, `#menu`, `#tornei`); it must not copy dates, prices, line-ups or menus.
- Tests: Node built-in test runner, Node 20+.
- Deployment: GitHub Pages from `main` root, `.nojekyll`. Every push to `main` is live.
- Architecture detail: `README.md`.

## Commands

- Develop: `python3 -m http.server 8081 --bind 127.0.0.1`
- Test: `node --test`
- Format/lint/type check/build: not applicable (no toolchain by design).

## Project boundaries

- Keep `js/map.js` free of Three.js. Terrain and zone layers must stay the same size.
- Content stays readable without JS/WebGL (reading mode is the CSS default).
- No external requests, cookies, analytics or forms; only plain outbound links.
- Do not modify `../lag_app` from this project. Reading its public assets and docs is fine.
- Zone positions are an unconfirmed hypothesis derived from the aerial photo (see profile).

## Delivery

- **Andrea authorized (2026-09-27) autonomous commits and direct pushes to `main` for this repository**, after local verification (`node --test` + browser check).
- Still ask before: force push, history rewrite, repository deletion or visibility change, settings/security changes beyond Pages, new dependencies or external services, reading LAG app live data.
- Conventional Commits in English.
- Before every push that changes CSS or JS, bump `?v=N` everywhere in `index.html` (import map, module script, stylesheet); the test enforces a single N. Otherwise visitors can mix cached old modules with new ones for up to 10 minutes.

## Documentation

- Record each intervention under `.forge/changes/`; keep `.forge/PROJECT_PROFILE.md` current.
- Learning evidence goes in `docs/learning/learning-register.md`.
