/* abcd 全站交互脚本 */
(function () {
  "use strict";

  /* ---------- 页眉滚动阴影 ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobileMenu");
  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- 滚动入场动画 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- 作品集筛选 ---------- */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll(".work-card");
  var emptyTip = document.querySelector(".empty-tip");
  if (chips.length && cards.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) {
          c.classList.remove("active");
          c.setAttribute("aria-selected", "false");
        });
        chip.classList.add("active");
        chip.setAttribute("aria-selected", "true");
        var f = chip.getAttribute("data-filter");
        var visible = 0;
        cards.forEach(function (card) {
          var cats = (card.getAttribute("data-cat") || "").split(" ");
          var show = f === "all" || cats.indexOf(f) !== -1;
          card.classList.toggle("hidden", !show);
          if (show) visible++;
        });
        if (emptyTip) emptyTip.classList.toggle("show", visible === 0);
      });
    });
  }

  /* ---------- 联系表单校验 ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (f) {
        var bad = !f.value.trim();
        if (!bad && f.type === "email") {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim());
        }
        f.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      var success = document.getElementById("formSuccess");
      if (ok && success) {
        success.classList.add("show");
        form.reset();
        setTimeout(function () { success.classList.remove("show"); }, 8000);
      } else if (!ok) {
        var firstBad = form.querySelector(".invalid");
        if (firstBad) firstBad.focus();
      }
    });
    form.querySelectorAll("[required]").forEach(function (f) {
      f.addEventListener("input", function () { f.classList.remove("invalid"); });
    });
  }

  /* ---------- 从作品集带过来的项目咨询预填 ---------- */
  var project = new URLSearchParams(location.search).get("project");
  if (project) {
    var msg = document.getElementById("message");
    if (msg && !msg.value.trim()) {
      msg.value = "我想咨询「" + project + "」相关项目，请尽快与我联系。";
    }
  }

  /* ---------- 微信号复制 ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var tip = btn.querySelector(".copied-tip");
      function done() {
        if (tip) {
          tip.classList.add("show");
          setTimeout(function () { tip.classList.remove("show"); }, 1800);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (err) { /* 忽略 */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
