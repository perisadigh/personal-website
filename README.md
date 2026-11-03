# Peri's personal website

A static site: plain HTML, CSS and a little vanilla JS. No build step. Live at https://perisadigh.com (deployed on Vercel from the default branch).

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home: the intro, the "two truths and a lie" game, what I do, say hello. Its styles and scripts are inline. |
| `work.html` | Things I've made, with the AI portraits rail, the music player and the video. |
| `things-i-love.html` | The list of things I love, and the pinned contact sheet of the people (and pets) I love. |
| `ranking.html` | Me at every age, ranked. |
| `404.html` | The not-found page (Vercel serves it automatically). |
| `about.html` | A redirect to the home page, kept so old links still work. |

Shared styles for the inner pages are in `assets/inner.css`, their behaviour (reveals, lightbox, contact sheet, music player, video) in `assets/inner.js`.

## Photos (`assets/img/`)

- `a/` the photos on the home page.
- `n/` the warm black-and-white photos used on the inner pages:
  - `sheet/row-{a,b,c}.webp` the three film strips of the contact sheet, drawn as one image each (eight or nine frames per strip).
  - `pNN.jpg` the colour originals the strips are made from. Keep them if you ever want to regenerate the sheet.
  - `kid-3.jpg`, `out-*.jpg` the plates on the Rankings and Things I love pages.
- `grain.png` (in `assets/`) the film grain laid over every page.
- `photo/` the AI portraits, in full colour.
- `og.jpg` the link-preview card (1200 x 630).

Everything is re-exported without EXIF or location data. Fonts (EB Garamond, Inter Tight, Kristi) load from Google Fonts.

## Working on it

```
python3 -m http.server 8765
```

then open http://localhost:8765. There is nothing to build.
