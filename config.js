window.SN_CFG = {
  apiKey: "AIzaSyApVMOhok9th2BKiPeCzLlOyWlblNjwso4",
  authDomain: "studynest-fb30d.firebaseapp.com",
  projectId: "studynest-fb30d",
  storageBucket: "studynest-fb30d.firebasestorage.app",
  messagingSenderId: "272215015380",
  appId: "1:272215015380:web:c597b70a7c1031e7c12041"
};
window.SN_ADMIN = "awajisusende@gmail.com";
window.addEventListener('load', function () {
  window.shrink = function (f, cb) {
    if (!f) return cb('');
    var u = URL.createObjectURL(f), i = new Image();
    i.onload = function () {
      var c = document.createElement('canvas'), z = Math.min(1, 480 / Math.max(i.width, i.height));
      c.width = i.width * z; c.height = i.height * z;
      c.getContext('2d').drawImage(i, 0, 0, c.width, c.height);
      URL.revokeObjectURL(u); cb(c.toDataURL('image/jpeg', .7));
    };
    i.onerror = function () { alert('Could not read that picture. Please choose a JPG or PNG photo.'); cb(''); };
    i.src = u;
  };
  window.sync = function () {
    var u = auth.currentUser;
    me = u ? D.users.find(function (x) { return x.id == u.uid; }) || null : null;
    if (me && me.banned) { auth.signOut(); alert('This account has been banned.'); return; }
    if (me && isAdm() && qEmpty) { qEmpty = false; save(); }
    var f = document.activeElement;
    if (f && /INPUT|TEXTAREA|SELECT/.test(f.tagName)) return;
    if ([].slice.call(document.querySelectorAll('input[type=file]')).some(function (x) { return x.files.length; }) || ($('#pt') && $('#pt').value)) return;
    R();
  };
  window.sendf = function (i) {
    var f = i.files[0]; if (!f) return;
    var vid = f.type.startsWith('video');
    (vid ? up : shrink)(f, function (d) {
      if (!d) return;
      D.msgs.push({ c: view.c, u: me.id, txt: v('ct'), media: d, type: vid ? 'vid' : 'img', ts: Date.now() });
      save(); R();
    });
  };
});
new MutationObserver(function () {
  document.querySelectorAll('input[type=file]').forEach(function (x) {
    if (!x.hasAttribute('capture') && x.hasAttribute('accept')) x.removeAttribute('accept');
  });
}).observe(document.documentElement, { childList: true, subtree: true });
var ms=document.createElement('script');ms.src='mock.js?v=1';document.head.appendChild(ms);
