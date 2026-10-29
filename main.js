/* 黄靖雯作品集 · 像素风交互脚本 */
(function () {
  'use strict';

  /* ---------- 移动端菜单 ---------- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 滚动高亮导航 ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  function spy() {
    var pos = window.scrollY + 140;
    var idx = 0;
    sections.forEach(function (sec, i) {
      if (sec.offsetTop <= pos) idx = i;
    });
    links.forEach(function (a, i) {
      a.classList.toggle('active', i === idx);
    });
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------- 轮播 ---------- */
  var slides = document.getElementById('slides');
  var dotsBox = document.getElementById('carDots');
  if (slides && dotsBox) {
    var total = slides.children.length;
    var cur = 0;
    var timer = null;

    for (var i = 0; i < total; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', '第' + (i + 1) + '张');
      (function (n) {
        b.addEventListener('click', function () { go(n); restart(); });
      })(i);
      dotsBox.appendChild(b);
    }
    var dots = Array.prototype.slice.call(dotsBox.children);

    function go(n) {
      cur = (n + total) % total;
      slides.style.transform = 'translateX(-' + cur * 100 + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(cur + 1); }, 5200);
    }
    document.getElementById('carPrev').addEventListener('click', function () { go(cur - 1); restart(); });
    document.getElementById('carNext').addEventListener('click', function () { go(cur + 1); restart(); });

    /* 触摸滑动 */
    var sx = 0;
    slides.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    slides.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 48) { go(cur + (dx < 0 ? 1 : -1)); restart(); }
    }, { passive: true });

    go(0);
    restart();
  }

  /* ---------- 打字机 ---------- */
  var typing = document.getElementById('typing');
  if (typing) {
    var lines = [
      'CHOOSE A DESTINATION · 成都职业技术学院 · 虚拟现实技术应用',
      '3D SCENE ARTIST · Blender / Substance Painter / UE5',
      'FROM MODEL TO ENGINE · 建模、材质、灯光到引擎落地',
      'LEVEL UP · 虚拟现实 · 数字孪生 · 游戏场景'
    ];
    var li = 0, ci = 0, del = false;
    function tick() {
      var line = lines[li];
      ci += del ? -1 : 1;
      typing.textContent = line.slice(0, ci);
      var wait = del ? 32 : 92;
      if (!del && ci >= line.length) { del = true; wait = 2200; }
      else if (del && ci <= 0) { del = false; li = (li + 1) % lines.length; wait = 420; }
      setTimeout(tick, wait);
    }
    setTimeout(tick, 600);
  }

  /* ---------- 联系方式点击复制 ---------- */
  function copyText(t) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? res() : rej();
    });
  }
  document.querySelectorAll('.contact-card[data-copy]').forEach(function (card) {
    card.addEventListener('click', function () {
      var href = card.getAttribute('href');
      copyText(card.getAttribute('data-copy')).then(function () {
        var tip = card.querySelector('.copy-toast');
        if (!tip) {
          tip = document.createElement('span');
          tip.className = 'copy-toast';
          card.appendChild(tip);
        }
        tip.textContent = '已复制';
        tip.classList.add('show');
        clearTimeout(tip._t);
        tip._t = setTimeout(function () { tip.classList.remove('show'); }, 1400);
      }).catch(function () {
        if (href) window.location.href = href;
      });
    });
  });

})();
