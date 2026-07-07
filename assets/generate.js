#!/usr/bin/env node
// assets/generate.js — the plain brand kit, as code.
//
// Every brand file is generated from the constants below: SVG masters are
// written next to this script, raster files (PNG/ICO) into assets/generated/.
// Adjust a constant, run it again, and every asset stays in step:
//
//   node assets/generate.js
//
// Self-contained on purpose — this folder can move to another repo wholesale.
// No packages. Rasterizing needs one of: rsvg-convert (brew install librsvg),
// ImageMagick, or Google Chrome. The three text compositions (og-image,
// banners) prefer Chrome so system-font text renders the way browsers do.
// If a sibling ../media folder exists, the files the site serves are also
// refreshed into ../media/brand/ (favicon, apple-touch icon, og image).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GEN = path.join(HERE, 'generated');
fs.mkdirSync(GEN, { recursive: true });

// ---------------------------------------------------------------------------
// Palette — anchored to the manual theme plain-cms.com ships with.
const C = {
  ink: '#161C23',       // tile, dark surfaces, wordmark on light
  paper: '#FAFAF8',     // light surfaces, wordmark on dark
  cloud: '#DCE3EB',     // text lines on ink
  amber: '#E8A13D',     // accent on dark backgrounds
  amberDeep: '#B26205', // accent on light backgrounds (AA on paper)
  muted: '#46525E',     // secondary text on light
  panelBorder: '#D4DAE1',
};

const SANS = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "ui-monospace, 'SF Mono', 'SFMono-Regular', Menlo, 'Cascadia Code', Consolas, monospace";
const TAGLINE = 'The Git-native CMS';
const SUBLINE = 'Your content is plain files — Markdown in, website out.';
const DOMAIN = 'plain-cms.com';

// ---------------------------------------------------------------------------
// Wordmark — geometric monoline "plain", drawn as paths so no font is needed.
// Grid: x-height 120 (y 80..200), baseline 200, stroke 30 with round caps,
// bowls are r=60 circles centered at y=140, l ascends to 38, p descends to 262.
const W = 30, R = 60, XT = 80, BL = 200, ASC = 38, DESC = 262, MID = 140;

function wordmark(ink, accent) {
  const seg = [];
  const line = (x1, y1, x2, y2) => seg.push(`<path d="M ${x1} ${y1} L ${x2} ${y2}"/>`);
  const bowl = (cx) => seg.push(`<circle cx="${cx}" cy="${MID}" r="${R}"/>`);
  line(0, XT, 0, DESC); bowl(R);                                  // p
  line(154, ASC, 154, BL);                                        // l
  bowl(188 + R); line(188 + 2 * R, XT, 188 + 2 * R, BL);          // a
  line(348, XT, 348, BL);                                         // i (dot below)
  line(388, XT, 388, BL);                                         // n
  seg.push(`<path d="M 388 ${MID} A ${R} ${R} 0 0 1 ${388 + 2 * R} ${MID}"/>`);
  line(388 + 2 * R, MID, 388 + 2 * R, BL);
  const body = `<g fill="none" stroke="${ink}" stroke-width="${W}" stroke-linecap="round">${seg.join('')}</g>` +
    `<circle cx="348" cy="41" r="17" fill="${accent}"/>`;         // the plain dot
  return { body, minX: -15, minY: 24, w: 538, h: 253 };           // tight content box
}

function wordmarkSvg(ink, accent, pad = 24) {
  const m = wordmark(ink, accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m.minX - pad} ${m.minY - pad} ${m.w + 2 * pad} ${m.h + 2 * pad}">${m.body}</svg>`;
}

// ---------------------------------------------------------------------------
// Mark — the frontmatter tile: three amber dashes (---) over two text lines.
// Content grid is 292×240 inside a 512 tile: rows 48 thick with 48 gaps.
const ROWS_W = 292, ROWS_H = 240;

function markRows(x, y, s = 1) {
  const t = 48 * s, g = 48 * s, dg = 30 * s, dw = (292 - 60) / 3 * s;
  const r = (dx, dy, w, fill) => `<rect x="${x + dx}" y="${y + dy}" width="${w}" height="${t}" rx="${t / 2}" fill="${fill}"/>`;
  return r(0, 0, dw, C.amber) + r(dw + dg, 0, dw, C.amber) + r(2 * (dw + dg), 0, dw, C.amber) +
    r(0, t + g, 292 * s, C.cloud) + r(0, 2 * (t + g), 200 * s, C.cloud);
}

function markSvg(size = 512) {
  const s = size / 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" rx="${116 * s}" fill="${C.ink}"/>` +
    markRows((512 - ROWS_W) / 2 * s, (512 - ROWS_H) / 2 * s, s) + `</svg>`;
}

