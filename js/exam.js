/* Đề thi thử: chọn môn / số câu / thời gian → làm bài tính giờ → chấm điểm và xem lại.
   Đề gồm phần lớn câu lấy từ ngân hàng ôn tập, cộng thêm một số ít "câu mở rộng" (data/mo_rong.js).
   Cấu hình trong data/cau_hinh.js. */
const CH = Object.assign({ soCauMacDinh: 40, phutMacDinh: 45, tyLeMoRongToiDa: 0.1 }, window.CAU_HINH || {});
let EX = null, exTimer = null, exWrongOnly = false;
const ABC = "ABCDEF", mmss = s => pad(Math.floor(s / 60)) + ":" + pad(s % 60);
const subName = id => (SUBJ.find(s => s.id === id) || { name: id }).name;

/* ---- Tạo đề ---- */
function extQs(sids) {   // câu mở rộng hợp lệ thuộc các môn đã chọn
  return (window.CAU_MO_RONG || []).filter(e => e && sids.includes(e.mon) && e.stem && Array.isArray(e.opts) && e.opts.length >= 3 && e.opts.length <= 6 &&
    ABC.indexOf(e.ans) >= 0 && ABC.indexOf(e.ans) < e.opts.length)
    .map(e => ({ src: "mr", sid: e.mon, n: null, stem: e.stem, opts: e.opts, ans: ABC.indexOf(e.ans), note: e.note || "" }));
}
function baseQs(sids) {  // câu từ ngân hàng ôn tập; bỏ câu chưa rõ đáp án hoặc có cờ cảnh báo
  const o = [];
  SUBJ.filter(s => sids.includes(s.id)).forEach(s => s.parts.forEach(p => p.q.forEach(q => { if (q[3] >= 0 && !q[4]) o.push({ src: "on", sid: s.id, n: q[0], stem: q[1], opts: q[2], ans: q[3], note: "" }); })));
  return o;
}
const extCount = (nE, n) => Math.min(nE, Math.round(n * CH.tyLeMoRongToiDa));
function buildExam(sids, n, mins) {
  const B = baseQs(sids), E = extQs(sids), k = extCount(E.length, n), nb = Math.min(B.length, n - k);
  const items = shuf(shuf(B).slice(0, nb).concat(shuf(E).slice(0, k))).map(x => {
    let ord = x.opts.map((_, i) => i); if (shufflable([0, 0, x.opts])) ord = shuf(ord);
    return { src: x.src, sid: x.sid, n: x.n, stem: x.stem, opts: ord.map(i => x.opts[i]), ans: ord.indexOf(x.ans), note: x.note, pick: -1 };
  });
  const t = Date.now(); return { sids, mins, items, t0: t, end: t + mins * 60000, idx: 0, done: false };
}

/* ---- Lưu / khôi phục bài đang làm, đồng hồ ---- */
const exSave = () => { S.exRun = EX && !EX.done ? EX : null; save(); };
function examInit() { if (S.exRun && !S.exRun.done) { EX = S.exRun; if (Date.now() >= EX.end) submitExam(true); else startTimer(); } }
function startTimer() { clearInterval(exTimer); exTimer = setInterval(tick, 1000); }
function tick() {
  if (!EX || EX.done) { clearInterval(exTimer); return; }
  const left = Math.max(0, Math.round((EX.end - Date.now()) / 1000)), t = document.getElementById("exT");
  if (t) { t.textContent = mmss(left); t.classList.toggle("warn", left <= 300); }
  if (left <= 0) submitExam(true);
}
function submitExam(auto) {
  if (!EX || EX.done) return;
  EX.done = true; EX.t1 = Math.min(Date.now(), EX.end); EX.auto = !!auto; clearInterval(exTimer);
  EX.ok = EX.items.filter(x => x.pick === x.ans).length;
  S.exHist = [{ t: EX.t0, sids: EX.sids, n: EX.items.length, ok: EX.ok, used: Math.round((EX.t1 - EX.t0) / 1000), mins: EX.mins, nMr: EX.items.filter(x => x.src === "mr").length }].concat(S.exHist || []).slice(0, 20);
  S.exLast = EX; S.exRun = null; save();
  if (location.hash === "#thithu-lam") nav("#thithu-ketqua");
  if (EX.ok / EX.items.length >= .8) setTimeout(confetti, 300);
}

