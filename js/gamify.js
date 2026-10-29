/* Cấp độ, linh vật tiến hóa, giao diện mở khóa, huy hiệu, thư, ảnh bí mật, đếm ngược, thông báo */
const TITLES = ["Tân binh", "Chăm chỉ", "Siêng năng", "Bứt phá", "Cao thủ", "Học giả", "Thủ khoa", "Huyền thoại", "Học bổng ✨"];
const lvl = x => Math.floor(Math.sqrt(x / 60)) + 1, lvTitle = l => TITLES[Math.min(l - 1, TITLES.length - 1)];
const T = () => S.st || (S.st = { xp: 0, days: {}, ach: {}, rw: {}, best: 0, ca: 0, ta: 0 });
const today = () => T().days[dkey(new Date())] || { a: 0, c: 0 };
function dayStreak() { const t = T(); let d = new Date(), n = 0; if (!(t.days[dkey(d)] || {}).a) d.setDate(d.getDate() - 1); while ((t.days[dkey(d)] || {}).a > 0) { n++; d.setDate(d.getDate() - 1); } return n; }
function partsDone() { let n = 0; SUBJ.forEach(s => s.parts.forEach((p, i) => { if (Object.keys((S.s[s.id] || {})[i] || {}).length >= p.q.length) n++; })); return n; }
const dayIdx = () => { const d = new Date(); return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); };

/* Linh vật tiến hóa theo cấp */
const MASCOT = [{ lv: 1, e: "🥚", n: "Trứng bí ẩn" }, { lv: 2, e: "🐣", n: "Gà con" }, { lv: 3, e: "🐥", n: "Chim non" }, { lv: 5, e: "🦉", n: "Cú thông thái" },
  { lv: 7, e: "🦅", n: "Đại bàng" }, { lv: 9, e: "🐲", n: "Rồng con" }, { lv: 12, e: "🐉", n: "Rồng vàng" }];
const mascotOf = l => MASCOT.filter(m => m.lv <= l).pop();
/* Giao diện mở khóa theo cấp */
const THEMES = [{ id: "mac", n: "Mặc định", lv: 1, c: "#2f4bff" }, { id: "hoang", n: "Hoàng hôn", lv: 3, c: "#f0643f" }, { id: "bien", n: "Đại dương", lv: 5, c: "#0e9aa7" }, { id: "dem", n: "Đêm tím", lv: 7, c: "#8b5cf6" }];
const applyTheme = () => { document.documentElement.dataset.th = S.th || "mac"; };

function daysToExam() { if (!CN.NGAY_THI) return null; const d = new Date(CN.NGAY_THI + "T00:00:00"); if (isNaN(d)) return null; const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((d - t) / 864e5); }
function uniqCorrect() { let n = 0, tot = 0; SUBJ.forEach(s => s.parts.forEach((p, i) => p.q.forEach((q, j) => { tot++; if (q[3] >= 0 && ((S.s[s.id] || {})[i] || {})[j] === q[3]) n++; }))); return { n, tot }; }
const mysteryP = () => Math.min(1, uniqCorrect().n / Math.max(1, CN.ANH_CAN));
const dailyUnread = () => CN.DAILY.length && S.dl !== dkey(new Date());

const BADGES = [{ id: "b1", i: "👣", t: "Bước đầu", x: "Trả lời câu đầu tiên", f: t => t.ta >= 1 }, { id: "b50", i: "🌱", t: "Khởi động", x: "Làm 50 câu", f: t => t.ta >= 50 },
  { id: "b200", i: "📚", t: "Chăm chỉ", x: "Làm 200 câu", f: t => t.ta >= 200 }, { id: "b500", i: "⛏️", t: "Cày cuốc", x: "Làm 500 câu", f: t => t.ta >= 500 },
  { id: "r10", i: "⚡", t: "Chuỗi 10", x: "10 câu đúng liên tiếp", f: t => t.best >= 10 }, { id: "r20", i: "👑", t: "Chuỗi 20", x: "20 câu đúng liên tiếp", f: t => t.best >= 20 },
  { id: "d3", i: "🔥", t: "3 ngày liền", x: "Học 3 ngày liên tiếp", f: () => dayStreak() >= 3 }, { id: "d7", i: "🌈", t: "Cả tuần", x: "Học 7 ngày liên tiếp", f: () => dayStreak() >= 7 },
  { id: "pd", i: "✅", t: "Xong 1 phần", x: "Hoàn thành 1 phần", f: () => partsDone() >= 1 }, { id: "p5", i: "🏅", t: "Xong 5 phần", x: "Hoàn thành 5 phần", f: () => partsDone() >= 5 },
  { id: "fx", i: "🔧", t: "Sửa sai", x: "Làm đúng một câu ở chế độ ôn câu sai", f: (t, c) => c.fix }, { id: "lk", i: "✨", t: "May mắn", x: "Trúng một câu may mắn", f: (t, c) => c.lucky },
  { id: "nt", i: "🦉", t: "Cú đêm", x: "Học sau 23 giờ", f: () => hr() >= 23 || hr() < 4 }];

