# Portfolio

Source for my personal portfolio website — **Keyur Aghao, Security Engineer & Vulnerability Researcher**. A single-page static site built from scratch: hand-authored HTML/CSS/JS, no framework or build step.

## Design
- Editorial dark theme: ink background, warm parchment text, a single restrained gold accent.
- Type pairing: Fraunces (display serif), Inter (body), JetBrains Mono (technical labels).
- Custom favicon monogram, scroll-reveal animations, project filtering, responsive down to mobile, reduced-motion aware.

## Contents
- `index.html` — the portfolio page (structure + content).
- `styles.css` — the full stylesheet.
- `fonts/`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` — site assets.
- `1739582468672.jpeg` — portrait; `ectf-win.jpg` — MITRE eCTF winning-team photo.
- Certificate PDFs/images (CEHv11, CND, Cryptography & Network Security, conference and course certificates) linked from the site.

## Running locally
```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes
The certificate PDFs live at the repo root because the page links to them directly — moving them would break those links. Leave paths as-is unless the corresponding `href`s in `index.html` are updated too.
