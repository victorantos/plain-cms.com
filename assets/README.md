# The plain brand kit

Everything visual about **plain** lives in this folder — the brand's home,
in the repo that publishes plain-cms.com — and all of it is generated from
one script. The folder is self-contained: the generator only writes inside
`assets/`, plus a refresh of the sibling `../media/brand/` files the site
serves. The engine repo (`plain-cms/plain`) carries only what the product
ships: the default-theme favicon, the admin tab icon, and the README logos
in `.github/`.

```sh
node assets/generate.js    # regenerates every file below
```

Requirements: any of `rsvg-convert` (`brew install librsvg`), ImageMagick, or
Google Chrome. Chrome is preferred for the three text compositions (og image,
banners) so type renders with real system fonts; pure-geometry files use
`rsvg-convert`. Committed rasters are canonical — regenerating on a different
OS may shift text rendering slightly (system fonts differ), so only commit
regenerated compositions from macOS or after eyeballing them.

## The idea

- **The mark** is a *frontmatter document*: a dark tile holding three amber
  dashes — `---`, the Markdown frontmatter delimiter every plain user types —
  above two text lines. It is a picture of the product: a plain file with
  structure. It doubles as a generic "document" glyph, which is why it also
  ships as the engine's default favicon.
- **The wordmark** is "plain", hand-drawn as a geometric monoline — circles
  and stems, no font, lowercase always. The dot of the *i* carries the accent.
- **The voice**: calm, concrete, no mystique. plain is written lowercase even
  at the start of a sentence.

## Palette

| Name       | Hex       | Use |
| ---------- | --------- | --- |
| Ink        | `#161C23` | tile, dark surfaces, wordmark on light |
| Paper      | `#FAFAF8` | light surfaces, wordmark on dark |
| Cloud      | `#DCE3EB` | text lines inside the tile, body text on ink |
| Amber      | `#E8A13D` | accent on dark backgrounds (the dashes, the dot) |
| Amber deep | `#B26205` | accent on light backgrounds (AA contrast) |
| Muted      | `#46525E` | secondary text on light |

The accent adapts to its background — bright amber on ink, deep amber on
paper. The palette is anchored to the *manual* theme plain-cms.com runs, so
site and brand always look related.

## Rules

- Don't restyle: no recoloring, stretching, outlining, shadows, or rotation.
- Clear space around the logo: at least the tile's width on all sides ÷ 4.
- On photos or busy backgrounds, use the tile mark alone.
- Minimum sizes: lockup 120 px wide; below that, use the mark or the favicon
  variant (a 32-grid redraw that stays crisp at 16 px).

## Files

SVG masters (edit `generate.js`, not these — they are overwritten):

| File | What it is |
| ---- | ---------- |
| `logo.svg` / `logo-dark.svg` | lockup: mark + wordmark, for light / dark backgrounds |
| `wordmark.svg` / `wordmark-dark.svg` | wordmark alone |
| `mark.svg` | the tile, 512 grid, rounded corners, transparent outside |
| `favicon.svg` | 32-grid redraw for tiny sizes (also the site + admin favicon) |
| `profile.svg` | full-bleed square avatar art (survives circle crops) |
| `apple-touch.svg` | full-bleed square, roomier margins (iOS rounds it) |
| `og-image.svg` / `github-social.svg` | link-preview composition, 1200×630 / 1280×640 |
| `banner-x.svg` / `banner-reddit.svg` | header art, 1500×500 / 1920×384 |

`generated/` — rasters, ready to upload:

| File | Size | Where it goes |
| ---- | ---- | ------------- |
| `favicon.ico` | 16+32+48 | legacy favicon (directories, old crawlers) |
| `favicon-16/32/48.png` | — | anywhere a PNG favicon is asked for |
| `icon-192.png`, `icon-512.png` | — | web-app manifest icons |
| `apple-touch-icon.png` | 180² | served at `/media/brand/` on the site |
| `og-image.png` | 1200×630 | served at `/media/brand/`, the site-wide `og:image` |
| `github-social.png` | 1280×640 | GitHub repo → Settings → General → Social preview |
| `profile-1024.png`, `profile-512.png` | — | X / GitHub org avatar |
| `reddit-icon-256.png` | 256² | Reddit community icon |
| `banner-x.png` | 1500×500 | X profile header |
| `banner-reddit.png` | 1920×384 | Reddit community banner |
| `logo.png`, `logo-dark.png` | 1600w | slides, articles, anywhere SVG won't do |
| `wordmark.png`, `wordmark-dark.png` | 1200w | same, wordmark only |

## How the site uses it

`site.config.json` points at three files the generator refreshes into
`media/brand/`:

```json
"favicon": "/media/brand/favicon.svg",
"appleTouchIcon": "/media/brand/apple-touch-icon.png",
"socialImage": "/media/brand/og-image.png"
```

Every theme's `base.html` honors these keys (favicon link, touch icon,
`og:image` + `twitter:card` fallback). The same 32-grid favicon ships as the
default-theme favicon and as the admin's tab icon.
