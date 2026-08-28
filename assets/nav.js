/* Extreme Matter Atlas · shared nav, footer and helpers */
(function () {
  /* Grouped by subject, not by how settled the subject is. */
  var PAGES = [
    { key: "index",       href: "index.html",               label: "Atlas" },
    { key: "beyond",      href: "beyond.html",              label: "We Go Beyond" },

    { key: "table",       href: "periodic-table.html",      label: "The Table",        wing: "elements" },
    { key: "extremes",    href: "extremes.html",            label: "Records",          wing: "elements" },
    { key: "claimed",     href: "claimed-elements.html",    label: "Claimed Elements", wing: "elements" },

    { key: "beyondtable", href: "beyond-the-table.html",    label: "Beyond the Table", wing: "elements" },
    { key: "crystal",     href: "crystal-lab.html",         label: "Crystal Lab",      wing: "patterns" },
    { key: "meta",        href: "metamaterials.html",       label: "Metamaterials",    wing: "patterns" },
    { key: "anomalies",   href: "anomalous-materials.html", label: "Anomalous Metamaterials", wing: "patterns" },
    { key: "cymatics",    href: "cymatics.html",            label: "Cymatics",         wing: "patterns" },
    { key: "resonance",   href: "resonance.html",           label: "Resonance",        wing: "patterns" },

    { key: "vimana",      href: "vimana.html",              label: "Vimana",           wing: "engines" },
    { key: "redmercury",  href: "red-mercury.html",         label: "Red Mercury",      wing: "engines" },
    { key: "elements115", href: "element-115.html",         label: "Element 115",      wing: "engines" },
    { key: "zeropoint",   href: "zero-point.html",          label: "Zero Point",       wing: "engines" },
    { key: "outofphase",  href: "out-of-phase.html",        label: "Out of Phase",     wing: "engines" },
    { key: "tesla",       href: "tesla.html",               label: "Tesla, Recalculated", wing: "engines" },

    { key: "gnome",       href: "gnome.html",               label: "GNoME",            wing: "making" },
    { key: "engineering", href: "engineering.html",         label: "Engineering",      wing: "making" },
    { key: "scifi",       href: "sci-fi-lab.html",          label: "Sci-Fi Lab",       wing: "making" },
    { key: "frontiers",   href: "frontiers.html",           label: "Frontiers",        wing: "making" }
  ];

  var WINGS = [
    { id: "elements", label: "Elements", blurb: "The shelf everything is built from, and the pieces people argue about" },
    { id: "patterns", label: "Patterns", blurb: "Structure, vibration, responsive matter and the shapes waves leave behind" },
    { id: "engines",  label: "Engines",  blurb: "Ways of moving, from old stories to open physics" },
    { id: "making",   label: "Making",   blurb: "Finding new materials and building with them" }
  ];

  var MAIN = PAGES.filter(function (p) { return !p.wing; });
  var inWing = function (id) { return PAGES.filter(function (p) { return p.wing === id; }); };

  var current = document.body.getAttribute("data-page") || "index";

  function li(p) {
    var active = p.key === current ? ' class="active" aria-current="page"' : "";
    return '<li><a href="' + p.href + '"' + active + ">" + p.label + "</a></li>";
  }

  var header = document.getElementById("site-header");
  if (header) {
    var wingHtml = WINGS.map(function (w) {
      var pages = inWing(w.id);
      var here = pages.some(function (p) { return p.key === current; });
      return '<li class="wing-holder" data-wing="' + w.id + '">' +
        '<button class="wing-btn' + (here ? " active" : "") + '" aria-expanded="false">' +
          w.label + ' <span class="caret" aria-hidden="true">&#9662;</span>' +
        "</button>" +
        '<ul class="wing-menu">' +
          '<li class="wing-head">' + w.blurb + "</li>" +
          pages.map(li).join("") +
        "</ul></li>";
    }).join("");

    header.innerHTML =
      '<header class="site-header"><div class="nav-bar">' +
      '<a class="brand" href="index.html">EXTREME MATTER ATLAS</a>' +
      '<button class="menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="main-nav">' +
      '<span class="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="menu-word">Menu</span></button>' +
      '<ul class="pill-nav" id="main-nav">' + MAIN.map(li).join("") + wingHtml + "</ul>" +
      "</div></header>";

    var holders = [].slice.call(header.querySelectorAll(".wing-holder"));
    function closeWings(except) {
      holders.forEach(function (h) {
        if (h === except) return;
        h.classList.remove("open");
        h.querySelector(".wing-btn").setAttribute("aria-expanded", "false");
      });
    }
    holders.forEach(function (h) {
      var b = h.querySelector(".wing-btn");
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var open = b.getAttribute("aria-expanded") !== "true";
        closeWings(h);
        h.classList.toggle("open", open);
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    var btn = document.getElementById("menu-btn");
    var nav = document.getElementById("main-nav");
    var hdr = header.querySelector(".site-header");

    var setOpen = function (open) {
      hdr.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    };

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(btn.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });

    document.addEventListener("click", function (e) {
      if (!hdr.contains(e.target)) { setOpen(false); closeWings(null); }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setOpen(false); closeWings(null); }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    var link = function (p) { return '<li><a href="' + p.href + '">' + p.label + "</a></li>"; };
    var footLinks =
      '<li class="foot-head">Start here</li>' + MAIN.map(link).join("") +
      WINGS.map(function (w) {
        return '<li class="foot-head">' + w.label + "</li>" + inWing(w.id).map(link).join("");
      }).join("");

    footer.innerHTML =
      '<footer class="site-footer"><div class="cols">' +
      "<div>" +
      '<div class="foot-brand">EXTREME MATTER ATLAS</div>' +
      "<p>Matter at its limits: the table, the records, the predicted crystals, the patterns waves leave behind, and the questions still open.</p>" +
      '<p class="fine">&copy; 2026 Luke Nathan Hayes &middot; Aura of Intelligence &middot; ' +
      '<a href="https://github.com/auraofintelligence/extreme-matter-atlas/blob/main/LICENCE.md">Strange But True Public Source Licence</a> &middot; ' +
      '<a href="https://github.com/auraofintelligence/extreme-matter-atlas">Source</a></p>' +
      "</div>" +
      '<ul class="foot-nav">' + footLinks + "</ul>" +
      "</div></footer>";
  }

  /* previous and next, in the order the nav lists them */
  if (footer) {
    var idx = -1;
    for (var i = 0; i < PAGES.length; i++) { if (PAGES[i].key === current) { idx = i; break; } }
    if (idx >= 0) {
      var prev = idx > 0 ? PAGES[idx - 1] : null;
      var next = idx < PAGES.length - 1 ? PAGES[idx + 1] : null;
      var wingOf = function (p) {
        if (!p.wing) return "Start here";
        for (var j = 0; j < WINGS.length; j++) { if (WINGS[j].id === p.wing) return WINGS[j].label; }
        return "";
      };
      var side = function (p, dir) {
        if (!p) return '<span class="page-turn-slot"></span>';
        return '<a class="page-turn-slot turn-' + dir + '" href="' + p.href + '">' +
          '<span class="turn-dir">' + (dir === "prev" ? "Previous" : "Next") + "</span>" +
          '<span class="turn-name">' + p.label + "</span>" +
          '<span class="turn-wing">' + wingOf(p) + "</span></a>";
      };
      var turn = document.createElement("nav");
      turn.className = "page-turn";
      turn.setAttribute("aria-label", "Previous and next page");
      turn.innerHTML = side(prev, "prev") + side(next, "next");
      footer.insertBefore(turn, footer.firstChild);
    }
  }

  /* back to top, which steps aside once the footer is in view */
  (function () {
    var top = document.createElement("button");
    top.className = "to-top";
    top.type = "button";
    top.setAttribute("aria-label", "Back to top");
    top.innerHTML = '<span aria-hidden="true">&#8593;</span><span class="to-top-word">Top</span>';
    document.body.appendChild(top);

    top.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var h = document.querySelector(".brand");
      if (h) h.focus({ preventScroll: true });
    });

    var footEl = footer ? footer.querySelector(".site-footer") : null;

    /* Geometry, not IntersectionObserver: this has to work even where the
       observer and the animation frame callback are throttled. */
    var apply = function () {
      var scrolled = window.scrollY > 600;
      var atFooter = false;
      if (footEl) {
        var r = footEl.getBoundingClientRect();
        atFooter = r.top < window.innerHeight - 40 && r.bottom > 0;
      }
      top.classList.toggle("show", scrolled && !atFooter);
    };

    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    apply();
  })();

  /* scroll-reveal for .reveal blocks */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* shared helpers */
  window.EMA = {
    pages: PAGES,
    wings: WINGS,
    fmt: function (n, dp) {
      if (n === null || n === undefined || isNaN(n)) return "?";
      var s = Number(n).toFixed(dp === undefined ? 0 : dp);
      return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    catClass: function (cat) { return "cat-" + (cat || "unknown"); }
  };
})();
