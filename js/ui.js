/* Giao diện: trang chủ, trang môn, thành tích, bảng tùy chọn */
const ringEl = (p, label) => h("span", { class: "ring", style: "--p:" + Math.round(Math.max(0, Math.min(1, p)) * 100) }, label != null ? label : Math.round(p * 100) + "%");
function lb(k) { const b = document.getElementById("lb"); b.replaceChildren(h("div", { class: "c" }, h("img", { src: IMG.a[k], alt: "" }), h("p", {}, CN.AVT[k] || ""), h("small", {}, "Chạm để đóng"))); b.classList.add("on"); b.onclick = () => b.classList.remove("on"); }
const av = (k, c) => h("img", { class: "ava" + (c ? " " + c : ""), src: IMG.a[k % 3], alt: "", onclick: e => { e.stopPropagation(); lb(k % 3); } });
function openSheet(...c) { const sh = document.getElementById("sheet"); sh.replaceChildren(h("div", { class: "c", onclick: e => e.stopPropagation() }, h("div", { class: "grab" }), ...c)); sh.onclick = closeSheet; sh.classList.add("on"); }
const closeSheet = () => document.getElementById("sheet").classList.remove("on");
const tgRow = (t, d, on, f) => h("button", { class: "tg", onclick: f }, h("span", {}, h("b", {}, t), h("small", {}, d)), h("i", { class: "sw" + (on ? " on" : "") }));
function prefsBlock(after) {
  return h("div", { class: "tgs" },
    tgRow("Trộn câu hỏi", "Đổi thứ tự câu mỗi lần vào làm", !!S.shq, () => { S.shq = S.shq ? 0 : 1; save(); after(); }),
    tgRow("Trộn đáp án", "Đổi vị trí A, B, C, D", !!S.sho, () => { S.sho = S.sho ? 0 : 1; save(); after(); }),
    tgRow("Từng câu một", "Mỗi lần chỉ hiện một câu", !!S.m, () => { S.m = S.m ? 0 : 1; save(); after(); }));
}
const prefsSheet = () => openSheet(h("h4", {}, "Tùy chọn làm bài"), prefsBlock(() => { closeSheet(); render(); }));
let taps = 0, bubT;
const egg = () => { if (++taps % 3 === 0) { confetti(); lb(Math.floor(Math.random() * 3)); } };
function sayBubble() { const b = document.getElementById("bub"); if (!b) return; b.textContent = fill(mascotSay()); b.classList.add("on"); clearTimeout(bubT); bubT = setTimeout(() => b.classList.remove("on"), 3800); }
const greetWord = () => hr() < 5 ? "Khuya rồi" : hr() < 11 ? "Chào buổi sáng" : hr() < 14 ? "Chào buổi trưa" : hr() < 18 ? "Chào buổi chiều" : "Chào buổi tối";

/* ---- Trang chủ ---- */
function root() {
  SID = ""; const st = SUBJ.map(x => ({ x, o: overall(x.id) })); SID = "";
  const t = T(), l = lvl(t.xp), m = mascotOf(l), td = today(), dl = daysToExam(), ds = dayStreak(), goal = Math.min(td.a, CN.MUC_TIEU);
  const last = S.last && st.find(y => y.x.id === S.last && y.o.rs >= 0);
  const sub = dl != null && dl > 0 ? "Còn " + dl + " ngày nữa là thi" : dl === 0 ? "Hôm nay thi rồi, bình tĩnh nhé!" : (hr() >= 23 || hr() < 5 ? "Nghỉ sớm nhé 🌙" : (CN.MOTTO.length ? CN.MOTTO[dayIdx() % CN.MOTTO.length] : ""));
  app.replaceChildren(
    h("header", { class: "hd" }, av(0),
      h("div", { class: "hd-t" }, h("h1", { class: "hello", onclick: egg }, greetWord() + (CN.TEN ? ", " + CN.TEN : "")), h("p", { class: "sub" }, sub)),
      CN.DAILY.length ? h("button", { class: "ib", "aria-label": "Thư hôm nay", onclick: openDaily }, ico("mail", 22), dailyUnread() ? h("i", { class: "dot" }) : "") : "",
      h("button", { class: "mas", "aria-label": m.n, onclick: sayBubble }, m.e)),
    h("div", { class: "bubble", id: "bub" }),
    h("button", { class: "today", onclick: () => nav("#tt") }, ringEl(goal / Math.max(1, CN.MUC_TIEU), goal + "/" + CN.MUC_TIEU),
      h("span", { class: "tt" }, h("b", {}, "Mục tiêu hôm nay"), h("small", {}, "Cấp " + l + " · " + lvTitle(l) + (ds ? " · 🔥 " + ds + " ngày" : ""))), ico("chev")),
    last ? h("button", { class: "cta", onclick: () => { ctx(last.x.id); jump = true; go(last.o.rs); } }, h("span", { class: "tt" }, h("small", {}, "Tiếp tục"), h("b", {}, last.x.name + " · Phần " + (last.o.rs + 1))), ico("chev")) : "",
    h("h4", { class: "sec" }, "Môn học"),
    h("div", { class: "list" }, st.map(({ x, o }) => h("button", { class: "item", onclick: () => nav("#" + x.id) }, h("span", { class: "ic" }, x.icon),
      h("span", { class: "it" }, h("b", {}, x.name), h("small", {}, x.parts.length + " phần · " + o.tn + " câu")), ringEl(o.td / Math.max(1, o.tn)))), examCard()));
  window.scrollTo(0, 0);
}

