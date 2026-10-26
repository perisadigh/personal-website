# personal-website

Parinaz's personal website: plain HTML, CSS and a little JavaScript, no build step. Fonts load from Google Fonts.

## What's on the page

One page, `index.html`: an intro with a photo, a "currently" list, experience, things I love, and contact. It's meant to be both a home on the internet and something to link in a job application.

Shared styles live in `assets/style.css` (colors and fonts are the variables at the top). Fade-ins and the scattered intro text live in `assets/site.js`. To change the intro, just edit the sentence in `index.html`; it is spread across lines automatically.

## Images

The images in `assets/img/` are generated placeholders. Swap in your own photos with the same file names, or change the `src` paths. Any photo is shown in black and white or in a red duotone (`duo`), and `warm` ones turn red on hover, so whatever you pick will look consistent.

## Preview and publish

Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

To publish, go to **Settings → Pages** in the repo, set **Source** to "Deploy from a branch", pick the branch and the `/ (root)` folder, and save. The site will be at https://perisadigh.github.io/personal-website/.
