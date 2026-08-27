# Extreme Matter Atlas: build playbook

Side document, never linked from the site. The site's front-facing pages follow §3 exactly.

## 1. What this site is

A public, interactive atlas of matter at its limits, for everyday curious readers. Eighteen
pages: a hub and the method page, then four wings, Elements, Patterns, Engines and Making.
The full map is the table in section 2; do not keep a second list of page names anywhere
else. Static HTML/CSS/JS, GitHub Pages, no build step.

## 2. Page map (18 pages; never index-only)

Grouped **by subject, never by how settled the subject is**. Contested and settled material
share the same drawers on purpose: that arrangement is the argument. Nav groups live in
`assets/nav.js` as `wing` values, and `WINGS` carries their labels.

| File | data-page | Wing | One line |
| --- | --- | --- | --- |
| index.html | index | (top) | Hub, choose-your-door cards, element ribbon |
| beyond.html | beyond | (top) | The method: story to spec to measurement, and the anthem |
| periodic-table.html | table | elements | 118 elements, colour-by-property, detail drawer |
| extremes.html | extremes | elements | Leaderboards computed live from the dataset |
| claimed-elements.html | claimed | elements | Every element named in an anomalous claim, and what it actually does |
| anomalous-materials.html | anomalies | elements | Claimed samples: story, claim, what instruments returned |
| crystal-lab.html | crystal | patterns | Lattice sketchpad: 2D to 3D, twist, defects, vibrating modes |
| metamaterials.html | meta | patterns | Geometry doing the work of chemistry |
| cymatics.html | cymatics | patterns | Chladni plates, standing waves, patterns you can drive |
| resonance.html | resonance | patterns | Resonance from a tuning fork to an atom |
| vimana.html | vimana | engines | Old sky-craft stories read as a design brief |
| red-mercury.html | redmercury | engines | Mercury drives, from the old texts to real ion thrusters |
| element-115.html | elements115 | engines | Moscovium, the S4 account, the island of stability |
| zero-point.html | zeropoint | engines | Vacuum energy, the Casimir force, what a ZPM would need |
| gnome.html | gnome | making | DeepMind's crystal predictions |
| engineering.html | engineering | making | Records matched to civil jobs |
| sci-fi-lab.html | scifi | making | Named fictional technology given a spec sheet |
| frontiers.html | frontiers | making | Where discovery could head next |

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

### 3a. The stance: no boundary, no grading

**NO TRUTH TAGS. NO CONFIDENCE TIERS. NO GRADED BADGES OF ANY KIND.** An earlier draft put
T1 to T4 provenance tags on the samples page and they were removed on sight. Do not
reintroduce them under any name: no tier chips, no confidence scores, no "strength of
evidence" labels, no colour-coded reliability keys, no section explaining how to weigh what
follows. Readers do their own pattern recognition; grading it for them is the failure.

Instead, **attribute in plain prose, inside the sentence**. Say who said it, where, when,
and on what instrument, and let that do the work:

- Not: `<span class="tier-2">T2</span> Layer structure measured.`
- Yes: "Oak Ridge National Laboratory reported the layer structure in 2019."
- Not: `<span class="tier-3">T3</span> Unusual alloy claimed.`
- Yes: "The claim was made on a History Channel episode in 2021, with no laboratory report
  published alongside it."

There is also **no discrete boundary between settled and speculative material**. Do not
build a "measured wing" and a "beyond wing", do not write section headings that sort
content into real and unreal, and do not open a page by warning the reader which mode they
are entering. Sci-fi, fringe and mainstream are stages of the same exploration, and the
site's structure treats them that way. A page may say what is measured and what is
hypothesis in ordinary sentences; it may not stamp them.

### 3b. Going beyond: the method every speculative page follows

The point of this site is to push further, not to relay consensus. Never close an argument
by citing what mainstream science says: that is an appeal to authority, and this site
does not use it. Apply the same standard to every claim regardless of its origin.

For any story, claim or piece of fiction, work it as an engineering brief in this order:

1. **The story**, told with respect and without wink or sneer.
2. **The claim as a spec**: pull out the numbers it implies. Thrust, energy density,
   temperature, mass, half-life, field strength. Give it real units.
3. **The physics it would need**: name the mechanism and put a number on the gap. Real
   figures, computed, not gestured at.
4. **The nearest built thing**: what already exists that rhymes with it. This is the
   payload of the page. Mercury ion drives really flew. The Casimir force is really
   measured. Acoustic levitation really lifts things. Find that, and lead with it.
5. **What would have to be true**: the conditions, stated plainly, that would make the
   claim work.
6. **What you would measure**: the experiment that would move the question. Instruments
   that exist, quantities they return.

Never end a speculative page on a dismissal or a verdict. End on the measurement, the
open question, or the thing worth building.

### 3d. Whose call it is: not ours

**The site has no standing to rule on what is real, what happened, or what is possible.**
Luke is the site authority; the reader is the explorer. Our job is to lay out the
engineering and the measurements and let people work it out first hand. Flagged 2026-08-28
after the vimana page was written with lines like "the craft stays a wish" and "the craft
itself has no measurement behind it, only a wish", which he called out directly: "are you
over 10 thousand years old? were you there when the mahabarata happened? don't go stating
with authority you don't have."