/* ---- Thông báo: banner nhỏ tự tắt (không chặn thao tác) và hộp thoại cho khoảnh khắc đặc biệt ---- */
let evq = [], bnq = [], bnT;
function bnNext() {
  let el = document.getElementById("bn");
  if (!el) { el = h("div", { id: "bn", onclick: () => { clearTimeout(bnT); el.classList.remove("on"); setTimeout(bnNext, 300); } }); document.body.append(el); }
  const e = bnq.shift(); if (!e) { el.classList.remove("on"); return; }
  el.replaceChildren(h("span", { class: "i" }, e.i), h("div", {}, h("b", {}, e.t), h("small", {}, fill(e.x)))); el.classList.add("on");
  bnT = setTimeout(() => { el.classList.remove("on"); setTimeout(bnNext, 350); }, 3200);
}
const bnPush = e => { bnq.push(e); const el = document.getElementById("bn"); if (!el || !el.classList.contains("on")) bnNext(); };
function pop() {
  const e = evq.shift(), b = document.getElementById("lb"); if (!e) { b.classList.remove("on"); return; }
  b.replaceChildren(h("div", { class: "c" }, e.img ? h("img", { src: e.img, alt: "" }) : h("div", { class: "big" }, e.i), h("h3", {}, (e.img ? e.i + " " : "") + e.t), h("p", {}, fill(e.x)), h("small", {}, evq.length ? "Chạm để xem tiếp" : "Chạm để đóng")));
  b.classList.add("on"); b.onclick = pop; if (!e.quiet) confetti();
}
function confetti() {
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const c = h("canvas", { class: "cf" }); document.body.append(c);
  const x = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight,
    P = Array.from({ length: 110 }, () => ({ x: W / 2, y: H * .38, vx: (Math.random() - .5) * 13, vy: -Math.random() * 12 - 3, s: 4 + Math.random() * 5, r: Math.random() * 6, c: rnd(["#2f4bff", "#f0643f", "#f0a30a", "#18946a", "#8b5cf6"]) }));
  let f = 0; (function a() { x.clearRect(0, 0, W, H); P.forEach(p => { p.vy += .28; p.x += p.vx; p.y += p.vy; p.r += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); x.restore(); }); ++f < 130 ? requestAnimationFrame(a) : c.remove(); })();
}
function openDaily() {
  if (!CN.DAILY.length) return; const i = dayIdx() % CN.DAILY.length; S.dl = dkey(new Date()); save();
  evq = [{ i: "💌", t: "Thư hôm nay", x: CN.DAILY[i] + " — {XUNG}", img: IMG.a[i % 3], quiet: true }]; pop(); const d = document.querySelector(".dot"); if (d) d.remove();
}
function mascotSay() {
  const L = [], dl = daysToExam(), td = today();
  if (hr() >= 23 || hr() < 4) L.push("Khuya rồi, nghỉ sớm cho khỏe nhé 🌙");
  if (dl != null && dl > 0 && dl <= 30) L.push("Còn " + dl + " ngày nữa là thi, mình cùng cố nhé!");
  if (td.a >= CN.MUC_TIEU) L.push("Hôm nay em đạt mục tiêu rồi, tự hào ghê!"); else if (td.a > 0) L.push("Còn " + (CN.MUC_TIEU - td.a) + " câu nữa là đạt mục tiêu hôm nay!");
  if (dayStreak() >= 2) L.push("Chuỗi " + dayStreak() + " ngày rồi, đừng để đứt nha 🔥");
  return rnd(L.concat(CN.MASCOT.length ? CN.MASCOT : ["Cố lên nào!"]));
}

/* ---- Ghi nhận mỗi lần trả lời: XP, cấp, linh vật, giao diện, mục tiêu, thư, huy hiệu, ảnh bí mật ---- */
function rec(ok, fix, bonus) {
  const t = T(), old = t.xp, k = dkey(new Date()), e = t.days[k] || (t.days[k] = { a: 0, c: 0 }), p0 = mysteryP();
  e.a++; t.ta++; if (ok === true) { e.c++; t.ca++; t.xp += 10 + (bonus || 0); } else t.xp += ok === false ? 3 : 1; t.best = Math.max(t.best, streak);
  const ev = [], l1 = lvl(old), l2 = lvl(t.xp);
  if (l2 > l1) {
    ev.push({ i: "⭐", t: "Lên cấp " + l2 + " · " + lvTitle(l2), x: "Giỏi quá!" });
    const m1 = mascotOf(l1), m2 = mascotOf(l2); if (m2.e !== m1.e) ev.push({ i: m2.e, t: "Linh vật tiến hóa!", x: m1.n + " đã trở thành " + m2.n + " 🎉", modal: true });
    THEMES.filter(th => th.lv > l1 && th.lv <= l2).forEach(th => ev.push({ i: "🎨", t: "Mở khóa giao diện " + th.n, x: "Vào Thành tích để đổi giao diện." }));
  }
  if (e.a === CN.MUC_TIEU) ev.push({ i: "🎯", t: "Đạt mục tiêu hôm nay!", x: "Đã làm đủ " + CN.MUC_TIEU + " câu. Nghỉ ngơi một chút cũng xứng đáng." });
  CN.THU.forEach((r, n) => { if (t.ca >= r.at && !t.rw[n]) { t.rw[n] = 1; ev.push({ i: r.i, t: r.t, x: r.x, img: IMG.a[n % 3] }); } });
  BADGES.forEach(b => { if (!t.ach[b.id] && b.f(t, { fix, lucky: bonus > 0 })) { t.ach[b.id] = 1; ev.push({ i: b.i, t: "Huy hiệu: " + b.t, x: b.x }); } });
  const p1 = mysteryP(); [.25, .5, .75, 1].forEach(m => { if (p0 < m && p1 >= m) ev.push(m === 1 ? { i: "🖼️", t: "Ảnh bí mật đã hiện rõ!", x: CN.ANH_LOI, img: IMG.m } : { i: "🖼️", t: "Ảnh bí mật rõ " + Math.round(m * 100) + "%", x: "Vào Thành tích để xem." }); });
  save(); ev.forEach(x => { if (x.img || x.modal) evq.push(x); else bnPush(x); });
  if (evq.length) setTimeout(() => { if (!document.getElementById("lb").classList.contains("on")) pop(); }, 900);
}
