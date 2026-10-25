# personal-website

Parinaz's personal website: plain HTML and CSS, no build step. Fonts load from Google Fonts.

## Edit

- Content lives in `index.html`.
- Colors, fonts, and spacing live in `assets/style.css` (the variables at the top).

To preview locally, open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

## Publish with GitHub Pages

In the repo, go to **Settings → Pages**, set **Source** to "Deploy from a branch", pick the branch and the `/ (root)` folder, and save. The site will be at https://perisadigh.github.io/personal-website/.

## Images

The images in `assets/img/` are generated placeholders. Swap in your own photos with the same file names, or change the `src` paths in `index.html`. Photos are shown in black and white or in a red duotone automatically.