// Favicon variant on an integer 32-grid so 16/32/48 px renders stay crisp.
function faviconSvg() {
  const d = (x, y, w, fill) => `  <rect x="${x}" y="${y}" width="${w}" height="4" rx="2" fill="${fill}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="${C.ink}"/>
${d(6, 6, 4, C.amber)}
${d(14, 6, 4, C.amber)}
${d(22, 6, 4, C.amber)}
${d(6, 14, 20, C.cloud)}
${d(6, 22, 14, C.cloud)}
</svg>
`;
}

// Full-bleed square (no rounded corners — iOS and avatar crops add their own).
function bleedSvg(size, rowScale) {
  const w = ROWS_W * rowScale, h = ROWS_H * rowScale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="${C.ink}"/>` +
    markRows((size - w) / 2, (size - h) / 2, rowScale) + `</svg>`;
}

// ---------------------------------------------------------------------------
// Lockup — tile + wordmark on a shared optical line.
function lockup(ink, accent, tile = 244, gap = 58) {
  const ty = ASC - (tile - (DESC - ASC)) / 2;
  const s = tile / 512;
  const wm = wordmark(ink, accent);
  const body = `<rect x="${-tile - gap}" y="${ty}" width="${tile}" height="${tile}" rx="${116 * s}" fill="${C.ink}"/>` +
    markRows(-tile - gap + (512 - ROWS_W) / 2 * s, ty + (512 - ROWS_H) / 2 * s, s) + wm.body;
  return { body, minX: -tile - gap, minY: ty, w: tile + gap + 523, h: tile };
}

function lockupSvg(ink, accent, pad = 32) {
  const m = lockup(ink, accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m.minX - pad} ${m.minY - pad} ${m.w + 2 * pad} ${m.h + 2 * pad}">${m.body}</svg>`;
}

function lockupAt(x, y, scale, ink, accent) {
  const m = lockup(ink, accent);
  return {
    svg: `<g transform="translate(${x} ${y}) scale(${scale}) translate(${-m.minX} ${-m.minY})">${m.body}</g>`,
    w: m.w * scale, h: m.h * scale,
  };
}

// ---------------------------------------------------------------------------
// Compositions (og image, banners). These use live text; rasterized via Chrome.
function text(x, y, size, fill, str, { font = SANS, weight = 600, anchor = 'start', spacing = 0 } = {}) {
  return `<text x="${x}" y="${y}" font-family="${font.replace(/'/g, '&#39;')}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}">${str}</text>`;
}

function ogSvg(w, h) {
  // Right: a content file as a card — the product in one glance.
  const cw = 350, ch = 330, cx = w - cw - 90, cy = (h - ch) / 2;
  const mono = (i, fill, str, weight = 500) => text(cx + 36, cy + 64 + i * 44, 23, fill, str, { font: MONO, weight });
  const card = `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="16" fill="#FFFFFF" stroke="${C.panelBorder}" stroke-width="1.5"/>
  ${mono(0, C.amberDeep, '---')}
  ${mono(1, C.ink, `title: <tspan fill="${C.muted}">Hello, world</tspan>`)}
  ${mono(2, C.ink, `draft: <tspan fill="${C.muted}">false</tspan>`)}
  ${mono(3, C.amberDeep, '---')}
  ${mono(5, C.ink, '# Hello, world', 700)}`;
  const lk = lockupAt(90, cy, 0.62, C.ink, C.amberDeep);
  const ty = cy + lk.h + 82;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${C.paper}"/>
  ${lk.svg}
  ${text(94, ty, 40, C.ink, TAGLINE)}
  ${text(94, ty + 44, 25, C.muted, SUBLINE, { weight: 400 })}
  ${text(94, ty + 98, 21, C.amberDeep, DOMAIN, { font: MONO })}
  ${card}
</svg>`;
}

function bannerSvg(w, h, lockScale, tagSize, tagGap) {
  const m = lockup(C.paper, C.amber);
  const lw = m.w * lockScale, lh = m.h * lockScale;
  const top = (h - (lh + tagGap + tagSize)) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${C.ink}"/>
  ${lockupAt((w - lw) / 2, top, lockScale, C.paper, C.amber).svg}
  ${text(w / 2, top + lh + tagGap + tagSize * 0.78, tagSize, C.cloud, TAGLINE, { anchor: 'middle', weight: 500, spacing: 0.5 })}
</svg>`;
}

// ---------------------------------------------------------------------------
// SVG masters.
const masters = {
  'logo.svg': lockupSvg(C.ink, C.amberDeep),
  'logo-dark.svg': lockupSvg(C.paper, C.amber),
  'wordmark.svg': wordmarkSvg(C.ink, C.amberDeep),
  'wordmark-dark.svg': wordmarkSvg(C.paper, C.amber),
  'mark.svg': markSvg(),
  'favicon.svg': faviconSvg(),
  'profile.svg': bleedSvg(1024, 1.75),
  'apple-touch.svg': bleedSvg(180, 0.46),
  'og-image.svg': ogSvg(1200, 630),
  'github-social.svg': ogSvg(1280, 640),
  'banner-x.svg': bannerSvg(1500, 500, 0.55, 34, 42),
  'banner-reddit.svg': bannerSvg(1920, 384, 0.40, 27, 30),
};
for (const [name, svg] of Object.entries(masters)) fs.writeFileSync(path.join(HERE, name), svg);