/* ---- Trang một môn ---- */
function subjHome() {
  const o = overall(SID), wn = o.w, pct = Math.round(o.td / Math.max(1, o.tn) * 100), all = D.every((_, i) => stat(i).d === stat(i).n), rs = o.rs;
  app.replaceChildren(
    h("div", { class: "bar" }, h("button", { class: "ib back", onclick: () => nav("#") }, ico("back"), h("span", {}, "Môn học")), h("button", { class: "ib", "aria-label": "Tùy chọn", onclick: prefsSheet }, ico("sliders"))),
    h("h1", { class: "title" }, SUB.icon + " " + SUB.name), h("p", { class: "sub" }, o.tn + " câu · " + D.length + " phần · đã làm " + pct + "%"),
    all ? h("p", { class: "done-note" }, "🏅 Đã hoàn thành tất cả các phần") : "",
    rs >= 0 ? h("button", { class: "cta", onclick: () => { jump = true; go(rs); } }, h("span", { class: "tt" }, h("small", {}, stat(rs).d ? "Tiếp tục" : "Bắt đầu"), h("b", {}, "Phần " + (rs + 1) + (stat(rs).d ? " · " + stat(rs).d + "/" + stat(rs).n : ""))), ico("chev")) : "",
    wn ? h("button", { class: "soft", onclick: () => go("sai") }, "🔁 Ôn lại câu sai (" + wn + ")") : "",
    h("h4", { class: "sec" }, "Các phần"),
    h("div", { class: "list" }, D.map((p, i) => { const s = stat(i); return h("button", { class: "item", onclick: () => go(i) }, h("span", { class: "pn" }, String(i + 1)),
      h("span", { class: "it" }, h("b", {}, "Phần " + (i + 1)), h("small", {}, "Câu " + p.s + "–" + p.e + (s.d ? " · đã làm " + s.d + "/" + s.n : " · " + s.n + " câu"))),
      s.d === s.n ? h("span", { class: "ring full" }, ico("check", 16)) : ringEl(s.d / s.n)); })));
  window.scrollTo(0, 0);
}

