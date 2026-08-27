# Extreme Matter Atlas: build playbook

Side document, never linked from the site. The site's front-facing pages follow §3 exactly.

## 1. What this site is

A public, interactive atlas of matter at its limits, for everyday curious readers. Ten
pages: the periodic table, the record-holding atoms, GNoME's predicted crystals, a playable
crystal lab, metamaterials, engineering uses, future paths, claimed anomalous samples, and a
vimana thought experiment. Static HTML/CSS/JS, GitHub Pages, no build step.

## 2. Page map (all ten ship; never index-only)

| File | Nav label | One line |
| --- | --- | --- |
| index.html | Atlas | Hub, choose-your-door cards, element strip |
| periodic-table.html | Table | 118 elements, colour-by-property, detail drawer |
| extremes.html | Records | Leaderboards computed live from the dataset, analogies |
| gnome.html | GNoME | DeepMind's crystal predictions, verified numbers |
| crystal-lab.html | Crystal Lab | 2D lattices stacked and twisted into 3D, moire view |
| metamaterials.html | Metamaterials | Geometry beats chemistry, playable demos |
| engineering.html | Engineering | Records matched to civil jobs, bridged from products |
| frontiers.html | Frontiers | Future exploration paths, conditional voice |
| anomalous-materials.html | Samples | Claimed samples, measurements, provenance tiers |
| vimana.html | Vimana | Stories read as a design brief, physics as the ruler |

## 3. Audience and voice (hard gates, checked before ship)

- Australian English spelling in all prose. CSS keywords and code stay as code demands.
- Never an em dash and never an en dash in prose. Use a colon, semicolon, comma or full
  stop. Ranges use "to".
- No absolutes, no exaggeration. The smaller true claim beats the bigger vague one.
  Measured records may be stated as records.
- Optimistic register: wonder without hype.
- Plain words for everyday Aussie readers. Every technical term glossed once in plain
  words; at most one technical term per idea; no formula or process-name parades.
- Every big number gets a mind's-eye analogy (a can of soft drink, a kettle, a ute, an
  Olympic pool, a footy field).
- Bridge from finished products people own (phone screen, knife, fridge magnet, bike
  frame) back to the material, never raw-material-first.
- Tense: real measured facts in present tense. Anything unbuilt, predicted, claimed or
  imagined in conditional voice (would, could, the claim is). Claims wear "claimed",
  "alleged" or "reported" naturally.
- Never mention on a page: how it was made, research, drafts, sources-gathering, AI, or
  the site's own machinery ("this page lets you"). No design chatter.
- Never announce honesty, transparency or accuracy. No sections, headings or labels named
  after the site's own truthfulness. Caveat blocks are titled by subject: "Limits",
  "Sources", "What was measured".
- The page talks to the reader, second person or plain declarative. Neutral, warm.
- Peace-first: engineering examples stay civil (energy, space, ocean, medicine,
  transport). No weapons applications, no current defence events.
- Provenance tiers wherever claims vary in strength, shown as tags, never verdict stamps:
  T1 peer-reviewed measurement · T2 named-lab report · T3 broadcast or documentary claim ·
  T4 story or anecdote.

## 4. Design system

Committed dark theme, very colourful, high contrast, not normal. Fonts via Google Fonts:
Unbounded (display), Inter (body), JetBrains Mono (data). All tokens and components live in
`assets/style.css`; nav and footer are injected by `assets/nav.js`.

Every page uses this exact skeleton:

```html
<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PAGE TITLE · Extreme Matter Atlas</title>
<meta name="description" content="ONE PLAIN SENTENCE.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/style.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚛️</text></svg>">
</head>
<body data-page="PAGEKEY">
<div id="site-header"></div>
<main>
  <!-- page content -->
</main>
<div id="site-footer"></div>
<script src="assets/nav.js"></script>
<script>
  // page scripts, all self-contained, no CDNs
</script>
</body>
</html>
```

`PAGEKEY` is one of: index, table, extremes, gnome, crystal, meta, engineering, frontiers,
anomalies, vimana. The body attribute selects the page's accent pair in style.css.

