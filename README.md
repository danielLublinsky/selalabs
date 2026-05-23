# SelaLabs

Marketing website for **SelaLabs** — a high-tech software studio that builds custom
software for client needs, powered by AI and delivered by senior engineers deployed
into the client's team.

Static site built with **Tailwind CSS v4**. No framework, no backend.

## Structure

```
index.html      # the full single-page site
i18n.js         # English/Hebrew switcher + the Hebrew dictionary
main.js         # interactions: mobile menu, scroll reveal, contact form
favicon.svg     # logo mark
src/input.css   # Tailwind entry + brand theme (yellow primary, green accents)
styles.css      # COMPILED output — do not edit by hand
```

## Develop

Install once:

```bash
npm install
```

Rebuild CSS on every change to HTML/JS/`src/input.css`:

```bash
npm run dev      # watch mode → regenerates styles.css
```

Open `index.html` directly, or serve the folder:

```bash
npm run serve    # static server at the printed URL
```

## Build for production

```bash
npm run build    # minified styles.css
```

Then deploy these files as-is to any static host (Netlify, Vercel, GitHub Pages, S3, …):
`index.html`, `styles.css`, `main.js`, `favicon.svg`.

## Brand

- **Primary:** yellow (`brand-*`) on white
- **Accent:** green (`leaf-*`) for touches and confirmations
- **Neutrals:** charcoal scale (`ink-*`)
- **Fonts:** Syne (display) + Space Mono (mono/retro accents) + Inter (body); Heebo / Rubik for Hebrew — all from Google Fonts

Edit the palette and tokens in [`src/input.css`](src/input.css), then re-run `npm run build`.

## Languages (English / Hebrew)

The site is bilingual with a globe toggle in the top bar. English is the single
source of truth — it lives directly in `index.html`. Hebrew is applied at runtime
by [`i18n.js`](i18n.js), which matches each text node against a dictionary and
flips the page to RTL (`dir="rtl"`) with Hebrew fonts (Heebo / Rubik). The choice
is remembered in `localStorage`.

To edit Hebrew copy, change the values in the `HE` map (and `PH` placeholders) in
`i18n.js`. To translate a new English string, add an entry keyed by its exact
English text. No build step is needed for `i18n.js` — it's plain JS.