BANNED as verdicts on a subject: a wish, only a wish, just a story, a myth (used to mean
untrue), fanciful, fantasy, make-believe, unproven, no evidence, never existed, could not
have, impossible (except as a stated mathematical result, such as five-fold symmetry not
tiling the plane), fringe, pseudo-anything, so-called, supposed, debunked, and any sentence
of the form "there is no reason to think X".

The trap to avoid is swapping one verdict for another. "The craft stays a wish" was written
to replace a banned accuracy-announcement, and it is worse: it is the site telling the
reader what to conclude about someone else's account.

WHAT TO WRITE INSTEAD. Describe the work, never the verdict:

- Not: "The craft stays a wish; the records it would have to beat are on the shelf."
- Yes: "Here is the brief the stories describe, priced against what the table can supply."
- Not: "The craft itself has no measurement behind it, only a wish."
- Yes: "Every figure on the bench is a measured one. What the bench cannot supply is the
  craft: that part is yours to work out."

Conditional voice still applies to **what a builder today would have to do** ("a hull like
that would need to hold at 900 degrees"), because that is the engineering exercise. It does
NOT apply to whether something existed or was built, because that is not ours to say.
Reporting who said what, where and when stays exactly as it is: that is information, not a
verdict.

The register is first principles and open exploration: a choose-your-own science adventure
where the reader can find out for themselves. Give them the numbers, the method and the
instruments. Never the conclusion.

### 3c. The workhorse sentence: "X, not Y"

This is the house construction across Luke's other sites, and it is how a claim gets held
without either endorsing it or sneering at it. **Y is the specific overclaim a sceptical
reader would suspect, named before they can suspect it.** Naming it first is what earns
the licence to keep going. Live examples from his sites:

> a hypothesis, not a discovery · a widely used shorthand, not a guarantee · engineering
> estimates for comparison, not a budget anyone has raised · a field trip, not a fog
> machine · digital twin, not digital master · a research lane, not a prediction machine ·
> a governance exercise before it is a belief exercise · a choice, not a law of physics

Two more habits from the same sites:

- **State what is unknown as a positive fact, with a cause.** Not a shrug and not an
  apology: "the other 352 bodies wear a latitude and longitude grid instead, because a map
  of them does not exist yet"; "where they have not been measured, the lab says unmeasured
  rather than guessing."
- **Never write** debunked, so-called, believers, or scare quotes. Scepticism is carried by
  what the sentence reports, never by its tone.

Section headings may be full sentences with full stops when they carry an argument.

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

`PAGEKEY` is one of: index, beyond, table, extremes, claimed, anomalies, crystal, meta,
cymatics, resonance, vimana, redmercury, elements115, zeropoint, gnome, engineering, scifi,
frontiers. It is the `data-page` value from the table in section 2, and it selects the
page's accent pair, set either in style.css or in that page's own scoped style block.

Component classes (all in style.css, use these before inventing new ones): `.wrap`,
`.hero`, `.orbs`, `.kicker`, `.display`, `.lede`, `.grid`, `.card`, `.card-link`, `.btn`,
`.panel`, `.stat`, `.stat-row`, `.bar-row`, `.bar`, `.tag` (with `.tag.est`, its only
modifier: no graded variant of `.tag` may be added, see §3a),
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
- 2026-08-28: the site grew from ten pages to eighteen and changed stance.
  - The provenance tier system was removed everywhere: 146 tags on the samples page and 21
    stray source badges on five older pages. Sources moved into the prose instead, which
    made the samples page longer, not shorter. See section 3a; do not reintroduce them.
  - Nav regrouped by subject into Elements, Patterns, Engines and Making, so contested and
    settled material share drawers. `assets/nav.js` carries a general `wing` system and
    `WINGS` supplies the labels and colours; adding a page is one line.
  - New: beyond, element-115, red-mercury, zero-point, sci-fi-lab, claimed-elements,
    cymatics, resonance. `media/we-go-beyond.mp4` plays on beyond.html with controls, no
    autoplay and no loop.
  - Vimana became a design bench that computes. Eight hulls, eight power sources, eight
    lift methods, each anchored to something built or measured. It sizes hull mass from
    areal density, hover power from newtons per kilowatt, and plant mass from watts per
    kilogram, then reports whether the design closes or the plant eats the craft. Swept
    all 1,536 combinations across three diameters: no NaN, no runaway text, 327 close.
  - The lesson that keeps repeating: a session limit can kill a whole fan-out mid-flight.
    Research results survive in the workflow journal at
    `subagents/workflows/<runId>/journal.jsonl`, so recover briefs from there rather than
    re-running the research. Files an agent already wrote survive too; check disk before
    assuming an agent that reported failure did nothing.

## 7. Checks run before each publish

- All internal `href` and `src` resolve; every page has the header div, footer div,
  stylesheet, nav script, unique title, meta description, and a `data-page` from §4.
- No external resources beyond Google Fonts.
- Prose scanned for em and en dashes, American spellings, hype words, honesty-preaching,
  backstage talk. Quoted document titles keep their original spelling.
- Analogy arithmetic recomputed against `assets/elements.js`.
- Every page loaded at 375px and at desktop width: no sideways scroll on the body.
