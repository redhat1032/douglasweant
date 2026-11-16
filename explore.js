/* Mount the existing fleet experiences. React is vendored locally (18.3.1, MIT). */
(function () {
  var DEST = {
    '01': '/explore/log/',
    '02': '/explore/worktable/',
    '03': '/challenge/',
    '04': '/explore/signals/',
    '05': '/explore/longship/',
    '06': '/contact/'
  };
  var STANZAS = [
    {"rune":"ᚹ","text":"Douglas stood watch upon the water, signal lamp in hand. The first task was to notice, understand, and communicate."},
    {"rune":"ᛗ","text":"From Navy service to Air Force Security Forces – CATM, the work returned to protection, preparation, and judgment."},
    {"rune":"ᚱ","text":"In food manufacturing and R&D, the questions became practical: what changed, why did it change, and what happens next?"},
    {"rune":"ᚦ","text":"Study opened another workshop: cybersecurity, computer science, and the patient work of turning an idea into something that holds up."},
    {"rune":"ᚺ","text":"Now the questions reach into AI: how does it shape human judgment, and what happens when an adversary enters the picture?"},
    {"rune":"ᛟ","text":"The next horizon is doctoral research and technology that protects people. Different tools, the same reason to stand watch."}
  ];

  function go(id) {
    if (DEST[id]) location.href = DEST[id];
  }

  function paintOcean(canvas) {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');
    var raf = 0;
    var t = 0;
    function size() {
      var rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(rect.width * 2));
      canvas.height = Math.max(2, Math.round(rect.height * 2));
    }
    function frame() {
      t += reduce ? 0 : 0.015;
      var w = canvas.width;
      var h = canvas.height;
      ctx.fillStyle = '#101614';
      ctx.fillRect(0, 0, w, h);
      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#101614');
      g.addColorStop(0.55, '#1a2c26');
      g.addColorStop(1, 'rgba(240,193,75,0.08)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(240,193,75,0.28)';
      ctx.lineWidth = 1;
      var waves = 5;
      for (var i = 0; i < waves; i++) {
        ctx.beginPath();
        for (var x = 0; x < w; x += 4) {
          var y = h * 0.42 + i * (h * 0.08) + Math.sin(x * 0.008 + t + i) * (h * 0.03) + Math.sin(x * 0.003 - t * 0.7) * (h * 0.04);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    size();
    frame();
    window.addEventListener('resize', function () { size(); if (reduce) frame(); });
    return function () { cancelAnimationFrame(raf); };
  }

  function Signals() {
    var R = window.React;
    var canvasRef = R.useRef(null);
    var state = R.useState(false);
    R.useEffect(function () {
      if (!canvasRef.current) return undefined;
      return paintOcean(canvasRef.current);
    }, []);
    return R.createElement(window.SignalBuoys, {
      React: R,
      canvasRef: canvasRef,
      broadcasting: state[0],
      onBroadcast: state[1],
      onNavigate: go
    });
  }

  window.mountExplore = function (name) {
    var R = window.React;
    var host = document.getElementById('explore-root');
    if (!R || !window.ReactDOM || !host) return;
    var node = null;
    if (name === 'log') node = R.createElement(window.FlightRecorder, {React: R, onNavigate: go});
    else if (name === 'worktable') node = R.createElement(window.WarRoom, {React: R, onNavigate: go});
    else if (name === 'signals') node = R.createElement(Signals);
    else if (name === 'longship') node = R.createElement(window.Longship, {React: R, stanzas: STANZAS});
    else if (name === 'challenge') node = R.createElement(window.DailyChallenge, {React: R});
    if (node) window.ReactDOM.createRoot(host).render(node);
  };
})();