// ---------------------------------------------------------------------------
// Rasterizers.
function has(cmd) {
  try { execFileSync('/bin/sh', ['-c', `command -v ${cmd}`], { stdio: 'pipe' }); return true; }
  catch { return false; }
}
const CHROME = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find((p) => fs.existsSync(p));
const VECTOR = has('rsvg-convert') ? 'rsvg-convert' : has('magick') ? 'magick' : null;
if (!VECTOR && !CHROME) {
  console.error('✖ no rasterizer found — install librsvg (brew install librsvg), ImageMagick, or Google Chrome');
  process.exit(1);
}

/** Rasterize an SVG master at width w (and height h when the art is not
 *  width-proportional). Vector tools for geometry; Chrome for text comps. */
function raster(master, out, w, h, { chrome = false } = {}) {
  const src = path.join(HERE, master);
  const dest = path.join(GEN, out);
  if ((chrome || !VECTOR) && CHROME) {
    // Chrome needs exact pixel dimensions — only used where the SVG declares them.
    execFileSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--default-background-color=00000000', `--window-size=${w},${h}`, `--screenshot=${dest}`, `file://${src}`], { stdio: 'pipe' });
  } else if (VECTOR === 'rsvg-convert') {
    // width only — height follows the viewBox, so nothing ever stretches
    execFileSync('rsvg-convert', ['-w', String(w), src, '-o', dest], { stdio: 'pipe' });
  } else {
    execFileSync('magick', ['-background', 'none', src, '-resize', String(w), dest], { stdio: 'pipe' });
  }
  return dest;
}

/** Pack PNG buffers into a .ico (PNG entries — fine everywhere that matters). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);  // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += buf.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

// ---------------------------------------------------------------------------
// Raster kit.
const jobs = [
  // favicons (crisp 32-grid master)
  ['favicon.svg', 'favicon-16.png', 16, 16],
  ['favicon.svg', 'favicon-32.png', 32, 32],
  ['favicon.svg', 'favicon-48.png', 48, 48],
  // app / manifest icons (rounded tile, transparent corners)
  ['mark.svg', 'icon-192.png', 192, 192],
  ['mark.svg', 'icon-512.png', 512, 512],
  // full-bleed squares
  ['apple-touch.svg', 'apple-touch-icon.png', 180, 180],
  ['profile.svg', 'profile-1024.png', 1024, 1024],
  ['profile.svg', 'profile-512.png', 512, 512],
  ['profile.svg', 'reddit-icon-256.png', 256, 256],
  // logos, transparent, 2× for READMEs and slides (height follows the viewBox)
  ['logo.svg', 'logo.png', 1600, null],
  ['logo-dark.svg', 'logo-dark.png', 1600, null],
  ['wordmark.svg', 'wordmark.png', 1200, null],
  ['wordmark-dark.svg', 'wordmark-dark.png', 1200, null],
  // social compositions (text → Chrome)
  ['og-image.svg', 'og-image.png', 1200, 630, true],
  ['github-social.svg', 'github-social.png', 1280, 640, true],
  ['banner-x.svg', 'banner-x.png', 1500, 500, true],
  ['banner-reddit.svg', 'banner-reddit.png', 1920, 384, true],
];
for (const [master, out, w, h, chrome] of jobs) raster(master, out, w, h, { chrome });

fs.writeFileSync(path.join(GEN, 'favicon.ico'), ico([16, 32, 48].map((size) => ({
  size, buf: fs.readFileSync(path.join(GEN, `favicon-${size}.png`)),
}))));

// ---------------------------------------------------------------------------
// Refresh the copies the site serves, when this folder lives next to media/.
const media = path.join(HERE, '..', 'media');
if (fs.existsSync(media)) {
  const brand = path.join(media, 'brand');
  fs.mkdirSync(brand, { recursive: true });
  fs.writeFileSync(path.join(brand, 'favicon.svg'), masters['favicon.svg']);
  fs.copyFileSync(path.join(GEN, 'apple-touch-icon.png'), path.join(brand, 'apple-touch-icon.png'));
  fs.copyFileSync(path.join(GEN, 'og-image.png'), path.join(brand, 'og-image.png'));
  console.log('✓ refreshed media/brand/ (favicon.svg, apple-touch-icon.png, og-image.png)');
}

const made = fs.readdirSync(GEN).filter((f) => !f.startsWith('.'));
console.log(`✓ ${Object.keys(masters).length} SVG masters in assets/, ${made.length} files in assets/generated/`);
console.log(`  rasterizer: ${VECTOR || 'chrome'}${CHROME ? ' + chrome for text' : ' (no chrome — text comps use system fallback fonts)'}`);
