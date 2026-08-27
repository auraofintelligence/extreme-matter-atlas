/* Extreme Matter Atlas · shared nav, footer and helpers */
(function () {
  var PAGES = [
    { key: "index",       href: "index.html",               label: "Atlas" },
    { key: "table",       href: "periodic-table.html",      label: "Table" },
    { key: "extremes",    href: "extremes.html",            label: "Records" },
    { key: "gnome",       href: "gnome.html",               label: "GNoME" },
    { key: "crystal",     href: "crystal-lab.html",         label: "Crystal Lab" },
    { key: "meta",        href: "metamaterials.html",       label: "Metamaterials" },
    { key: "engineering", href: "engineering.html",         label: "Engineering" },
    { key: "frontiers",   href: "frontiers.html",           label: "Frontiers" },
    { key: "anomalies",   href: "anomalous-materials.html", label: "Samples" },
    { key: "vimana",      href: "vimana.html",              label: "Vimana" }
  ];

  var current = document.body.getAttribute("data-page") || "index";

  var header = document.getElementById("site-header");
  if (header) {
    var links = PAGES.map(function (p) {
      var active = p.key === current ? ' class="active" aria-current="page"' : "";
      return '<li><a href="' + p.href + '"' + active + ">" + p.label + "</a></li>";
    }).join("");
    header.innerHTML =
      '<header class="site-header"><div class="nav-bar">' +
      '<a class="brand" href="index.html">EXTREME MATTER ATLAS</a>' +
      '<button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="main-nav">' +
      '<span class="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="menu-word">Menu</span></button>' +
      '<ul class="pill-nav" id="main-nav">' + links + "</ul>" +
      "</div></header>";

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
      if (hdr.classList.contains("menu-open") && !hdr.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    var footLinks = PAGES.map(function (p) {
      return '<li><a href="' + p.href + '">' + p.label + "</a></li>";
    }).join("");
    footer.innerHTML =
      '<footer class="site-footer"><div class="cols">' +
      "<div>" +
      '<div class="foot-brand">EXTREME MATTER ATLAS</div>' +
      "<p>Matter at its limits: the table, the records, the predicted crystals, the lattices, and the questions still open.</p>" +
      '<p class="fine">&copy; 2026 Luke Nathan Hayes &middot; Aura of Intelligence &middot; ' +
      '<a href="https://github.com/auraofintelligence/extreme-matter-atlas/blob/main/LICENCE.md">Strange But True Public Source Licence</a> &middot; ' +
      '<a href="https://github.com/auraofintelligence/extreme-matter-atlas">Source</a></p>' +
      "</div>" +
      "<ul>" + footLinks + "</ul>" +
      "</div></footer>";
  }

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
    fmt: function (n, dp) {
      if (n === null || n === undefined || isNaN(n)) return "?";
      var s = Number(n).toFixed(dp === undefined ? 0 : dp);
      return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    catClass: function (cat) { return "cat-" + (cat || "unknown"); }
  };
})();
