# Portfolio

Source for my personal portfolio website - **Keyur Aghao, Security Engineer & Vulnerability Researcher**. A single-page static site (`index.html`) plus supporting assets (fonts, icons, images) and copies of my certificates.

## Contents
- `index.html` - the portfolio page (styles and layout inline / co-located).
- `fonts/`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` - site assets.
- `ectf-win.jpg`, `1739582468672.jpeg` - images used on the page.
- Certificate PDFs (CEHv11, CND, Cryptography and Network Security, conference and course certificates) linked from the site.

## Running locally
```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes
The certificate PDFs live at the repo root because the page links to them directly - moving them would break those links. Leave paths as-is unless the corresponding `href`s in `index.html` are updated too.
