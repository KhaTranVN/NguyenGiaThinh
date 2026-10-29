/* Làm bài theo phần / ôn câu sai, và bộ định tuyến */
function quiz(cfg) {
  S.last = SID; save();
  let { items, retry, title, sub, pi } = cfg; PERM = {}; if (S.shq) items = shuf(items);
  const loc = {}, single = !!S.m;
  const ans = (i, j) => retry ? loc[i + ":" + j] : (SS[i] || {})[j];
  const st = () => { let d = 0, r = 0, sc = 0; items.forEach(([i, j]) => { const q = D[i].q[j], a = ans(i, j); if (q[3] >= 0) sc++; if (a !== undefined) { d++; if (a === q[3]) r++; } }); return { d, r, sc, n: items.length }; };
  let cur = Math.max(0, items.findIndex(([i, j]) => ans(i, j) === undefined));
  const top = h("div", { class: "top" }), list = h("div"), end = h("div", { class: "end" });
  function upd() {
    const s = st();
    top.replaceChildren(h("button", { class: "ib", "aria-label": "Quay lại", onclick: () => go(null) }, ico("back", 22)),
      h("div", { class: "tt" }, h("b", {}, title), h("small", {}, sub + " · " + s.d + "/" + s.n + (streak >= 3 ? " · 🔥 " + streak : ""))),
      h("button", { class: "ib", "aria-label": "Chọn câu", onclick: sheet }, ico("grid", 22)), h("div", { class: "pbar" }, h("i", { style: "width:" + Math.round(s.d / Math.max(1, s.n) * 100) + "%" })));
    const pc = s.sc ? s.r / s.sc : 1, done = s.n > 0 && s.d === s.n, left = retry ? allWrong(pi).length : 0, wn = !retry && allWrong(pi).length;
    const rb = h("button", { class: "b", onclick: () => { if (!rb.dataset.c) { rb.dataset.c = 1; rb.textContent = "Chắc chắn xóa? Bấm lần nữa"; rb.classList.add("danger"); setTimeout(() => { rb.dataset.c = ""; rb.textContent = "Làm lại phần này"; rb.classList.remove("danger"); }, 3500); } else { SS[pi] = {}; save(); go(pi); } } }, "Làm lại phần này");
    end.replaceChildren(done ? h("div", { class: "res" }, av(1 + (pi || 0)), h("b", {}, s.r + " / " + s.sc + " câu đúng"), h("p", {}, pc >= .9 ? "Xuất sắc! Học bổng gọi tên rồi 🏆" : pc >= .7 ? "Tốt lắm, thêm chút nữa là hoàn hảo 💪" : pc >= .5 ? "Khá ổn, làm lại để chắc hơn nhé 📚" : "Đừng nản, ôn lại là nhớ ngay thôi 🌱")) : "",
      items.length ? h("div", { class: "nav" }, retry ? "" : rb, wn ? h("button", { class: "b", onclick: () => go("sai" + (pi + 1)) }, "🔁 Ôn câu sai (" + wn + ")") : "", retry && left ? h("button", { class: "b", onclick: render }, "🔁 Ôn tiếp (" + left + ")") : "",
        !retry && pi > 0 ? h("button", { class: "b", onclick: () => go(pi - 1) }, "← Phần trước") : "", !retry && pi < D.length - 1 ? h("button", { class: "b p", onclick: () => go(pi + 1) }, "Phần sau →") : "") : "");
  }
  function card(x) {
    const [i, j] = items[x], q = D[i].q[j], a = ans(i, j), done = a !== undefined, key = SID + i + ":" + j;
    if (LK[key] === undefined) LK[key] = (!done && q[3] >= 0 && !q[4] && Math.random() < .08) ? 1 : 0;
    const box = h("div", { class: "q" }, h("h3", {}, h("em", {}, "Câu " + q[0] + (LK[key] === 1 ? " · ✨ may mắn" : "")), q[1]));
    if (q[4]) box.append(h("div", { class: "flag " + q[4].k }, (q[4].k === "unk" ? "❔ Chưa rõ đáp án (không tính điểm). " : q[4].k === "conf" ? "⚠️ Đáp án mâu thuẫn giữa 2 tài liệu. " : "❓ Đáp án chưa chắc chắn. ") + q[4].t));
    const ord = (S.sho && shufflable(q)) ? (PERM[key] || (PERM[key] = shuf(q[2].map((_, k) => k)))) : q[2].map((_, k) => k);
    ord.forEach((k, d) => {
      const t = q[2][k]; let c = "o", mk = "";
      if (done) { if (q[3] < 0) { if (a === k) c += " sel"; } else if (k === q[3]) { c += " ok"; mk = ico("check", 18); } else if (a === k) { c += " no"; mk = ico("x", 18); } }
      box.append(h("button", { class: c, disabled: done ? "" : null, onclick: () => choose(i, j, k, q) }, h("b", {}, L[d]), h("span", {}, t), mk));
    });
    const f = FB[key]; if (done && f) box.append(h("div", { class: "fb " + (f.ok === null ? "un" : f.ok ? "ok" : "no") + (f.lucky ? " lucky" : "") }, f.msg));
    return box;
  }
  function choose(i, j, k, q) {
    const was = st().d, key = SID + i + ":" + j; if (!SS[i]) SS[i] = {}; SS[i][j] = k; save(); if (retry) loc[i + ":" + j] = k;
    const unk = q[3] < 0, ok = unk ? null : k === q[3], lucky = LK[key] === 1 && ok === true; if (!unk) streak = ok ? streak + 1 : 0;
    FB[key] = { ok, lucky, msg: unk ? "Đã ghi nhận · câu này chưa có đáp án để chấm" : lucky ? rnd(CN.LUCKY) + " ✨ +30 XP" : ({ 5: "🔥 5 câu liên tiếp!", 10: "⚡ 10 câu liên tiếp, quá đỉnh!", 20: "👑 20 câu liên tiếp!" }[streak] || rnd(ok ? CN.OKS : CN.NOS)) };
    draw(); upd(); const s = st(); if (was < s.n && s.d === s.n && s.sc && s.r / s.sc >= .7) setTimeout(confetti, 250); if (streak === 10 || streak === 20) setTimeout(confetti, 200);
    rec(ok, retry && ok === true, lucky ? 30 : 0);
  }
  function draw() {
    if (single) list.replaceChildren(card(cur), h("div", { class: "nav" }, h("button", { class: "b", disabled: cur <= 0 ? "" : null, onclick: () => { cur--; draw(); scrollTo(0, 0); } }, "← Trước"), h("button", { class: "b p", disabled: cur >= items.length - 1 ? "" : null, onclick: () => { cur++; draw(); scrollTo(0, 0); } }, "Sau →")));
    else list.replaceChildren(...items.map((_, x) => card(x)));
  }
  function toX(x) { if (single) { cur = x; draw(); scrollTo(0, 0); } else list.children[x] && list.children[x].scrollIntoView({ behavior: "smooth", block: "start" }); }
  function sheet() {
    openSheet(h("h4", {}, "Chọn câu"), h("div", { class: "gr" }, items.map(([i, j], x) => { const q = D[i].q[j], a = ans(i, j); return h("button", { class: (a === undefined ? "" : q[3] < 0 ? "un" : a === q[3] ? "ok" : "no") + (single && x === cur ? " cur" : ""), onclick: () => { closeSheet(); toX(x); } }, String(x + 1)); })),
      h("h4", { style: "margin-top:18px" }, "Tùy chọn"), prefsBlock(() => { closeSheet(); render(); }));
  }
  if (!items.length) { app.replaceChildren(h("div", { class: "res" }, av(2), h("b", {}, "Không có câu sai 🎉"), h("p", {}, "Bạn đã làm đúng hết những câu đã làm."), h("div", { class: "nav" }, h("button", { class: "b p", onclick: () => go(null) }, "Quay lại")))); return; }
  const fab = h("button", { class: "fab", "aria-label": "Tới câu chưa làm", onclick: () => { const f = items.findIndex(([i, j]) => ans(i, j) === undefined); f >= 0 ? toX(f) : scrollTo({ top: 0, behavior: "smooth" }); } }, ico("down", 22));
  app.replaceChildren(top, list, end, single ? "" : fab); draw(); upd(); window.scrollTo(0, 0);
  if (jump) { jump = false; const f = items.findIndex(([i, j]) => ans(i, j) === undefined); if (f > 0 && !single) setTimeout(() => toX(f), 80); }
}

