# Mahmuda Sultana — Portfolio

Personal portfolio website of **Mahmuda Sultana** — UI/UX Designer & Visual/Graphic Designer (Rajshahi, Bangladesh).

A single-page, dependency-free static site: dark, bold and playful — inspired by [jessicahsu.design](https://jessicahsu.design/), [milanreed.framer.website](https://milanreed.framer.website/), [portfolio.tami.agency](https://portfolio.tami.agency/) and [yanliuportfolio.vercel.app](https://yanliuportfolio.vercel.app/).

## Structure

```
portfolio/
├── index.html          # All content & sections
├── styles.css          # Design system, layout, animations
├── script.js           # Nav, scroll reveals, copy-email, card tilt
├── assets/
│   └── favicon.svg
└── README.md
```

## Sections

1. Hero — intro, stickers, stats
2. Skills marquee
3. Selected work (links to Behance)
4. About
5. Skills (UI/UX · Visual & Graphic · Tools)
6. Experience timeline
7. Awards & achievements
8. Education & training
9. Contact + footer

## Run locally

No build step. Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `mahmuda-portfolio`) and push this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mahmuda-portfolio.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.

3. Your site will be live at `https://<your-username>.github.io/mahmuda-portfolio/`.

## Customizing

- **Text / CV details** — all content lives in `index.html`.
- **Colors** — change the CSS variables at the top of `styles.css` (`--accent`, `--accent-2`, `--accent-3`, `--bg`).
- **Fonts** — loaded from Google Fonts in `<head>` of `index.html`.
- **Project cards** — the four work cards currently link to the [Behance portfolio](https://www.behance.net/mahmudasultana2). Replace titles/descriptions/links in the `#work` section with real case studies when ready.
