// Chạy thử nhanh các luồng chính trên điện thoại giả lập. Dùng: node tests/smoke.js [thư-mục-lưu-ảnh]
// Tự mở máy chủ tĩnh, nạp dữ liệu giả lập, bấm qua từng luồng, báo lỗi JS và kiểm tra kết quả lưu.
var http = require("http"), fs = require("fs"), path = require("path");
var chromium;
try { chromium = require("playwright").chromium; } catch (e) { console.error("Cần Playwright: npm i playwright (hoặc dùng bản cài sẵn của máy)"); process.exit(1); }
var ROOT = path.join(__dirname, ".."), SHOTS = process.argv[2], S = require("./seed.js");
var TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webmanifest": "application/manifest+json" };
var server = http.createServer(function (q, r) {
  var f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]).replace(/\/$/, "/index.html"));
  fs.readFile(f, function (err, d) { if (err) { r.writeHead(404); return r.end(); } r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); r.end(d); });
});
var fails = 0;
function check(ok, msg) { console.log((ok ? "  ✓ " : "  ✗ ") + msg); if (!ok) fails++; }

(async function () {
  await new Promise(function (r) { server.listen(0, r); });
  var url = "http://localhost:" + server.address().port + "/";
  var b;
  try { b = await chromium.launch(); } catch (e) { b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" }); }
  async function page(time, mutate) {
    var data = JSON.parse(JSON.stringify(S)); if (mutate) mutate(data);
    var ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: "block", timezoneId: "Asia/Ho_Chi_Minh" });
    await ctx.addInitScript(function (s) { if (!sessionStorage.seeded) { localStorage.setItem("fitcore3", s); sessionStorage.seeded = 1; } }, JSON.stringify(data));
    var p = await ctx.newPage();
    p.on("pageerror", function (e) { check(false, "Lỗi JS: " + e.message); });
    await p.clock.setFixedTime(new Date(time));
    await p.route(/fonts\./, function (r) { r.abort(); });
    await p.goto(url); await p.waitForTimeout(250);
    p.state = function () { return p.evaluate(function () { return JSON.parse(localStorage.fitcore3); }); };
    p.shot = function (n) { return SHOTS ? p.screenshot({ path: path.join(SHOTS, n + ".png"), fullPage: true }) : null; };
    return p;
  }

  console.log("Tập");
  var p = await page("2026-10-26T19:00:00+07:00");
  await p.shot("1_tap");
  check(await p.$(".hero-t") !== null, "Khối gợi ý hôm nay hiện");
  await p.click("[data-act=sel][data-v=UB]"); await p.click("[data-act=start]");
  for (var j = 0; j < 3; j++) await p.click('[data-act=done][data-i="0"][data-j="' + j + '"]');
  await p.click('[data-act=fb][data-i="0"][data-v="ok"]'); await p.click("#timer >> text=Tắt");
  await p.click('[data-act=exmove][data-i="4"][data-v="now"]');
  var st = await p.state();
  check(st.draft.ex[1].id === "latcable", "Đưa bài vai lên làm tiếp theo");
  await p.shot("2_buoi_tap");
  await p.click("[data-act=finish]"); await p.waitForTimeout(150);
  st = await p.state();
  check(st.workouts[0].key === "UB" && st.workouts[0].ex.length === 1, "Kết thúc buổi lưu đúng");
  await p.close();

  console.log("Cardio");
  p = await page("2026-10-26T21:00:00+07:00");
  await p.click("[data-act=cardio][data-v=walk]"); await p.fill("#cSpd", "5.5"); await p.fill("#cInc", "10");
  var res = await p.evaluate(function () { return document.getElementById("cres").innerText; });
  check(/8,3 MET/.test(res), "Đi bộ dốc 5,5 km/h 10% ra 8,3 MET (ACSM)");
  await p.click("[data-act=savecardio]"); await p.waitForTimeout(100);
  await p.click("[data-act=cardio][data-v=bad]"); await p.click("[data-act=cdate] >> nth=1"); await p.click("[data-act=savecardio]"); await p.waitForTimeout(100);
  st = await p.state();
  check(st.cardio.length === 2 && st.cardio.some(function (c) { return c.type === "bad" && c.date === "2026-10-25"; }), "Ghi cầu lông cho hôm qua");
  await p.click('.cmain:has-text("Cầu lông")'); await p.click('[data-act=cmin][data-v="120"]'); await p.click("[data-act=savecardio]"); await p.waitForTimeout(100);
  st = await p.state();
  check(st.cardio.filter(function (c) { return c.type === "bad"; })[0].min === 120 && st.cardio.length === 2, "Sửa buổi cầu lông");
  await p.shot("3_cardio");
  await p.close();

  console.log("Gợi ý sau cầu lông");
  p = await page("2026-10-27T18:00:00+07:00", function (d) {
    d.workouts.unshift({ id: "x", date: "2026-10-26", ts: Date.parse("2026-10-26T12:00:00Z"), key: "UA", dur: 60, ex: [] });
    d.cardio = [{ id: "c", date: "2026-10-26", type: "bad", lv: 1, min: 150, met: 7, kcal: 1000 }];
  });
  check(await p.textContent(".ht-name") === "Upper B", "Hôm sau đánh cầu: đẩy Upper lên trước buổi chân");
  await p.close();

  console.log("Ăn");
  p = await page("2026-10-26T20:30:00+07:00");
  await p.click("[data-tab=food]");
  await p.click("[data-act=addto][data-v=s]");
  await p.fill("#fq", "xôi, thịt lợn quay, chút rau");
  await p.click('[data-gi="1"]'); await p.keyboard.type("137");
  await p.click("[data-act=addmeal]"); await p.waitForTimeout(100);
  st = await p.state();
  var last = st.food["2026-10-26"].slice(-1)[0];
  check(last.meal === "s" && last.parts[1].id === "heo_quay" && last.parts[1].g === 137, "Ghi bữa sáng theo thành phần, gõ gram thật");
  await p.click("#fab"); await p.click("[data-act=view][data-v=num]");
  await p.fill("#nN", "Bánh thử"); await p.fill("#nK", "450"); await p.fill("#nP", "7"); await p.fill("#nE", "45");
  await p.click("[data-act=addnum]"); await p.waitForTimeout(100);
  st = await p.state();
  check(st.food["2026-10-26"].slice(-1)[0].kcal === 203, "Đồ đóng gói: 450 kcal/100g × 45g = 203 kcal");
  await p.shot("4_an");
  await p.close();

  console.log("Bữa tối");
  p = await page("2026-10-26T18:30:00+07:00");
  await p.click("[data-tab=food]");
  check((await p.$$(".recipe-opt")).length === 3, "Có 3 gợi ý bữa tối");
  var ideas = await p.evaluate(function () { return [].map.call(document.querySelectorAll(".recipe-opt"), function (e) { return e.innerText; }).join(" "); });
  check(!/\bcá\b/i.test(ideas), "Không gợi ý cá");
  await p.click('[data-act=didea][data-v="0"]');
  await p.click("[data-act=dpro][data-v=lon]"); await p.click("[data-act=dcut][data-v=lon_bachi]");
  var meat = +(await p.inputValue("[data-di=meat]"));
  check(meat <= 170, "Ba chỉ: thịt không quá ~55% calo của bữa (" + meat + "g)");
  await p.click("[data-act=dcut][data-v=lon_nac]"); await p.click("[data-act=deat]"); await p.waitForTimeout(100);
  st = await p.state();
  last = st.food["2026-10-26"].slice(-1)[0];
  check(last.meal === "d" && last.parts[0].id === "lon_nac", "Ghi món ghép vào Bữa tối");
  await p.shot("5_bua_toi");
  await p.close();

  console.log("Tiến độ");
  p = await page("2026-10-26T20:00:00+07:00");
  await p.click("[data-tab=progress]"); await p.waitForTimeout(150);
  check(await p.$(".hero-p") !== null, "Khối hành trình % mỡ hiện");
  await p.shot("6_tien_do");
  await p.close();

  await b.close(); server.close();
  console.log(fails ? "\n" + fails + " lỗi" : "\nTất cả đều ổn");
  process.exit(fails ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
