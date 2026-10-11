# Vow & Verse

Personal website for a wedding officiant & reception MC — available nationwide and for destination weddings.

Single-page static site: no build step, no dependencies. Open `index.html` or serve the folder with any static server.

```
index.html              — all content
assets/css/styles.css   — design system + all styling
assets/js/main.js       — nav, reveal animations, lightbox, booking form
assets/images/          — AI-generated placeholder photos (replace with real ones)
```

## Make it yours (5-minute checklist)

1. **Contact details** — edit the `CONFIG` object at the top of `assets/js/main.js`
   (email, phone, social handle). The booking form and the contact list both read from it.
2. **Prices** — search `index.html` for `pkg-price` and adjust the two "From $" figures.
3. **Photos** — drop your own images into `assets/images/` using the same filenames
   (`hero-aisle.jpg`, `gallery-rings.jpg`, …) and they replace the placeholders with zero code changes.
4. **Portrait** — the framed "V & V" card in the About section is a portrait slot: replace
   `.portrait-card` content with an `<img>` when you have one.
5. **Claims** — copy was written to be safe and generic ("ordained officiant", "English & 中文",
   deposit terms, FAQ answers). Read every claim and change anything that isn't true for you.

## Booking form

Currently opens the visitor's email client via `mailto:` with the inquiry pre-filled.
For a serverless form backend, sign up at [Formspree](https://formspree.io) (or use Netlify Forms
if hosting there) and in `assets/js/main.js` replace the `mailto:` redirect with a `fetch()` POST —
the field values are already collected in one place.

## Publish (GitHub Pages)

```bash
git init
git add -A
git commit -m "Vow & Verse — wedding officiant site"
git branch -M main
git remote add origin git@github.com:<you>/vow-and-verse.git
git push -u origin main
```

Then: repo → Settings → Pages → Source: *Deploy from a branch* → Branch: `main` / root.
Site goes live at `https://<you>.github.io/vow-and-verse/`.

For a custom domain (e.g. `vowandverse.com`), add a `CNAME` file containing the domain
and point DNS at GitHub Pages — or use Cloudflare Pages / Netlify, which work with this
folder as-is.

## Design notes

- Type: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif) + Inter (body),
  loaded from Google Fonts with full system fallbacks.
- Palette: ink `#1a1815` · ivory `#fbf8f2` · champagne gold `#b3945a` · cream `#f4eee4`.
- Respects `prefers-reduced-motion`; keyboard-focus styles and aria labels included.
