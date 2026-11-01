# personal-website

Parinaz's personal website: plain HTML, CSS and a little JavaScript, no build step. Fonts load from Google Fonts.

## What's on the site

- `index.html`: a footnoted intro, right now, and an index of the pages.
- `about.html`: the longer version, experience and CV.
- `work.html`: Work & Play, a catalogue with a filter.
- `ai.html`: AI Studio, funny AI portraits as polaroids and AI music.
- `archive.html`: life lately on film strips, soundtrack, people, screen, websites and rabbit holes.
- `favourite-things.html`: a hand-written notebook of things I love.

Placeholders are marked with a dashed red underline (`<span class="ph">`). Swap them for the real thing.

Every page shares the footer, which has a "Surprise me" button that jumps somewhere random on the site.

Shared styles live in `assets/style.css`. The colours at the top are pulled from golden-hour photos (apricot, sky, clay, sand, pine). Fade-ins and dates live in `assets/site.js`.

## Images

Photos live in `assets/img/` (resized, with location data stripped). To swap one, replace the file or change its `src` in the page that uses it.

## Preview and publish

Open `index.html` in a browser, or run `python3 -m http.server` and visit http://localhost:8000.

To publish, go to **Settings → Pages** in the repo, set **Source** to "Deploy from a branch", pick the branch and the `/ (root)` folder, and save. The site will be at https://perisadigh.github.io/personal-website/.
