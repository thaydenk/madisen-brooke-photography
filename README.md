# Madisen Brooke Photography

Website for Madisen Brooke Photography — Magnolia, Texas.

## Adding Photos

Drop photos into the appropriate folder under `photos/`:

```
photos/
├── hero/        → Main hero image (1 photo, landscape or portrait)
├── families/    → Family session portfolio photos
├── maternity/   → Maternity session portfolio photos
├── couples/     → Couples session portfolio photos
├── newborn/     → Newborn session portfolio photos
├── lifestyle/   → Lifestyle session portfolio photos
└── milestones/  → Milestones session portfolio photos
```

**Photo naming:** Use descriptive names like `smith-family-golden-hour-01.jpg`. Keep files under 2MB each for fast loading (compress with TinyPNG if needed).

**Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

After adding photos, the site HTML (`index.html`) needs to be updated to reference them. This is handled automatically via a Claude scheduled task, or can be done manually.

## Deployment

This site is served by **GitHub Pages** from the `main` branch, with the custom domain set by the `CNAME` file (madisenbphotography.com). Pushes to `main` deploy automatically.

Note: the booking form targets Netlify Forms, which GitHub Pages does not run — on this host the form falls back to its `mailto:` path. Swap to Formspree/Web3Forms if staying on Pages.

## Tech Stack

- Static HTML/CSS/JS (no build step, no runtime dependencies; `index.html` + `gallery.html`)
- Google Fonts (Italiana, Crimson Pro, DM Mono, Instrument Sans, Lora)
- Framework-free
- Test suite: Vitest + jsdom, html-validate, axe-core (`npm test`)
- Client gallery links to Pixieset (optional)
