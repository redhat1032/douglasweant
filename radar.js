/* douglasweant.com v2 — CIC plot. Zero dependencies.
   Layers: WebGL phosphor scope (CSS fallback), sections as radar contacts,
   sweep-lit headline, active-sonar ping, decrypt reveals, Morse signal lamp,
   and a keyboard CIC console. Everything degrades to plain readable HTML. */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduce = !!(mq && mq.matches);
  var TAU = Math.PI * 2;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- contacts (from the semantic nav) ---------- */
  var plot = $("#plot");
  var links = $$("#plot a");
  var contacts = links.map(function (a) {
    var li = a.parentNode, st = li.getAttribute("style") || "";
    var brg = parseFloat((st.match(/--brg:\s*([\d.]+)/) || [0, 0])[1]) * Math.PI / 180;
    var rng = parseFloat((st.match(/--rng:\s*([\d.]+)/) || [0, 0.5])[1]);
    return { a: a, brg: brg, rng: rng, hostile: a.classList.contains("hostile"), id: a.getAttribute("href").slice(1), t: 0 };
  });

  function paint(c) {
    c.a.classList.add("painted");
    clearTimeout(c.t);
    c.t = setTimeout(function () { c.a.classList.remove("painted"); }, 140);
  }

  /* ---------- geometry: hero plot -> background scope as you scroll ---------- */
  var vw = 0, vh = 0, heroH = 1, plotBox = { x: 0, y: 0, r: 100 }, geo = { x: 0, y: 0, r: 100 };
  var hero = $(".hero"), h1 = $("#name"), phos = $(".h1-phosphor");
  function measure() {
    vw = window.innerWidth; vh = window.innerHeight;
    var r = plot.getBoundingClientRect();
    plotBox = { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY, r: r.width / 2 };
    heroH = hero.offsetHeight || vh;
  }
  function geometry() {
    var sy = window.scrollY, pr0 = plot.getBoundingClientRect();
    plotBox = { x: pr0.left + pr0.width / 2, y: pr0.top + pr0.height / 2 + sy, r: pr0.width / 2 };
    var start = Math.max(0, plotBox.y - vh * 0.5);
    var p = Math.min(1, Math.max(0, (sy - start) / (vh * 0.75)));
    p = p * p * (3 - 2 * p);
    var mobile = vw < 860;
    var tx = mobile ? vw * 0.5 : vw * 0.8, ty = vh * 0.5, tr = mobile ? Math.max(vw, vh) * 0.55 : Math.max(vw * 0.42, vh * 0.62);
    geo.x = plotBox.x + (tx - plotBox.x) * p;
    geo.y = (plotBox.y - sy) + (ty - (plotBox.y - sy)) * p;
    geo.r = plotBox.r + (tr - plotBox.r) * p;
    geo.p = p;
    return geo;
  }

  /* ---------- section tracking: lock the active contact ---------- */
  var lockIdx = -1, rangeEl = $("#range"), RANGES = [12, 12, 24, 24, 48, 48, 96, 96];
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = -1;
        contacts.forEach(function (c, k) { if (c.id === e.target.id) i = k; });
        lockIdx = i;
        contacts.forEach(function (c, k) { c.a.classList.toggle("locked", k === i); });
        $$(".panel").forEach(function (p) { p.classList.toggle("active", p === e.target); });
        if (rangeEl) rangeEl.textContent = RANGES[i + 1] || 12;
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    $$(".panel").forEach(function (p) { io.observe(p); });
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { lockIdx = -1; contacts.forEach(function (c) { c.a.classList.remove("locked"); }); if (rangeEl) rangeEl.textContent = 12; }
    }, { rootMargin: "-45% 0px -45% 0px" }).observe(hero);
  }

  /* ---------- clock + Morse lamp ---------- */
  var clock = $("#clock");
  function tick() {
    var d = new Date();
    clock.textContent = "CIC · " + d.toISOString().slice(11, 19) + "Z";
  }
  tick(); setInterval(tick, 1000);
  if (!reduce) {
    // D = -..   W = .--   (1 unit = 170 ms; dash 3, gap 1, letter gap 3, word gap 7)
    var seq = [3, 1, 1, 1, 1, 3, 1, 1, 3, 1, 3, 7], lamp = $("#lamp"), si = 0;
    (function blink() {
      var on = si % 2 === 0;
      lamp.classList.toggle("on", on);
      setTimeout(blink, seq[si] * 170);
      si = (si + 1) % seq.length;
    })();
  }

  /* ---------- decrypt reveals ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var GLY = "01<>/\\#%*+=?ABCDEF";
    var dio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        dio.unobserve(e.target);
        var el = e.target, txt = el.getAttribute("aria-label"), n = txt.length, t0 = performance.now(), dur = Math.min(900, 300 + n * 18);
        el.classList.add("scrambling");
        (function step(now) {
          var k = Math.floor(((now - t0) / dur) * n), out = "";
          for (var i = 0; i < n; i++) out += i < k || txt[i] === " " ? txt[i] : GLY[(Math.random() * GLY.length) | 0];
          el.firstChild.nodeValue = out;
          if (k < n) requestAnimationFrame(step); else { el.firstChild.nodeValue = txt; el.classList.remove("scrambling"); }
        })(t0);
      });
    }, { threshold: 0.6 });
    $$("[data-decrypt]").forEach(function (h) {
      if (h.childNodes.length !== 1 || h.firstChild.nodeType !== 3) return;
      h.setAttribute("aria-label", h.textContent);
      dio.observe(h);
    });
  }

  /* ---------- ping (+ optional sound) ---------- */
  var pingT = -1, audio = null, soundOn = false, soundBtn = $("#sound");
  soundBtn.addEventListener("click", function () {
    soundOn = !soundOn;
    soundBtn.setAttribute("aria-pressed", soundOn);
    soundBtn.textContent = soundOn ? "Sound on" : "Sound off";
  });
  function pingSound() {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var t = audio.currentTime;
      [0, 0.9].forEach(function (dt, i) {
        var o = audio.createOscillator(), g = audio.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(1180, t + dt);
        g.gain.setValueAtTime(0.0001, t + dt);
        g.gain.exponentialRampToValueAtTime(i ? 0.035 : 0.12, t + dt + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dt + (i ? 0.9 : 1.6));
        o.connect(g).connect(audio.destination); o.start(t + dt); o.stop(t + dt + 1.7);
      });
    } catch (e) { /* audio is optional */ }
  }
  function ping() { pingT = performance.now(); pingSound(); contacts.forEach(function (c) { c.pinged = false; }); }
  $("#ping").addEventListener("click", ping);

  /* ---------- CIC console ---------- */
  var dlg = $("#cic"), out = $("#cic-out"), inp = $("#cic-in");
  function say(t, cls) { var p = document.createElement("div"); if (cls) p.className = cls; p.textContent = t; out.appendChild(p); out.scrollTop = out.scrollHeight; }
  function sectionText(id) {
    var s = document.getElementById(id); if (!s) return "";
    var els = $$("h2,h3,p:not(.track),li,pre", s).filter(function (el) { return !el.querySelector("h3,p,li,pre"); });
    return els.map(function (el) { var t = el.textContent.replace(/\s+/g, " ").trim(); return el.tagName === "H3" ? "\n■ " + t : el.tagName === "H2" ? t : "  " + t; }).join("\n");
  }
  var CMDS = {
    help: function () { say("whoami  short  work  foundation  showcase  outside  certs  contact\ngoto t-01..t-07   ping   clear   exit"); },
    whoami: function () { say("Douglas Robert Weant\nI build for the moments when systems are most needed.\nbuilds   software · systems · hardware\nday job  R&D leadership, food manufacturing\nnow      MS Computer Science (AI/ML), WGU"); },
    short: function () { say(sectionText("short")); }, work: function () { say(sectionText("work")); },
    foundation: function () { say(sectionText("foundation")); }, showcase: function () { say(sectionText("showcase")); },
    outside: function () { say(sectionText("outside")); }, certs: function () { say(sectionText("creds")); },
    contact: function () { say("dweant@proton.me\nPGP DA37 81CC FFE4 8F08 B6AF F5F9 640A 90CF 4215 36DE"); },
    ping: function () { ping(); say("Active ping transmitted. Listen for returns."); },
    clear: function () { out.textContent = ""; },
    exit: function () { dlg.close(); },
    sudo: function () { say("Permission denied."); }
  };
  function openCic() {
    if (!dlg.open) {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      if (!out.childNodes.length) say("CIC CONSOLE · TRACK 0001 · type 'help'");
      inp.focus();
    }
  }
  $("#open-cic").addEventListener("click", openCic);
  $("#cic-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var raw = inp.value.trim(); inp.value = ""; if (!raw) return;
    say("> " + raw, "u");
    var parts = raw.toLowerCase().split(/\s+/), cmd = parts[0];
    if (cmd === "goto") {
      var c = contacts.filter(function (x) { return x.a.dataset.track.toLowerCase() === parts[1]; })[0];
      if (c) { dlg.close(); location.hash = c.id; } else say("No such track. Try goto t-03.");
    } else if (CMDS[cmd]) CMDS[cmd](); else say("Unknown command: " + cmd + ". Type help.");
  });
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    if (e.key === "`" || e.key === "~") { e.preventDefault(); openCic(); }
    else if (e.key === "p" || e.key === "P") ping();
  });

  /* ---------- scope renderer ---------- */
  var canvas = $("#scope"), fb = $(".scope-fallback"), gl = null, prog, U = {};
  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision mediump float;",
    "uniform vec2 uC;uniform float uR,uSw,uT,uPing,uS,uDim;uniform vec4 uB[7];",
    "const float TAU=6.2831853;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "void main(){",
    " vec2 f=gl_FragCoord.xy/uS; vec2 p=f-uC; float r=length(p); float rn=r/uR;",
    " float a=atan(p.x,p.y); if(a<0.)a+=TAU;",
    " float d=mod(uSw-a,TAU); float inS=step(rn,1.);",
    " float trail=exp(-d*2.4)*inS;",
    " float beam=(1.-smoothstep(0.,.025,d))*(inS+(1.-inS)*.18*exp(-(rn-1.)*1.5));",
    " float k=rn*4.; float rp=abs(k-floor(k+.5))*uR/4.; float ring=(1.-smoothstep(0.,1.4,rp))*step(rn,1.01);",
    " float sp=TAU/12.; float spk=abs(fract(a/sp+.5)-.5)*sp*r; float spoke=(1.-smoothstep(0.,1.,spk))*inS*step(.04,rn);",
    " float rim=1.-smoothstep(0.,2.,abs(r-uR));",
    " float n=h(floor(f/2.5)); float cl=step(.992,n)*trail*1.4 + exp(-rn*7.)*h(floor(f/2.)+floor(uT*6.))*trail*.9;",
    " vec2 g=mod(f,36.)-18.; float dots=(1.-smoothstep(0.,1.2,length(g)))*.05*(1.-inS);",
    " vec3 G=vec3(.47,1.,.71), A=vec3(1.,.7,.28);",
    " vec3 col=G*(trail*.2+beam*.55+ring*.28+spoke*.08+rim*.5+cl+dots);",
    " for(int i=0;i<7;i++){ vec4 b=uB[i]; vec2 q=f-b.xy; vec2 bp=b.xy-uC; float ba=atan(bp.x,bp.y); if(ba<0.)ba+=TAU;",
    "  float bd=mod(uSw-ba,TAU); float ph=exp(-bd*.9); float gg=exp(-dot(q,q)/(18.+b.w*30.));",
    "  float halo=(1.-smoothstep(0.,1.5,abs(length(q)-14.)))*b.w;",
    "  col+=mix(G,A,b.z)*(gg*(.35+ph*2.2)+halo*.8); }",
    " if(uPing>0.){ float pr=abs(r-uPing); float pf=1.-uPing/(uR*1.7); col+=G*(1.-smoothstep(0.,3.,pr))*max(pf,0.)*.9 + G*exp(-pr*.05)*step(r,uPing)*max(pf,0.)*.06; }",
    " col*=uDim; col+=vec3(.012,.031,.027);",
    " gl_FragColor=vec4(col,1.);",
    "}"
  ].join("\n");

  function initGL() {
    if (reduce || !canvas) return false;
    try { gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }); } catch (e) { gl = null; }
    if (!gl) return false;
    // Software rasterizers (SwiftShader, llvmpipe) would burn the CPU; use the CSS scope instead.
    var dbg = gl.getExtension("WEBGL_debug_renderer_info");
    var ren = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|basic render/i.test(ren) && !/[?&]gl=1/.test(location.search)) { gl = null; return false; }
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null; }
    var v = sh(gl.VERTEX_SHADER, VS), f = sh(gl.FRAGMENT_SHADER, FS);
    if (!v || !f) return false;
    prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ["uC", "uR", "uSw", "uT", "uPing", "uS", "uDim", "uB"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); gl = null; doc.classList.remove("gl"); });
    return true;
  }

  var scale = 1;
  function resize() {
    measure();
    if (gl) {
      scale = Math.min(window.devicePixelRatio || 1, 1.5) * (vw * vh > 1.6e6 ? 0.6 : 0.8);
      canvas.width = Math.round(vw * scale); canvas.height = Math.round(vh * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  var useGL = false;
  window.addEventListener("resize", resize);
  resize();

  var SPEED = TAU / 6, t0 = performance.now(), lastSw = 0, blipArr = new Float32Array(28), running = true;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) requestAnimationFrame(frame); });

  function frame(now) {
    if (!running) return;
    var g = geometry(), t = (now - t0) / 1000, sw = (t * SPEED) % TAU;
    var hr = gl && g.p < 1 && phos ? h1.getBoundingClientRect() : null;
    // paint contacts as the beam passes them
    contacts.forEach(function (c) {
      var crossed = lastSw <= sw ? c.brg > lastSw && c.brg <= sw : c.brg > lastSw || c.brg <= sw;
      if (crossed) paint(c);
    });
    var pr = -1;
    if (pingT > 0) {
      pr = ((now - pingT) / 1000) * g.r * 0.9;
      if (pr > g.r * 1.7) pingT = -1;
      contacts.forEach(function (c) { if (!c.pinged && pr >= c.rng * g.r) { c.pinged = true; paint(c); } });
    }
    lastSw = sw;
    if (gl) {
      var H = vh;
      contacts.forEach(function (c, i) {
        blipArr[i * 4] = g.x + Math.sin(c.brg) * c.rng * g.r;
        blipArr[i * 4 + 1] = (H - g.y) + Math.cos(c.brg) * c.rng * g.r;
        blipArr[i * 4 + 2] = c.hostile ? 1 : 0;
        blipArr[i * 4 + 3] = i === lockIdx ? 1 : 0;
      });
      gl.uniform2f(U.uC, g.x, H - g.y); gl.uniform1f(U.uR, g.r); gl.uniform1f(U.uSw, sw);
      gl.uniform1f(U.uT, t); gl.uniform1f(U.uPing, pr); gl.uniform1f(U.uS, scale);
      gl.uniform1f(U.uDim, 1 - g.p * 0.45); gl.uniform4fv(U.uB, blipArr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // the beam escapes the scope and lights the name
      if (hr) {
        var cx = g.x - hr.left, cy = g.y - hr.top;
        var deg = sw * 180 / Math.PI;
        phos.style.setProperty("--beam", "conic-gradient(from " + (deg - 70).toFixed(1) + "deg at " + cx.toFixed(0) + "px " + cy.toFixed(0) + "px,transparent,rgba(0,0,0,.25) 50deg,#000 69deg,transparent 70deg)");
      }
    } else {
      fb.style.setProperty("--sw", (sw * 180 / Math.PI).toFixed(1) + "deg");
      fb.style.setProperty("--cx", g.x.toFixed(0) + "px");
      fb.style.setProperty("--cy", g.y.toFixed(0) + "px");
      fb.style.setProperty("--plot", (g.r * 2).toFixed(0) + "px");
    }
    requestAnimationFrame(frame);
  }

  if (reduce) {
    // Still frame: align the static CSS scope with the plot, no animation.
    var still = function () { measure(); var g = geometry(); fb.style.setProperty("--cx", g.x.toFixed(0) + "px"); fb.style.setProperty("--cy", g.y.toFixed(0) + "px"); fb.style.setProperty("--plot", (g.r * 2).toFixed(0) + "px"); };
    still(); window.addEventListener("resize", still); window.addEventListener("scroll", still, { passive: true });
    $("#ping").addEventListener("click", function () { contacts.forEach(paint); });
  } else {
    var start = function () {
      useGL = initGL();
      if (useGL) { doc.classList.add("gl"); resize(); } else fb.classList.add("driven");
      requestAnimationFrame(frame);
    };
    var idle = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(start, { timeout: 1500 }); };
    if (document.readyState === "complete") idle(); else window.addEventListener("load", idle);
  }
  if (mq && mq.addEventListener) mq.addEventListener("change", function () { location.reload(); });
})();
