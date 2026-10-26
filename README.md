# personal-website

Parinaz's personal website: plain HTML, CSS and a little JavaScript, no build step. Fonts load from Google Fonts.

## Concept: field notes

The site works like a personal archive. Two inks: oxblood red for anything "printed" (headings, numbers, threads) and pen-blue for handwritten notes. Every image is a "fig." with a typewriter caption.

## Pages

- `index.html`: home. Intro spread, selected work, a strip from the archive.
- `work.html`: one poster-like plate per project.
- `archive.html`: images, words and sounds pinned and threaded to a central photo, with filters.
- `about.html`: annotated portrait and a few typewriter columns of details.

Shared styles live in `assets/style.css` (colors and fonts are the variables at the top). Behaviour (scroll-drawn threads, reveals, archive threads and filters) lives in `assets/site.js`.

## Images

The images in `assets/img/` are generated placeholders. Swap in your own photos with the same file names, or change the `src` paths. Photos are shown in black and white, or in a red duotone (`duo`), and `warm` ones turn red on hover.

## Preview and publish

Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

To publish, go to **Settings → Pages** in the repo, set **Source** to "Deploy from a branch", pick the branch and the `/ (root)` folder, and save. The site will be at https://perisadigh.github.io/personal-website/.
