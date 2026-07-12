# NJ Developments — Marketing Site

The marketing site for **NJ Developments LLC** — a Connecticut-based agency building websites, AI voice agents, and automated follow-up systems for local service businesses.

Live: <https://nj-developments.com>

---

## Stack

| Layer | What it is |
| --- | --- |
| Markup | Hand-written static HTML (one file per page) |
| Styles | Single `css/styles.css` design system |
| Scripts | One `js/main.js` for nav, scroll progress, fade-ins, marquee, business-card modal |
| Fonts | `Inter` (body, UI) + `Instrument Serif` (display / editorial accents), both from Google Fonts |
| Bookings | Calendly inline + popup widget |
| Analytics | Google Analytics (GA4 — `G-WZQ2CGG93L`) |
| Hosting | Firebase Hosting (config in `firebase.json`, project in `.firebaserc`) |

No build step. Edit a file, commit, deploy.

---

## File structure

```
NJSITE/
├── index.html                              Homepage (dark editorial hero + bento services)
├── services.html                           Services grid
├── portfolio.html                          Client work grid w/ live iframe previews
├── about.html                              Founders, story, values, why-us
├── contact.html                            Calendly embed + contact info
├── blog.html                               Blog post index
├── blog-*.html                             Individual blog posts
├── privacy.html                            Privacy policy
├── terms.html                              Terms of service
├── 404.html                                Not-found page (dark editorial)
│
├── css/styles.css                          The entire design system (v6)
├── js/main.js                              All client behavior
│
├── images/
│   ├── NJDev_Logo.{png,svg}                Brand logo
│   ├── cedar-preview.png                   Hand-picked screenshot used as portfolio thumbnail
│   ├── clients/                            Client logos (used on marquee + portfolio)
│   ├── headshots/                          Founder portraits (used on About page)
│   └── business-cards/                     Founder business-card images (used in modal)
│
├── favicon.ico, favicon-{16,32}.png,
│   apple-touch-icon.png, icon-{192,512}.png Favicons + PWA icons
├── manifest.json                           PWA manifest
├── robots.txt, sitemap.xml, llms.txt       SEO / crawler hints
├── .well-known/                            Domain verification files
│
├── firebase.json, .firebaserc              Firebase Hosting config
└── README.md                               This file
```

---

## Design system

### Type
- **Display / editorial moments** — `Instrument Serif` at regular weight, italics used for accent words ("booking you *jobs*", "more *jobs*", "real *results*")
- **Body / UI** — `Inter` 400 / 500 / 600 / 700 / 800

### Color tokens (defined in `:root` of `css/styles.css`)
| Token | Value | Usage |
| --- | --- | --- |
| `--ink` / `--ink-deep` | `#0a0e1a` / `#050811` | Primary text + dark hero / CTA / footer background |
| `--navy` / `--navy-deep` | `#0d2240` / `#061226` | Secondary dark, gradients |
| `--teal` / `--teal-bright` / `--teal-deep` | `#2a9d8f` / `#3ec5b1` / `#1e7a6f` | Primary brand accent |
| `--teal-soft` | `#e6f4f1` | Icon backgrounds, soft accents |
| `--bg` / `--bg-elev` / `--bg-soft` | `#fafaf7` / `#fff` / `#f4f1ea` | Page / card / section surfaces |
| `--gray-{100..900}` | warm gray scale | Body text, lines, dividers |

### Shadows & radii
`--sh-{1,2,3}` + `--sh-glow` for elevation; `--r-{xs,sm,md,lg,xl,pill}` for corner rounding.

