// douglasweant.com — shared behavior: mobile nav, reveal on scroll, matrix rain
(function(){
  "use strict";

  // ── Mobile nav ──
  var nav = document.getElementById('siteNav');
  var btn = document.getElementById('navToggle');
  if (nav && btn) {
    btn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.getElementById('navLinks').addEventListener('click', function(e){
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Reveal on scroll ──
  var panels = document.querySelectorAll('.panel');
  if (!('IntersectionObserver' in window)) {
    panels.forEach(function(p){ p.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: .1 });
    panels.forEach(function(p){ io.observe(p); });
  }

  // ── Subtle matrix rain ──
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var c = document.getElementById('matrix');
  if (!c) return;
  var ctx = c.getContext('2d');
  var chars = '01アイタ<>+*#'.split('');
  var fs = 15, cols = 0, drops = [];
  function size(){
    c.width = window.innerWidth; c.height = window.innerHeight;
    cols = Math.floor(c.width / fs);
    drops = Array.from({ length: cols }, function(){ return Math.random() * -40; });
  }
  size();
  window.addEventListener('resize', size);
  ctx.font = fs + 'px ui-monospace, Menlo, monospace';
  setInterval(function(){
    ctx.fillStyle = 'rgba(10,14,23,.12)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#50fa7b';
    for (var i = 0; i < drops.length; i++) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fs, drops[i] * fs);
      if (drops[i] * fs > c.height && Math.random() > .978) drops[i] = 0;
      drops[i]++;
    }
  }, 66);
})();
