// Theme switch, mobile menu, footer year, and the guilloche rosette.
(function () {
  var root = document.documentElement;

  function currentTheme() {
    var set = root.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  applyTheme(currentTheme());

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Mobile menu
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Guilloche rosette, the kind printed on banknotes and cheques
  var svg = document.querySelector("svg.rosette");
  if (svg) {
    var NS = "http://www.w3.org/2000/svg";
    var cx = 200, cy = 200;

    function ring(R, A, lobes, wobble, phase, steps) {
      var d = "";
      for (var i = 0; i <= steps; i++) {
        var t = (i / steps) * Math.PI * 2;
        var r = R + A * Math.sin(lobes * t + phase) + wobble * Math.cos((lobes * 3) * t);
        var x = cx + r * Math.cos(t);
        var y = cy + r * Math.sin(t);
        d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
      }
      return d + "Z";
    }

    var paths = [];
    var outer = 26, inner = 14;
    for (var k = 0; k < outer; k++) {
      paths.push(ring(150, 34, 12, 4, (k / outer) * Math.PI * 2 / 12 * 2, 720));
    }
    for (var j = 0; j < inner; j++) {
      paths.push(ring(78, 22, 8, 2, (j / inner) * Math.PI * 2 / 8 * 2, 480));
    }
    for (var m = 0; m < 10; m++) {
      paths.push(ring(32, 10, 6, 0, (m / 10) * Math.PI * 2 / 6 * 2, 240));
    }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paths.forEach(function (d, idx) {
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", d);
      svg.appendChild(p);
      if (!reduce && p.getTotalLength) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = "stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1) " + (idx * 0.025) + "s";
      }
    });
    if (!reduce) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          svg.querySelectorAll("path").forEach(function (p) { p.style.strokeDashoffset = "0"; });
        });
      });
    }
  }
})();
