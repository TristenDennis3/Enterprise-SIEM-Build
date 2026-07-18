/* =============================================================
   Enterprise SIEM Network — shared interactions
   Restraint first: motion is slow, subtle, reduced-motion aware.
   ============================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

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
      a.addEventListener("click", function () { links.classList.remove("open"); toggle.classList.remove("open"); });
    });
  }

  /* ---------- Background: lock + floating commands ---------- */
  var BG_CMDS = [
    'sudo ip route add default via 10.0.2.2 metric 50',
    'sudo ip addr del 10.0.40.101/24 dev eth0',
    'sudo nmcli connection modify "Wired connection 1" ipv4.method auto',
    'sudo lsof -i :80',
    'curl --head http://target',
    'nmap --script ssl-enum-ciphers -p 443 target',
    'tcpdump -n -i eth0',
    'find / -name "*.nse"',
    'sudo systemctl restart wazuh-manager',
    'sudo pkill -f server.py',
    'chmod +x ~/sliver-server',
    'python3 -m http.server 8080',
    'ip link set enp6s0f0 promisc on',
    'bridge link set dev enp6s0f0 flood on'
  ];
  function initBackground() {
    var layer = document.getElementById("bg-layer");
    if (!layer) return;
    // Lock glyph
    var lock = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    lock.setAttribute("viewBox", "0 0 100 120");
    lock.setAttribute("class", "bg-lock");
    lock.innerHTML =
      '<defs><linearGradient id="bglg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#8B5CF6"/><stop offset="0.55" stop-color="#D946EF"/><stop offset="1" stop-color="#F472B6"/>' +
      '</linearGradient></defs>' +
      '<rect x="20" y="52" width="60" height="56" rx="12" fill="none" stroke="url(#bglg)" stroke-width="2.5"/>' +
      '<path d="M31 52 V37 a19 19 0 0 1 38 0 V52" fill="none" stroke="url(#bglg)" stroke-width="2.5"/>' +
      '<circle cx="50" cy="76" r="6.5" fill="none" stroke="url(#bglg)" stroke-width="2.5"/>' +
      '<rect x="47.5" y="80" width="5" height="15" rx="2.5" fill="url(#bglg)"/>';
    layer.appendChild(lock);
    if (reduce) return;
    // Floating commands
    var n = window.innerWidth < 640 ? 7 : 12;
    for (var i = 0; i < n; i++) {
      var el = document.createElement("div");
      el.className = "bg-cmd";
      var cmd = BG_CMDS[i % BG_CMDS.length];
      el.innerHTML = '<span class="tok">$</span> ' + esc(cmd);
      var top = 6 + Math.random() * 86;
      var left = Math.random() * 74;
      el.style.top = top + "%";
      el.style.left = left + "%";
      el.style.setProperty("--dur", (22 + Math.random() * 16).toFixed(1) + "s");
      el.style.setProperty("--delay", (-Math.random() * 20).toFixed(1) + "s");
      layer.appendChild(el);
    }
  }

  /* ---------- Cursor glow (all pages) ---------- */
  function initGlow() {
    var glow = document.getElementById("cursor-glow");
    if (!glow || reduce || window.matchMedia("(pointer: coarse)").matches) return;
    var shown = false;
    window.addEventListener("mousemove", function (e) {
      if (!shown) { glow.style.opacity = "1"; shown = true; }
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  /* ---------- Scroll progress + back-to-top ---------- */
  function initScroll() {
    var bar = document.getElementById("scroll-bar");
    var top = document.getElementById("to-top");
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop / max) : 0;
      if (bar) bar.style.width = (p * 100) + "%";
      if (top) top.classList.toggle("show", h.scrollTop > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (top) top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal, .script-feature");
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Chart: animate bars into view ---------- */
  function initChart() {
    var chart = document.querySelector(".chart");
    if (!chart) return;
    function run() {
      chart.querySelectorAll(".chart-fill").forEach(function (f) {
        f.style.width = (f.getAttribute("data-pct") || "0") + "%";
      });
    }
    if (reduce || !("IntersectionObserver" in window)) { run(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(chart);
  }

  /* ---------- Terminal: type the Suricata rule (pink) ---------- */
  function initTerminal() {
    var term = document.getElementById("terminal-body");
    if (!term) return;
    var rule = 'alert http $HOME_NET any -> 10.0.40.0/24 any (msg:"CUSTOM C2 Beaconing - Repeated HTTP Callbacks to Attack Subnet"; flow:established,to_server; http.method; content:"GET"; threshold:type both, track by_src, count 5, seconds 60; classtype:trojan-activity; sid:1000001; rev:1;)';
    var lines = [
      { t: "$ sudo vi /opt/so/rules/local.rules", cls: "prompt", sp: 40 },
      { t: rule, cls: "rule", sp: 12 },
      { t: "[OK] sid:1000001 loaded — C2 beaconing detection active", cls: "ok", sp: 16 }
    ];
    if (reduce) {
      term.innerHTML = lines.map(function (l) { return '<div class="' + l.cls + '">' + esc(l.t) + "</div>"; }).join("") + '<span class="cursor"></span>';
      return;
    }
    var li = 0, ci = 0, cur = document.createElement("div");
    term.appendChild(cur);
    var cursorEl = document.createElement("span"); cursorEl.className = "cursor";
    function type() {
      if (li >= lines.length) { term.appendChild(cursorEl); return; }
      var line = lines[li];
      if (ci === 0) cur.className = line.cls;
      if (ci <= line.t.length) {
        cur.textContent = line.t.slice(0, ci); cur.appendChild(cursorEl); ci++;
        setTimeout(type, line.sp);
      } else {
        cur.textContent = line.t; li++; ci = 0;
        if (li < lines.length) { cur = document.createElement("div"); term.appendChild(cur); }
        setTimeout(type, 420);
      }
    }
    setTimeout(type, 500);
  }

  /* ---------- Flip cards: tap on touch ---------- */
  function initFlips() {
    document.querySelectorAll(".flip").forEach(function (card) {
      card.setAttribute("tabindex", "0");
      card.addEventListener("click", function () { if (window.matchMedia("(hover: none)").matches) card.classList.toggle("is-flipped"); });
      card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); card.classList.toggle("is-flipped"); } });
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (!triggers.length) return;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button><button class="lb-nav prev" aria-label="Previous">&#8249;</button><button class="lb-nav next" aria-label="Next">&#8250;</button><img alt=""><div class="lb-cap"></div>';
    document.body.appendChild(box);
    var img = box.querySelector("img"), cap = box.querySelector(".lb-cap"), prev = box.querySelector(".prev"), next = box.querySelector(".next");
    var items = triggers.filter(function (t) { return srcOf(t); });
    var idx = 0;
    function srcOf(el) { return el.getAttribute("data-src") || (el.querySelector("img") && el.querySelector("img").getAttribute("src")); }
    function show(i) { idx = (i + items.length) % items.length; var el = items[idx]; img.src = srcOf(el); cap.textContent = el.getAttribute("data-cap") || ""; }
    function open(el) { idx = items.indexOf(el); var multi = items.length > 1; prev.style.display = next.style.display = multi ? "grid" : "none"; show(idx); box.classList.add("open"); document.body.style.overflow = "hidden"; }
    function close() { box.classList.remove("open"); document.body.style.overflow = ""; img.src = ""; }
    items.forEach(function (t) { t.addEventListener("click", function () { open(t); }); });
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
    initNav(); initBackground(); initGlow(); initScroll(); initReveal();
    initChart(); initTerminal(); initFlips(); initLightbox();
    var y = document.getElementById("year"); if (y) y.textContent = "2026";
  });
})();