/* ---- Thành tích ---- */
function achv() {
  SID = ""; const t = T(), l = lvl(t.xp), m = mascotOf(l), lo = 60 * (l - 1) * (l - 1), hi = 60 * l * l, nx = MASCOT.find(x => x.lv > l), u = uniqCorrect(), p = mysteryP();
  const ta = h("textarea", { class: "bkt", rows: 3, placeholder: "Dán mã sao lưu vào đây để khôi phục…" });
  const copyBk = () => { const txt = JSON.stringify(S); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => bnPush({ i: "📋", t: "Đã sao chép", x: "Mã sao lưu đã nằm trong bộ nhớ tạm" })).catch(() => { ta.value = txt; ta.select(); bnPush({ i: "📋", t: "Hãy sao chép thủ công", x: "Mã đã hiện trong ô bên dưới" }); }); };
  const restoreBk = () => { try { const o = JSON.parse(ta.value); if (!o || typeof o !== "object" || !o.s) throw 0; S = o; if (!S.s) S.s = {}; save(); applyTheme(); bnPush({ i: "✅", t: "Đã khôi phục", x: "Tiến độ đã được nạp lại" }); render(); } catch (e) { bnPush({ i: "⚠️", t: "Mã không hợp lệ", x: "Hãy dán đúng mã đã sao chép" }); } };
  const st3 = (a, b) => h("div", { class: "st" }, h("b", {}, String(a)), h("small", {}, b));
  app.replaceChildren(
    h("div", { class: "bar" }, h("button", { class: "ib back", onclick: () => nav("#") }, ico("back"), h("span", {}, "Trang chủ"))),
    h("h1", { class: "title" }, "Thành tích"),
    h("div", { class: "prof" }, h("div", { class: "pm" }, m.e), h("div", { class: "pt" }, h("b", {}, "Cấp " + l + " · " + lvTitle(l)), h("small", {}, m.n + (nx ? " · tiến hóa ở cấp " + nx.lv : " · đã tiến hóa tối đa")),
      h("div", { class: "xp" }, h("i", { style: "width:" + Math.round((t.xp - lo) / (hi - lo) * 100) + "%" })), h("small", {}, t.xp + " XP · còn " + (hi - t.xp) + " XP để lên cấp " + (l + 1)))),
    h("div", { class: "stats" }, st3(t.ta, "Đã làm"), st3(t.ca, "Đúng"), st3(t.best, "Chuỗi tốt nhất"), st3(dayStreak(), "Ngày liền")),
    h("h4", { class: "sec" }, "Bức ảnh bí mật"),
    h("div", { class: "mys" }, h("div", { class: "mys-img", style: "--b:" + ((1 - p) * 22).toFixed(1) + "px" }, h("img", { src: IMG.m, alt: "" }), p < 1 ? h("span", { class: "mys-p" }, Math.round(p * 100) + "%") : ""),
      h("div", { class: "mys-t" }, h("b", {}, p >= 1 ? "Đã hiện rõ" : "Làm đúng để ảnh rõ dần"), h("small", {}, p >= 1 ? fill(CN.ANH_LOI) : u.n + "/" + CN.ANH_CAN + " câu đúng khác nhau"))),
    h("h4", { class: "sec" }, "Giao diện"),
    h("div", { class: "themes" }, THEMES.map(th => { const ok = l >= th.lv; return h("button", { class: "th" + ((S.th || "mac") === th.id ? " on" : "") + (ok ? "" : " lock"), style: "background:" + th.c, title: th.n + (ok ? "" : " · mở khóa ở cấp " + th.lv), onclick: () => { if (ok) { S.th = th.id; save(); applyTheme(); render(); } else bnPush({ i: "🔒", t: th.n, x: "Mở khóa ở cấp " + th.lv }); } }, ok ? "" : "🔒"); })),
    h("h4", { class: "sec" }, "Huy hiệu · " + Object.keys(t.ach).length + "/" + BADGES.length),
    h("div", { class: "bdg" }, BADGES.map(b => h("div", { class: "bd" + (t.ach[b.id] ? "" : " lock") }, h("span", { class: "bi" }, t.ach[b.id] ? b.i : "🔒"), h("b", {}, b.t), h("small", {}, b.x)))),
    h("h4", { class: "sec" }, "Thư mở khóa"),
    ...CN.THU.map((r, n) => t.rw[n] ? h("button", { class: "letter", onclick: () => { evq = [{ i: r.i, t: r.t, x: r.x, img: IMG.a[n % 3] }]; pop(); } }, r.i + " " + r.t + " · chạm để đọc lại") : h("div", { class: "letter lock" }, "🔒 Mở khóa khi đạt " + r.at + " câu đúng (" + Math.min(t.ca, r.at) + "/" + r.at + ")")),
    h("details", { class: "bk" }, h("summary", {}, "Sao lưu tiến độ"), h("p", { class: "note" }, "Tiến độ chỉ lưu trên trình duyệt này. Sao chép mã rồi dán vào ghi chú để giữ; đổi máy thì dán lại vào ô bên dưới."),
      h("div", { class: "nav" }, h("button", { class: "b", onclick: copyBk }, "📋 Sao chép mã"), h("button", { class: "b p", onclick: restoreBk }, "Khôi phục")), ta));
  window.scrollTo(0, 0);
}
