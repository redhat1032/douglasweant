/* Shared header behavior: menu, theme, copy. */
(function () {
  var root = document.documentElement;
  var navBtn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navBtn && nav) {
    navBtn.addEventListener('click', function () {
      var open = navBtn.getAttribute('aria-expanded') === 'true';
      navBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navBtn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
      });
    });
  }

  var themeBtn = document.querySelector('.theme-toggle');
  function explicitTheme() {
    var t = root.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function paintThemeButton() {
    if (!themeBtn) return;
    var mode = explicitTheme();
    var next = mode === 'dark' ? 'light' : 'dark';
    themeBtn.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
    themeBtn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'light' ? '#f7f5f0' : '#101614');
  }
  if (themeBtn) {
    paintThemeButton();
    themeBtn.addEventListener('click', function () {
      var next = explicitTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('dw-theme', next); } catch (e) {}
      paintThemeButton();
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-copy'));
      var text = el ? el.textContent.trim() : '';
      var old = btn.textContent;
      var status = document.getElementById(btn.getAttribute('data-status') || '');
      function done(msg) {
        btn.textContent = msg;
        if (status) status.textContent = msg;
        setTimeout(function () { btn.textContent = old; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Select and copy'); });
      } else {
        done('Select and copy');
      }
    });
  });

  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (/^(https?:)?\/\//.test(href) || href.indexOf('mailto:') === 0) {
      if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
      var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
      ['noopener', 'noreferrer'].forEach(function (token) {
        if (rel.indexOf(token) === -1) rel.push(token);
      });
      a.setAttribute('rel', rel.join(' '));
    }
  });
})();