function render() {
  const h1 = location.hash; let id = null, rest = "", m;
  if (h1 === "#tt") return achv();
  if (/^#thithu/.test(h1)) return examRoute(h1);
  if (/^#p\d+$/.test(h1)) { id = "cnxhkh"; rest = h1.slice(1); }
  else if ((m = /^#([a-z][a-z0-9]*)(?:-(.+))?$/.exec(h1)) && SUBJ.some(x => x.id === m[1])) { id = m[1]; rest = m[2] || ""; }
  if (!id) return root();
  ctx(id);
  if (m = /^sai(\d*)$/.exec(rest)) { const pi = m[1] ? +m[1] - 1 : null; if (pi == null || (pi >= 0 && pi < D.length)) return quiz({ items: allWrong(pi), retry: true, title: "Ôn câu sai", sub: SUB.name + (pi == null ? "" : " · Phần " + (pi + 1)), pi }); }
  if (m = /^p(\d+)$/.exec(rest)) { const i = +m[1] - 1; if (i >= 0 && i < D.length) return quiz({ items: D[i].q.map((_, j) => [i, j]), title: "Phần " + (i + 1), sub: SUB.name, pi: i }); }
  subjHome();
}
const L = "ABCDEF";
function startApp() { applyTheme(); if (typeof examInit === "function") examInit(); addEventListener("hashchange", render); render(); }
