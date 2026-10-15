# Madisen Brooke Photography — Design System

Source of truth for the site's visual identity, transcribed from Madisen's brand
board and reconciled with what is implemented at madisenbphotography.com
(`index.html` + `gallery.html`). Mark anything wrong and it becomes the next PR.

---

## 1. Brand

| | |
|---|---|
| Name | **Madisen Brooke Photography** |
| Location | Magnolia, Texas |
| Service area | Magnolia · Houston · Cypress · The Woodlands · Spring · Tomball |
| Services (site) | Families · Maternity · Couples · Newborn · Lifestyle · Milestones |
| Services (board) | Families · Couples · Portraits · Business Headshots · Brands |
| Voice | Warm, literary, unhurried. "The moments in between." |

**Taglines**
- Hero: *Timeless photographs for a life well lived.*
- Statement panel: *More than photos. A legacy of this season.*
- Kicker: PEOPLE · PLACES · CONNECTIONS THAT MATTER
- Footer strip: AUTHENTIC PEOPLE | BEAUTIFUL PLACES | MEANINGFUL MOMENTS | TIMELESS PHOTOS

---

## 2. Logo system

### 2.1 Primary lockup
```
M A D I S E N
B R OO K E          ← the two O's overlap, strokes crossing
   𝒫𝒽𝑜𝓉𝑜𝑔𝓇𝒶𝓅𝒽𝓎    ← thin signature script sweeping across the baseline
```
- Serif: very thin, high-contrast Didone. **Currently: Playfair (variable) wght 300** —
  the thinnest Playfair Google serves. See §4 for alternates if still too heavy.
- OO ligature: plain overlap (no weave) — tracking `-0.34em` on the OO pair,
  ≈45 % overlap, both strokes visible where they cross.
- Script: overlaps the serif's bottom quarter, slight −2° cant, nearly the full
  width of the wordmark.
- Category line beneath, DM Mono small caps with thin `|` pipes.

### 2.2 Monogram — `MB`
Overlapping Playfair M + B (B at 80 % opacity), drawn as SVG symbol `#orn-monogram`.
Used: nav brand (both pages), sand mosaic tile, center of the badge.

### 2.3 Alternate logo — circular badge
`MADISEN BROOKE · PHOTOGRAPHY · MAGNOLIA TEXAS` wrapped around double rings,
MB monogram center. Implemented as the "heritage stamp" in the Inquire column,
tilted −6°, straightens on hover.

---

## 3. Color

Sampled **pixel-exact from the brand board image** (not estimated).

| Token | Hex | Board name | Use |
|---|---|---|---|
| `--ivory` | `#F0EAE1` | Ivory | Page background, cards |
| `--sand` | `#DBCCBE` | Sand | Light text on dark, soft panels |
| `--taupe` | `#B19A86` | Taupe | Secondary accents, footer text |
| `--clay` | `#73543B` | Warm Clay | Primary accent: CTAs, rules, crests, script |
| `--clay-deep` | `#5D432F` | — (derived) | Hover/pressed clay |
| `--olive` | `#564F35` | Olive | Statement panel, accent tile, stems |
| `--charcoal` | `#29231D` | Charcoal | Headline text, dark bands, footer |

Derived supporting tones: `--haze #E8DFD2`, `--rose #E3D7C8` (section bands),
`--mid #4F4638` (body text), `--whisper #766A58` (captions), `--line #CDC0AF`
(hairlines), plus florals `--bluebonnet #8A94B8`, `--bb-tip #F6F1E7`.

**Color blocking** (board pattern): ivory base → haze band (Sessions) → rose band
(Testimonials) → olive statement panel → charcoal anchors (Client Gallery banner,
footer strip + footer as one dark block).

---

## 4. Typography

| Role | Board spec | Implemented | Notes |
|---|---|---|---|
| Headlines / logo | Playfair Display | **Playfair (variable) wght 300** for wordmark + gallery titles; Playfair Display 400 elsewhere | Playfair Display's floor is 400 — the variable "Playfair" family is how we get thinner |
| Accent script | Brittany Signature (paid) | **WindSong 500** | Closest free match: thin pen-signature, tall ascenders. Great Vibes was tried and rejected (formal copperplate, wrong feel) |
| Body | Montserrat | **Montserrat 300/400/500** | |
| Micro-labels | — | DM Mono, tracked small caps | Site texture; board uses tracked Montserrat caps — swappable |
| Literary italics | — | Crimson Pro / Lora italic | Epigraphs, quotes, bios |

