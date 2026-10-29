/* Lõi: dữ liệu, lưu tiến độ, tiện ích, điều hướng */
const SUBJ = [];                       // các môn (được nạp từ data/ bởi js/loader.js)
let D = [], SID = "", SS = {}, SUB = null, jump = false;
const IMG = { h: "img/hero.jpg", a: ["img/av0.jpg", "img/av1.jpg", "img/av2.jpg"], m: "img/bi_mat.jpg" };
const CN = Object.assign({ TEN: "em", XUNG: "Anh", MUC_TIEU: 20, NGAY_THI: "", ANH_CAN: 300, ANH_LOI: "", THU: [], DAILY: [], MOTTO: [], MASCOT: [],
  OKS: ["Chuẩn rồi!"], NOS: ["Chưa đúng, nhớ lại nhé"], LUCKY: ["Câu may mắn!"], AVT: ["", "", ""] }, window.CA_NHAN || {});
const fill = s => String(s).replace(/\{XUNG\}/g, CN.XUNG).replace(/\{xung\}/g, CN.XUNG.toLowerCase()).replace(/\{TEN\}/g, CN.TEN);

/* ---- lưu trữ (trình duyệt) ---- */
const KEY = "monhoc_v2";
let S = { m: 0, s: {} }, streak = 0, FB = {}, PERM = {}, LK = {};
try { const r = localStorage.getItem(KEY); if (r) S = JSON.parse(r); else { const o = JSON.parse(localStorage.getItem("cnxhkh_v1") || "null"); if (o) { S.m = o.m || 0; delete o.m; S.s.cnxhkh = o; } } } catch (e) {}
if (!S || typeof S !== "object") S = { m: 0, s: {} }; if (!S.s) S.s = {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

/* ---- tiện ích ---- */
const app = document.getElementById("app");
const pad = n => (n < 10 ? "0" : "") + n, rnd = a => a[Math.floor(Math.random() * a.length)], hr = () => new Date().getHours();
const dkey = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const shufflable = q => !/(tất cả|đều đúng|đều sai|cả [a-d]\b|\b[a-d] (và|,) [a-d]\b|không có đáp án)/i.test(q[2].join(" | "));
function h(t, a, ...k) {
  const e = document.createElement(t);
  for (const x in a || {}) { if (a[x] == null) continue; x === "class" ? e.className = a[x] : x.startsWith("on") ? e.addEventListener(x.slice(2), a[x]) : e.setAttribute(x, a[x]); }
  k.flat().forEach(c => e.append(c)); return e;
}
const ICON = {
  back: '<path d="M15 5l-7 7 7 7"/>', chev: '<path d="M9 5l7 7-7 7"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>', check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'
};
const ico = (n, s = 20) => { const e = document.createElement("span"); e.className = "ico"; e.innerHTML = `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICON[n]}</svg>`; return e; };

/* ---- điều hướng và ngữ cảnh môn học ---- */
const nav = x => { if (location.hash === x || (x === "#" && !location.hash)) render(); else location.hash = x; };
function go(t) { nav("#" + SID + (t == null ? "" : "-" + (typeof t === "string" ? t : "p" + (t + 1)))); }
function ctx(id) { SID = id; SUB = SUBJ.find(x => x.id === id); D = SUB.parts; SS = S.s[id] || (S.s[id] = {}); }
function stat(i) { const a = SS[i] || {}; let d = 0, r = 0; D[i].q.forEach((q, j) => { if (a[j] !== undefined) { d++; if (q[3] >= 0 && a[j] === q[3]) r++; } }); return { d, r, n: D[i].q.length, sc: D[i].q.filter(q => q[3] >= 0).length }; }
const wrongOf = i => { const a = SS[i] || {}; return D[i].q.map((q, j) => j).filter(j => a[j] !== undefined && D[i].q[j][3] >= 0 && a[j] !== D[i].q[j][3]); };
const allWrong = i => (i == null ? D.map((_, x) => x) : [i]).flatMap(x => wrongOf(x).map(j => [x, j]));
function overall(id) {
  ctx(id); let td = 0, tn = 0; D.forEach((p, i) => { const s = stat(i); td += s.d; tn += s.n; });
  let rs = D.findIndex((_, i) => { const s = stat(i); return s.d > 0 && s.d < s.n; }); if (rs < 0) rs = D.findIndex((_, i) => stat(i).d < stat(i).n);
  return { td, tn, rs, w: allWrong(null).length };
}
