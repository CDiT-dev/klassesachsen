# klasseSachsen Demonstrator

A playable demo of one quest, at the Albrechtsburg Meißen, for the klasseSachsen app. It is part of the offer of CDiT (Casey does IT) for the 5. Sächsische Landesausstellung (Vergabe-ID 3473649): the demo shows what the Grobkonzept describes.

Live: https://klassesachsen.cdit-works.de

- Static PWA (SvelteKit, Svelte 5, adapter-static). Works offline after the first load.
- No cookies, no analytics, no accounts, no requests to third parties at runtime.
- German texts; images only own or openly licensed, with an attribution page.
- Licence: [EUPL 1.2](LICENSE).

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # types
pnpm build && pnpm test   # static build in build/, plus checks for manifest, service worker, legal pages, third-party URLs
```

## Hosting

Built from source by Komodo on a CDiT server in Germany (Hetzner): `Dockerfile` builds the static site into nginx, `compose.yaml` runs it. Every push to `main` redeploys. See `compose.yaml`.