### Reusable components (shared classes — used across multiple pages)
- `.navbar` + `.navbar-dark` — frosted floating pill
- `.hero-dark` with `.hero-mesh` + `.hero-grid-bg` + `.hero-grain` — editorial dark hero
- `.page-header` — gradient-tinted hero for non-home pages
- `.section` + `.section-soft` / `.section-dark` / `.section-white`
- `.section-label` / `.eyebrow` — uppercase eyebrow with teal dot
- `.serif-accent` — italic teal-gradient serif for accent words
- `.bento` + `.bento-lg` / `.bento-md` / `.bento-sm` / `.bento-wide` — bento grid cards with `bento-visual` mockups inside
- `.process-timeline` + `.process-card` — numbered step cards
- `.testimonial-block` — oversized serif pull-quote card
- `.faq-list` + `.faq-item` (uses `<details>`) — accordion FAQ
- `.cta-banner` — dark CTA section with mesh gradient
- `.footer` — dark footer with brand / links / contact columns
- `.mobile-cta-bar` — sticky bottom call/book bar on mobile
- `.btn-{glow,primary,outline,ghost,white,link}` — button styles
- `.fade-in` / `.fade-in.visible` — scroll-triggered entrance (JS-gated via `body.js-ready` so no-JS users see content)

### Bento visual variants (homepage services grid)
Each service card uses a dark gradient `bento-visual` container with one of these illustrations inside:
- `.bento-browser` — full browser mockup (Professional Websites)
- `.visual-call` — phone with incoming-call pulse ring (AI Voice Agent)
- `.visual-review` — floating Google review card with star badge (Review & Follow-Up)
- `.visual-search` — search bar w/ blinking cursor + map-pin result (SEO & Google Maps)
- `.visual-chat` — chat bubbles with typing indicator (Lead Follow-Up)

---

## Local development

No tooling required. Serve the directory with anything that speaks HTTP:

```bash
# Python
python3 -m http.server 8765

# Node
npx serve .

# Or use Firebase emulator
firebase serve --only hosting
```

Then open `http://localhost:8765`.

### After editing CSS / JS
Bump the `?v=` query string on the `styles.css` / `main.js` references in every HTML file to bust cache. Currently at `v=6`.

---

## Deploying

```bash
firebase deploy --only hosting
```

`firebase.json` controls rewrites (pretty URLs like `/services`, `/portfolio`, etc.) and caching headers.

---

## SEO / structured data

Every primary page includes:
- A canonical link
- Open Graph + Twitter Card meta
- JSON-LD structured data (`Organization`, `WebPage`, `BreadcrumbList`, `ProfessionalService`, `FAQPage`, `ItemList`, `BlogPosting`, etc.)
- `geo.region` / `geo.placename` set to `US-CT` / `Connecticut`

Blog posts include `BlogPosting` schema with `datePublished` and author.

`robots.txt`, `sitemap.xml`, and `llms.txt` live at the root.

---

## Adding a new page

1. Copy the closest existing page (e.g. `about.html` for a content page, or `blog-5-signs-new-website.html` for a blog post).
2. Update the `<title>`, all `<meta>` tags, `<link rel="canonical">`, and the JSON-LD block.
3. Mark the matching nav link with `class="active"`.
4. Add the page to `sitemap.xml`.
5. If you want pretty URLs, add a rewrite to `firebase.json`.
6. If it's a blog post: also add a card to the grid in `blog.html`.

## Adding a new portfolio item

1. Drop the client logo into `images/clients/`.
2. Add an `<a>` to **both** marquee rows in `index.html` and `portfolio.html` (logos appear twice for the seamless infinite scroll).
3. Add a `.portfolio-card` block to `portfolio.html` — use an `<iframe>` preview for live sites, or a screenshot in `images/` for slow / non-embeddable ones.
4. Optionally feature it in `index.html`'s "Featured Work" section.
5. Add the item to the `ItemList` JSON-LD in `portfolio.html`.

## Adding a client testimonial

Edit the `.testimonial-block` in `index.html`. Quote text goes in `<blockquote><p>…</p></blockquote>`; the author block has logo, name, and role.

---

## Contact / business info (kept consistent across pages)

- **Email** — `Njdevelopments123@gmail.com`
- **Phone** — `860-987-7606`
- **Instagram** — [@nj_developments_ct](https://www.instagram.com/nj_developments_ct/)
- **Calendly** — `https://calendly.com/jamiahbartlett-pate/30-min-meeting-1`

Founders: Jamiah Bartlett, Javier Flores, Nolan Krieger.

If any of the above changes, search-replace across all HTML files (footer, contact page, JSON-LD blocks, and Calendly popup URLs).
