# Derryle Gogel — Personal site

A minimal, location-neutral portfolio focused on cybersecurity, systems engineering, and cloud engineering.

## Local preview

The site has no build step or third-party dependencies. Serve the repository root with any static HTTP server, for example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publishing

Pushes to `main` deploy automatically through the GitHub Pages workflow in `.github/workflows/pages.yml`.

## Updating content

- Page content and links: `index.html`
- Visual styling and responsive behavior: `styles.css`
- Lightweight scroll and reveal behavior: `script.js`
- Social sharing artwork: `assets/social-card.svg` and `assets/social-card.png`
