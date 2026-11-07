# NJ Developments Marketing Site

The marketing site for **NJ Developments LLC**, a Connecticut-based agency building websites, AI voice agents, and automated follow-up systems for local service businesses.

Live: <https://nj-developments.com>

---

## Stack

| Layer | What it is |
| --- | --- |
| Markup | Hand-written static HTML (one file per page) |
| Styles | Single `css/styles.css` design system |
| Scripts | One `js/main.js` for nav, scroll progress, fade-ins, marquee, business-card modal |
| Fonts | `Inter` (body, UI) + `Instrument Serif` (display / editorial accents), both from Google Fonts |
| Inquiry + bookings | Embedded GoHighLevel form-first calendar widget |
| Analytics | Google Analytics (GA4, `G-WZQ2CGG93L`) |
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
├── book.html                               GHL project inquiry + optional booking
├── contact.html                            Legacy route fallback to /book
├── blog.html                               Blog post index
├── blog-*.html                             Individual blog posts
├── privacy.html                            Privacy policy
├── terms.html                              Terms of service
├── 404.html                                Not-found page (dark editorial)
│
├── css/styles.css                          The entire design system (v7)
├── js/main.js                              All client behavior
│
├── images/
│   ├── NJDev_Logo.{png,svg}                Brand logo
│   ├── work/                               Site screenshots used as portfolio + homepage previews
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
- **Everything:** `Inter` 400 / 500 / 600 / 700 / 800. One family since v10 (2026-11-06); accent words are teal (`.accent`), not a second typeface.

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

### Reusable components (shared classes, used across multiple pages)
- `.navbar` + `.navbar-dark`: frosted floating pill
- `.hero-dark` with `.hero-mesh` + `.hero-grid-bg` + `.hero-grain`: editorial dark hero
- `.page-header`: gradient-tinted hero for non-home pages
- `.section` + `.section-soft` / `.section-dark` / `.section-white`
- `.section-label` / `.eyebrow`: uppercase eyebrow with teal dot
- `.serif-accent` / `.accent`: teal accent for highlighted words
- `.bento` + `.bento-lg` / `.bento-md` / `.bento-sm` / `.bento-wide`: bento grid cards with `bento-visual` mockups inside
- `.process-timeline` + `.process-card`: numbered step cards
- `.testimonial-block`: oversized pull-quote card
- `.faq-list` + `.faq-item` (uses `<details>`): accordion FAQ
- `.cta-banner`: dark CTA section with mesh gradient
- `.footer`: dark footer with brand / links / contact columns
- `.mobile-cta-bar`: sticky bottom call/book bar on mobile
- `.btn-{glow,primary,outline,ghost,white,link}`: button styles
- `.fade-in` / `.fade-in.visible`: scroll-triggered entrance (JS-gated via `body.js-ready` so no-JS users see content)

### Bento visual variants (homepage services grid)
Each service card uses a dark gradient `bento-visual` container with one of these illustrations inside:
- `.bento-browser`: full browser mockup (Professional Websites)
- `.visual-call`: phone with incoming-call pulse ring (AI Voice Agent)
- `.visual-review`: floating Google review card with star badge (Review & Follow-Up)
- `.visual-search`: search bar w/ blinking cursor + map-pin result (SEO & Google Maps)
- `.visual-chat`: chat bubbles with typing indicator (Lead Follow-Up)

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
Bump the `?v=` query string on the `styles.css` / `main.js` references in every HTML file to bust cache. Styles are currently at `v=10`; JavaScript is at `v=9`.

---

## Deploying

```bash
firebase deploy --only hosting:njdevelopmentsales
```

The `njdevelopmentsales` project also hosts other client sites, so always name the site. Deploy from a clean checkout of `main` (a working folder with local edits ships them).

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

1. Drop the client logo into `images/clients/marquee/` and add an `<a>` to the marquee row in `index.html` and `portfolio.html` (the JS clones it for the loop).
2. Add screenshots `images/work/live/<key>-desktop.webp` (1200x750, shot at 1440x900) and `<key>-phone.webp` (390x844), taken after scrolling the page once so fade-in sections render. The monthly refresh keeps them current after that.
3. Add a `.work-card` to the grid in `portfolio.html` (copy an existing one: kind, name, one-line description, tags, link). The `alt` must read `<Name> homepage`, the refresh job finds cards by it.
4. Optionally put it in the home page "Our work" grid in `index.html` (six cards there).
5. Add the item to the `ItemList` JSON-LD in `portfolio.html`.
6. Clients we leave off on purpose: tell Javi, the refresh job keeps that list (it is not in this repo).

## Monthly refresh (automatic)

Client screenshots in `images/work/live/` are refreshed on the 1st of every month by an automated job that runs outside this repo. It re-shoots every client site shown on the home page and portfolio, and ships new screenshots only when all of this holds: the repo is clean and on `origin/main`, live matches the repo byte for byte for every deployed file (if someone deployed without committing, or committed without deploying, it stops), every link and image resolves, JSON-LD parses, no em dashes, and the preview channel serves the new files. It ships as a normal commit (the new screenshots, a `?v=` bump on their `<img>` tags so browsers fetch them, sitemap dates), pushes to `main`, deploys, checks live, and rolls back by itself if live does not serve the new files. A client site that is down, shows an error page, renders blank, or changed beyond recognition keeps its old screenshot and gets reported for a human to look at.

So: **commit and push what you deploy, and deploy what you push to main**, or the monthly refresh will refuse to run (and tell you why).

## Adding a client testimonial

Edit the `.testimonial-block` in `index.html`. Quote text goes in `<blockquote><p>…</p></blockquote>`; the author block has logo, name, and role.

---

## Contact / business info (kept consistent across pages)

- **Email:** `jamiah@nj-developments.com`
- **Phone:** `860-815-8662`
- **Location shown on the site:** `Glastonbury, Connecticut` (2389 Main St is the registered agent's address: fine on the legal pages, not shown as an office)
- **Instagram:** [@nj_developments_ct](https://www.instagram.com/nj_developments_ct/)
- **Project inquiry:** `https://nj-developments.com/book`
- **GHL widget:** permanent calendar ID `4fl6kTMdXBi20NflHTic`

Founders: Jamiah Bartlett, Javier Flores, Nolan Krieger.

If any of the above changes, update the shared footer/CTA links, `book.html`, JSON-LD blocks, `sitemap.xml`, `llms.txt`, and `.well-known` route inventories.
