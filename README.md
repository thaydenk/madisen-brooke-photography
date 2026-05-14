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

This site auto-deploys to Netlify when changes are pushed to `main`.

## Tech Stack

- Single-file HTML/CSS/JS (no build step, no dependencies)
- Google Fonts (Italiana, Crimson Pro, DM Mono, Instrument Sans, Lora)
- Chart.js-free, framework-free
- Booking form submits via mailto (upgrade to Formspree/Netlify Forms for server-side)
- Client gallery links to Pixieset (optional)
