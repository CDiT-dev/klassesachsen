# klasseSachsen Demonstrator

A playable demo of one quest, at the Albrechtsburg Meißen, for the klasseSachsen app. It is part of the offer of CDiT (Casey does IT) for the 5. Sächsische Landesausstellung (Vergabe-ID 3473649): the demo shows what the Grobkonzept describes.

Live: https://klassesachsen.cdit-works.de

- Static PWA (SvelteKit, Svelte 5, adapter-static). Works offline after the first load.
- No cookies, no analytics, no accounts, no requests to third parties at runtime.
- German texts; images only own or openly licensed, with an attribution page.
- Licence: [EUPL 1.2](LICENSE).

## How it is built

- `content/quest.de.json` is the single source for every text, option, solution, source and image of the quest, in Einfache and Leichte Sprache. `python3 content/check.py` validates it and writes the attribution page (`content/quellen-und-bilder.md`) and the read-aloud script (`content/audio-skript.tsv`). Run it after every content change; CI runs it too.
- Each station's `spiel` block says which minigames run in which order, who holds the tablet and which images it shows. The minigames in `src/lib/ui/spiele/` are reusable components filled from that file: `SuchenUndFinden` (find it in the room, a miss locks until the team looked again, free hint ladder), `Abstimmung` and `Begruenden` (two invented, labelled voices, show of hands, tie and re-vote, a reason without names), `Teamraetsel` (each role holds one clue, ingredients into a bowl).
- Game rules without UI live in `src/lib/regeln.js` and are tested by `scripts/test-regeln.mjs`.
- The game state stays in the browser's local storage. The showcase PNG (2048 px) is drawn in the browser.
- Fonts (Archivo, Atkinson Hyperlegible Next and Mono, SIL OFL 1.1) and images are served from this site.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # types
python3 content/check.py   # content
pnpm build && pnpm test   # static build in build/, plus checks for manifest, service worker, legal pages, third-party URLs, game rules
```

## Hosting

Built from source by Komodo on a CDiT server in Germany (Hetzner): `Dockerfile` builds the static site into nginx, `compose.yaml` runs it. Every push to `main` redeploys. See `compose.yaml`.