Component classes (all in style.css, use these before inventing new ones): `.wrap`,
`.hero`, `.orbs`, `.kicker`, `.display`, `.lede`, `.grid`, `.card`, `.card-link`, `.btn`,
`.panel`, `.stat`, `.stat-row`, `.bar-row`, `.bar`, `.tag`, `.tier-1` to `.tier-4`,
`.table-scroll`, `.data-table`, `.drawer`, `.control`, `.control-row`, `.canvas-frame`,
`.src-list`, `.divider`, `.two-col`, `.note`. Page-specific styles go in a `<style>` block
in that page's head, scoped under `body[data-page="..."]`.

Wide content (tables, canvases, the periodic table grid) scrolls inside its own
`overflow-x: auto` container; the page body never scrolls sideways.

## 5. Element dataset

`assets/elements.js` defines `window.ELEMENTS`, an array of 118 objects:

```js
{ z: 26, sym: "Fe", name: "Iron", cat: "transition",
  group: 8, period: 4, xpos: 8, ypos: 4,
  mass: 55.845,        // u
  density: 7.874,      // g/cm3 near room temperature (gases at STP)
  melt: 1811,          // K, null if unknown
  boil: 3134,          // K, null if unknown
  en: 1.83,            // Pauling electronegativity, null if none assigned
  ion1: 762.5,         // first ionisation energy, kJ/mol
  radius: 132,         // covalent radius, pm
  abundCrust: 56300,   // ppm by mass in Earth's crust, null if none
  abundUni: 1090,      // ppm by mass in the universe, null if unknown
  discovered: null,    // year, or null for known since ancient times
  radioactive: false,
  halfLife: null,      // string for most stable isotope when radioactive
  est: [],             // field names whose values are estimates or predictions
  records: []          // short strings for genuine records this element holds
}
```

`cat` is one of: alkali, alkaline, transition, post-transition, metalloid, nonmetal,
halogen, noble, lanthanide, actinide, unknown. Lanthanides sit at ypos 9, actinides at
ypos 10, fifteen elements each spanning xpos 4 to 18, with La and Ac at xpos 4 and Lu and
Lr at xpos 18 (grid rows 6 and 7 keep a placeholder at xpos 3). Pages read the data live so corrections propagate; estimated
values wear a small "est." tag in any UI that shows them.

## 6. Build log

- 2026-08-27: repo created, skeleton, licence, design system, ten-page swarm build, first
  publish. All ten pages live.
- 2026-08-28: header row class renamed `.bar` to `.nav-bar`. The header shared `.bar` with
  the leaderboard progress bar, whose 16px height collapsed the header on every page and
  dropped the nav over the hero. Do not reuse `.bar` for layout.
- 2026-08-28: narrow screens get a drop-down menu (button plus two-column panel, 44px+ tap
  targets) instead of a wrapping or sideways-scrolling pill row. Pill row tightened so ten
  items sit on one line inside the 1160px container.
- 2026-08-28: the hub's element ribbon wraps into 46px tiles carrying number and symbol,
  and each tile deep-links to `periodic-table.html#el-<Sym>`, which opens that element's
  drawer on arrival.
- 2026-08-28: review round, 49 findings applied. The ones worth remembering:
  - The atlas had been calling fluorine the element that "grips its electrons hardest",
    which is this site's plain wording for first ionisation energy, and that record is
    helium's. Fluorine's record is the pull on shared electrons. Keep those two apart.
  - The atom-size figures are covalent radii, a reach from centre to centre when bonded,
    not the width of an atom. Any analogy built on them has to double the reach to get a
    span, and the label must not say "across".
  - Conductivity comparisons scale with cross-section, not thickness: silver's six per
    cent lead over copper is six per cent more metal in the cross-section, about three
    per cent fatter.
  - Population and price analogies drift. Date them in the copy ("passed 2.4 million in
    2025", "at 2026 prices") so the next reader can see how old the comparison is.
  - When a page's prose and `assets/elements.js` disagree, fix both. Half the second-round
    findings were a page and the dataset drifting apart after a one-file edit.

## 7. Checks run before each publish

- All internal `href` and `src` resolve; every page has the header div, footer div,
  stylesheet, nav script, unique title, meta description, and a `data-page` from §4.
- No external resources beyond Google Fonts.
- Prose scanned for em and en dashes, American spellings, hype words, honesty-preaching,
  backstage talk. Quoted document titles keep their original spelling.
- Analogy arithmetic recomputed against `assets/elements.js`.
- Every page loaded at 375px and at desktop width: no sideways scroll on the body.
