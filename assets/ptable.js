/* Extreme Matter Atlas · shared periodic table
   ------------------------------------------------------------------
   One component, mounted by index.html and by periodic-table.html, so
   the chart and the element card can never drift apart.

   Needs assets/elements.js first. Reads window.EMA when nav.js has run,
   and falls back to its own copies of those two helpers when it has not.

     window.PTable.mount(options) -> instance

   options
     container     Element or CSS selector. Required. The scrolling frame
                   and the eighteen column grid are built inside it.
     label         Text for the grid's aria-label. Defaults to
                   "Periodic table of the 118 elements".
     colourBy      Element or selector for a <select>. Filled with the
                   colour-by modes and wired to the chart. Leave it out
                   and the boxes stay coloured by family.
     legend        Element or selector. The colour key is drawn here.
     legendNote    Element or selector. The plain words for the mode in
                   use are written here.
     search        Element or selector for a search input.
     searchStatus  Element or selector. The match count is written here.
     records       Element or selector for a button that lights up the
                   elements holding a record.
     familyKey     Element or selector for a <ul>. Filled with the eleven
                   families, how many boxes each one holds, and what each
                   one gets up to.
     deepLink      Boolean, true by default. Answers #el-Os in the address
                   bar, and any later change to it, by opening that card.

   instance
     elements      the list the chart was built from
     tiles         the 118 tile buttons, in atomic number order
     grid          the grid element
     frame         the scrolling frame around the grid
     drawer        the card drawer
     recordCount   how many elements hold a record
     open(what)    open a card. Takes a symbol, an atomic number, or an
                   entry from window.ELEMENTS. Returns true if it opened.
     close()       close the card
     setMode(key)  cat, density, melt, boil, en, ion1, radius,
                   abundCrust or discovered
     find(query)   dim every box that does not match, and return the
                   number that do. An empty string clears it.
     showRecords(on)  light up the record holders

   window.PTable also carries families, modes and catLabel, so a page can
   use the same names in its own copy.
*/
(function () {
  "use strict";

  var seq = 0;

  /* ---------- families, and what each one gets up to ---------- */
  var FAMILIES = [
    { key: "alkali", name: "Alkali metals",
      d: "Soft, light metals that react hard with water. Lithium from this column is the moving part of a phone battery; sodium pairs with chlorine to make table salt." },
    { key: "alkaline", name: "Alkaline earth metals",
      d: "Still keen to react, but steadier than their neighbours. Calcium from here makes up most of your bones; magnesium goes into light bike frames." },
    { key: "transition", name: "Transition metals",
      d: "The workhorse metals: iron, copper, titanium, nickel, gold. Most of the metal you touch in a day comes out of this block." },
    { key: "post-transition", name: "Post-transition metals",
      d: "Softer metals that melt at friendlier temperatures. Aluminium in a drink can, tin in the solder holding a circuit board together, lead in a car battery." },
    { key: "metalloid", name: "Metalloids",
      d: "In-between materials, part metal and part not, which is exactly why they are useful. Silicon from here is the chip in your phone." },
    { key: "nonmetal", name: "Other nonmetals",
      d: "The stuff of air, water and living things. Oxygen to breathe, carbon for the frame of living tissue, sulphur for the tyres on your car." },
    { key: "halogen", name: "Halogens",
      d: "Keen reactors that pair up with metals to make salts. Chlorine keeps a pool clean; fluorine goes into toothpaste; iodine goes into table salt." },
    { key: "noble", name: "Noble gases",
      d: "Loners that mostly refuse to react with anything. Helium in a party balloon, argon sealed inside double glazing, neon glowing in an old shop sign." },
    { key: "lanthanide", name: "Lanthanides, often called rare earths",
      d: "Metals that give small magnets and bright screens their punch. Neodymium drives the speakers in your headphones; europium lit the red in older televisions." },
    { key: "actinide", name: "Actinides",
      d: "Heavy metals, mostly radioactive, meaning their atoms break down over time. Uranium fuels a power station; a speck of americium sits in most smoke alarms." },
    { key: "unknown", name: "Family not yet settled",
      d: "The newest and heaviest boxes. Only a handful of atoms of each have ever been made, and they fall apart in a blink, so where they belong is still an open question." }
  ];
  var CAT_LABEL = {};
  FAMILIES.forEach(function (f) { CAT_LABEL[f.key] = f.name; });

  /* ---------- shared helpers, taken from nav.js when it has run ---------- */
  function fmt(n, dp) {
    if (window.EMA && window.EMA.fmt) return window.EMA.fmt(n, dp);
    if (n === null || n === undefined || isNaN(n)) return "?";
    return Number(n).toFixed(dp === undefined ? 0 : dp)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function catClass(c) {
    if (window.EMA && window.EMA.catClass) return window.EMA.catClass(c);
    return "cat-" + (c || "unknown");
  }

  /* ---------- number helpers ---------- */
  function trim(n) {
    var a = Math.abs(n);
    var dp = a >= 100 ? 0 : a >= 10 ? 1 : a >= 1 ? 2 : 3;
    return String(parseFloat(Number(n).toFixed(dp)));
  }
  function compact(n) {
    var a = Math.abs(n);
    if (n === 0) return "0";
    if (a >= 1e6) return trim(n / 1e6) + "M";
    if (a >= 1e4) return trim(n / 1e3) + "k";
    if (a >= 1000) return fmt(n, 0);
    if (a < 0.001) return Number(n).toExponential(0);
    return trim(n);
  }
  function perTonne(v) {
    if (v >= 1000) return trim(v / 1000) + " kg per tonne";
    if (v >= 1) return trim(v) + " g per tonne";
    if (v >= 0.001) return trim(v * 1000) + " mg per tonne";
    return "under a milligram per tonne";
  }
  /* Temperatures read in degrees Celsius first, kelvin alongside in brackets.
     Below COLD_K the Celsius figure stops carrying any feel for how cold a thing is,
     so kelvin leads there and a plain line says how far above absolute zero it sits. */
  var COLD_K = 30;
  function celNum(k) {
    var s = fmt(k - 273.15, 0);
    return s === "-0" ? "0" : s;
  }
  function kelvinTxt(k) {
    return fmt(k, k < 100 ? 2 : 0) + " K";
  }
  function tempPair(k) {
    return k < COLD_K
      ? kelvinTxt(k) + " (" + celNum(k) + " °C)"
      : celNum(k) + " °C (" + kelvinTxt(k) + ")";
  }
  function tempPlain(k) {
    if (k >= COLD_K) return null;
    if (k < 1) return "Less than a degree above absolute zero.";
    return "About " + fmt(k, 0) + " degrees above absolute zero.";
  }
  function densFmt(d) {
    return String(Number(Number(d).toPrecision(d < 1 ? 3 : 5)));
  }
  function massFmt(m) {
    return m % 1 === 0 ? fmt(m, 0) : fmt(m, 3);
  }
  function ppmLong(v) {
    if (v >= 1000) return fmt(v, 0) + " ppm";
    if (v >= 0.0001) return String(Number(Number(v).toPrecision(3))) + " ppm";
    return Number(v).toExponential(1) + " ppm";
  }
  function ppmPlain(v, what) {
    if (v >= 1000) return "About " + trim(v / 1000) + " kg in every tonne of " + what + ".";
    if (v >= 1) return "About " + trim(v) + " g in every tonne of " + what + ".";
    if (v >= 0.001) return "About " + trim(v * 1000) + " mg in every tonne of " + what + ".";
    return "Less than a milligram in every tonne of " + what + ".";
  }
  function densityPlain(d) {
    if (d < 0.02) return "A gas in its ordinary form, so this figure is the gas at normal air pressure.";
    if (d < 1) return "Lighter than the same amount of water.";
    return "About " + trim(d) + " times as heavy as the same amount of water.";
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------- colour-by modes ---------- */
  var MODES = [
    { key: "cat", label: "Family",
      note: "Colours group the boxes into families that behave alike. The full key sits further down." },
    { key: "density", label: "Density", log: true,
      note: "Density is what a fixed amount weighs. Water sits at 1 g/cm³, the gases at the top of the chart sit near zero, and osmium tops it at 22.6.",
      tile: function (v) { return densFmt(v); },
      end: function (v) { return densFmt(v) + " g/cm³"; } },
    { key: "melt", label: "Melting point",
      note: "The temperature where a solid gives up and turns liquid. Boxes carry degrees Celsius: ice does it at 0 °C, which is 273 K, caesium melts in a warm hand, and carbon holds out past 3,500 °C. Down the cold end, helium takes pressure as well as chill before it will set at all, at 0.95 K, less than a degree above absolute zero. The ends of the ramp give kelvin alongside.",
      tile: function (v) { return celNum(v); },
      end: function (v) { return tempPair(v); } },
    { key: "boil", label: "Boiling point",
      note: "The temperature where a liquid turns to vapour. Boxes carry degrees Celsius: a kettle gets water there at 100 °C, which is 373 K, and rhenium holds out to 5,596 °C. Down the cold end, helium turns to vapour at 4.22 K, about four degrees above absolute zero and barely above the background chill of deep space. The ends of the ramp give kelvin alongside.",
      tile: function (v) { return celNum(v); },
      end: function (v) { return tempPair(v); } },
    { key: "en", label: "Pull on shared electrons",
      note: "When two atoms share electrons, one usually pulls harder. That tug is scored on the Pauling scale, from 0.7 for caesium up to 3.98 for fluorine. Eighteen boxes hold no score, because they hardly share at all.",
      tile: function (v) { return trim(v); },
      end: function (v) { return trim(v) + " on the scale"; } },
    { key: "ion1", label: "Energy to strip one electron",
      note: "How tightly the outermost electron is held. Caesium lets one go for 376 kJ/mol; helium clings on until 2,372. Metals sit low, and that looseness is what makes them conduct.",
      tile: function (v) { return fmt(v, 0); },
      end: function (v) { return fmt(v, 0) + " kJ/mol"; } },
    { key: "radius", label: "Atom size",
      note: "How far the middle of an atom sits from the middle of a partner it is bonded to, in picometres. Helium is the tightest at 28; francium spreads to about 260, roughly nine times as far.",
      tile: function (v) { return fmt(v, 0); },
      end: function (v) { return fmt(v, 0) + " pm"; } },
    { key: "abundCrust", label: "Share of Earth's crust", log: true,
      note: "How much of the ground is made of it, in grams per tonne. Oxygen runs to 461,000 of them, close to half the weight of the crust. Astatine is the scarcest, and the standard tables carry no crust figure for it at all: reported estimates of the whole crust's supply run from under a gram, about the weight of a paperclip, up to a few dozen grams.",
      tile: function (v) { return compact(v); },
      end: function (v) { return perTonne(v); } },
    { key: "discovered", label: "Year first found",
      note: "The year each element was pinned down. Ten boxes stay dark here: gold, iron, carbon and seven others have been worked since ancient times, long before anyone wrote a date on it.",
      tile: function (v) { return String(v); },
      end: function (v) { return String(v); } }
  ];

  var RAMP = [[96, 165, 250], [45, 212, 191], [163, 230, 53], [251, 191, 36], [251, 113, 133]];
  function rampColour(t) {
    t = Math.max(0, Math.min(1, t));
    var s = t * (RAMP.length - 1);
    var i = Math.min(RAMP.length - 2, Math.floor(s));
    var f = s - i, a = RAMP[i], b = RAMP[i + 1];
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * f) + "," +
                    Math.round(a[1] + (b[1] - a[1]) * f) + "," +
                    Math.round(a[2] + (b[2] - a[2]) * f) + ")";
  }
  var NO_DATA_BG = "#121b33";

  /* ---------- small DOM helpers ---------- */
  function node(ref) {
    if (!ref) return null;
    if (typeof ref === "string") return document.querySelector(ref);
    return ref.nodeType === 1 ? ref : null;
  }

  /* ---------- the component ---------- */
  function mount(options) {
    var opt = options || {};
    var host = node(opt.container);
    var E = (window.ELEMENTS || []).slice();
    if (!host || !E.length) return null;

    var id = ++seq;

    function extent(key) {
      var lo = null, hi = null, loEl = null, hiEl = null;
      E.forEach(function (e) {
        var v = e[key];
        if (v === null || v === undefined) return;
        if (lo === null || v < lo) { lo = v; loEl = e; }
        if (hi === null || v > hi) { hi = v; hiEl = e; }
      });
      return { lo: lo, hi: hi, loEl: loEl, hiEl: hiEl };
    }

    /* ----- frame and grid ----- */
    var frame = document.createElement("div");
    frame.className = "table-scroll ptable-frame";

    var grid = document.createElement("div");
    grid.className = "ptable";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", opt.label || "Periodic table of the 118 elements");
    frame.appendChild(grid);
    host.appendChild(frame);

    var tiles = [];
    var byPos = {};
    var recordCount = 0;

    E.forEach(function (e) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "el-tile " + catClass(e.cat);
      b.style.gridColumn = String(e.xpos);
      b.style.gridRow = String(e.ypos);
      b.setAttribute("data-x", e.xpos);
      b.setAttribute("data-y", e.ypos);
      b.setAttribute("aria-label",
        e.name + ", symbol " + e.sym + ", atomic number " + e.z + ", " + CAT_LABEL[e.cat]);
      b.innerHTML = '<span class="z">' + e.z + "</span>" +
                    '<span class="sym">' + e.sym + "</span>" +
                    '<span class="nm">' + esc(e.name) + "</span>" +
                    '<span class="pv"></span>';
      if (e.records && e.records.length) { b.classList.add("has-rec"); recordCount++; }
      b.addEventListener("click", function () { openCard(e, b); });
      b._el = e;
      tiles.push(b);
      byPos[e.xpos + "," + e.ypos] = b;
      grid.appendChild(b);
    });

    function placeholder(row, text) {
      var d = document.createElement("div");
      d.className = "ptable-ph";
      d.setAttribute("aria-hidden", "true");
      d.style.gridColumn = "3";
      d.style.gridRow = String(row);
      d.innerHTML = text;
      grid.appendChild(d);
    }
    placeholder(6, "57<br>to<br>71");
    placeholder(7, "89<br>to<br>103");

    var gap = document.createElement("div");
    gap.className = "ptable-gap";
    gap.style.gridRow = "8";
    gap.setAttribute("aria-hidden", "true");
    grid.appendChild(gap);

    function seriesLabel(row, text) {
      var d = document.createElement("div");
      d.className = "ptable-series";
      d.style.gridRow = String(row);
      d.innerHTML = text;
      grid.appendChild(d);
    }
    seriesLabel(9, "Lanthanides<br>57 to 71");
    seriesLabel(10, "Actinides<br>89 to 103");

    /* ----- the card drawer ----- */
    var nameId = "ptable-card-name-" + id;

    var scrim = document.createElement("div");
    scrim.className = "scrim";

    var drawer = document.createElement("aside");
    drawer.className = "drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-labelledby", nameId);
    drawer.setAttribute("aria-hidden", "true");

    var drawerClose = document.createElement("button");
    drawerClose.type = "button";
    drawerClose.className = "close-x";
    drawerClose.setAttribute("aria-label", "Close the element card");
    drawerClose.innerHTML = "&#10005;";

    var card = document.createElement("div");
    card.className = "el-card";

    drawer.appendChild(drawerClose);
    drawer.appendChild(card);
    document.body.appendChild(scrim);
    document.body.appendChild(drawer);

    var opener = null;

    function propRow(k, v, plain, isEst) {
      return '<div class="prop"><span class="k">' + k +
        (isEst ? ' <span class="tag est">est.</span>' : "") + "</span>" +
        '<span class="v">' + v + "</span>" +
        (plain ? '<span class="plain">' + plain + "</span>" : "") + "</div>";
    }

    function openCard(e, from) {
      opener = from || null;
      var isEst = function (k) { return e.est && e.est.indexOf(k) >= 0; };
      var h = "";

      h += '<div class="el-head">' +
        '<div class="el-badge ' + catClass(e.cat) + '"><span class="s">' + e.sym + "</span>" +
        '<span class="n">' + e.z + "</span></div>" +
        '<div><div class="el-name" id="' + nameId + '">' + esc(e.name) + "</div>" +
        '<span class="tag">' + CAT_LABEL[e.cat] + "</span></div></div>";

      h += propRow("Atomic number", fmt(e.z, 0), "Protons in the middle of the atom.");
      h += propRow("Atomic mass", massFmt(e.mass) + " u", null);
      h += propRow("Density", densFmt(e.density) + " g/cm³", densityPlain(e.density), isEst("density"));
      h += propRow("Melting point",
        e.melt === null ? "no settled figure" : tempPair(e.melt),
        e.melt === null ? null : tempPlain(e.melt), isEst("melt"));
      h += propRow("Boiling point",
        e.boil === null ? "no settled figure" : tempPair(e.boil),
        e.boil === null ? null : tempPlain(e.boil), isEst("boil"));
      h += propRow("Pull on shared electrons",
        e.en === null ? "none assigned" : trim(e.en),
        e.en === null ? "It hardly shares electrons at all, so it sits off the scale."
                      : "On a scale that runs from 0.7 to 3.98.", isEst("en"));
      h += propRow("Energy to strip one electron",
        fmt(e.ion1, e.ion1 % 1 === 0 ? 0 : 1) + " kJ/mol", null, isEst("ion1"));
      h += propRow("Atom size", fmt(e.radius, 0) + " pm",
        e.radius === 28 ? "The tightest atom on the chart."
                        : "About " + trim(e.radius / 28) + " times helium's reach, the tightest on the chart.",
        isEst("radius"));
      h += propRow("Share of Earth's crust",
        e.abundCrust === null ? "not found in the crust" : ppmLong(e.abundCrust),
        e.abundCrust === null ? "It does not turn up in ordinary rock." : ppmPlain(e.abundCrust, "crust"));
      h += propRow("Share of the universe",
        e.abundUni === null ? "no settled figure" : ppmLong(e.abundUni),
        e.abundUni === null ? null : ppmPlain(e.abundUni, "ordinary matter"));
      h += propRow("First found",
        e.discovered === null ? "ancient times" : String(e.discovered),
        e.discovered === null ? "Worked and named long before anyone kept records of it." : null);
      if (e.radioactive) {
        h += propRow("Radioactive", "yes",
          e.halfLife ? "Half of any sample of its steadiest form breaks down in " + esc(e.halfLife) + "."
                     : "Its atoms break down over time.");
      }

      if (e.records && e.records.length) {
        h += '<div class="sec-h">Records it holds</div><ul class="rec-list">' +
          e.records.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>";
      }
      if (e.est && e.est.length) {
        h += '<p class="drawer-note">Figures marked est. were worked out from theory rather than weighed at a bench.</p>';
      }

      card.innerHTML = h;
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      scrim.classList.add("on");
      tiles.forEach(function (b) { b.classList.toggle("picked", b === from); });
      drawerClose.focus();
      if (typeof opt.onOpen === "function") opt.onOpen(e);
    }

    function closeCard() {
      if (!drawer.classList.contains("open")) return;
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      scrim.classList.remove("on");
      tiles.forEach(function (b) { b.classList.remove("picked"); });
      if (opener) { opener.focus(); opener = null; }
    }

    drawerClose.addEventListener("click", closeCard);
    scrim.addEventListener("click", closeCard);
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeCard();
    });

    /* ----- walking the chart with the arrow keys ----- */
    grid.addEventListener("keydown", function (ev) {
      var t = document.activeElement;
      if (!t || !t.classList || !t.classList.contains("el-tile")) return;
      var dx = 0, dy = 0;
      if (ev.key === "ArrowLeft") dx = -1;
      else if (ev.key === "ArrowRight") dx = 1;
      else if (ev.key === "ArrowUp") dy = -1;
      else if (ev.key === "ArrowDown") dy = 1;
      else return;
      ev.preventDefault();
      var x = parseInt(t.getAttribute("data-x"), 10);
      var y = parseInt(t.getAttribute("data-y"), 10);
      for (var i = 0; i < 20; i++) {
        x += dx; y += dy;
        if (x < 1 || x > 18 || y < 1 || y > 10) return;
        var n = byPos[x + "," + y];
        if (n) { n.focus(); return; }
      }
    });

    /* ----- colouring ----- */
    var legendEl = node(opt.legend);
    var legendNoteEl = node(opt.legendNote);
    if (legendEl) legendEl.classList.add("ptable-legend");
    if (legendNoteEl) legendNoteEl.classList.add("ptable-legend-note");

    var mode = MODES[0];

    function applyMode(m) {
      mode = m;
      if (m.key === "cat") {
        grid.classList.remove("mode-prop");
        tiles.forEach(function (b) {
          b.style.backgroundColor = "";
          b.classList.remove("no-data");
          b.querySelector(".pv").textContent = "";
        });
        if (legendEl) {
          legendEl.innerHTML = FAMILIES.map(function (f) {
            return '<span class="nodata"><i style="background:var(--cat-' + f.key +
                   ');border-color:transparent"></i>' + f.name.split(",")[0] + "</span>";
          }).join("");
        }
        if (legendNoteEl) legendNoteEl.textContent = m.note;
        return;
      }
      grid.classList.add("mode-prop");
      var ex = extent(m.key);
      var useLog = !!m.log;
      var lo = useLog ? Math.log10(ex.lo) : ex.lo;
      var hi = useLog ? Math.log10(ex.hi) : ex.hi;
      var span = (hi - lo) || 1;

      tiles.forEach(function (b) {
        var v = b._el[m.key];
        var pv = b.querySelector(".pv");
        if (v === null || v === undefined) {
          b.style.backgroundColor = NO_DATA_BG;
          b.classList.add("no-data");
          pv.textContent = "";
          return;
        }
        b.classList.remove("no-data");
        var t = ((useLog ? Math.log10(v) : v) - lo) / span;
        b.style.backgroundColor = rampColour(t);
        pv.textContent = m.tile(v);
      });

      var darkLabel = m.key === "discovered" ? "known since ancient times" : "no settled figure";
      function endTag(el) {
        return (el.est && el.est.indexOf(m.key) >= 0) ? ' <span class="tag est">est.</span>' : "";
      }
      if (legendEl) {
        legendEl.innerHTML =
          '<span class="end">' + m.end(ex.lo) + " · " + ex.loEl.sym + endTag(ex.loEl) + "</span>" +
          '<span class="ramp" role="img" aria-label="Colour ramp running from low on the left to high on the right"></span>' +
          '<span class="end">' + m.end(ex.hi) + " · " + ex.hiEl.sym + endTag(ex.hiEl) + "</span>" +
          '<span class="nodata"><i></i>' + darkLabel + "</span>";
      }
      if (legendNoteEl) legendNoteEl.textContent = m.note;
    }

    function setMode(key) {
      for (var i = 0; i < MODES.length; i++) {
        if (MODES[i].key === key) {
          applyMode(MODES[i]);
          if (select) select.value = String(i);
          return true;
        }
      }
      return false;
    }

    var select = node(opt.colourBy);
    if (select) {
      MODES.forEach(function (m, i) {
        var o = document.createElement("option");
        o.value = String(i);
        o.textContent = m.label;
        select.appendChild(o);
      });
      select.addEventListener("change", function () {
        applyMode(MODES[parseInt(select.value, 10) || 0]);
      });
    }
    applyMode(MODES[0]);

    /* ----- finding an element ----- */
    var searchEl = node(opt.search);
    var statusEl = node(opt.searchStatus);
    if (statusEl) statusEl.classList.add("ptable-search-status");

    function find(query) {
      var q = String(query === undefined || query === null ? "" : query).trim().toLowerCase();
      if (!q) {
        tiles.forEach(function (b) { b.classList.remove("dim"); });
        if (statusEl) statusEl.textContent = "";
        return 0;
      }
      var hits = 0;
      var numeric = /^\d+$/.test(q);
      tiles.forEach(function (b) {
        var e = b._el;
        var match = numeric
          ? String(e.z) === q
          : (e.sym.toLowerCase().indexOf(q) === 0 || e.name.toLowerCase().indexOf(q) >= 0);
        b.classList.toggle("dim", !match);
        if (match) hits++;
      });
      if (statusEl) {
        statusEl.textContent = hits
          ? hits + " of " + tiles.length + " boxes match"
          : "No box matches that";
      }
      return hits;
    }
    if (searchEl) {
      searchEl.addEventListener("input", function () { find(searchEl.value); });
    }

    /* ----- record holders ----- */
    var recBtn = node(opt.records);
    function showRecords(on) {
      grid.classList.toggle("show-records", !!on);
      if (recBtn) {
        recBtn.setAttribute("aria-pressed", on ? "true" : "false");
        recBtn.textContent = (on ? "Hide record holders (" : "Highlight record holders (") +
          recordCount + ")";
      }
    }
    if (recBtn) {
      showRecords(false);
      recBtn.addEventListener("click", function () {
        showRecords(!grid.classList.contains("show-records"));
      });
    }

    /* ----- the family key ----- */
    var famEl = node(opt.familyKey);
    if (famEl) {
      famEl.classList.add("ptable-fam-key");
      FAMILIES.forEach(function (f) {
        var n = E.filter(function (e) { return e.cat === f.key; }).length;
        var li = document.createElement("li");
        li.innerHTML = '<span class="sw ' + catClass(f.key) + '">' + n + "</span>" +
                       "<span><b>" + f.name + '</b><span class="d">' + f.d + "</span></span>";
        famEl.appendChild(li);
      });
    }

    /* ----- opening a card from code, or from #el-Os in the address bar ----- */
    function open(what) {
      var want = null, num = null;
      if (what && typeof what === "object" && what.sym) {
        want = String(what.sym).toLowerCase();
      } else if (typeof what === "number") {
        num = what;
      } else if (typeof what === "string" && /^\d+$/.test(what.trim())) {
        num = parseInt(what, 10);
      } else if (what) {
        want = String(what).toLowerCase();
      } else {
        return null;
      }
      for (var i = 0; i < tiles.length; i++) {
        var e = tiles[i]._el;
        var hit = want === null ? e.z === num : e.sym.toLowerCase() === want;
        if (hit) { openCard(e, tiles[i]); return tiles[i]; }
      }
      return null;
    }

    function openFromHash() {
      var m = /^#el-([A-Za-z]{1,3})$/.exec(window.location.hash || "");
      if (!m) return;
      var tile = open(m[1]);
      if (tile) tile.scrollIntoView({ block: "nearest", inline: "center" });
    }
    if (opt.deepLink !== false) {
      openFromHash();
      window.addEventListener("hashchange", openFromHash);
    }

    return {
      elements: E,
      tiles: tiles,
      grid: grid,
      frame: frame,
      drawer: drawer,
      recordCount: recordCount,
      open: function (what) { return !!open(what); },
      close: closeCard,
      setMode: setMode,
      find: find,
      showRecords: showRecords
    };
  }

  window.PTable = {
    mount: mount,
    families: FAMILIES,
    modes: MODES,
    catLabel: CAT_LABEL
  };
})();
