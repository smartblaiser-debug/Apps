var t0 = setInterval(function () {
  if (typeof R != 'function' || typeof home != 'function' || typeof prac != 'function') return;
  clearInterval(t0);
  var op = window.prac, oh = window.home, mk = null, iv = null;
  function fmt(l) { l = Math.max(0, Math.floor(l / 1000)); return ('0' + Math.floor(l / 60)).slice(-2) + ':' + ('0' + l % 60).slice(-2); }
  function tick() { var l = mk ? mk.end - Date.now() : 0, t = document.getElementById('tm'); if (t) t.textContent = fmt(l); if (l <= 0 && mk && !mk.done) mkFin(); }
  function rec(x) { x.ts = Date.now(); me.hist = (me.hist || []).concat([x]).slice(-60); save(); }
  function remark(p) { return p >= 70 ? 'Excellent! You are exam ready.' : p >= 50 ? 'Good effort. Keep practising.' : 'Keep practising and review your weak subjects.'; }
  function bars(o) { return Object.keys(o).map(function (s) { var p = Math.round(o[s].c / o[s].t * 100); return '<div style="margin:10px 0"><div class="row"><span class="sp">' + e(s) + '</span><b>' + p + '%</b></div><div class="pg"><i style="width:' + p + '%;background:' + (p >= 70 ? '#16a34a' : p >= 50 ? '#f59e0b' : '#dc2626') + '"></i></div></div>'; }).join(''); }
  window.tg = function (s, c) { var a = view.ms || ['English', 'Mathematics']; view.ms = c ? a.concat(s).filter(function (x, i, r) { return r.indexOf(x) == i; }) : a.filter(function (x) { return x != s; }); };
  window.mkStart = function () {
    var ms = view.ms || ['English', 'Mathematics'], qs = [];
    if (!ms.length) return alert('Choose at least one subject');
    ms.forEach(function (s) { (D.qs[s] || []).forEach(function (q) { qs.push({ s: s, q: q.q, o: q.o, a: q.a }); }); });
    qs.sort(function () { return Math.random() - .5; });
    mk = { ex: view.mx || 'JAMB', qs: qs, a: [], i: 0, end: Date.now() + (view.mt || 30) * 60000, done: 0 };
    clearInterval(iv); iv = setInterval(tick, 1000); R();
  };
  window.mkAns = function (k) { mk.a[mk.i] = k; R(); };
  window.mkGo = function (d) { mk.i = Math.max(0, Math.min(mk.qs.length - 1, mk.i + d)); R(); };
  window.mkReset = function () { mk = null; R(); };
  window.mkFin = function () {
    if (!mk || mk.done) return;
    clearInterval(iv);
    var sub = {}, c = 0;
    mk.qs.forEach(function (q, i) { var s = sub[q.s] = sub[q.s] || { c: 0, t: 0 }; s.t++; if (mk.a[i] === q.a) { s.c++; c++; } });
    mk.done = 1; mk.sc = c; mk.sub = sub;
    rec({ t: 'mock', ex: mk.ex, c: c, n: mk.qs.length, sub: sub });
    view.pm = 'm'; tab = 'prac'; R();
  };
  function mockView() {
    if (mk && mk.done) {
      var p = Math.round(mk.sc / mk.qs.length * 100);
      return '<div class="card hero"><div class="m">' + mk.ex + ' Mock Exam</div><h1 class="big">' + p + '%</h1><div>' + mk.sc + ' of ' + mk.qs.length + ' correct' + (mk.ex == 'JAMB' ? ' · JAMB-style score ' + Math.round(p * 4) + '/400' : '') + '</div><p class="m">' + remark(p) + '</p></div><div class="card"><b>By subject</b>' + bars(mk.sub) + '</div><div class="row"><button class="sp" onclick="mkReset()">New exam</button><button class="g sp" onclick="mkReset();view.pm=\'s\';R()">My history</button></div>';
    }
    if (mk) {
      var q = mk.qs[mk.i], n = mk.qs.length;
      return '<div class="card row" style="position:sticky;top:56px;z-index:4"><b class="sp">' + mk.ex + ' Mock</b><b id="tm" style="font-size:22px;color:#ea580c">' + fmt(mk.end - Date.now()) + '</b></div><div class="m">' + e(q.s) + ' · Question ' + (mk.i + 1) + ' of ' + n + '</div><div class="pg"><i style="width:' + (mk.i + 1) / n * 100 + '%"></i></div><div class="card"><b>' + e(q.q) + '</b>' + q.o.map(function (o, k) { return '<button class="opt" style="' + (mk.a[mk.i] === k ? 'background:var(--g);color:#fff' : '') + '" onclick="mkAns(' + k + ')">' + 'ABCD'[k] + '. ' + e(o) + '</button>'; }).join('') + '</div><div class="row"><button class="g" onclick="mkGo(-1)">Previous</button><span class="sp"></span>' + (mk.i < n - 1 ? '<button onclick="mkGo(1)">Next</button>' : '') + '</div><p class="m">Answered ' + mk.a.filter(function (x) { return x !== undefined; }).length + ' of ' + n + '</p><button class="g" style="width:100%" onclick="if(confirm(\'Submit your exam now?\'))mkFin()">Submit exam</button>';
    }
    var sel = view.ms || ['English', 'Mathematics'];
    return '<div class="card"><b>Exam</b><div class="row" style="margin:8px 0">' + ['JAMB', 'WAEC', 'NECO'].map(function (x) { return '<span class="pill ' + ((view.mx || 'JAMB') == x ? 'on' : '') + '" onclick="view.mx=\'' + x + '\';R()">' + x + '</span>'; }).join('') + '</div><b>Subjects</b>' + Object.keys(D.qs).map(function (s) { return '<label class="row" style="margin:6px 0"><input type="checkbox" style="width:auto" ' + (sel.indexOf(s) > -1 ? 'checked' : '') + ' onchange="tg(\'' + s + '\',this.checked)"> ' + e(s) + ' <span class="m">(' + D.qs[s].length + ' questions)</span></label>'; }).join('') + '<b>Time (minutes)</b><input type="number" min="1" value="' + (view.mt || 30) + '" oninput="view.mt=+this.value"><button style="width:100%;margin-top:8px" onclick="mkStart()">Start exam</button></div>';
  }
  function stats() {
    var h = me.hist || [];
    if (!h.length) return '<div class="card m">No results yet. Take a practice quiz or a mock exam and your performance will appear here.</div>';
    var tc = 0, tn = 0, best = 0, agg = {};
    h.forEach(function (x) { tc += x.c; tn += x.n; best = Math.max(best, Math.round(x.c / x.n * 100)); for (var s in x.sub) { var g = agg[s] = agg[s] || { c: 0, t: 0 }; g.c += x.sub[s].c; g.t += x.sub[s].t; } });
    var weak = Object.keys(agg).sort(function (a, b) { return agg[a].c / agg[a].t - agg[b].c / agg[b].t; })[0];
    return '<div class="st"><div><b>' + h.length + '</b><span>Attempts</span></div><div><b>' + Math.round(tc / tn * 100) + '%</b><span>Average</span></div><div><b>' + best + '%</b><span>Best</span></div></div><div class="card"><b>By subject</b>' + bars(agg) + '<p class="m">Focus on <b>' + e(weak) + '</b>, your weakest subject.</p></div><div class="sh">History</div>' + h.slice().reverse().map(function (x) { var p = Math.round(x.c / x.n * 100); return '<div class="card row" style="margin:8px 0"><div class="sp"><b>' + (x.t == 'mock' ? e(x.ex) + ' Mock Exam' : 'Practice · ' + e(Object.keys(x.sub)[0])) + '</b><div class="m">' + new Date(x.ts).toLocaleString() + '</div></div><b style="color:' + (p >= 50 ? '#16a34a' : '#dc2626') + '">' + x.c + '/' + x.n + ' · ' + p + '%</b></div>'; }).join('');
  }
  window.prac = function () {
    var m = view.pm || 'p';
    var hub = '<div class="row" style="margin:8px 0">' + [['p', 'Practice'], ['m', 'Mock Exam'], ['s', 'Performance']].map(function (x) { return '<span class="pill ' + (m == x[0] ? 'on' : '') + '" onclick="view.pm=\'' + x[0] + '\';R()">' + x[1] + '</span>'; }).join('') + '</div>';
    if (m == 'm') return hub + mockView();
    if (m == 's') return hub + stats();
    var h = op();
    if (qz && qz.sub) {
      var len = D.qs[qz.sub].length;
      if (qz.i >= len && !qz.saved) { qz.saved = 1; var sb = {}; sb[qz.sub] = { c: qz.sc, t: len }; rec({ t: 'practice', ex: qz.ex, c: qz.sc, n: len, sub: sb }); }
      else if (qz.i < len) qz.saved = 0;
    }
    return hub + h;
  };
  window.home = function () {
    var h = oh().replace(/onclick="qz=/g, 'onclick="view.pm=\'p\';qz=');
    return h + '<div class="sh">Test yourself</div><div class="gr"><div class="ex" style="--x:linear-gradient(135deg,#7c3aed,#ec4899)" onclick="view.pm=\'m\';tab=\'prac\';R()"><div class="ic">' + I.prac + '</div><b>Mock Exam</b><span>Timed, exam-style test</span><em>Start →</em></div><div class="ex" style="--x:linear-gradient(135deg,#0891b2,#2563eb)" onclick="view.pm=\'s\';tab=\'prac\';R()"><div class="ic">' + I.adm + '</div><b>My Performance</b><span>Scores, history, weak subjects</span><em>View →</em></div></div>';
  };
}, 50);