**If the wordmark still reads too heavy**, free candidates in thinness order
(all Google Fonts, drop-in swap):
1. **Cormorant / Cormorant Garamond 300** — true hairline Didone feel, thinnest option
2. **Prata 400** — single weight, elegant high contrast, slightly wider
3. **Italiana 400** — ultra-thin, geometric (the site's original face)

---

## 5. Ornament inventory (SVG sprite)

| Symbol | What | Where |
|---|---|---|
| `#orn-fleur` | Fleur-de-lis | Crest above every section title; marquee separators; divider centerpiece |
| `#orn-corner` | Floral vine spray w/ cream blossoms | Hero corners (210 px), booking-form filigree corners, gallery hero |
| `#orn-bluebonnet` | Bluebonnet sprig (TX state flower), olive stems, cream tips | Flanking the olive panel quote; beside the badge |
| `#orn-divider` | Horizontal vine + center fleur | Between Portfolio→About and before Client Gallery |
| `#orn-magnolia` | Layered cream/sand bloom, 16 petals | Hero watermark (~560 px @ 13 %), About watermark, session-card crowns, gallery hero watermark |
| `#orn-monogram` | MB | Nav, badge center, mosaic tile |
| `#ic-*` ×6 | Thin-line service icons (family trio, heart-in-circle, double heart, moon+star, branch, pennant) | Portfolio tile overlays |
| Petals | CSS particles as drifting cream petals | Desktop only, max 20 |

---

## 6. Page architecture (index)

1. Nav — glass ivory, MB + wordmark, links, subtle social icons, hamburger ≤968 px
2. **Hero** — watermark magnolia, corner sprays, wordmark lockup, MAGNOLIA TEXAS,
   tagline, category pipes, charcoal VIEW PORTFOLIO button, scroll cue
3. Marquee (categories, fleur separators)
4. **Olive statement panel** — kicker / vertical rule / legacy line, bluebonnets
5. **Portfolio mosaic** — 9 tiles: 6 categories (line icon + name + VIEW GALLERY →,
   hover reveal desktop / bottom scrim mobile) + charcoal REAL PEOPLE tile +
   sand MB tile + olive THIS SEASON tile → each category links `gallery.html?cat=…`
6. Vine divider → **About** — label, name, drop-cap bio, WindSong signature, watermark
7. Marquee (cities, reversed)
8. **Sessions** — haze band, 3 ivory cards (magnolia crown, MINI/SIGNATURE/LUXE,
   rule, duration, details, Book CTA)
9. **Kind Words** — rose band, 3 ivory quote cards (placeholder copy — replace!)
10. **Inquire** — left: title, script sub, email, areas, social, response note,
    badge + bluebonnet · right: booking form (Netlify Forms + mailto fallback,
    honeypot, animated draw-in check on success)
11. Vine divider → **Client Gallery banner** — charcoal block → Pixieset
12. **Footer** — charcoal: tagline strip, domain, social, copyright

`gallery.html` mirrors the chrome: nav, crest + watermark + title + epigraph per
category (`?cat=`), empty-state, inquire CTA (returns with Session Type preselected),
explore-more row, footer.

---

## 7. Interaction & motion

- Scroll-reveal (IntersectionObserver), staggered delays; honors `prefers-reduced-motion`
- Hero entrance cascade: nav → name lines → script → rule → location → tagline → CTA
- Marquees auto-scroll opposite directions; petals drift upward tumbling (desktop)
- Card hovers: lift + shadow + border warm; badge straightens; CTA fills clay
- Form: button → "Sending…", success panel check draws itself in

---

## 8. Open items

| Item | Status |
|---|---|
| **Wordmark approval** | ⚠️ awaiting verdict on Playfair-300 render (alternates in §4) |
| **Real photos** | ❌ the big one — `photos/<category>/`, then wire grids + og-image |
| **HTTPS cert** | ❌ Settings → Pages → re-add custom domain → Enforce HTTPS (cert is stuck serving \*.github.io) |
| Form backend on Pages | ⚠️ Netlify Forms doesn't run on GitHub Pages → falls back to mailto. Swap to Formspree/Web3Forms (~5 lines) |
| Testimonial copy | ⚠️ placeholders — swap for real client words |
| Pixieset account | ⚠️ confirm `madisenbrookephotography.pixieset.com` exists or update links |
| Pricing on session cards | 💡 recommended, needs numbers |

---

## 9. Working agreement

- Tokens first: change `--clay` etc. in `:root` and the whole site follows.
- Every visual change is **rendered in headless Chromium and screenshotted before
  commit** (`scratchpad/shot.mjs` loop) — no more blind typography.
- `npm test` = 46 checks (booking form, DOM contract, anchors, html-validate, axe).
- Ship path: branch → render-verify → PR → CI green → "merge".