/* ---- Màn hình ---- */
function examCard() {
  const run = EX && !EX.done, last = (S.exHist || [])[0];
  return h("button", { class: "item exam", onclick: () => nav("#thithu") }, h("span", { class: "ic" }, "📝"),
    h("span", { class: "it" }, h("b", {}, "Đề thi thử"), h("small", {}, run ? "Đang có bài làm dở · bấm để tiếp tục" : (last ? "Lần gần nhất: " + last.ok + "/" + last.n + " câu" : "Tự chọn số câu và thời gian"))), ico("chev"));
}
function examRoute(h1) {
  SID = "";
  if (h1 === "#thithu-lam") { if (EX && !EX.done) return examRun(); return nav("#thithu"); }
  if (h1 === "#thithu-ketqua") { const R = EX && EX.done ? EX : S.exLast; if (R) return examResult(R); return nav("#thithu"); }
  examSetup();
}
function examSetup() {
  const st = S.exSet || (S.exSet = { sids: ["*"], n: CH.soCauMacDinh, min: CH.phutMacDinh }); let gu = false;
  const ids = () => st.sids.includes("*") ? SUBJ.map(s => s.id) : st.sids.filter(x => SUBJ.some(s => s.id === x));
  function draw() {
    const I = ids(), B = baseQs(I).length, E = extQs(I).length, n = Math.min(st.n, B + E), k = extCount(E, n);
    const chip = (t, on, f) => h("button", { class: "b" + (on ? " on" : ""), onclick: f }, t), run = EX && !EX.done;
    const numIn = (id, val, min, max) => h("input", { type: "number", inputmode: "numeric", min, max, value: val, id, class: "num", oninput: () => upd() });
    const nIn = numIn("exN", st.n, 5, 300), mIn = numIn("exM", st.min, 1, 600), noteEl = h("p", { class: "note", style: "margin-top:14px" });
    const goBtn = h("button", { class: "b p big", onclick: () => { const v = vals(); if (v.okN && v.okM) { EX = buildExam(I, Math.min(v.n, B + E), v.m); exSave(); startTimer(); nav("#thithu-lam"); } } }, "▶ Bắt đầu thi");
    const vals = () => { const n = parseInt(nIn.value, 10), m = parseInt(mIn.value, 10); return { n, m, okN: n >= 5 && n <= 300, okM: m >= 1 && m <= 600 }; };
    function upd() {
      const v = vals(); if (v.okN) st.n = v.n; if (v.okM) st.min = v.m; save();
      const nn = v.okN ? Math.min(v.n, B + E) : 0, kk = extCount(E, nn), warn = [];
      if (!v.okN) warn.push("Số câu phải từ 5 đến 300."); else if (v.n > B + E) warn.push("Ngân hàng chỉ có " + (B + E) + " câu nên đề sẽ có " + (B + E) + " câu.");
      if (!v.okM) warn.push("Thời gian phải từ 1 đến 600 phút.");
      noteEl.textContent = "Ngân hàng của lựa chọn này: " + B + " câu ôn tập + " + E + " câu mở rộng." + (nn ? " Đề gồm " + nn + " câu" +
        (kk ? ", trong đó khoảng " + kk + " câu mở rộng (tối đa " + Math.round(CH.tyLeMoRongToiDa * 100) + "%)" : (E ? "" : " (chưa có câu mở rộng nào — xem hướng dẫn nhập trong README)")) + "." : "") +
        " Câu chưa rõ đáp án hoặc có cờ cảnh báo không được đưa vào đề. " + warn.join(" ");
      goBtn.disabled = !(v.okN && v.okM && nn >= 5);
    }
    const left = run ? Math.max(0, Math.round((EX.end - Date.now()) / 1000)) : 0, answered = run ? EX.items.filter(x => x.pick >= 0).length : 0, hs = (S.exHist || []).slice(0, 5);
    app.replaceChildren(
      h("div", { class: "top" }, h("div", { class: "t" }, av(0), h("div", {}, "Đề thi thử", h("small", {}, "Ngẫu nhiên · tính giờ · chấm điểm"))), h("button", { class: "b", onclick: () => nav("#") }, "← Trang chủ")),
      run ? h("div", { class: "me", style: "cursor:default;margin-top:12px" }, h("b", {}, "📌 Bài thi đang làm dở"), h("p", { class: "note" }, EX.items.length + " câu · đã trả lời " + answered + " · còn " + mmss(left)),
        h("div", { class: "nav", style: "margin-top:6px" }, h("button", { class: "b p", onclick: () => nav("#thithu-lam") }, "▶ Tiếp tục làm"),
          h("button", { class: "b" + (gu ? " danger" : ""), onclick: () => { if (!gu) { gu = true; draw(); } else { EX = null; S.exRun = null; save(); clearInterval(exTimer); draw(); } } }, gu ? "Chắc chắn bỏ? Bấm lần nữa" : "Bỏ bài này"))) : "",
      h("h4", { class: "sec" }, "1. Chọn môn"),
      h("div", { class: "lg wrap" }, chip("Tất cả môn", st.sids.includes("*"), () => { st.sids = ["*"]; save(); draw(); }),
        SUBJ.map(s => chip(s.icon + " " + s.name, !st.sids.includes("*") && st.sids.includes(s.id), () => { let a = st.sids.filter(x => x !== "*"); a = a.includes(s.id) ? a.filter(x => x !== s.id) : a.concat(s.id); st.sids = a.length ? a : ["*"]; save(); draw(); }))),
      h("h4", { class: "sec" }, "2. Số câu (tự nhập)"), h("div", { class: "inp" }, nIn, h("span", {}, "câu")),
      h("h4", { class: "sec" }, "3. Thời gian làm bài (tự nhập)"), h("div", { class: "inp" }, mIn, h("span", {}, "phút")),
      noteEl, goBtn,
      hs.length ? h("h4", { class: "sec" }, "Lịch sử thi thử gần đây") : "",
      hs.map(r => { const d = new Date(r.t); return h("div", { class: "letter" }, pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + " · " +
        (r.sids.includes("*") || r.sids.length > 1 ? "Nhiều môn" : subName(r.sids[0])) + " · " + r.ok + "/" + r.n + " câu · " + (r.ok / r.n * 10).toFixed(1) + " điểm · " + mmss(r.used)); }));
    upd(); scrollTo(0, 0);
  }
  draw();
}
function examRun() {
  const it = EX.items, N = it.length; let cs = false;
  const top = h("div", { class: "top" }), body = h("div");
  function drawTop() {
    const left = Math.max(0, Math.round((EX.end - Date.now()) / 1000)), a = it.filter(x => x.pick >= 0).length;
    top.replaceChildren(h("div", { class: "t" }, h("div", {}, "Đề thi thử", h("small", {}, "Đã trả lời " + a + "/" + N))), h("div", { class: "exT" + (left <= 300 ? " warn" : ""), id: "exT" }, mmss(left)),
      h("button", { class: "b", onclick: () => nav("#thithu") }, "Thoát tạm"), h("div", { class: "pbar" }, h("i", { style: "width:" + Math.round(a / N * 100) + "%" })));
  }
  const mv = d => { EX.idx = Math.max(0, Math.min(N - 1, EX.idx + d)); exSave(); drawQ(); scrollTo(0, 0); };
  function drawQ() {
    const x = it[EX.idx], box = h("div", { class: "q" }, h("h3", {}, h("em", {}, "Câu " + (EX.idx + 1) + "/" + N), x.stem)), un = it.filter(y => y.pick < 0).length;
    x.opts.forEach((t, k) => box.append(h("button", { class: "o" + (x.pick === k ? " sel" : ""), onclick: () => { x.pick = x.pick === k ? -1 : k; exSave(); drawQ(); drawTop(); } }, h("b", {}, ABC[k]), h("span", {}, t))));
    body.replaceChildren(box,
      h("div", { class: "nav" }, h("button", { class: "b", disabled: EX.idx <= 0 ? "" : null, onclick: () => mv(-1) }, "← Trước"), h("button", { class: "b p", disabled: EX.idx >= N - 1 ? "" : null, onclick: () => mv(1) }, "Sau →")),
      h("p", { class: "note", style: "text-align:center" }, "Bấm lại lựa chọn đã chọn để bỏ chọn. Đáp án chỉ hiện sau khi nộp bài."),
      h("div", { class: "nav" }, h("button", { class: "b" + (cs ? " danger" : ""), onclick: () => { if (!cs) { cs = true; drawQ(); setTimeout(() => { if (cs) { cs = false; drawQ(); } }, 4000); } else submitExam(false); } },
        cs ? "Chắc chắn nộp bài? Bấm lần nữa" : "Nộp bài (" + (un ? un + " câu chưa trả lời" : "đã trả lời hết") + ")")));
  }
  const fab = h("button", {
    class: "fab l", onclick: () => {
      const sh = document.getElementById("sheet"), close = () => sh.classList.remove("on");
      sh.replaceChildren(h("div", { class: "c", onclick: e => e.stopPropagation() }, h("h4", {}, "Chọn câu"),
        h("div", { class: "gr" }, it.map((y, i) => h("button", { class: (y.pick >= 0 ? "ans" : "") + (i === EX.idx ? " cur" : ""), onclick: () => { close(); EX.idx = i; exSave(); drawQ(); scrollTo(0, 0); } }, String(i + 1)))),
        h("div", { class: "lg" }, h("button", { class: "b", onclick: close }, "Đóng"))));
      sh.onclick = close; sh.classList.add("on");
    }
  }, "▦ Câu");
  app.replaceChildren(top, body, fab); drawTop(); drawQ(); scrollTo(0, 0);
}
function examResult(R) {
  const N = R.items.length, ok = R.ok != null ? R.ok : R.items.filter(x => x.pick === x.ans).length, wrong = R.items.filter(x => x.pick >= 0 && x.pick !== x.ans).length, un = N - ok - wrong;
  const pc = ok / N, used = Math.round((R.t1 - R.t0) / 1000), by = s => { const a = R.items.filter(x => x.src === s); return [a.filter(x => x.pick === x.ans).length, a.length]; };
  const [o1, n1] = by("on"), [o2, n2] = by("mr");
  const list = R.items.map((x, i) => [x, i]).filter(([x]) => !exWrongOnly || x.pick !== x.ans).map(([x, i]) => {
    const box = h("div", { class: "q" }, h("h3", {}, h("em", {}, "Câu " + (i + 1)), x.stem, x.src === "mr" ? h("span", { class: "tag" }, "⭐ câu mở rộng") : ""));
    x.opts.forEach((t, k) => box.append(h("button", { class: "o" + (k === x.ans ? " ok" : k === x.pick ? " no" : ""), disabled: "" }, h("b", {}, ABC[k]), h("span", {}, t))));
    box.append(h("div", { class: "note" }, (x.pick < 0 ? "⚠️ Bạn chưa trả lời câu này. " : "") + subName(x.sid) + (x.src === "on" ? " · Câu " + x.n : " · câu mở rộng") + (x.note ? " — " + x.note : "")));
    return box;
  });
  app.replaceChildren(
    h("div", { class: "top" }, h("div", { class: "t" }, av(1), h("div", {}, "Kết quả thi thử", h("small", {}, new Date(R.t0).toLocaleDateString("vi-VN")))), h("button", { class: "b", onclick: () => nav("#") }, "Trang chủ")),
    h("div", { class: "res", style: "margin-top:12px" }, av(2), h("b", {}, ok + " / " + N + " câu đúng"), h("div", { class: "score" }, (pc * 10).toFixed(1) + " điểm"),
      h("p", {}, pc >= .9 ? "Xuất sắc! 🏆" : pc >= .7 ? "Tốt lắm, giữ vững phong độ 💪" : pc >= .5 ? "Đạt rồi, ôn thêm các câu sai nhé 📚" : "Chưa đạt, đừng nản — xem lại câu sai rồi thi lại 🌱"),
      h("p", { class: "note" }, "Sai " + wrong + " · Bỏ trống " + un + " · Thời gian " + mmss(used) + "/" + R.mins + " phút" + (R.auto ? " (hết giờ, tự nộp)" : "")),
      h("p", { class: "note" }, "Từ ngân hàng ôn: " + o1 + "/" + n1 + (n2 ? " · Câu mở rộng: " + o2 + "/" + n2 : ""))),
    h("div", { class: "nav" }, h("button", { class: "b p", onclick: () => { EX = buildExam(R.sids, N, R.mins); exSave(); startTimer(); nav("#thithu-lam"); } }, "🔁 Thi lại"), h("button", { class: "b", onclick: () => nav("#thithu") }, "Đổi cài đặt")),
    h("div", { class: "lg" }, h("button", { class: "b" + (exWrongOnly ? "" : " on"), onclick: () => { exWrongOnly = false; examResult(R); } }, "Xem lại tất cả"), h("button", { class: "b" + (exWrongOnly ? " on" : ""), onclick: () => { exWrongOnly = true; examResult(R); } }, "Chỉ câu sai / bỏ trống")),
    h("div", {}, list));
  scrollTo(0, 0);
}
