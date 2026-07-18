/* =============================================================
   SIEM SOC Lab — shared interactions
   Restraint first: motion is slow, subtle, and respects
   prefers-reduced-motion.
   ============================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.classList.remove("open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up stats ---------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce) { el.textContent = target + suffix; return; }
      var start = 0, dur = 1400, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Terminal typing ---------- */
  function initTerminal() {
    var term = document.getElementById("terminal-body");
    if (!term) return;
    var lines = [
      { t: "$ whoami", cls: "prompt" },
      { t: "tristen_dennis — cybersecurity analyst", cls: "muted" },
      { t: "$ status --lab", cls: "prompt" },
      { t: "[OK] 4 VLANs segmented | 2 SIEM platforms | attacks detected", cls: "ok" }
    ];
    if (reduce) {
      term.innerHTML = lines.map(function (l) { return '<div class="' + l.cls + '">' + esc(l.t) + "</div>"; }).join("") +
        '<span class="cursor"></span>';
      return;
    }
    var li = 0, ci = 0, cur = document.createElement("div");
    term.appendChild(cur);
    var cursorEl = document.createElement("span");
    cursorEl.className = "cursor";
    function type() {
      if (li >= lines.length) { term.appendChild(cursorEl); return; }
      var line = lines[li];
      if (ci === 0) { cur.className = line.cls; }
      if (ci <= line.t.length) {
        cur.textContent = line.t.slice(0, ci);
        cur.appendChild(cursorEl);
        ci++;
        setTimeout(type, line.cls === "prompt" ? 42 : 20);
      } else {
        cur.textContent = line.t;
        li++; ci = 0;
        if (li < lines.length) { cur = document.createElement("div"); term.appendChild(cur); }
        setTimeout(type, 360);
      }
    }
    setTimeout(type, 500);
  }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---------- Cursor glow (hero only) ---------- */
  function initGlow() {
    var glow = document.getElementById("cursor-glow");
    var hero = document.querySelector(".hero");
    if (!glow || !hero || reduce || window.matchMedia("(pointer: coarse)").matches) return;
    hero.addEventListener("mouseenter", function () { glow.style.opacity = "1"; });
    hero.addEventListener("mouseleave", function () { glow.style.opacity = "0"; });
    hero.addEventListener("mousemove", function (e) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    });
  }

  /* ---------- Background: slow-drifting circuit nodes ---------- */
  function initBackground() {
    var canvas = document.getElementById("bg-canvas");
    if (!canvas || reduce) return;
    var ctx = canvas.getContext("2d");
    var w, h, nodes, dpr;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      var count = Math.min(48, Math.floor((window.innerWidth * window.innerHeight) / 26000));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12 * dpr,
          vy: (Math.random() - 0.5) * 0.12 * dpr,
          r: (Math.random() * 1.4 + 0.6) * dpr
        });
      }
    }
    var COL = [[139,92,246], [217,70,239], [59,130,246]];
    function draw() {
      ctx.clearRect(0, 0, w, h);
      var linkDist = 150 * dpr;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        var c = COL[i % 3];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0.5)";
        ctx.fill();
        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < linkDist) {
            var a = (1 - d / linkDist) * 0.14;
            ctx.strokeStyle = "rgba(139,92,246," + a + ")";
            ctx.lineWidth = dpr * 0.6;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    size();
    window.addEventListener("resize", debounce(size, 200));
    requestAnimationFrame(draw);
  }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ---------- Flip cards: tap support on touch ---------- */
  function initFlips() {
    document.querySelectorAll(".flip").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", function (e) {
        if (window.matchMedia("(hover: none)").matches) card.classList.toggle("is-flipped");
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.classList.toggle("is-flipped"); }
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (!triggers.length) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lb-nav next" aria-label="Next">&#8250;</button>' +
      '<img alt="">' +
      '<div class="lb-cap"></div>';
    document.body.appendChild(box);
    var img = box.querySelector("img");
    var cap = box.querySelector(".lb-cap");
    var prev = box.querySelector(".prev");
    var next = box.querySelector(".next");
    var idx = 0;
    var items = triggers.filter(function (t) { return t.getAttribute("data-lightbox") !== "none-src"; });

    function srcOf(el) { return el.getAttribute("data-src") || (el.querySelector("img") && el.querySelector("img").src); }
    function show(i) {
      idx = (i + items.length) % items.length;
      var el = items[idx];
      var src = srcOf(el);
      if (!src) return;
      img.src = src;
      cap.textContent = el.getAttribute("data-cap") || "";
    }
    function open(el) {
      idx = items.indexOf(el);
      var multi = items.length > 1;
      prev.style.display = next.style.display = multi ? "grid" : "none";
      show(idx);
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() { box.classList.remove("open"); document.body.style.overflow = ""; img.src = ""; }

    triggers.forEach(function (t) {
      if (!srcOf(t)) return;
      t.addEventListener("click", function () { open(t); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    prev.addEventListener("click", function () { show(idx - 1); });
    next.addEventListener("click", function () { show(idx + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initBackground();
    initReveal();
    initCounters();
    initTerminal();
    initGlow();
    initFlips();
    initLightbox();
    var y = document.getElementById("year");
    if (y) y.textContent = "2026";
  });
})();
