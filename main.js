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

  /* ---------- 导出简历（打印为 PDF） ---------- */
  function exportResume() { window.print(); }
  var btn = document.getElementById('btnResume');
  if (btn) btn.addEventListener('click', exportResume);
  document.querySelectorAll('[data-resume]').forEach(function (el) {
    el.addEventListener('click', exportResume);
  });

  /* ---------- 8-bit 音效合成 ---------- */
  var actx = null;
  function tone(freq, dur, delay, type, vol) {
    try {
      if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      var t0 = actx.currentTime + (delay || 0);
      var osc = actx.createOscillator(), g = actx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(vol || 0.045, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(actx.destination);
      osc.start(t0); osc.stop(t0 + dur + 0.02);
    } catch (e) { /* 无声降级 */ }
  }
  var sfx = {
    coin: function () { tone(988, .09, 0); tone(1319, .16, .09); },
    slime: function () { tone(220, .12, 0, 'square', .05); tone(120, .14, .1, 'square', .05); },
    levelup: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, .14, i * .1); }); }
  };

  /* ---------- 像素烟花 ---------- */
  var boom = document.getElementById('fxBoom');
  var COLORS = ['#00e07f', '#ffc93c', '#2de2e6', '#ff6ac1', '#ff5a5a', '#fff'];
  function burst(x, y, n) {
    if (!boom) return;
    for (var i = 0; i < (n || 36); i++) {
      var p = document.createElement('i');
      p.className = 'fx-pix';
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.background = COLORS[(Math.random() * COLORS.length) | 0];
      boom.appendChild(p);
      var ang = Math.random() * Math.PI * 2, r = 60 + Math.random() * 190;
      var dx = Math.cos(ang) * r, dy = Math.sin(ang) * r;
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx * .65 + 'px,' + (dy * .65 - 46) + 'px) scale(1)', opacity: 1, offset: .55 },
        { transform: 'translate(' + dx + 'px,' + (dy + 90) + 'px) scale(.5)', opacity: 0 }
      ], { duration: 640 + Math.random() * 320, easing: 'cubic-bezier(.1,.6,.3,1)' }).onfinish = (function (el) { return function () { el.remove(); }; })(p);
    }
  }

  /* ---------- 金币收集 + 计分 HUD ---------- */
  var coinsBox = document.getElementById('fxCoins');
  var hudCount = document.getElementById('coinCount');
  var hud = document.querySelector('.hud');
  var banner = document.getElementById('levelBanner');
  var MILESTONES = [15, 50, 100, 200];
  var count = 0;
  try { count = parseInt(localStorage.getItem('hjw_coins') || '0', 10) || 0; } catch (e) {}

  function renderHud(flash) {
    if (hudCount) hudCount.textContent = '×' + (count < 100 ? ('0' + count).slice(-2) : count);
    if (hud && flash) { hud.classList.remove('flash'); void hud.offsetWidth; hud.classList.add('flash'); }
  }

  function floatText(x, y, txt, color) {
    var t = document.createElement('b');
    t.className = 'fx-pix';
    t.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:auto;background:none;color:' + (color || '#ffc93c') +
      ';font:800 13px "Microsoft YaHei",sans-serif;text-shadow:2px 2px 0 #0a0a16;white-space:nowrap;';
    t.textContent = txt;
    if (boom) {
      boom.appendChild(t);
      t.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-46px)', opacity: 0 }],
        { duration: 800, easing: 'steps(8)' }).onfinish = function () { t.remove(); };
    }
  }

  function milestoneCheck() {
    var idx = MILESTONES.indexOf(count);
    if (idx > -1) {
      sfx.levelup();
      if (banner) { banner.classList.remove('show'); void banner.offsetWidth; banner.classList.add('show'); }
      if (boom) {
        var w = window.innerWidth, h = window.innerHeight;
        [0, 260, 520].forEach(function (d) {
          setTimeout(function () { burst(w * (0.25 + Math.random() * .5), h * (.25 + Math.random() * .3), 44); }, d);
        });
      }
      document.body.classList.add('rainbow');
      setTimeout(function () { document.body.classList.remove('rainbow'); }, 3200);
    }
  }

  function spawnCoin(el) {
    var w = window.innerWidth, h = window.innerHeight;
    el.style.left = (16 + Math.random() * Math.max(w - 60, 100)) + 'px';
    el.style.top = (130 + Math.random() * Math.max(h - 240, 120)) + 'px';
  }

  if (coinsBox) {
    var N = window.innerWidth < 700 ? 4 : 5;
    for (var c = 0; c < N; c++) {
      var coin = document.createElement('span');
      coin.className = 'fx-coin';
      spawnCoin(coin);
      coin.addEventListener('click', function (ev) {
        var el = ev.currentTarget;
        count++; try { localStorage.setItem('hjw_coins', String(count)); } catch (e) {}
        renderHud(true); sfx.coin(); milestoneCheck();
        var r = el.getBoundingClientRect();
        floatText(r.left, r.top - 10, '+1');
        burst(r.left + 7, r.top + 7, 12);
        el.classList.add('pop');
        setTimeout(function () { spawnCoin(el); el.classList.remove('pop'); }, 420);
      });
      coinsBox.appendChild(coin);
    }
    renderHud(false);
  }

  /* ---------- 史莱姆 ---------- */
  ['slime1', 'slime2'].forEach(function (id) {
    var s = document.getElementById(id);
    if (!s) return;
    s.addEventListener('click', function (ev) {
      s.classList.add('squash'); sfx.slime();
      var r = s.getBoundingClientRect();
      burst(r.left + 13, r.top + 6, 14);
      if (Math.random() < .5) {
        count++; try { localStorage.setItem('hjw_coins', String(count)); } catch (e) {}
        renderHud(true); floatText(r.left, r.top - 14, '+1');
      }
      setTimeout(function () { s.classList.remove('squash'); }, 480);
    });
  });

  /* ---------- 鼠标像素轨迹（仅桌面） ---------- */
  if (window.matchMedia && matchMedia('(hover:hover)').matches) {
    var track = document.getElementById('fxTrack');
    var last = 0;
    if (track) {
      window.addEventListener('mousemove', function (ev) {
        var now = performance.now();
        if (now - last < 48) return;
        last = now;
        var p = document.createElement('i');
        p.className = 'fx-pix';
        p.style.left = (ev.clientX - 3) + 'px';
        p.style.top = (ev.clientY - 3) + 'px';
        p.style.background = COLORS[(Math.random() * COLORS.length) | 0];
        track.appendChild(p);
        p.animate([{ transform: 'translateY(0)', opacity: .45 }, { transform: 'translateY(14px)', opacity: 0 }],
          { duration: 460, easing: 'steps(5)' }).onfinish = function () { p.remove(); };
      }, { passive: true });
    }
  }

  /* ---------- Konami 彩蛋：↑↑↓↓←→←→BA ---------- */
  var SEQ = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var buf = [];
  window.addEventListener('keydown', function (ev) {
    var k = ev.key.length === 1 ? ev.key.toLowerCase() : ev.key;
    buf.push(k);
    if (buf.length > SEQ.length) buf.shift();
    if (SEQ.every(function (v, i) { return buf[i] === v; })) {
      buf = [];
      sfx.levelup();
      var w = window.innerWidth, h = window.innerHeight;
      [0, 180, 360, 540, 720].forEach(function (d) {
        setTimeout(function () { burst(w * Math.random(), h * Math.random() * .5 + 60, 40); }, d);
      });
      count += 30; try { localStorage.setItem('hjw_coins', String(count)); } catch (e) {}
      renderHud(true);
      if (banner) { banner.classList.remove('show'); void banner.offsetWidth; banner.textContent = '★ +30 COINS! ★'; banner.classList.add('show'); setTimeout(function () { banner.textContent = '★ LEVEL UP! ★'; }, 2400); }
    }
  });
})();
