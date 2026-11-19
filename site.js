/* douglasweant.com — pilot-slice enhancements.
   Progressive enhancement only: every page is complete without this file.
   Mounts the Fleet pieces that live on the home page (the daily challenge
   and the signal buoys) using the site's existing component scripts and a
   locally vendored React 18.3.1. The static text stays in place until a
   mount succeeds. */
(function () {
  'use strict';

  /* Legacy Fleet hashes that live on this page: #03 daily watch,
     #04 signal buoys, #06 contact. (Cross-page hashes are redirected
     by the inline shim in the home page head.) */
  var ANCHORS = { '#03': 'daily-watch', '#04': 'signals', '#06': 'contact' };
  function scrollToHash() {
    var id = ANCHORS[location.hash];
    if (!id) return;
    var el = document.getElementById(id);
    if (el) el.scrollIntoView();
  }

  /* Buoy panel actions navigate with the old channel numbers; map them
     to where those channels live now. */
  var DEST = {
    '01': '/about/#log',
    '02': '/about/#worktable',
    '03': '/#daily-watch',
    '04': '/#signals',
    '05': '/about/#saga',
    '06': '/#contact'
  };
  function go(id) {
    if (DEST[id]) location.href = DEST[id];
  }

  function Signals() {
    var R = window.React;
    var canvasRef = R.useRef(null);
    var state = R.useState(false);
    return R.createElement(window.SignalBuoys, {
      React: R,
      canvasRef: canvasRef,
      broadcasting: state[0],
      onBroadcast: state[1],
      onNavigate: go
    });
  }

  function mount() {
    scrollToHash();
    var R = window.React;
    var RD = window.ReactDOM;
    if (!R || !RD) return;

    var challengeHost = document.getElementById('challenge-root');
    if (challengeHost && window.DailyChallenge) {
      RD.createRoot(challengeHost).render(
        R.createElement(window.DailyChallenge, { React: R })
      );
    }

    var signalsHost = document.getElementById('signals-root');
    if (signalsHost && window.SignalBuoys) {
      RD.createRoot(signalsHost).render(R.createElement(Signals));
      var fallback = document.getElementById('signals-static');
      if (fallback) fallback.hidden = true;
    }

    /* The buoy mount changes the page height; re-check the legacy hash
       now that the interactive section exists. */
    scrollToHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
