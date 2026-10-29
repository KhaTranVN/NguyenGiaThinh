/* Nạp dữ liệu các môn từ thư mục data/ rồi khởi động ứng dụng.
   Hoạt động cả khi mở trực tiếp file index.html (không cần máy chủ). */
(function () {
  var SIZE = 25;                       // số câu mỗi phần (đừng đổi sau khi đã có người học: tiến độ lưu theo số thứ tự phần)
  var files = window.MON_FILES || [];
  function split(items) {
    var n = items.length, k = Math.max(1, Math.round(n / SIZE)), base = Math.floor(n / k), ex = n % k, out = [], i = 0;
    for (var x = 0; x < k; x++) { var st = base + (x < ex ? 1 : 0); out.push(items.slice(i, i + st)); i += st; }
    return out;
  }
  function finish() {
    files.forEach(function (id) {
      var m = (window.MON_HOC || []).filter(function (x) { return x.id === id; })[0];
      if (!m) return;
      m.parts = split(m.q).map(function (p) { return { s: p[0][0], e: p[p.length - 1][0], q: p }; });
      delete m.q; SUBJ.push(m);
    });
    if (!SUBJ.length) { document.getElementById('app').innerHTML = '<p style="padding:24px">Không tải được dữ liệu trong thư mục data/. Hãy kiểm tra data/manifest.js.</p>'; return; }
    startApp();
  }
  function load(i) {
    if (i >= files.length) return finish();
    if ((window.MON_HOC || []).some(function (x) { return x.id === files[i]; })) return load(i + 1);   // đã có sẵn (bản một file)
    var s = document.createElement('script'); s.src = 'data/' + files[i] + '.js';
    s.onload = function () { load(i + 1); }; s.onerror = function () { console.warn('Không tải được data/' + files[i] + '.js'); load(i + 1); };
    document.head.appendChild(s);
  }
  load(0);
})();
