(function () {
  "use strict";

  // =====================================================================
  // Dữ liệu cố định
  // =====================================================================

  // Nhóm cơ: tên, vùng số hiệp nặng mỗi tuần nên đạt (dưới mức thấp: ít kích thích; trên mức cao: khó hồi phục)
  var MUSCLES = {
    chest: ["Ngực", 10, 20], back: ["Lưng", 10, 20], delts: ["Vai", 8, 16], biceps: ["Tay trước", 6, 14], triceps: ["Tay sau", 6, 14],
    quads: ["Đùi trước", 10, 20], hams: ["Đùi sau, mông", 10, 20], calves: ["Bắp chân", 6, 12], abs: ["Bụng", 6, 12]
  };

  // Dụng cụ phòng tập. "none" là không cần dụng cụ.
  var EQUIP = [
    ["barbell", "Đòn tạ + giá squat"], ["smith", "Máy Smith"], ["db", "Tạ đơn + ghế"], ["cable", "Máy cáp (pulley)"], ["latpd", "Máy lat pulldown"],
    ["pullbar", "Xà đơn"], ["upm", "Máy thân trên (chest press, row máy, shoulder press máy)"], ["pecdeck", "Máy pec deck"], ["legpress", "Máy đạp đùi (leg press)"],
    ["hack", "Máy hack squat"], ["legext", "Máy leg extension"], ["lycurl", "Máy leg curl nằm"], ["seatcurl", "Máy leg curl ngồi"], ["calfm", "Máy calf đứng"], ["calfseat", "Máy calf ngồi"]
  ];
  // Thư viện bài: tên, dụng cụ, bước tăng tạ (kg), từ khoá video, không cần tạ
  var EXL = {
    smbench: ["Smith bench press", "smith", 2.5, "smith machine bench press"], bbbench: ["Barbell bench press", "barbell", 2.5, "barbell bench press"],
    dbbench: ["DB bench press", "db", 2, "dumbbell bench press"], machpress: ["Chest press máy", "upm", 2.5, "machine chest press"],
    incdb: ["Incline DB press", "db", 2, "incline dumbbell press"], incsmith: ["Incline Smith press", "smith", 2.5, "incline smith press"], incbb: ["Incline barbell press", "barbell", 2.5, "incline barbell press"],
    pecdeck: ["Pec deck", "pecdeck", 2.5, "pec deck fly"], cablefly: ["Cable fly", "cable", 2.5, "cable fly"], dbfly: ["DB fly", "db", 1, "dumbbell fly"],
    brow: ["Barbell row", "barbell", 2.5, "barbell row"], machrow: ["Row máy tựa ngực", "upm", 2.5, "chest supported machine row"],
    cablerow: ["Seated cable row", "cable", 2.5, "seated cable row"], dbrow: ["DB row 1 tay", "db", 2, "one arm dumbbell row"],
    latpd: ["Lat pulldown", "latpd", 2.5, "lat pulldown"], pullup: ["Pulldown tay ngửa", "latpd", 2.5, "underhand lat pulldown"], chinup: ["Pull-up xà đơn", "pullbar", 0, "pull up", 1],
    smohp: ["Smith OHP ngồi", "smith", 2.5, "seated smith shoulder press"], dbohp: ["DB shoulder press ngồi", "db", 2, "seated dumbbell shoulder press"], machohp: ["Shoulder press máy", "upm", 2.5, "machine shoulder press"],
    latraise: ["Lateral raise tạ đơn", "db", 1, "dumbbell lateral raise"], latcable: ["Lateral raise cáp", "cable", 1.25, "cable lateral raise"], latmach: ["Lateral raise máy", "upm", 2.5, "machine lateral raise"],
    tripd: ["Triceps pushdown", "cable", 2.5, "cable triceps pushdown"], ohtri: ["Triceps qua đầu (cáp)", "cable", 2.5, "overhead cable triceps extension"],
    dbohtri: ["Triceps qua đầu tạ đơn", "db", 2, "dumbbell overhead triceps extension"], skull: ["Skull crusher", "barbell", 2.5, "ez bar skull crusher"],
    dbcurl: ["DB curl", "db", 1, "dumbbell curl"], inccurl: ["Incline curl", "db", 1, "incline dumbbell curl"], cablecurl: ["Cable curl", "cable", 2.5, "cable curl"], ezcurl: ["EZ bar curl", "barbell", 2.5, "ez bar curl"],
    squat: ["Back squat", "barbell", 2.5, "barbell back squat"], hack: ["Hack squat", "hack", 5, "hack squat machine"], smsquat: ["Smith squat", "smith", 2.5, "smith machine squat"],
    legpress: ["Leg press", "legpress", 5, "leg press"], goblet: ["Goblet squat", "db", 2, "goblet squat"], legext: ["Leg extension", "legext", 2.5, "leg extension"],
    bss: ["Bulgarian split squat", "db", 2, "bulgarian split squat"],
    rdl: ["Romanian deadlift", "barbell", 2.5, "romanian deadlift"], dbrdl: ["DB Romanian deadlift", "db", 2, "dumbbell romanian deadlift"],
    dl: ["Deadlift", "barbell", 2.5, "conventional deadlift"], hipthrust: ["Hip thrust", "barbell", 2.5, "barbell hip thrust"],
    seatcurl: ["Leg curl ngồi", "seatcurl", 2.5, "seated leg curl"], legcurl: ["Leg curl nằm", "lycurl", 2.5, "lying leg curl"],
    dbcurlham: ["Leg curl tạ đơn nằm sấp", "db", 1, "dumbbell lying leg curl"], nordic: ["Nordic curl có trợ lực", "none", 0, "assisted nordic curl", 1],
    calfst: ["Calf raise đứng (máy)", "calfm", 2.5, "standing calf raise machine"], calflp: ["Calf raise máy đạp đùi", "legpress", 5, "leg press calf raise"],
    calfsm: ["Calf raise Smith", "smith", 2.5, "smith machine calf raise"], calfdb: ["Calf raise tạ đơn 1 chân", "db", 2, "single leg dumbbell calf raise"], calfsit: ["Calf raise ngồi", "calfseat", 2.5, "seated calf raise"],
    crunch: ["Cable crunch", "cable", 2.5, "kneeling cable crunch"], abmach: ["Ab crunch máy", "upm", 2.5, "ab crunch machine"],
    hlr: ["Hanging leg raise", "pullbar", 0, "hanging leg raise", 1], kneeraise: ["Nâng gối nằm ngửa", "none", 0, "lying knee raise", 1]
  };
  // Giáo án Upper/Lower xoay vòng, chia theo vị trí. c: các bài cho vị trí đó, xếp theo ưu tiên; app lấy bài đầu tiên có dụng cụ.
  // m: hiệp tính cho nhóm cơ (1 = cơ chính, 0,5 = cơ phụ).
  var PROGRAM = {
    UA: { name: "Upper A", sub: "Ngực, lưng làm chính", ex: [
      { id: "ua1", role: "Đẩy ngang", t: "C", s: 3, r: "6–8", m: { chest: 1, triceps: 0.5, delts: 0.5 }, c: ["smbench", "bbbench", "dbbench", "machpress"] },
      { id: "ua2", role: "Kéo ngang", t: "C", s: 3, r: "8–10", m: { back: 1, biceps: 0.5 }, c: ["brow", "machrow", "cablerow", "dbrow"] },
      { id: "ua3", role: "Đẩy dốc lên", t: "C", s: 3, r: "8–12", m: { chest: 1, delts: 0.5, triceps: 0.5 }, c: ["incdb", "incsmith", "incbb"] },
      { id: "ua4", role: "Kéo dọc", t: "C", s: 3, r: "10–12", m: { back: 1, biceps: 0.5 }, c: ["latpd", "chinup"] },
      { id: "ua5", role: "Tay sau", t: "I", s: 3, r: "10–15", m: { triceps: 1 }, c: ["tripd", "ohtri", "dbohtri", "skull"] },
      { id: "ua6", role: "Tay trước", t: "I", s: 3, r: "10–15", m: { biceps: 1 }, c: ["dbcurl", "cablecurl", "ezcurl"] },
      { id: "ua7", role: "Vai giữa", t: "I", s: 3, r: "12–15", m: { delts: 1 }, c: ["latraise", "latcable", "latmach"] }
    ]},
    LA: { name: "Lower A", sub: "Squat làm chính", ex: [
      { id: "la1", role: "Squat", t: "C", s: 3, r: "6–8", m: { quads: 1, hams: 0.5 }, c: ["squat", "hack", "smsquat", "goblet"] },
      { id: "la2", role: "Gập hông", t: "C", s: 3, r: "8–10", m: { hams: 1 }, c: ["rdl", "dbrdl"] },
      { id: "la3", role: "Duỗi gối", t: "I", s: 3, r: "10–15", m: { quads: 1 }, c: ["legext", "legpress", "goblet"] },
      { id: "la4", role: "Gập gối", t: "I", s: 3, r: "10–15", m: { hams: 1 }, c: ["seatcurl", "legcurl", "dbcurlham", "nordic"] },
      { id: "la5", role: "Bắp chân", t: "I", s: 3, r: "12–15", m: { calves: 1 }, c: ["calfst", "calflp", "calfsm", "calfdb"] },
      { id: "la6", role: "Bụng", t: "I", s: 3, r: "12–15", m: { abs: 1 }, c: ["crunch", "abmach", "kneeraise"] }
    ]},
    UB: { name: "Upper B", sub: "Vai, xô làm chính", ex: [
      { id: "ub1", role: "Đẩy dọc", t: "C", s: 3, r: "6–10", m: { delts: 1, triceps: 0.5 }, c: ["smohp", "dbohp", "machohp"] },
      { id: "ub2", role: "Kéo dọc", t: "C", s: 3, r: "6–10", m: { back: 1, biceps: 0.5 }, c: ["pullup", "chinup", "latpd"] },
      { id: "ub3", role: "Đẩy ngang", t: "C", s: 3, r: "8–12", m: { chest: 1, triceps: 0.5, delts: 0.5 }, c: ["dbbench", "machpress", "bbbench", "smbench"] },
      { id: "ub4", role: "Kéo ngang", t: "C", s: 3, r: "10–12", m: { back: 1, biceps: 0.5 }, c: ["cablerow", "machrow", "dbrow"] },
      { id: "ub5", role: "Vai giữa", t: "I", s: 3, r: "12–15", m: { delts: 1 }, c: ["latcable", "latraise", "latmach"] },
      { id: "ub6", role: "Tay trước (cơ duỗi dài)", t: "I", s: 3, r: "10–15", m: { biceps: 1 }, c: ["inccurl", "cablecurl", "dbcurl"] },
      { id: "ub7", role: "Tay sau qua đầu", t: "I", s: 3, r: "10–15", m: { triceps: 1 }, c: ["ohtri", "dbohtri", "skull"] },
      { id: "ub8", role: "Ép ngực", t: "I", s: 3, r: "12–15", m: { chest: 1 }, c: ["pecdeck", "cablefly", "dbfly"] }
    ]},
    LB: { name: "Lower B", sub: "Deadlift làm chính", ex: [
      { id: "lb1", role: "Gập hông nặng", t: "C", s: 3, r: "4–6", m: { hams: 1, back: 0.5, quads: 0.25 }, c: ["dl", "hipthrust"] },
      { id: "lb2", role: "Squat có tựa lưng", t: "C", s: 3, r: "8–12", m: { quads: 1, hams: 0.5 }, c: ["hack", "legpress", "bss", "smsquat"] },
      { id: "lb3", role: "Gập gối", t: "I", s: 3, r: "10–12", m: { hams: 1 }, c: ["seatcurl", "legcurl", "dbcurlham", "nordic"] },
      { id: "lb4", role: "Duỗi gối", t: "I", s: 3, r: "12–15", m: { quads: 1 }, c: ["legext", "legpress"] },
      { id: "lb5", role: "Bắp chân", t: "I", s: 3, r: "12–15", m: { calves: 1 }, c: ["calfsit", "calfst", "calfdb"] },
      { id: "lb6", role: "Bụng", t: "I", s: 3, r: "10–15", m: { abs: 1 }, c: ["hlr", "kneeraise", "crunch"] }
    ]}
  };
  var ORDER = ["UA", "LA", "UB", "LB"];
  var SLOT = {}, EXDB = {};
  ORDER.forEach(function (k) {
    PROGRAM[k].ex.forEach(function (sl) {
      SLOT[sl.id] = sl;
      sl.c.forEach(function (id) {
        if (EXDB[id]) return;
        var e = EXL[id];
        EXDB[id] = { id: id, n: e[0], eq: e[1], inc: e[2], q: e[3] + " form", bw: !!e[4], t: sl.t, r: sl.r, m: sl.m };
      });
    });
  });

  // Bữa tối tự ghép: đạm chính × phần thịt × cách nấu × vị. Thịt cân lúc sống; số liệu lấy từ db.js.
  var DPRO = {
    bo: { n: "Bò", cuts: [["bo_than", "Thăn"], ["bo_bap", "Bắp"]] },
    lon: { n: "Lợn", cuts: [["lon_nac", "Nạc thăn"], ["lon_vai", "Nạc vai"], ["lon_bachi", "Ba chỉ"]] },
    ga: { n: "Gà", cuts: [["ga_uc", "Ức"], ["ga_dui", "Đùi bỏ da"], ["ga_dui_da", "Đùi có da"]] },
    trung: { n: "Trứng", cuts: [["trung", "Trứng gà"]] }
  };
  // oil: gram dầu; sugar: gram đường; flav: các vị hợp với cách nấu
  var DSTY = {
    xao: { n: "Xào", oil: 10, sugar: 0, min: 15, flav: ["sa", "toi", "hanh"] },
    kho: { n: "Kho / rim", oil: 5, sugar: 5, min: 30, flav: ["gung", "tieu", "sa"] },
    luoc: { n: "Luộc / hấp", oil: 0, sugar: 0, min: 20, flav: ["gung", "sa", "toi"] },
    ap: { n: "Áp chảo / nồi chiên", oil: 5, sugar: 0, min: 20, flav: ["tieu", "toi", "sa"] }
  };
  var DFLAV = { sa: ["sả ớt", "2 cây sả, 1 quả ớt"], gung: ["gừng", "1 khúc gừng"], toi: ["tỏi", "3–4 tép tỏi"], tieu: ["tiêu", "tiêu đen xay"], hanh: ["hành tây", "nửa củ hành tây"] };
  var DVEG = ["rau_muong", "cai_ngot", "bap_cai", "sup_lo_xanh", "su_su", "bi_xanh", "dau_que", "rau_ngot", "mong_toi", "ca_chua", "nam"];
  function dName(o) {
    var f = DFLAV[o.flav][0], v = { xao: "xào", kho: "kho", luoc: "luộc", ap: "áp chảo" }[o.sty];
    if (o.pro === "trung") return { xao: "Trứng xào cà chua", kho: "Trứng kho " + f, luoc: "Trứng luộc", ap: "Trứng chiên hành" }[o.sty];
    var cut = DPRO[o.pro].cuts.filter(function (c) { return c[0] === o.cut; })[0][1].toLowerCase();
    return DPRO[o.pro].n + " " + (o.pro === "ga" && o.sty === "ap" ? "nướng" : v) + " " + f + " (" + cut + ")";
  }
  function dSteps(o) {
    var f = DFLAV[o.flav][0], P = o.pro === "bo" ? "bò" : o.pro === "lon" ? "thịt lợn" : "gà";
    if (o.pro === "trung") return {
      xao: ["Xào 1–2 quả cà chua với tỏi phi đến khi mềm.", "Đánh trứng với chút nước mắm, tiêu, đổ vào chảo, đảo nhẹ đến khi vừa chín.", "Rau luộc ăn kèm."],
      kho: ["Luộc chín trứng 9 phút, bóc vỏ.", "Kho với nước mắm, " + f + ", hành tím, 1 thìa cà phê đường và chút nước, lửa nhỏ 15 phút.", "Rau luộc ăn kèm."],
      luoc: ["Cho trứng vào nước sôi: 7 phút lòng đào, 9–10 phút chín kỹ.", "Ngâm nước lạnh rồi bóc. Chấm muối tiêu.", "Luộc rau ngay nồi đó."],
      ap: ["Đánh trứng với hành lá, nước mắm, tiêu.", "Chảo chống dính, ít dầu, lửa vừa, chiên 2–3 phút mỗi mặt.", "Rau luộc ăn kèm."]
    }[o.sty];
    return {
      xao: ["Thái " + P + " mỏng" + (o.pro === "bo" ? " ngang thớ" : "") + ".", "Ướp " + f + ", tỏi, nước mắm, tiêu, 1 thìa cà phê dầu, 10 phút.", "Chảo thật nóng, xào lửa to " + (o.pro === "bo" ? "2–3" : "4–5") + " phút đến khi vừa chín, nhấc ra.", "Xào rau ngay chảo đó, trộn lại với thịt, nêm vừa."],
      kho: ["Cắt " + P + " miếng vừa ăn.", "Ướp nước mắm, " + f + ", tiêu, 1 thìa cà phê đường, 15 phút.", "Phi hành tím, cho thịt vào đảo săn.", "Thêm chút nước, kho lửa nhỏ " + (o.pro === "bo" ? "40" : "20–25") + " phút đến khi sệt. Rau luộc ăn kèm."],
      luoc: ["Cho " + P + " vào nồi nước lạnh cùng " + f + ", chút muối.", "Đun sôi rồi hạ lửa nhỏ: " + (o.pro === "bo" ? "bắp bò 40–50 phút, thăn nhúng 1–2 phút" : o.pro === "ga" ? "ức 12–15 phút, đùi 20 phút" : "15–20 phút") + ".", "Thái miếng, chấm nước mắm tỏi ớt. Luộc rau bằng nước luộc thịt."],
      ap: ["Lạng " + P + " dày đều 1–1,5cm, thấm khô.", "Ướp " + f + ", muối, tiêu 10 phút.", "Chảo thật nóng, ít dầu, áp mỗi mặt 3–4 phút (nồi chiên 180°C, 12–15 phút).", "Để nghỉ 3 phút rồi thái. Rau luộc hoặc xào ăn kèm."]
    }[o.sty];
  }
  function fid(id) { return FitDB.FOODS.filter(function (f) { return f.id === id; })[0]; }
  // Thành phần của một món ghép (gram)
  function dParts(o) {
    var out = [];
    if (o.pro === "trung") out.push({ id: "trung", g: o.eggs * 50 });
    else { out.push({ id: o.cut, g: o.meat }); if (o.eggs) out.push({ id: "trung", g: o.eggs * 50 }); }
    if (o.pro === "trung" && o.sty === "xao") out.push({ id: "ca_chua", g: 150 });
    if (o.veg && o.vegG) out.push({ id: o.veg, g: o.vegG });
    if (o.rice) out.push({ id: "com", g: o.rice });
    if (o.oil) out.push({ id: "dau_an", g: o.oil });
    var sg = DSTY[o.sty].sugar; if (sg) out.push({ id: "duong", g: sg });
    return out;
  }
  function dSum(o) { return dParts(o).reduce(function (a, x) { var r = FitDB.calc(fid(x.id), x.g); a.kcal += r.kcal; a.p += r.p; a.c += r.c; a.f += r.f; return a; }, { kcal: 0, p: 0, c: 0, f: 0 }); }
  // Tự tính lượng: đạm bữa tối nhắm phần còn thiếu nhưng tối đa ~0,6 g/kg (lượng một bữa cơ thể dùng tốt; phần dư bù ở bữa phụ),
  // cơm lấp phần calo còn lại; nếu thịt nhiều mỡ làm vượt calo thì bớt thịt để vẫn giữ được ít nhất 100g cơm.
  function dAuto(o, b) {
    var kg = trendNow() || S.profile.weight, pT = clamp(b.p, 25, Math.round(0.6 * kg)), egg = o.pro === "trung", cut = fid(egg ? "trung" : o.cut);
    var fitRice = function () { var other = dSum(Object.assign({}, o, { rice: 0 })).kcal; o.rice = clamp(Math.round((b.kcal - other) / 1.3 / 10) * 10, 0, 300); };
    o.oil = DSTY[o.sty].oil; o.rice = 150;
    for (var it = 0; it < 2; it++) {
      var rest = dSum(Object.assign({}, o, egg ? { eggs: 0 } : { meat: 0 })), need = Math.max(0, pT - rest.p);
      if (egg) o.eggs = clamp(Math.round(need / (cut.p / 2)), 2, 4);
      else o.meat = clamp(Math.round(need / (cut.p / 100) / 10) * 10, 80, 250);
      fitRice();
    }
    if (!egg && o.rice < 100) {
      var base = dSum(Object.assign({}, o, { meat: 0, rice: 0 })).kcal, room = b.kcal - base - 130;
      o.meat = clamp(Math.floor(room / (cut.kcal / 100) / 10) * 10, 80, o.meat); fitRice();
    }
    return o;
  }
  // Loại đạm ăn gần nhất cách đây bao nhiêu ngày (dựa trên thành phần đã ghi, hoặc tên món)
  function proAge(pro, k) {
    var ids = DPRO[pro].cuts.map(function (c) { return c[0]; }).concat(pro === "lon" ? ["lon_chin", "lon_bachi_chin", "lon_luoc", "heo_quay", "thit_nuong", "xa_xiu", "lon_xay"] : pro === "bo" ? ["bo_chin", "bo_xay"] : pro === "ga" ? ["ga_uc_chin", "ga_dui_chin", "ga_ta", "ga_ran", "ga_xe"] : ["trung_chien"]);
    var rx = { bo: /\bbo\b/, lon: /\b(lon|heo|thit kho|ba chi|suon)\b/, ga: /\bga\b/, trung: /\btrung\b/ }[pro];
    for (var i = 0; i <= 4; i++) if (dayFood(shiftKey(k, -i)).some(function (m) { return m.parts ? m.parts.some(function (x) { return ids.indexOf(x.id) >= 0; }) : rx.test(norm(m.n)); })) return i;
    return 9;
  }
  function dinnerIdeas(k) {
    var b = dinnerBudget(k), seed = parseKey(k).getDate(), stys = ["xao", "kho", "ap", "luoc"];
    return ["bo", "lon", "ga", "trung"].map(function (pro, i) { return { pro: pro, age: proAge(pro, k), i: i }; })
      .sort(function (x, y) { return y.age - x.age || (x.i + seed) % 4 - (y.i + seed) % 4; }).slice(0, 3)
      .map(function (x, j) {
        var sty = stys[(seed + j * 3 + x.i) % 4], fl = DSTY[sty].flav;
        return dAuto({ pro: x.pro, cut: DPRO[x.pro].cuts[0][0], sty: sty, flav: fl[(seed + j) % fl.length], veg: DVEG[(seed * 3 + j * 5) % DVEG.length], vegG: 250, eggs: x.pro === "trung" ? 3 : 0 }, b);
      });
  }


  // =====================================================================
  // Tiện ích
  // =====================================================================
  var WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  var MONTHS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function keyOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseKey(k) { var p = String(k).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function todayKey() { return keyOf(new Date()); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function shiftKey(k, n) { return keyOf(addDays(parseKey(k), n)); }
  function daysBetween(a, b) { return Math.round((parseKey(b) - parseKey(a)) / 86400000); }
  function weekStart(d) { return addDays(d, -((d.getDay() + 6) % 7)); }
  function shortDate(k) { var d = parseKey(k); return WD[d.getDay()] + " " + pad(d.getDate()) + "/" + pad(d.getMonth() + 1); }
  function friendly(k) { var t = todayKey(); return k === t ? "Hôm nay" : k === shiftKey(t, -1) ? "Hôm qua" : shortDate(k); }
  function fmt(v) { return String(Math.round(v * 10) / 10).replace(".", ","); }
  function int(v) { return Math.round(v).toLocaleString("vi-VN"); }
  function pct(v) { return (v > 0 ? "+" : "") + fmt(v) + "%"; }
  function num(s) { var n = parseFloat(String(s == null ? "" : s).replace(",", ".")); return isNaN(n) ? null : n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); }
  function range(r) { var m = String(r).match(/(\d+)\s*[–-]\s*(\d+)/); return m ? { lo: +m[1], hi: +m[2] } : { lo: 8, hi: 12 }; }
  function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function roundTo(x, step) { return step ? Math.round(x / step) * step : x; }

  // =====================================================================
  // Lưu trữ
  // =====================================================================
  var KEY = "fitcore3";
  var S = null;
  function blank() {
    return {
      v: 3,
      profile: null,          // { sex, age, height, weight, act, rate, pkg, weekly, start, tdee0 }
      plan: null,             // mục tiêu đang dùng { kcal, p, tdee, date }
      checkins: [],           // lịch sử điều chỉnh hằng tuần
      swaps: {},              // vị trí -> bài bạn chọn
      equip: { seatcurl: false }, equipSet: false, // dụng cụ phòng tập
      workouts: [],           // { id, date, ts, key, dur, ex: [{ id, sets: [{kg, reps, rir}] }] }, mới nhất trước
      draft: null,            // buổi đang tập
      food: {},               // ngày -> [{ id, n, kcal, p, c, f, base, mul, ts, rid }]
      weight: {}, waist: {}, neck: {}, hip: {},  // ngày -> số đo (kg, cm)
      custom: [],
      cardio: [],             // { id, date, type, lv, min, kcal } cầu lông và cardio             // đồ đóng gói tự thêm: { id, n, kcal, p, c, f (trên 100g hoặc 1 gói), units, noG }
      lastBackup: null
    };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        S = Object.assign(blank(), JSON.parse(raw));
        // Bản 3.0 lưu đổi bài theo mã bài cũ; bỏ đi vì giáo án giờ chia theo vị trí
        Object.keys(S.swaps).forEach(function (k) { if (!SLOT[k]) delete S.swaps[k]; });
        if (S.draft && S.draft.ex.some(function (e) { return !SLOT[e.slot]; })) S.draft = null;
        return;
      }
    } catch (e) {}
    S = blank();
    // Bắt đầu lại từ đầu: xoá dữ liệu của các bản trước
    try { localStorage.removeItem("so-tap-recomp-app-v1"); } catch (e) {}
    try { if (window.indexedDB) indexedDB.deleteDatabase("so-tap-photos"); } catch (e) {}
  }
  var saveT = null;
  function save() { clearTimeout(saveT); saveT = setTimeout(flush, 120); }
  function flush() { clearTimeout(saveT); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Không lưu được: bộ nhớ đầy hoặc bị chặn."); } }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });

  // =====================================================================
  // Khoa học: sức mạnh, khối lượng, tăng tiến
  // =====================================================================

  // 1RM ước tính có tính RIR: số rep tối đa làm được = rep + RIR (công thức Epley)
  function e1rm(kg, reps, rir) { return kg > 0 ? kg * (1 + (reps + (rir || 0)) / 30) : 0; }
  function hasEq(id) { var e = EXDB[id]; return !!e && (e.eq === "none" || S.equip[e.eq] !== false); }
  // Bài đang dùng cho một vị trí: bài bạn đã chọn (nếu còn dụng cụ), không thì bài ưu tiên đầu tiên có dụng cụ
  function actualEx(slot) {
    var a = S.swaps[slot.id];
    if (a && slot.c.indexOf(a) >= 0 && hasEq(a)) return EXDB[a];
    for (var i = 0; i < slot.c.length; i++) if (hasEq(slot.c[i])) return EXDB[slot.c[i]];
    return EXDB[slot.c[0]];
  }
  function bestE(sets) { return sets.reduce(function (m, s) { return Math.max(m, e1rm(s.kg, s.reps, s.rir)); }, 0); }
  function hardSets(sets) { return sets.filter(function (s) { return s.reps > 0 && (s.rir == null || s.rir <= 3); }).length; }
  // Lịch sử một bài: mỗi buổi một điểm, cũ trước
  function exHistory(id) {
    var out = [];
    for (var i = S.workouts.length - 1; i >= 0; i--) {
      var w = S.workouts[i], e = w.ex.filter(function (x) { return x.id === id; })[0];
      if (e && e.sets.length) out.push({ date: w.date, sets: e.sets, e: bestE(e.sets), fb: e.fb });
    }
    return out;
  }
  function lastSets(id) { var h = exHistory(id); return h.length ? h[h.length - 1] : null; }

  // Gợi ý buổi tới theo tăng tiến kép có RIR:
  // đạt đỉnh khoảng rep ở mọi hiệp mà vẫn còn dư ≥ (RIR mục tiêu − 1) thì tăng tạ; quá nặng thì giảm; còn lại giữ tạ, thêm rep.
  // Phản hồi sau bài (kiểu RP): đau khớp 1 lần, hoặc không cảm nhận cơ 2 trong 3 buổi gần nhất → nên đổi bài
  function swapAdvice(slot) {
    var act = actualEx(slot), h = exHistory(act.id).slice(-3), fbs = h.map(function (x) { return x.fb; });
    var pain = fbs.length && fbs[fbs.length - 1] === "pain", nofeel = fbs.filter(function (f) { return f === "nofeel"; }).length >= 2;
    if (!pain && !nofeel) return null;
    var alt = slot.c.filter(function (id) { return id !== act.id && hasEq(id); })[0];
    return { why: pain ? "Buổi trước bạn báo đau khớp ở bài này." : "2 buổi gần đây bạn không cảm nhận được cơ.", alt: alt };
  }
  function suggest(slot) {
    var act = actualEx(slot), rg = range(slot.r), tr = slot.t === "C" ? 2 : 1, last = lastSets(act.id);
    if (!last) return { kg: act.bw ? 0 : null, reps: rg.hi, rir: tr, why: act.bw ? "Lần đầu: làm tới khi còn dư " + tr + " rep." : "Lần đầu: chọn mức tạ làm được khoảng " + rg.hi + " rep mà còn dư " + tr + " rep." };
    var top = Math.max.apply(null, last.sets.map(function (s) { return s.kg; })), atTop = last.sets.filter(function (s) { return s.kg === top; });
    var inc = act.inc || 2.5;
    if (act.bw || !top) {
      var mr = Math.max.apply(null, last.sets.map(function (s) { return s.reps; }));
      return { kg: top, reps: mr + 1, rir: tr, why: "Lần trước tối đa " + mr + " rep → thêm 1 rep mỗi hiệp." };
    }
    var hit = atTop.length >= Math.min(2, slot.s) && atTop.every(function (s) { return s.reps >= rg.hi && (s.rir == null || s.rir >= tr - 1); });
    var tooHeavy = last.sets.some(function (s) { return s.reps < rg.lo && s.rir === 0; });
    if (hit) return { kg: top + inc, reps: rg.lo, rir: tr, why: "Đạt " + rg.hi + " rep mọi hiệp ở " + fmt(top) + "kg → tăng " + fmt(inc) + "kg." };
    if (tooHeavy) { var dn = roundTo(top * 0.93, inc || 2.5); return { kg: dn, reps: rg.lo, rir: tr, why: "Lần trước hụt rep khi đã kiệt sức → giảm còn " + fmt(dn) + "kg." }; }
    var best = Math.max.apply(null, atTop.map(function (s) { return s.reps; }));
    return { kg: top, reps: Math.min(rg.hi, best + 1), rir: tr, why: "Giữ " + fmt(top) + "kg, cố đạt " + Math.min(rg.hi, best + 1) + " rep." };
  }

  // Báo cáo sức mạnh: so 7 ngày gần nhất với 7 ngày trước đó, xu hướng 4 tuần, phát hiện chững lại
  function strengthReport() {
    var t = todayKey(), a7 = shiftKey(t, -6), a14 = shiftKey(t, -13), a28 = shiftKey(t, -27), seen = {}, rows = [];
    S.workouts.forEach(function (w) { w.ex.forEach(function (e) { seen[e.id] = 1; }); });
    Object.keys(seen).forEach(function (id) {
      var ex = EXDB[id]; if (!ex || ex.bw) return;
      var h = exHistory(id); if (!h.length) return;
      var inR = function (x, y) { return h.filter(function (p) { return p.date >= x && p.date <= y; }).reduce(function (m, p) { return Math.max(m, p.e); }, 0); };
      var cur = inR(a7, t), prev = inR(a14, shiftKey(a7, -1)), old = inR(a28, shiftKey(t, -21));
      var wk = cur && prev ? (cur / prev - 1) * 100 : null, m4 = cur && old ? ((cur / old - 1) * 100) / (daysBetween(a28, t) / 7) : null;
      // Chững: 3 buổi gần nhất không vượt được kỷ lục trước đó
      var stall = false;
      if (h.length >= 5) { var recent = h.slice(-3), before = h.slice(0, -3); stall = Math.max.apply(null, recent.map(function (p) { return p.e; })) <= Math.max.apply(null, before.map(function (p) { return p.e; })) * 1.005; }
      rows.push({ id: id, ex: ex, e: h[h.length - 1].e, wk: wk, m4: m4, stall: stall, n: h.length, compound: ex.t === "C" });
    });
    return rows.sort(function (x, y) { return (y.compound - x.compound) || (y.n - x.n); });
  }
  // Số hiệp nặng mỗi nhóm cơ trong khoảng ngày
  function volume(from, to) {
    var v = {}; Object.keys(MUSCLES).forEach(function (m) { v[m] = 0; });
    S.workouts.forEach(function (w) {
      if (w.date < from || w.date > to) return;
      w.ex.forEach(function (e) { var ex = EXDB[e.id]; if (!ex) return; var n = hardSets(e.sets); Object.keys(ex.m).forEach(function (m) { v[m] += n * ex.m[m]; }); });
    });
    return v;
  }

  // =====================================================================
  // Khoa học: năng lượng (kiểu MacroFactor)
  // =====================================================================
  var ACTS = [[1.35, "Ít vận động ngoài giờ tập"], [1.5, "Đi lại vừa phải (đi làm văn phòng, 6–8 nghìn bước)"], [1.65, "Vận động nhiều (trên 10 nghìn bước, lao động)"]];
  var RATES = [[0, "Giữ cân, tăng cơ chậm"], [-0.25, "Recomp chậm (−0,25%/tuần)"], [-0.5, "Giảm mỡ, giữ cơ (−0,5%/tuần)"], [-0.75, "Giảm mỡ nhanh (−0,75%/tuần)"]];
  function bmr(p, w) { return 10 * w + 6.25 * p.height - 5 * p.age + (p.sex === "m" ? 5 : -161); }
  // Cân xu hướng: trung bình trượt hàm mũ (hệ số 0,1/ngày), lọc dao động nước
  function trendSeries() {
    var keys = Object.keys(S.weight).sort(), out = {};
    if (!keys.length) return out;
    var t = S.weight[keys[0]], d = keys[0], end = todayKey();
    while (d <= end) { if (S.weight[d] != null) t = t + 0.1 * (S.weight[d] - t); out[d] = t; d = shiftKey(d, 1); }
    return out;
  }
  function trendNow() { var s = trendSeries(), k = Object.keys(s); return k.length ? s[k[k.length - 1]] : (S.profile ? S.profile.weight : null); }
  function dayFood(k) { return S.food[k] || []; }
  function daySum(k) { return dayFood(k).reduce(function (a, m) { return { kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + (m.c || 0), f: a.f + (m.f || 0) }; }, { kcal: 0, p: 0, c: 0, f: 0 }); }
  // Ngày được tính là "ghi đủ" khi tổng ≥ 60% mục tiêu; ngày ghi thiếu bị bỏ qua để không kéo sai TDEE
  function loggedDay(k) { return S.plan && daySum(k).kcal >= S.plan.kcal * 0.6; }
  // TDEE thật = calo ăn trung bình − năng lượng tương ứng với thay đổi cân xu hướng (≈7.700 kcal/kg)
  function estimateTDEE() {
    var p = S.profile; if (!p) return null;
    var prior = p.tdee0, ts = trendSeries(), end = shiftKey(todayKey(), -1), start = shiftKey(end, -20), days = [];
    for (var d = start; d <= end; d = shiftKey(d, 1)) if (loggedDay(d)) days.push(d);
    var tk = Object.keys(ts).filter(function (k) { return k >= start && k <= end; });
    var wCount = Object.keys(S.weight).filter(function (k) { return k >= start && k <= end; }).length;
    if (days.length < 7 || tk.length < 10 || wCount < 4) return { tdee: prior, est: null, conf: 0, days: days.length, wCount: wCount };
    var intake = avg(days.map(function (k) { return daySum(k).kcal; })), span = daysBetween(tk[0], tk[tk.length - 1]);
    var est = intake - (ts[tk[tk.length - 1]] - ts[tk[0]]) * 7700 / span, conf = clamp((days.length - 6) / 12, 0, 1);
    return { tdee: Math.round(prior * (1 - conf) + est * conf), est: Math.round(est), conf: conf, days: days.length, wCount: wCount, intake: intake };
  }
  function planFrom(tdee) {
    var p = S.profile, w = trendNow() || p.weight, deficit = (p.rate / 100) * w * 7700 / 7;
    return { kcal: Math.round(Math.max(bmr(p, w) * 1.1, tdee + deficit) / 10) * 10, p: Math.round(p.pkg * w / 5) * 5, tdee: Math.round(tdee), date: todayKey() };
  }
  // Check-in thứ Hai: tự chỉnh mục tiêu theo TDEE ước tính
  function autoCheckin() {
    if (!S.profile || !S.plan) return;
    var mon = keyOf(weekStart(new Date()));
    if (S.plan.date >= mon) return;
    var r = estimateTDEE(), np = planFrom(r.tdee), old = S.plan;
    S.checkins.unshift({ date: todayKey(), tdee: np.tdee, est: r.est, kcal: np.kcal, p: np.p, from: old.kcal });
    S.plan = np; flush();
    UI.banner = "Mục tiêu tuần này đã cập nhật: " + int(np.kcal) + " kcal (" + (np.kcal >= old.kcal ? "+" : "") + int(np.kcal - old.kcal) + "), " + np.p + "g đạm.";
  }

  // =====================================================================
  // Giao diện chung
  // =====================================================================
  var UI = { tab: "train", date: todayKey(), sel: null, banner: "", calMode: "month", calMonth: todayKey().slice(0, 7), chartEx: null, exOpen: {} };
  var view = document.getElementById("view"), fab = document.getElementById("fab");
  function render() {
    var ae = document.activeElement, fid = ae && ae.id && view.contains(ae) ? ae.id : null;
    document.querySelectorAll("#nav button").forEach(function (b) { if (b.getAttribute("data-tab") === UI.tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
    view.innerHTML = !S.profile ? vWelcome() : UI.tab === "train" ? vTrain() : UI.tab === "food" ? vFood() : vProgress();
    fab.hidden = !(S.profile && UI.tab === "food");
    if (fid) { var el = document.getElementById(fid); if (el) el.focus({ preventScroll: true }); }
  }
  function vWelcome() {
    return '<div class="card"><h2>Chào bạn</h2><p>FitCore cần vài thông tin để tính mức calo và đạm khởi đầu. Sau 2–3 tuần ghi cân và ăn uống, app sẽ tự chỉnh theo cơ thể thật của bạn.</p><button class="btn" data-act="profile">Bắt đầu</button></div>';
  }

  // =====================================================================
  // TẬP
  // =====================================================================
  // Buổi tiếp theo = buổi lâu chưa tập nhất, nên đổi thứ tự (vd. làm Upper trước vì hôm qua đánh cầu) vẫn không bị sót buổi
  function lastDone() { var last = {}; S.workouts.forEach(function (w) { if (last[w.key] == null) last[w.key] = w.ts; }); return last; }
  function oldestOf(keys) { var last = lastDone(); return keys.slice().sort(function (a, b) { return (last[a] || 0) - (last[b] || 0) || ORDER.indexOf(a) - ORDER.indexOf(b); })[0]; }
  function nextKey() { return oldestOf(ORDER); }
  function isLower(k) { return k.charAt(0) === "L"; }

  // Cardio. MET theo Compendium of Physical Activities (bản 2024 cho cầu lông; 2011 cho đi bộ dốc, elliptical).
  // Calo đốt thêm = (MET − 1) × kg × giờ, tức phần vượt so với ngồi yên; chỉ tính thời gian vận động thật.
  var CARDIO = {
    bad: { n: "Cầu lông", ic: "🏸", lv: [["Đánh đôi nhẹ nhàng", 5.5], ["Đánh căng (đơn, đôi)", 7], ["Thi đấu tính điểm", 9]], lvDef: 1, min: 150 },
    walk: { n: "Đi bộ dốc", ic: "⛰️", lv: [["Dốc 1–5%", 5.3], ["Dốc 6–15%", 8]], lvDef: 0, min: 30 },
    ell: { n: "Elliptical", ic: "🔁", lv: [["Vừa sức", 5], ["Mạnh", 9]], lvDef: 0, min: 30 },
    out: { n: "Đi bộ nhanh ngoài trời", ic: "🚶", lv: [["Nhanh (khoảng 5,6 km/h)", 4.3]], lvDef: 0, min: 30 }
  };
  var LIGHT_GOAL = 2; // buổi cardio nhẹ mỗi tuần, ngoài cầu lông
  // Giá trị mặc định lần đầu; sau đó app nhớ lần ghi gần nhất của từng loại
  var CDEF = { bad: { lv: 1, min: 150 }, walk: { lv: 0, min: 30, spd: 5.5, inc: 8 }, ell: { lv: 0, min: 30, hr: null }, out: { lv: 0, min: 30 } };
  var CMIN = { bad: [90, 120, 150, 180], walk: [20, 30, 45], ell: [20, 30, 45], out: [20, 30, 45, 60] };
  // Tính MET cho một buổi:
  // - Đi bộ dốc có tốc độ và độ dốc: công thức chuyển hoá ACSM. Đi bộ: VO2 = 0,1·v + 1,8·v·dốc + 3,5; chạy (trên 7,5 km/h): VO2 = 0,2·v + 0,9·v·dốc + 3,5 (v: m/phút). MET = VO2 / 3,5.
  // - Elliptical có nhịp tim trung bình: công thức Keytel 2005 (theo nhịp tim, cân nặng, tuổi, giới tính).
  // - Còn lại: MET theo Compendium.
  function cardioCalc(e) {
    var w = trendNow() || S.profile.weight, met, how;
    if (e.type === "walk" && e.spd > 0) {
      var v = e.spd * 1000 / 60, g = (e.inc || 0) / 100, run = e.spd > 7.5;
      met = (run ? 0.2 * v + 0.9 * v * g : 0.1 * v + 1.8 * v * g) / 3.5 + 1; how = "công thức ACSM (" + (run ? "chạy" : "đi bộ") + ")";
    } else if (e.type === "ell" && e.hr >= 80) {
      var p = S.profile, kj = p.sex === "f" ? -20.4022 + 0.4472 * e.hr - 0.1263 * w + 0.074 * p.age : -55.0969 + 0.6309 * e.hr + 0.1988 * w + 0.2017 * p.age;
      met = Math.max(1.5, kj / 4.184 * 60 / w); how = "theo nhịp tim (Keytel 2005)";
    } else { met = CARDIO[e.type].lv[e.lv || 0][1]; how = "theo bảng Compendium"; }
    return { met: Math.round(met * 10) / 10, kcal: Math.round((met - 1) * w * (e.min || 0) / 60), how: how };
  }
  function cMet(c) { return c.met || CARDIO[c.type].lv[c.lv || 0][1]; }
  function cardioDesc(c) {
    var C = CARDIO[c.type];
    if (c.type === "walk" && c.spd) return fmt(c.spd) + " km/h · dốc " + fmt(c.inc || 0) + "%";
    return C.lv[c.lv || 0][0].toLowerCase() + (c.hr ? " · nhịp tim " + c.hr : "");
  }
  function cardioIn(a, b) { return (S.cardio || []).filter(function (c) { return c.date >= a && c.date <= b; }); }
  // Phút quy đổi theo WHO: phút vận động mạnh (≥ 6 MET) tính gấp đôi phút vận động vừa
  function modMinutes(list) { return list.reduce(function (a, c) { return a + c.min * (cMet(c) >= 6 ? 2 : 1); }, 0); }
  function hrZone() { var mx = 220 - S.profile.age; return [Math.round(mx * 0.64), Math.round(mx * 0.76)]; }
  // Gợi ý hôm nay, dựa trên những gì đã ghi thật (lịch không cố định)
  function todayPlan() {
    var t = todayKey(), y = shiftKey(t, -1), ws = keyOf(weekStart(new Date())), wd = new Date().getDay();
    var wk = cardioIn(ws, t), light = wk.filter(function (c) { return c.type !== "bad"; }).length, badWeek = wk.some(function (c) { return c.type === "bad"; });
    var badT = cardioIn(t, t).some(function (c) { return c.type === "bad"; }), badY = cardioIn(y, y).some(function (c) { return c.type === "bad"; });
    var liftT = S.workouts.filter(function (w) { return w.date === t; })[0], lifts = weekCount(), goal = S.profile.weekly;
    var key = nextKey(), msg = "", extra = "";
    var lightTip = light < LIGHT_GOAL ? "20–30 phút đi bộ dốc hoặc elliptical nhẹ, vẫn nói chuyện được (buổi cardio nhẹ " + (light + 1) + "/" + LIGHT_GOAL + " của tuần)" : "";
    if (badT) { msg = "Hôm nay đã đánh cầu. Nghỉ tạ, ăn đủ tinh bột và đạm để chân hồi phục."; key = null; }
    else if (liftT) { msg = "Hôm nay đã tập " + PROGRAM[liftT.key].name + "."; extra = lightTip && !isLower(liftT.key) ? "Còn sức thì thêm " + lightTip + "." : "Nghỉ ngơi, ngủ đủ 7–9 tiếng."; key = null; }
    else if (lifts >= goal) { msg = "Đủ " + goal + " buổi tạ tuần này."; extra = lightTip ? "Hôm nay có thể làm " + lightTip + ", hoặc nghỉ." : "Nghỉ ngơi hoặc đi bộ nhẹ."; key = null; }
    else {
      if (badY && isLower(key)) { key = oldestOf(["UA", "UB"]); msg = "Hôm qua đánh cầu, chân cần thêm thời gian hồi phục: làm " + PROGRAM[key].name + " trước, buổi chân để hôm khác."; }
      else if (!badWeek && (wd === 5 || wd === 6) && isLower(key)) { msg = "Nếu mai đánh cầu, nên làm " + PROGRAM[oldestOf(["UA", "UB"])].name + " hôm nay để chân còn khoẻ. Không đánh thì cứ tập " + PROGRAM[key].name + ". Chọn buổi ở hàng bên dưới."; }
      if (lightTip && !isLower(key)) extra = "Sau buổi tạ có thể thêm " + lightTip + ".";
    }
    return { key: key, msg: msg, extra: extra, light: light, badWeek: badWeek, lifts: lifts, goal: goal, wk: wk };
  }
  function weekCount() { var ws = keyOf(weekStart(new Date())); return S.workouts.filter(function (w) { return w.date >= ws; }).length; }
  function vTrain() {
    if (S.draft) return vWorkout();
    var plan = todayPlan(), nk = plan.key || nextKey(); if (!UI.sel) UI.sel = nk;
    var P = PROGRAM[UI.sel], h = "";
    if (UI.banner) h += '<div class="banner good">' + esc(UI.banner) + "</div>";
    var ws = weekStart(new Date()), tk = todayKey(), dots = "";
    for (var di = 0; di < 7; di++) {
      var dk = keyOf(addDays(ws, di)), wo = S.workouts.filter(function (w) { return w.date === dk; })[0], cd = cardioIn(dk, dk), bad = cd.some(function (c) { return c.type === "bad"; }), lt = cd.some(function (c) { return c.type !== "bad"; });
      dots += '<span class="wd' + (wo || bad ? " on" : "") + (dk === tk ? " today" : "") + (lt ? " lt" : "") + (wo && bad ? " bd" : "") + '"><i>' + (wo ? PROGRAM[wo.key].name.replace(/[a-z ]/g, "") : bad ? "🏸" : "") + "</i>" + WD[(di + 1) % 7] + "</span>";
    }
    var mins = P.ex.reduce(function (a, sl) { return a + sl.s * (sl.t === "C" ? 3 : 2); }, 0);
    h += '<div class="hero-t"><div class="row between"><span class="eyebrow">' + (plan.key && UI.sel === plan.key ? "Gợi ý hôm nay" : UI.sel === nk ? "Buổi kế tiếp" : "Xem trước") + '</span><span class="eyebrow">Tạ ' + plan.lifts + "/" + plan.goal + " · 🏸 " + (plan.badWeek ? "✓" : "–") + " · nhẹ " + plan.light + "/" + LIGHT_GOAL + '</span></div><div class="ht-name">' + P.name + '</div><div class="ht-sub">' + P.sub + " · " + P.ex.length + " bài · khoảng " + Math.round(mins / 5) * 5 + " phút</div>" +
      (plan.msg || plan.extra ? '<div class="ht-tip">' + esc(plan.msg) + (plan.msg && plan.extra ? " " : "") + esc(plan.extra) + "</div>" : "") + '<div class="week">' + dots + '</div><button class="btn light" data-act="start">Bắt đầu ' + P.name + "</button></div>";
    if (!S.equipSet) h += '<div class="banner warn"><b>Phòng tập của bạn có gì?</b> Chọn một lần để app chỉ xếp bài bạn làm được. <button class="btn sm dark" data-act="equip" style="margin-top:8px">Chọn dụng cụ</button></div>';
    h += '<div class="cquick">' + ["bad", "walk", "ell", "out"].map(function (k) { return '<button data-act="cardio" data-v="' + k + '"><span>' + CARDIO[k].ic + "</span>" + (k === "out" ? "Đi bộ" : CARDIO[k].n) + "</button>"; }).join("") + "</div>";
    h += '<div class="seg">' + ORDER.map(function (k) { return '<button aria-pressed="' + (k === UI.sel) + '" data-act="sel" data-v="' + k + '">' + PROGRAM[k].name + "</button>"; }).join("") + "</div>";
    h += '<div class="card"><div class="row between"><h2>Các bài hôm nay</h2><span class="note">bộ × kg × rep</span></div><div>';
    P.ex.forEach(function (slot) {
      var act = actualEx(slot), sg = suggest(slot), adv = swapAdvice(slot);
      h += '<div class="next-ex"><span>' + esc(act.n) + (adv ? ' <span class="flag">Nên đổi</span>' : "") + (hasEq(act.id) ? "" : ' <span class="flag">Thiếu máy</span>') + '<br><span class="note">' + slot.role + "</span></span><span>" + slot.s + " × " + (sg.kg != null && sg.kg > 0 ? fmt(sg.kg) + "kg × " + sg.reps : slot.r + " rep") + "</span></div>";
    });
    h += "</div></div>";
    h += cardioCard(plan);
    var v = volume(shiftKey(todayKey(), -6), todayKey()), low = Object.keys(MUSCLES).filter(function (m) { return v[m] < MUSCLES[m][1]; });
    if (S.workouts.length) h += '<p class="note">7 ngày qua còn thiếu hiệp ở: ' + (low.length ? low.map(function (m) { return MUSCLES[m][0].toLowerCase(); }).join(", ") : "không nhóm nào") + '. Xem chi tiết ở mục Tiến độ.</p>';
    return h;
  }
  function cardioCard(plan) {
    var t = todayKey(), ws = keyOf(weekStart(new Date())), z = hrZone(), list = cardioIn(shiftKey(t, -13), t).sort(function (a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : b.id < a.id ? -1 : 1; });
    var wk = plan.wk, kc = wk.reduce(function (a, c) { return a + c.kcal; }, 0), mm = modMinutes(wk);
    var h = '<div class="card"><div class="row between"><h2>Cardio và cầu lông</h2><span class="note">Bấm một dòng để sửa</span></div>';
    h += '<div class="cstats"><div><b class="num">' + mm + '</b><span>/150 phút quy đổi, tuần này</span></div><div><b class="num">' + int(kc) + '</b><span>kcal đốt thêm, tuần này</span></div><div><b class="num">' + plan.light + "/" + LIGHT_GOAL + "</b><span>buổi cardio nhẹ, tuần này</span></div></div>";
    if (list.length) h += '<div class="clist">' + list.slice(0, 6).map(function (c) {
      var C = CARDIO[c.type]; return '<div class="crow"><button class="cmain" data-act="editcardio" data-v="' + c.id + '"><span class="ic">' + C.ic + '</span><span class="t"><b>' + C.n + '</b><span class="note">' + friendly(c.date) + " · " + c.min + " phút · " + esc(cardioDesc(c)) + '</span></span><span class="k num">' + int(c.kcal) + ' kcal</span></button><button class="x" data-act="delcardio" data-v="' + c.id + '" aria-label="Xoá">×</button></div>';
    }).join("") + "</div>";
    else h += '<p class="empty">Chưa ghi buổi nào. Đánh cầu xong bấm "+ Ghi".</p>';
    h += '<details class="cinfo"><summary>Lịch cardio của bạn và cách tính</summary><ul>' +
      "<li><b>Cầu lông 1 buổi/tuần</b> là phần cardio chính. 2–3 tiếng đánh căng đã vượt mức WHO khuyên (75–150 phút vận động mạnh mỗi tuần).</li>" +
      "<li><b>Thêm " + LIGHT_GOAL + " buổi cardio nhẹ</b> 20–30 phút (đi bộ dốc hoặc elliptical) để tăng sức bền và đốt thêm mà ít ảnh hưởng tới tăng cơ. Cường độ: nói được thành câu nhưng không hát được, nhịp tim khoảng " + z[0] + "–" + z[1] + " nhịp/phút.</li>" +
      "<li>Nên làm <b>sau buổi Upper</b> hoặc vào ngày nghỉ. Hôm sau đánh cầu không tập chân; app tự đẩy buổi thân trên lên trước.</li>" +
      "<li>Calo mục tiêu <b>giữ nguyên mỗi ngày</b>. Phần đốt của cầu lông đã nằm trong TDEE mà app tự học từ cân nặng và lượng ăn. Số kcal ở đây chỉ để tham khảo, có thể lệch 15–25%.</li>" +
      "<li>Đi bộ dốc tính theo công thức ACSM từ tốc độ và độ dốc: chính xác hơn khi không vịn tay vào máy. Elliptical: tốc độ và lực cản mỗi máy một khác nên không dùng được; nhập nhịp tim trung bình (từ đồng hồ hoặc tay cầm của máy) để tính sát hơn. Đừng tin số calo máy hiện, thường cao hơn thật khoảng 100 kcal mỗi 30 phút.</li><li>Quy đổi: phút vận động mạnh (từ 6 MET, như cầu lông đánh căng) tính gấp đôi phút vận động vừa.</li></ul></details>";
    return h + "</div>";
  }
  function startWorkout(key) {
    var ex = PROGRAM[key].ex.map(function (slot) {
      var sg = suggest(slot), act = actualEx(slot);
      var sets = []; for (var i = 0; i < slot.s; i++) sets.push({ kg: sg.kg == null ? "" : sg.kg, reps: sg.reps, rir: sg.rir, done: false });
      return { slot: slot.id, id: act.id, sets: sets, why: sg.why };
    });
    S.draft = { key: key, start: Date.now(), ex: ex }; UI.banner = ""; UI.exOpen = {}; flush(); render(); window.scrollTo(0, 0);
  }
  var FB = [["ok", "Hợp"], ["meh", "Tạm"], ["pain", "Đau khớp"], ["nofeel", "Không cảm nhận cơ"]];
  function vWorkout() {
    var d = S.draft, P = PROGRAM[d.key], done = 0, total = 0, h = "";
    d.ex.forEach(function (e) { e.sets.forEach(function (s) { total++; if (s.done) done++; }); });
    h += '<div class="wo-head"><div><b class="disp" style="font-size:24px">' + P.name + '</b> <span class="note num" id="elapsed" data-start="' + d.start + '">' + Math.round((Date.now() - d.start) / 60000) + " phút · " + done + "/" + total + ' hiệp</span></div><button class="btn sm dark" data-act="finish">Kết thúc</button><div class="wo-bar"><i style="width:' + (total ? done / total * 100 : 0) + '%"></i></div></div>';
    var cur = -1; d.ex.forEach(function (e, ei) { if (cur < 0 && !e.sets.every(function (s) { return s.done; })) cur = ei; });
    d.ex.forEach(function (e, ei) {
      var ex = EXDB[e.id], sl = SLOT[e.slot] || ex, all = e.sets.length && e.sets.every(function (s) { return s.done; }), adv = SLOT[e.slot] && !e.fb ? swapAdvice(sl) : null;
      // Bài đã xong và đã chấm cảm nhận: gọn thành một dòng, bấm để mở lại
      if (all && e.fb && !UI.exOpen[e.slot]) {
        h += '<button class="ex-sum" data-act="exopen" data-i="' + ei + '"><span class="ok">✓</span><span class="t"><b>' + esc(ex.n) + '</b><span class="note num">' + e.sets.map(function (q) { return fmt(q.kg) + "×" + q.reps; }).join(" · ") + '</span></span><span class="note">Sửa</span></button>';
        return;
      }
      h += '<div class="ex' + (all ? " done" : "") + (ei === cur ? " cur" : "") + '"><div class="ex-top"><div><div class="ex-name"><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.q) + '" target="_blank" rel="noopener">' + esc(ex.n) + '</a></div><div class="note">' + (sl.role ? sl.role + " · " : "") + sl.r + " rep · RIR mục tiêu " + (sl.t === "C" ? 2 : 1) + '</div></div><button class="link" data-act="swap" data-i="' + ei + '">Đổi bài</button></div>' + (all ? "" : moveBar(d, ei, cur));
      if (adv) h += '<div class="banner warn">' + adv.why + (adv.alt ? ' Nên đổi sang <b>' + esc(EXDB[adv.alt].n) + '</b>. <button class="link" data-act="quickswap" data-i="' + ei + '" data-v="' + adv.alt + '">Đổi ngay</button>' : " Chưa có bài thay thế với dụng cụ bạn có.") + "</div>";
      h += '<div class="target">' + esc(e.why) + "</div>";
      h += '<div class="sets-h"><span></span><span>kg</span><span>Rep</span><span>RIR (còn dư)</span><span></span></div>';
      e.sets.forEach(function (s, si) {
        h += '<div class="srow' + (s.done ? " on" : "") + '"><span class="n">' + (si + 1) + '</span><input id="kg' + ei + "_" + si + '" inputmode="decimal" value="' + (s.kg === "" ? "" : fmt(s.kg)) + '" placeholder="kg" data-act="kg" data-i="' + ei + '" data-j="' + si + '" aria-label="kg"><input id="rp' + ei + "_" + si + '" inputmode="numeric" value="' + s.reps + '" data-act="reps" data-i="' + ei + '" data-j="' + si + '" aria-label="rep">';
        h += '<span class="rir">' + [0, 1, 2, 3].map(function (r) { return '<button aria-pressed="' + (s.rir === r) + '" data-act="rir" data-i="' + ei + '" data-j="' + si + '" data-v="' + r + '">' + (r === 3 ? "3+" : r) + "</button>"; }).join("") + "</span>";
        h += '<button class="tick' + (s.done ? " on" : "") + '" data-act="done" data-i="' + ei + '" data-j="' + si + '" aria-label="Xong hiệp">✓</button></div>';
      });
      h += '<div class="row" style="gap:14px"><button class="link" data-act="addset" data-i="' + ei + '">+ Thêm hiệp</button>' + (e.sets.length > 1 && !e.sets[e.sets.length - 1].done ? '<button class="link" data-act="delset" data-i="' + ei + '">− Bớt hiệp</button>' : "") + "</div>";
      if (all) h += '<div class="fb"><span class="note">Bài này thế nào?</span><div class="chips">' + FB.map(function (f) { return '<button class="chip" aria-pressed="' + (e.fb === f[0]) + '" data-act="fb" data-i="' + ei + '" data-v="' + f[0] + '">' + f[1] + "</button>"; }).join("") + "</div></div>";
      if (UI.exOpen[e.slot]) h += '<button class="link" data-act="exopen" data-i="' + ei + '" style="align-self:flex-start">Thu gọn</button>';
      h += "</div>";
    });
    h += '<p class="note">RIR = còn làm thêm được mấy rep nữa. Hiệp có RIR từ 0 đến 3 mới được tính là hiệp nặng.</p>';
    h += '<button class="btn ghost" data-act="cancel">Huỷ buổi này</button>';
    return h;
  }
  // Đổi thứ tự bài trong buổi đang tập (chỉ buổi này; giáo án giữ nguyên)
  function started(e) { return e.sets.some(function (q) { return q.done; }); }
  function moveBar(d, ei, cur) {
    var n = d.ex.length, now = ei > cur && !started(d.ex[ei]);
    return '<div class="exmv">' + (now ? '<button class="chip" data-act="exmove" data-i="' + ei + '" data-v="now">Làm bài này tiếp theo</button>' : "<span></span>") +
      '<span class="arr"><button data-act="exmove" data-i="' + ei + '" data-v="-1" aria-label="Đưa lên"' + (ei === 0 ? " disabled" : "") + '>↑</button><button data-act="exmove" data-i="' + ei + '" data-v="1" aria-label="Đưa xuống"' + (ei === n - 1 ? " disabled" : "") + ">↓</button></span></div>";
  }
  function moveEx(i, v) {
    var ex = S.draft.ex, it = ex[i], to;
    if (v === "now") { to = 0; ex.forEach(function (e, k) { if (k !== i && started(e)) to = k + 1; }); if (to > i) to--; }
    else to = clamp(i + +v, 0, ex.length - 1);
    if (to === i) return;
    ex.splice(i, 1); ex.splice(to, 0, it); flush(); render();
    var el = document.querySelectorAll("#view .ex, #view .ex-sum")[to]; if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 130); // chừa chỗ cho thanh tiêu đề dính
    if (v === "now") toast("Đã đưa " + EXDB[it.id].n + " lên làm tiếp theo");
  }
  function finishWorkout() {
    var d = S.draft, ex = [], prs = [], vol = 0, hs = 0, cmp = [];
    var prevSame = S.workouts.filter(function (w) { return w.key === d.key; })[0];
    d.ex.forEach(function (e) {
      var sets = e.sets.filter(function (s) { return s.done; }).map(function (s) { return { kg: +s.kg || 0, reps: +s.reps || 0, rir: s.rir }; });
      if (!sets.length) return;
      var prevBest = exHistory(e.id).reduce(function (m, p) { return Math.max(m, p.e); }, 0), now = bestE(sets);
      if (prevBest && now > prevBest * 1.001) prs.push(EXDB[e.id].n + " ≈" + fmt(now) + "kg 1RM");
      if (prevSame) { var pe = prevSame.ex.filter(function (x) { return x.id === e.id; })[0]; if (pe && bestE(pe.sets) && now) cmp.push((now / bestE(pe.sets) - 1) * 100); }
      sets.forEach(function (s) { vol += s.kg * s.reps; }); hs += hardSets(sets);
      ex.push({ id: e.id, slot: e.slot, sets: sets, fb: e.fb || null });
    });
    if (!ex.length) { toast("Chưa có hiệp nào xong. Bấm Huỷ nếu không tập nữa."); return; }
    var dur = Math.round((Date.now() - d.start) / 60000), w = { id: "w" + Date.now(), date: keyOf(new Date(d.start)), ts: d.start, key: d.key, dur: dur, ex: ex };
    S.workouts.unshift(w); S.draft = null; UI.sel = null; stopTimer(); flush();
    var msg = "Xong " + PROGRAM[w.key].name + ": " + dur + " phút · " + hs + " hiệp nặng · " + int(vol) + " kg đã nâng.";
    if (cmp.length) msg += " Sức mạnh so với buổi " + PROGRAM[w.key].name + " trước: " + pct(avg(cmp)) + ".";
    if (prs.length) msg += " 🏆 Kỷ lục: " + prs.join(", ") + ".";
    UI.banner = msg; render(); window.scrollTo(0, 0);
  }

  // =====================================================================
  // ĂN
  // =====================================================================
  function ring(pct, size, stroke, cls, inner) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r, v = clamp(pct, 0, 1);
    return '<div class="ring ' + cls + '" style="width:' + size + "px;height:" + size + 'px"><svg viewBox="0 0 ' + size + " " + size + '" aria-hidden="true"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" class="tr"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-width="' + stroke + '" class="fg" stroke-dasharray="' + c + '" stroke-dashoffset="' + c * (1 - v) + '" transform="rotate(-90 ' + size / 2 + " " + size / 2 + ')"/></svg><div class="in">' + inner + "</div></div>";
  }
  var MEALS = [["s", "Bữa sáng", "☀️"], ["t", "Bữa trưa", "🍱"], ["c", "Bữa phụ", "🍌"], ["d", "Bữa tối", "🌙"]];
  function mealName(m) { return MEALS.filter(function (x) { return x[0] === m; })[0][1]; }
  // Bữa của món: người dùng chọn thì theo đó, món cũ chưa có thì đoán theo giờ ghi
  function mealOf(m) { if (m.meal) return m.meal; return mealByTime(new Date(m.ts)); }
  function mealByTime(d) { var x = d.getHours() * 60 + d.getMinutes(); return x < 630 ? "s" : x < 870 ? "t" : x < 1050 ? "c" : "d"; }
  function vFood() {
    var k = UI.date, t = S.plan, s = daySum(k), lk = t.kcal - s.kcal, lp = t.p - s.p, h = "";
    var fT = Math.round(t.kcal * 0.27 / 9), cT = Math.max(0, Math.round((t.kcal - t.p * 4 - fT * 9) / 4));
    h += '<div class="datebar"><button class="icon" data-act="prev" aria-label="Ngày trước">‹</button><span class="d">' + friendly(k) + '</span><button class="icon" data-act="next" aria-label="Ngày sau"' + (k >= todayKey() ? " disabled" : "") + ">›</button></div>";
    var mac = function (lab, v, tg, cls) { return '<div class="mac"><div class="row between"><span>' + lab + '</span><span class="num"><b>' + int(v) + "</b> / " + int(tg) + 'g</span></div><div class="bar ' + cls + '"><i style="width:' + clamp(v / tg * 100, 0, 100) + '%"></i></div></div>'; };
    h += '<div class="hero-f card">' + ring(s.kcal / t.kcal, 132, 12, lk < 0 ? "over" : "", '<b class="num">' + int(Math.abs(lk)) + "</b><span>" + (lk >= 0 ? "kcal còn lại" : "kcal vượt") + "</span>") +
      '<div class="macs">' + mac("Đạm", s.p, t.p, "p") + mac("Tinh bột", s.c, cT, "c") + mac("Béo", s.f, fT, "f") + '<p class="note num">Đã ăn ' + int(s.kcal) + " / " + int(t.kcal) + " kcal" + (lp <= 0 ? " · đủ đạm ✓" : "") + "</p></div></div>";
    if (k === todayKey()) {
      var w = S.weight[k];
      h += '<div class="weigh"><span class="label" style="flex:1">Cân sáng nay</span>' + (w != null ? '<b class="num">' + fmt(w) + ' kg</b><button class="link" data-act="clearw">Sửa</button>' : '<input id="wIn" inputmode="decimal" placeholder="kg" aria-label="Cân nặng sáng nay"><button class="btn sm dark" data-act="savew">Lưu</button>') + "</div>";
    }
    var list = dayFood(k).slice().sort(function (a, b) { return a.ts - b.ts; });
    MEALS.forEach(function (M) {
      var items = list.filter(function (m) { return mealOf(m) === M[0]; }), sub = items.reduce(function (a, x) { a.k += x.kcal; a.p += x.p; return a; }, { k: 0, p: 0 });
      h += '<div class="mcard' + (items.length ? "" : " empty") + '"><div class="mhead"><span class="ic">' + M[2] + '</span><div class="mt"><b>' + M[1] + "</b>" + (items.length ? '<span class="note num">' + int(sub.k) + " kcal · " + int(sub.p) + "g đạm</span>" : '<span class="note">Chưa ghi</span>') + '</div><button class="madd" data-act="addto" data-v="' + M[0] + '" aria-label="Thêm vào ' + M[1].toLowerCase() + '">+</button></div>';
      items.forEach(function (m) {
        h += '<button class="food-row" data-act="edit" data-v="' + m.id + '"><span class="t"><b>' + esc(m.n) + (m.mul && m.mul !== 1 ? " ×" + fmt(m.mul) : "") + '</b></span><span class="k"><b>' + int(m.kcal) + "</b><span>" + fmt(m.p) + "g đạm</span></span></button>";
      });
      h += "</div>";
    });
    if (k === todayKey()) h += dinnerCard(k);
    return h;
  }
  function dinnerBudget(k) {
    var t = S.plan, s = daySum(k), reserve = k === todayKey() && new Date().getHours() < 20 ? 150 : 0;
    return { kcal: t.kcal - s.kcal - reserve, p: t.p - s.p };
  }
  function dLine(o) {
    var main = o.pro === "trung" ? o.eggs + " quả trứng" : DPRO[o.pro].cuts.filter(function (c) { return c[0] === o.cut; })[0][1].toLowerCase() + " " + o.meat + "g";
    return (o.pro === "trung" ? "" : DPRO[o.pro].n + " ") + main + " · cơm " + o.rice + "g · " + fid(o.veg).n.split(" (")[0].split(" /")[0].toLowerCase();
  }
  function dinnerCard(k) {
    if (new Date().getHours() < 14 || dayFood(k).some(function (m) { return mealOf(m) === "d"; })) return "";
    var b = dinnerBudget(k), ideas = dinnerIdeas(k); UI.ideas = ideas;
    var h = '<div class="card"><div class="row between"><h2>Tối nay nấu gì?</h2><span class="note num">còn ≈ ' + int(Math.max(0, b.kcal)) + " kcal · " + int(Math.max(0, b.p)) + "g đạm</span></div>";
    ideas.forEach(function (o, i) {
      var t = dSum(o);
      h += '<button class="recipe-opt" data-act="didea" data-v="' + i + '"><span><b>' + esc(dName(o)) + '</b><span class="s">' + esc(dLine(o)) + '</span></span><span class="k"><b>' + int(t.kcal) + "</b> kcal<br>" + int(t.p) + "g đạm</span></button>";
    });
    return h + '<p class="note">Ưu tiên loại thịt mấy hôm nay chưa ăn. Bấm vào để đổi thịt, cách nấu, vị, lượng.</p><button class="link" data-act="dbuild" style="align-self:flex-start">Tự ghép món khác</button></div>';
  }
  function addFood(k, item) {
    var base = { kcal: Math.round(item.kcal), p: Math.round(item.p * 10) / 10, c: Math.round((item.c || 0) * 10) / 10, f: Math.round((item.f || 0) * 10) / 10 };
    var now = new Date(), d = parseKey(k); d.setHours(now.getHours(), now.getMinutes());
    if (!S.food[k]) S.food[k] = [];
    S.food[k].push({ meal: item.meal || (k === todayKey() ? mealByTime(new Date()) : "t"), id: uid(), n: item.n, kcal: base.kcal, p: base.p, c: base.c, f: base.f, base: base, mul: 1, ts: k === todayKey() ? Date.now() : d.getTime(), rid: item.rid || null, parts: item.parts || null });
    flush();
  }
  // Món quen: ghi nhiều lần trong 30 ngày; món hay ăn vào giờ này được xếp trước
  function frequent() {
    var map = {}, hr = new Date().getHours(), t = todayKey(), from = shiftKey(t, -30);
    Object.keys(S.food).forEach(function (k) {
      if (k < from || k > t) return;
      S.food[k].forEach(function (m) {
        var key = norm(m.n), r = map[key] || (map[key] = { n: m.n, cnt: 0, near: 0, last: 0, base: m.base || m, rid: m.rid });
        r.cnt++; if (SH.meal ? mealOf(m) === SH.meal : Math.abs(new Date(m.ts).getHours() - hr) <= 2) r.near++; if (m.ts > r.last) { r.last = m.ts; r.base = m.base || m; }
      });
    });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return (b.cnt + 2 * b.near) - (a.cnt + 2 * a.near) || b.last - a.last; });
  }

  // =====================================================================
  // TIẾN ĐỘ
  // =====================================================================
  function vProgress() {
    var h = "";
    if (UI.banner) h += '<div class="banner good">' + esc(UI.banner) + "</div>";
    h += progressHero();
    h += reportCard();
    h += bodyCard();
    h += weightCard();
    h += strengthCard();
    h += volumeCard();
    h += calendarCard();
    h += historyCard();
    h += '<button class="btn ghost" data-act="toclaude">Gửi dữ liệu cho Claude phân tích sâu hơn</button>';
    return h;
  }
  // ---------- Thành phần cơ thể ----------
  // % mỡ theo công thức Hải quân Mỹ (đơn vị cm). Sai số khoảng ±3–4% so với DEXA, nhưng đo đều thì xu hướng tin được.
  function navyBF(sex, h, waist, neck, hip) {
    if (!(waist > neck)) return null;
    var bf = sex === "f" ? 495 / (1.29579 - 0.35004 * Math.log10(waist + (hip || 0) - neck) + 0.221 * Math.log10(h)) - 450
      : 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
    return bf > 3 && bf < 60 ? bf : null;
  }
  function latestOn(map, k) { var ks = Object.keys(map).sort(), v = null; ks.forEach(function (x) { if (x <= k) v = map[x]; }); return v != null ? v : (ks.length ? map[ks[0]] : null); }
  // Mỗi lần đo: % mỡ (làm mượt), cân xu hướng ngày đó, khối mỡ, khối nạc
  function bodySeries() {
    var p = S.profile, ts = trendSeries(), out = [], sm = null;
    if (!p) return out;
    Object.keys(S.waist).sort().forEach(function (k) {
      var neck = latestOn(S.neck, k), hip = p.sex === "f" ? latestOn(S.hip, k) : 0;
      if (neck == null || (p.sex === "f" && !hip)) return;
      var bf = navyBF(p.sex, p.height, S.waist[k], neck, hip); if (bf == null) return;
      sm = sm == null ? bf : sm + 0.5 * (bf - sm);
      var w = ts[k] != null ? ts[k] : (S.weight[k] || trendNow());
      out.push({ k: k, bf: sm, raw: bf, w: w, fm: w * sm / 100, lm: w * (1 - sm / 100) });
    });
    return out;
  }
  function bodyAnalysis() {
    var bs = bodySeries(), p = S.profile; if (!bs.length) return null;
    var last = bs[bs.length - 1], cut = shiftKey(last.k, -21), ref = bs[0];
    bs.forEach(function (x) { if (x.k <= cut) ref = x; });
    var wk = Math.max(0.01, daysBetween(ref.k, last.k) / 7), dF = last.fm - ref.fm, dL = last.lm - ref.lm;
    var lifts = strengthReport().filter(function (x) { return x.compound && x.m4 != null; }), s4 = lifts.length ? avg(lifts.map(function (x) { return x.m4; })) : null;
    var v, cls = "";
    if (bs.length < 2 || wk < 1.5) v = "Cần thêm số đo ở các tuần sau để thấy mỡ và nạc thay đổi thế nào.";
    else if (dF < -0.2 && dL > -0.3) { v = "Mỡ giảm " + fmt(-dF) + " kg mà vẫn giữ" + (dL > 0.2 ? ", thậm chí tăng " + fmt(dL) + " kg" : "") + " khối nạc: recomp đang đúng hướng."; cls = "good"; }
    else if (dF < -0.2 && dL <= -0.3) {
      var share = -dL / Math.max(0.1, -(dF + dL));
      if (s4 != null && s4 > 0.5) v = "Số đo cho thấy mất " + fmt(-dL) + " kg nạc, nhưng sức mạnh vẫn tăng " + pct(s4) + "/tuần. Phần nạc giảm nhiều khả năng là nước và glycogen. Giữ nguyên, đo lại tuần sau.";
      else { v = "Đang mất cả cơ: khoảng " + Math.round(share * 100) + "% số cân giảm là khối nạc. Tăng đạm lên 2,0–2,2 g/kg, giảm mức thâm hụt, giữ mức tạ nặng."; cls = "warn"; }
    }
    else if (dF > 0.3) { v = "Mỡ tăng " + fmt(dF) + " kg. Kiểm tra lại calo thực ăn so với mục tiêu."; cls = "warn"; }
    else if (dL > 0.2) { v = "Mỡ gần như giữ nguyên, khối nạc tăng " + fmt(dL) + " kg: đang tăng cơ."; cls = "good"; }
    else v = "Thành phần cơ thể chưa đổi nhiều. Cần ít nhất 4 tuần để thấy rõ.";
    var g = p.goalBf || 12, wGoal = last.lm / (1 - g / 100), fatLeft = Math.max(0, last.w - wGoal);
    var rate = wk >= 1.5 && dF / wk < -0.05 ? dF / wk : (p.rate / 100) * last.w * 0.8, weeksLeft = rate < 0 ? fatLeft / -rate : null;
    return { bs: bs, last: last, ref: ref, wk: wk, dF: dF, dL: dL, v: v, cls: cls, goal: g, wGoal: wGoal, fatLeft: fatLeft, weeksLeft: weeksLeft, s4: s4 };
  }
  function progressHero() {
    var a = bodyAnalysis(), tw = trendNow(), ts = trendSeries(), ks = Object.keys(ts), w0 = ks.length ? ts[ks[0]] : tw, d = tw - w0;
    var h = '<div class="hero-p"><span class="eyebrow">Hành trình</span>';
    if (a) {
      var st = a.bs[0].bf, now = a.last.bf, g = a.goal, prog = st > g ? clamp((st - now) / (st - g), 0, 1) : 1;
      h += '<div class="hp-row"><div><div class="hp-big num">' + fmt(now) + '<small>%</small></div><span class="hp-lab">mỡ cơ thể</span></div><div class="hp-side"><b class="num">' + fmt(tw) + " kg</b><span>" + (d <= 0 ? "" : "+") + fmt(d) + " kg từ đầu</span></div></div>" +
        '<div class="hp-track"><i style="width:' + Math.max(3, prog * 100) + '%"></i></div><div class="row between hp-ends"><span>Bắt đầu ' + fmt(st) + "%</span><span>Mục tiêu " + g + "%</span></div>";
    } else {
      h += '<div class="hp-row"><div><div class="hp-big num">' + fmt(tw) + '<small>kg</small></div><span class="hp-lab">cân xu hướng</span></div><div class="hp-side"><b class="num">' + (d <= 0 ? "" : "+") + fmt(d) + ' kg</b><span>từ đầu</span></div></div><p class="hp-lab">Đo vòng bụng và vòng cổ để xem % mỡ.</p>';
    }
    return h + "</div>";
  }
  function bodyCard() {
    var a = bodyAnalysis(), p = S.profile, h = '<div class="card' + (a && a.cls ? " " + a.cls + "-b" : "") + '"><div class="row between"><h2>Thành phần cơ thể</h2><button class="link" data-act="waist">Đo</button></div>';
    if (!a) return h + '<p class="empty">Đo <b>vòng bụng</b> (ngang rốn) và <b>vòng cổ</b> (ngay dưới yết hầu)' + (p.sex === "f" ? " và <b>vòng hông</b> (chỗ to nhất)" : "") + ' mỗi tuần một lần, buổi sáng. App tính % mỡ, khối mỡ và khối nạc theo công thức Hải quân Mỹ.</p></div>';
    var L = a.last, per = a.wk >= 1.5 ? " / " + Math.round(a.wk) + " tuần" : "";
    h += '<p class="verdict">' + a.v + "</p><div>";
    h += '<div class="kv"><span>% mỡ ước tính</span><span><b>' + fmt(L.bf) + "%</b> · mục tiêu " + a.goal + "%</span></div>";
    h += '<div class="kv"><span>Khối mỡ</span><span><b>' + fmt(L.fm) + " kg</b>" + (a.bs.length > 1 ? ' · <span class="' + (a.dF <= 0 ? "up" : "down") + '">' + (a.dF > 0 ? "+" : "") + fmt(a.dF) + " kg" + per + "</span>" : "") + "</span></div>";
    h += '<div class="kv"><span>Khối nạc (cơ, xương, nước)</span><span><b>' + fmt(L.lm) + " kg</b>" + (a.bs.length > 1 ? ' · <span class="' + (a.dL >= -0.2 ? "up" : "down") + '">' + (a.dL > 0 ? "+" : "") + fmt(a.dL) + " kg" + per + "</span>" : "") + "</span></div>";
    if (a.fatLeft > 0) { var eta = a.weeksLeft ? addDays(new Date(), Math.round(a.weeksLeft * 7)) : null; h += '<div class="kv"><span>Để đạt ' + a.goal + "% mỡ</span><span>Cân khoảng <b>" + fmt(a.wGoal) + " kg</b> nếu giữ nguyên khối nạc" + (eta ? " · dự kiến " + MONTHS[eta.getMonth()].toLowerCase() + "/" + eta.getFullYear() : "") + "</span></div>"; }
    h += "</div>";
    if (a.bs.length >= 2) {
      var f0 = a.bs[0];
      h += dualChart(a.bs.map(function (x) { return { k: x.k, a: x.fm - f0.fm, b: x.lm - f0.lm }; }));
      h += '<div class="legend"><span><i style="background:var(--accent)"></i>Mỡ thay đổi (kg)</span><span><i style="background:var(--blue)"></i>Nạc thay đổi (kg)</span></div>';
    }
    h += '<p class="note">Kỳ vọng: ' + (p.rate < 0 ? "khi ăn thâm hụt, người mới hoặc vừa quay lại tập giữ được hoặc tăng 0–0,5 kg nạc/tháng" : "ăn đủ, người mới tập tăng khoảng 0,5–1 kg nạc/tháng") + ". Công thức thước dây sai số ±3–4%, xem xu hướng là chính.</p>";
    return h + "</div>";
  }
  function dualChart(pts) {
    var W = 600, H = 170, L = 40, R = 12, T = 12, B = 24, vals = [0];
    pts.forEach(function (p) { vals.push(p.a, p.b); });
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals); if (mx - mn < 2) { mn -= 1; mx += 1; }
    var t0 = parseKey(pts[0].k).getTime(), span = Math.max(1, parseKey(pts[pts.length - 1].k).getTime() - t0);
    function X(k) { return L + (W - L - R) * (parseKey(k).getTime() - t0) / span; }
    function Y(v) { return T + (H - T - B) * (1 - (v - mn) / (mx - mn)); }
    function line(f, col) { return '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + X(p.k).toFixed(1) + " " + Y(f(p)).toFixed(1); }).join(" ") + '" fill="none" stroke="' + col + '" stroke-width="2.5"/>' + pts.map(function (p) { return '<circle cx="' + X(p.k).toFixed(1) + '" cy="' + Y(f(p)).toFixed(1) + '" r="3.5" fill="' + col + '"/>'; }).join(""); }
    var g = [mn, 0, mx].map(function (v) { return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" stroke="var(--line)"' + (v === 0 ? ' stroke-width="1.5"' : "") + '/><text x="' + (L - 6) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + (v > 0 ? "+" : "") + fmt(v) + "</text>"; }).join("");
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Thay đổi mỡ và nạc">' + g + line(function (p) { return p.a; }, "var(--accent)") + line(function (p) { return p.b; }, "var(--blue)") + '<text x="' + L + '" y="' + (H - 6) + '" font-size="12" fill="var(--muted)">' + shortDate(pts[0].k) + '</text><text x="' + (W - R) + '" y="' + (H - 6) + '" font-size="12" text-anchor="end" fill="var(--muted)">' + shortDate(pts[pts.length - 1].k) + "</text></svg></div>";
  }
  function openMeasure() {
    var p = S.profile, ln = latestOn(S.neck, todayKey()), lh = latestOn(S.hip, todayKey());
    SH = { kind: "measure" };
    openSheet(head("Số đo tuần này") + '<p class="note">Buổi sáng, trước khi ăn, thở ra bình thường, thước sát da nhưng không siết. Mỗi tuần đo một lần vào cùng một ngày.</p>' +
      '<label class="field">Vòng bụng ngang rốn (cm)<input id="waIn" inputmode="decimal"></label><label class="field">Vòng cổ ngay dưới yết hầu (cm)<input id="neIn" inputmode="decimal" value="' + (ln != null ? fmt(ln) : "") + '"></label>' +
      (p.sex === "f" ? '<label class="field">Vòng hông chỗ to nhất (cm)<input id="hpIn" inputmode="decimal" value="' + (lh != null ? fmt(lh) : "") + '"></label>' : "") +
      '<p class="note">Vòng cổ gần như không đổi, đo một lần rồi để nguyên cũng được.</p><button class="btn" data-act="savewaist">Lưu</button>');
  }

  // ---------- Gửi dữ liệu cho Claude ----------
  function claudeText() {
    var p = S.profile, t = todayKey(), L = [], r = estimateTDEE(), ts = trendSeries();
    L.push("FITCORE · dữ liệu gửi Claude · " + shortDate(t));
    L.push("Hồ sơ: " + (p.sex === "m" ? "nam" : "nữ") + ", " + p.age + " tuổi, " + p.height + " cm. Mục tiêu " + (p.rate ? fmt(p.rate) + "% cân/tuần" : "giữ cân") + ", đạm " + String(p.pkg).replace(".", ",") + " g/kg, mỡ mục tiêu " + (p.goalBf || 12) + "%, " + p.weekly + " buổi tập/tuần.");
    L.push("Mục tiêu đang dùng: " + S.plan.kcal + " kcal, " + S.plan.p + " g đạm. TDEE " + r.tdee + (r.est ? " (đo được " + r.est + ", tin cậy " + Math.round(r.conf * 100) + "%)" : " (ước tính công thức)") + ".");
    L.push(""); L.push("Theo tuần (thứ Hai–Chủ nhật):");
    var ws = keyOf(weekStart(new Date()));
    for (var i = 3; i >= 0; i--) {
      var a = shiftKey(ws, -7 * i), b = shiftKey(a, 6), days = [], wts = [], ses = S.workouts.filter(function (w) { return w.date >= a && w.date <= b; });
      for (var d = a; d <= b && d <= t; d = shiftKey(d, 1)) { if (loggedDay(d)) days.push(daySum(d)); if (S.weight[d] != null) wts.push(S.weight[d]); }
      var v = volume(a, b), hs = Object.keys(v).reduce(function (x, m) { return x + v[m]; }, 0);
      L.push("- " + shortDate(a) + "–" + shortDate(b) + ": cân TB " + (wts.length ? fmt(avg(wts)) + " (" + wts.length + " lần)" : "–") + ", xu hướng cuối tuần " + (ts[b > t ? t : b] != null ? fmt(ts[b > t ? t : b]) : "–") + "; ăn TB " + (days.length ? int(avg(days.map(function (x) { return x.kcal; }))) + " kcal / " + int(avg(days.map(function (x) { return x.p; }))) + " g đạm (" + days.length + " ngày ghi đủ)" : "chưa ghi đủ") + "; " + ses.length + " buổi tập, " + fmt(hs) + " hiệp nặng.");
    }
    var cl = cardioIn(shiftKey(ws, -21), t);
    if (cl.length) { L.push(""); L.push("Cardio 4 tuần (phút, cường độ, kcal ước tính):"); cl.sort(function (a, b) { return a.date < b.date ? -1 : 1; }).forEach(function (c) { L.push("- " + shortDate(c.date) + ": " + CARDIO[c.type].n + " " + c.min + " phút, " + cardioDesc(c) + " (" + fmt(cMet(c)) + " MET), ~" + c.kcal + " kcal"); }); }
    var bs = bodySeries();
    if (bs.length) { L.push(""); L.push("Số đo (bụng/cổ → mỡ, khối mỡ, khối nạc):"); bs.slice(-6).forEach(function (x) { L.push("- " + shortDate(x.k) + ": bụng " + fmt(S.waist[x.k]) + " cm → " + fmt(x.raw) + "% mỡ, " + fmt(x.fm) + " kg mỡ, " + fmt(x.lm) + " kg nạc"); }); }
    else if (Object.keys(S.waist).length) { L.push(""); L.push("Vòng bụng: " + Object.keys(S.waist).sort().slice(-6).map(function (k) { return shortDate(k) + " " + fmt(S.waist[k]); }).join(", ") + " (chưa có vòng cổ)."); }
    var sr = strengthReport().filter(function (x) { return x.compound; });
    if (sr.length) {
      L.push(""); L.push("Sức mạnh bài chính (1RM ước tính, từng buổi gần nhất):");
      sr.forEach(function (x) { var hh = exHistory(x.id).slice(-5); L.push("- " + x.ex.n + ": " + hh.map(function (q) { return fmt(q.e); }).join(" → ") + (x.stall ? " (chững)" : "") + "; buổi gần nhất " + hh[hh.length - 1].sets.map(function (s2) { return fmt(s2.kg) + "×" + s2.reps + "@" + (s2.rir == null ? "?" : s2.rir); }).join(", ")); });
    }
    var v7 = volume(shiftKey(t, -6), t);
    L.push(""); L.push("Hiệp nặng 7 ngày: " + Object.keys(MUSCLES).map(function (m) { return MUSCLES[m][0] + " " + fmt(v7[m]); }).join(", ") + ".");
    var fbl = [];
    S.workouts.slice(0, 12).forEach(function (w) { w.ex.forEach(function (e) { if (e.fb && e.fb !== "ok") fbl.push(EXDB[e.id].n + ": " + { meh: "tạm", pain: "đau khớp", nofeel: "không cảm nhận cơ" }[e.fb] + " (" + shortDate(w.date) + ")"); }); });
    if (fbl.length) { L.push("Phản hồi bài tập: " + fbl.join("; ") + "."); }
    var sw = Object.keys(S.swaps); if (sw.length) L.push("Đã đổi bài: " + sw.map(function (k) { return SLOT[k].role + " → " + EXDB[S.swaps[k]].n; }).join("; ") + ".");
    var noEq = EQUIP.filter(function (q) { return S.equip[q[0]] === false; }).map(function (q) { return q[1]; }); if (noEq.length) L.push("Phòng tập không có: " + noEq.join(", ") + ".");
    L.push(""); L.push("Câu hỏi của tôi: ");
    return L.join("\n");
  }
  function shareClaude() {
    var txt = claudeText();
    SH = { kind: "claude" };
    openSheet(head("Gửi cho Claude") + '<p class="note">Bản tóm tắt 4 tuần gần nhất. Chép rồi dán vào chat với Claude, viết thêm câu hỏi ở dòng cuối.</p><textarea id="clText" class="cltext" readonly>' + esc(txt) + '</textarea><div class="grid2"><button class="btn" data-act="copyclaude">Chép</button>' + (navigator.share ? '<button class="btn ghost" data-act="shareclaude">Chia sẻ…</button>' : "") + "</div>");
  }

  function reportCard() {
    var p = S.profile, r = estimateTDEE(), ts = trendSeries(), t = todayKey(), tw = ts[t], t7 = ts[shiftKey(t, -7)];
    var rate = tw != null && t7 != null ? tw - t7 : null, goal = p.rate / 100 * (tw || p.weight);
    var wa = Object.keys(S.waist).sort(), waNow = wa.length ? S.waist[wa[wa.length - 1]] : null, waPrev = wa.length > 1 ? S.waist[wa[wa.length - 2]] : null;
    var sr = strengthReport().filter(function (x) { return x.compound && x.wk != null; }), sAvg = sr.length ? avg(sr.map(function (x) { return x.wk; })) : null;
    var verdict;
    if (rate == null) verdict = "Cân buổi sáng ít nhất 4 lần mỗi tuần để app tính được xu hướng.";
    else if (goal < 0 && rate < goal * 1.6) verdict = "Giảm nhanh hơn mục tiêu. Nếu sức mạnh đi xuống, nên ăn thêm 100–150 kcal.";
    else if (goal < 0 && rate > goal * 0.4 && !(waNow != null && waPrev != null && waNow < waPrev)) verdict = "Cân chưa giảm như mục tiêu. App sẽ tự hạ calo ở lần cập nhật thứ Hai tới nếu xu hướng giữ nguyên.";
    else verdict = "Đúng hướng" + (sAvg != null && sAvg > 0 ? ", sức mạnh đang tăng" : "") + ". Giữ nguyên.";
    var h = '<div class="card"><div class="row between"><h2>Báo cáo tuần</h2><span class="note">Mục tiêu tự cập nhật mỗi thứ Hai</span></div><p class="verdict">' + verdict + "</p><div>";
    h += '<div class="kv"><span>Cân xu hướng</span><span>' + (tw != null ? "<b>" + fmt(tw) + " kg</b>" + (rate != null ? " · " + (rate > 0 ? "+" : "") + fmt(rate) + " kg/tuần" : "") : "–") + "</span></div>";
    h += '<div class="kv"><span>Mục tiêu tốc độ</span><span>' + (goal ? fmt(goal) + " kg/tuần" : "Giữ cân") + "</span></div>";
    h += '<div class="kv"><span>Calo bạn đốt (TDEE)</span><span><b>' + int(r.tdee) + " kcal</b>" + (r.est ? " · đo được " + int(r.est) : " · ước tính ban đầu") + "</span></div>";
    h += '<div class="kv"><span>Mục tiêu đang dùng</span><span><b>' + int(S.plan.kcal) + " kcal · " + S.plan.p + "g đạm</b></span></div>";
    h += '<div class="kv"><span>Sức mạnh 7 ngày</span><span>' + (sAvg != null ? '<b class="' + (sAvg >= 0 ? "up" : "down") + '">' + pct(sAvg) + "</b> (kỳ vọng +0,5–2%)" : "Cần 2 tuần dữ liệu") + "</span></div>";
    var c7 = cardioIn(shiftKey(t, -6), t);
    h += '<div class="kv"><span>Cardio 7 ngày</span><span>' + (c7.length ? "<b>" + modMinutes(c7) + "</b>/150 phút quy đổi · ~" + int(c7.reduce(function (a, c) { return a + c.kcal; }, 0)) + " kcal" : "Chưa ghi") + "</span></div>";
    h += '<div class="kv"><span>Vòng bụng</span><span>' + (waNow != null ? "<b>" + fmt(waNow) + " cm</b>" + (waPrev != null ? " · " + (waNow - waPrev > 0 ? "+" : "") + fmt(waNow - waPrev) : "") : "") + ' <button class="link" data-act="waist">Đo</button></span></div>';
    h += "</div>";
    if (r.conf < 1) h += '<p class="note">Độ tin cậy TDEE: ' + Math.round(r.conf * 100) + "%. Cần ít nhất 7 ngày ghi ăn đủ và 4 lần cân trong 3 tuần gần nhất (hiện có " + r.days + " ngày, " + r.wCount + " lần cân).</p>";
    h += '<button class="btn ghost sm" data-act="recalc" style="align-self:flex-start">Cập nhật mục tiêu ngay</button>';
    return h + "</div>";
  }
  function volumeCard() {
    var t = todayKey(), v = volume(shiftKey(t, -6), t), lw = volume(shiftKey(t, -13), shiftKey(t, -7)), max = 24;
    var h = '<div class="card"><div class="row between"><h2>Hiệp nặng mỗi nhóm cơ</h2><span class="note">7 ngày qua · vùng xanh là mức nên đạt</span></div>';
    Object.keys(MUSCLES).forEach(function (m) {
      var M = MUSCLES[m], x = v[m], cls = x < M[1] ? "lo" : x > M[2] ? "hi" : "";
      h += '<div class="vol"><span>' + M[0] + '</span><span class="vtrack"><span class="band" style="left:' + (M[1] / max * 100) + "%;width:" + ((M[2] - M[1]) / max * 100) + '%"></span><i class="' + cls + '" style="width:' + clamp(x / max * 100, 0, 100) + '%"></i></span><b>' + fmt(x) + "</b></div>";
    });
    var lwTotal = Object.keys(lw).reduce(function (a, m) { return a + lw[m]; }, 0);
    return h + '<p class="note">Cơ chính tính 1 hiệp, cơ phụ tính ½. 7 ngày trước đó tổng ' + fmt(lwTotal) + " hiệp nặng.</p></div>";
  }
  function strengthCard() {
    var rows = strengthReport(), h = '<div class="card"><div class="row between"><h2>Sức mạnh từng bài</h2><span class="note">1RM ước tính · so 7 ngày trước · dòng dưới: trung bình 4 tuần</span></div>';
    if (!rows.length) return h + '<p class="empty">Tập vài buổi để có số liệu.</p></div>';
    var stalls = rows.filter(function (x) { return x.stall && x.compound; });
    var shown = UI.allLifts ? rows : rows.filter(function (x) { return x.compound; });
    h += "<div>";
    shown.forEach(function (x) {
      h += '<div class="lift"><span>' + esc(x.ex.n) + (x.stall ? '<span class="flag">Chững</span>' : "") + '</span><span class="e">≈' + fmt(x.e) + 'kg</span><span class="d ' + (x.wk > 0 ? "up" : x.wk < 0 ? "down" : "") + '">' + (x.wk != null ? pct(x.wk) : "–") + (x.m4 != null ? '<br><span class="note">' + pct(x.m4) + "</span>" : "") + "</span></div>";
    });
    h += "</div>";
    if (rows.length > shown.length || UI.allLifts) h += '<button class="link" data-act="alllifts" style="align-self:flex-start">' + (UI.allLifts ? "Chỉ xem bài chính" : "Xem cả " + (rows.length - shown.length) + " bài phụ") + "</button>";
    if (stalls.length >= 2) h += '<div class="banner warn"><b>Nên giảm tải 1 tuần:</b> ' + stalls.length + " bài chính chững cùng lúc. Giữ mức tạ, bớt 1/3 số hiệp, để RIR 3–4. Tuần sau tập lại bình thường.</div>";
    else if (stalls.length === 1) h += '<div class="banner warn"><b>' + esc(stalls[0].ex.n) + " chững 3 buổi.</b> Thử đổi sang biến thể khác 4–6 tuần, hoặc kiểm tra lại ngủ và đạm.</div>";
    var lastW = S.workouts.filter(function (w) { return w.date >= shiftKey(todayKey(), -7); }), rirs = [];
    lastW.forEach(function (w) { w.ex.forEach(function (e) { e.sets.forEach(function (s) { if (s.rir != null) rirs.push(s.rir); }); }); });
    if (rirs.length >= 15 && avg(rirs) < 0.7) h += '<div class="banner warn">RIR trung bình tuần qua chỉ ' + fmt(avg(rirs)) + ": bạn đang tập sát kiệt sức liên tục. Giữ RIR 1–2 để hồi phục và tiến bộ đều hơn.</div>";
    var ids = rows.filter(function (x) { return x.n >= 2; }).map(function (x) { return x.id; });
    if (ids.length) {
      if (ids.indexOf(UI.chartEx) < 0) UI.chartEx = ids[0];
      h += '<select id="chartSel" data-act="chartex" aria-label="Chọn bài">' + ids.map(function (id) { return '<option value="' + id + '"' + (id === UI.chartEx ? " selected" : "") + ">" + esc(EXDB[id].n) + "</option>"; }).join("") + "</select>";
      h += lineChart(exHistory(UI.chartEx).map(function (p) { return { k: p.date, v: p.e }; }), null, "1RM ước tính");
    }
    return h + "</div>";
  }
  function weightCard() {
    var ts = trendSeries(), keys = Object.keys(ts).slice(-60), raw = [];
    var h = '<div class="card"><div class="row between"><h2>Cân nặng</h2><span class="note">Chấm: cân thật · Đường: xu hướng</span></div>';
    if (keys.length < 2) return h + '<p class="empty">Ghi cân buổi sáng ở mục Ăn. Sau vài ngày biểu đồ sẽ hiện.</p></div>';
    keys.forEach(function (k) { if (S.weight[k] != null) raw.push({ k: k, v: S.weight[k] }); });
    return h + lineChart(keys.map(function (k) { return { k: k, v: ts[k] }; }), raw, "Cân nặng") + "</div>";
  }
  function lineChart(pts, dots, label) {
    if (pts.length < 2) return '<p class="note">Cần ít nhất 2 điểm.</p>';
    var W = 600, H = 190, L = 42, R = 12, T = 12, B = 24, all = pts.concat(dots || []).map(function (p) { return p.v; });
    var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
    if (mx - mn < 2) { var m = (mx + mn) / 2; mn = m - 1; mx = m + 1; }
    var t0 = parseKey(pts[0].k).getTime(), t1 = parseKey(pts[pts.length - 1].k).getTime(), span = Math.max(1, t1 - t0);
    function X(k) { return L + (W - L - R) * (parseKey(k).getTime() - t0) / span; }
    function Y(v) { return T + (H - T - B) * (1 - (v - mn) / (mx - mn)); }
    var g = [mn, (mn + mx) / 2, mx].map(function (v) { return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" stroke="var(--line)"/><text x="' + (L - 6) + '" y="' + (Y(v) + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + fmt(v) + "</text>"; }).join("");
    var d = (dots || []).map(function (p) { return '<circle cx="' + X(p.k).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="3" fill="var(--muted)" fill-opacity=".5"/>'; }).join("");
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + X(p.k).toFixed(1) + " " + Y(p.v).toFixed(1); }).join(" "), lp = pts[pts.length - 1];
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + label + '">' + g + d + '<path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/><circle cx="' + X(lp.k).toFixed(1) + '" cy="' + Y(lp.v).toFixed(1) + '" r="5" fill="var(--accent)"/><text x="' + L + '" y="' + (H - 6) + '" font-size="12" fill="var(--muted)">' + shortDate(pts[0].k) + '</text><text x="' + (W - R) + '" y="' + (H - 6) + '" font-size="12" text-anchor="end" fill="var(--muted)">' + shortDate(lp.k) + "</text></svg></div>";
  }
  function dayScore(k) {
    var tr = S.workouts.some(function (w) { return w.date === k; }), s = daySum(k), ok = S.plan && s.kcal > 0 && Math.abs(s.kcal - S.plan.kcal) <= S.plan.kcal * 0.1 && s.p >= S.plan.p * 0.9;
    var cd = cardioIn(k, k), bad = cd.some(function (c) { return c.type === "bad"; }), lt = cd.length > (bad ? 1 : 0);
    return { tr: tr, logged: s.kcal > 0, ok: ok, score: (tr || bad ? 2 : 0) + (ok ? 1 : 0), w: tr ? S.workouts.filter(function (w) { return w.date === k; })[0] : null, bad: bad, lt: lt };
  }
  function calendarCard() {
    var today = todayKey(), h = '<div class="card"><div class="row between"><h2>Lịch</h2><div class="seg" style="width:140px"><button aria-pressed="' + (UI.calMode === "month") + '" data-act="calmode" data-v="month">Tháng</button><button aria-pressed="' + (UI.calMode === "year") + '" data-act="calmode" data-v="year">Năm</button></div></div>';
    if (UI.calMode === "month") {
      var ym = UI.calMonth.split("-"), y = +ym[0], m = +ym[1] - 1, first = new Date(y, m, 1), dim = new Date(y, m + 1, 0).getDate(), off = (first.getDay() + 6) % 7, nT = 0, nOk = 0;
      h += '<div class="datebar"><button class="icon" data-act="calprev" aria-label="Tháng trước">‹</button><span class="d">' + MONTHS[m] + " " + y + '</span><button class="icon" data-act="calnext" aria-label="Tháng sau"' + (UI.calMonth >= today.slice(0, 7) ? " disabled" : "") + ">›</button></div>";
      h += '<div class="cal">' + ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(function (x) { return '<span class="cw">' + x + "</span>"; }).join("");
      for (var i = 0; i < off; i++) h += "<span></span>";
      for (var dd = 1; dd <= dim; dd++) {
        var k = keyOf(new Date(y, m, dd)), st = dayScore(k), fut = k > today;
        if (st.tr) nT++; if (st.ok) nOk++;
        h += '<button class="cd' + (st.tr ? " tr" : "") + (k === today ? " now" : "") + (fut ? " fut" : "") + '" data-act="goday" data-v="' + k + '"' + (fut ? " disabled" : "") + ">" + dd + "<small>" + (st.w ? PROGRAM[st.w.key].name.replace("pper ", "").replace("ower ", "") : "") + (st.bad ? "🏸" : "") + (st.lt ? "+" : "") + '</small><span class="ft ' + (st.ok ? "ok" : st.logged ? "off" : "") + '"></span></button>';
      }
      h += '</div><div class="legend"><span><i style="background:var(--fg)"></i>Có tập</span><span>🏸 cầu lông · + cardio nhẹ</span><span><i style="background:var(--good);height:4px"></i>Ăn đúng mục tiêu</span><span><i style="background:var(--accent);height:4px"></i>Ăn lệch</span></div><p class="note">Tháng này ' + nT + " buổi tập, " + nOk + " ngày ăn đúng. Bấm một ngày để xem bữa ăn.</p>";
    } else {
      var yr = +UI.calMonth.slice(0, 4);
      h += '<div class="datebar"><button class="icon" data-act="yrprev" aria-label="Năm trước">‹</button><span class="d">Năm ' + yr + '</span><button class="icon" data-act="yrnext" aria-label="Năm sau"' + (yr >= new Date().getFullYear() ? " disabled" : "") + '>›</button></div><div class="yr">';
      for (var mm = 0; mm < 12; mm++) {
        var f1 = new Date(yr, mm, 1), dm = new Date(yr, mm + 1, 0).getDate(), o1 = (f1.getDay() + 6) % 7, cnt = 0, cells = "";
        for (var e = 0; e < o1; e++) cells += "<i></i>";
        for (var d2 = 1; d2 <= dm; d2++) { var k2 = keyOf(new Date(yr, mm, d2)), sc = k2 > today ? "f" : dayScore(k2).score; if (sc !== "f" && sc >= 2) cnt++; cells += '<i class="s' + sc + '"></i>'; }
        h += '<button class="ym" data-act="calmonth" data-v="' + yr + "-" + pad(mm + 1) + '"><span><b>T' + (mm + 1) + "</b> " + (cnt ? '<span class="muted">' + cnt + " buổi</span>" : "") + '</span><span class="ymg">' + cells + "</span></button>";
      }
      h += '</div><div class="legend"><span>Ít</span><i></i><i class="s1"></i><i class="s2"></i><i class="s3"></i><span>Tập + ăn đúng</span></div>';
    }
    return h + "</div>";
  }
  function historyCard() {
    if (!S.workouts.length) return "";
    var h = '<details class="card"><summary>Lịch sử buổi tập (' + S.workouts.length + ")</summary><div>";
    S.workouts.slice(0, 60).forEach(function (w) {
      var parts = w.ex.filter(function (e) { return EXDB[e.id] && EXDB[e.id].t === "C"; }).map(function (e) { var top = e.sets.reduce(function (a, s) { return e1rm(s.kg, s.reps, s.rir) > e1rm(a.kg, a.reps, a.rir) ? s : a; }); return EXDB[e.id].n + " " + fmt(top.kg) + "×" + top.reps; });
      h += '<div class="hist-row"><div><p><b>' + shortDate(w.date) + " · " + PROGRAM[w.key].name + "</b> · " + w.dur + " phút</p><p>" + esc(parts.join(" · ")) + '</p></div><button class="x" data-act="delw" data-v="' + w.id + '" aria-label="Xoá buổi">×</button></div>';
    });
    return h + "</div></details>";
  }

  // =====================================================================
  // Bảng trượt
  // =====================================================================
  var sheet = document.getElementById("sheet"), sb = document.getElementById("sheet-body"), SH = {};
  function openSheet(html) { sb.innerHTML = html; sheet.hidden = false; sb.scrollTop = 0; }
  function reSheet(html) { var st = sb.scrollTop; sb.innerHTML = html; sb.scrollTop = st; }
  function closeSheet() { sheet.hidden = true; SH = {}; }
  function head(t) { return '<div class="row between"><h2 class="t" id="sheet-title">' + t + '</h2><button class="x" data-act="close" aria-label="Đóng">✕</button></div>'; }
  function stepper(f, val) { return '<span class="step"><button data-act="st" data-f="' + f + '" data-d="-1" aria-label="Bớt">−</button><b class="num">' + fmt(val) + '</b><button data-act="st" data-f="' + f + '" data-d="1" aria-label="Thêm">+</button></span>'; }
  function totals(r) { return '<div class="row between" style="align-items:flex-end"><div><span class="huge num">' + int(r.kcal) + '</span> <span class="note">kcal</span></div><span class="num"><b>' + fmt(r.p) + "g</b> đạm</span></div>"; }

  // ---- Hồ sơ ----
  function openProfile() {
    var p = S.profile || { sex: "m", age: 25, height: 171, weight: 80, act: 1.5, rate: -0.5, pkg: 1.75, weekly: 4, goalBf: 12 };
    var sel = function (id, list, v) { return '<select id="' + id + '">' + list.map(function (x) { return '<option value="' + x[0] + '"' + (String(x[0]) === String(v) ? " selected" : "") + ">" + x[1] + "</option>"; }).join("") + "</select>"; };
    SH = { kind: "profile" };
    openSheet(head("Hồ sơ") + '<div class="grid2"><label class="field">Giới tính' + sel("pSex", [["m", "Nam"], ["f", "Nữ"]], p.sex) + '</label><label class="field">Tuổi<input id="pAge" inputmode="numeric" value="' + p.age + '"></label><label class="field">Chiều cao (cm)<input id="pH" inputmode="numeric" value="' + p.height + '"></label><label class="field">Cân nặng hiện tại (kg)<input id="pW" inputmode="decimal" value="' + fmt(p.weight) + '"></label></div>' +
      '<label class="field">Mức vận động ngoài giờ tập' + sel("pAct", ACTS, p.act) + '</label><label class="field">Mục tiêu' + sel("pRate", RATES, p.rate) + '</label><div class="grid2"><label class="field">Đạm (g mỗi kg)' + sel("pPkg", [[1.6, "1,6 g/kg"], [1.75, "1,75 g/kg"], [2, "2,0 g/kg"], [2.2, "2,2 g/kg"]], p.pkg) + '</label><label class="field">Buổi tập mỗi tuần' + sel("pWk", [[3, "3"], [4, "4"], [5, "5"]], p.weekly) + '</label></div><label class="field">Mục tiêu % mỡ' + sel("pBf", [[10, "10%"], [12, "12%"], [15, "15%"], [18, "18%"], [20, "20%"], [25, "25% (nữ)"]], p.goalBf || 12) + "</label>" +
      '<p class="note">Calo khởi đầu tính theo công thức Mifflin–St Jeor × mức vận động. Sau 2–3 tuần app thay bằng con số đo từ cơ thể bạn. Đạm 1,6–2,2 g/kg là mức nghiên cứu khuyên dùng khi tập tạ và giảm mỡ.</p><button class="btn" data-act="saveprofile">Lưu</button>');
  }
  // ---- Thêm món ----
  function defMeal() { return UI.date === todayKey() ? mealByTime(new Date()) : "t"; }
  function openAdd(meal) { SH = { kind: "add", view: "search", q: "", ov: {}, adj: {}, segs: [], meal: meal || defMeal() }; openSheet(addHtml()); }
  function mealSeg(cur, act) { return '<div class="seg mseg">' + MEALS.map(function (M) { return '<button aria-pressed="' + (cur === M[0]) + '" data-act="' + act + '" data-v="' + M[0] + '">' + M[2] + " " + M[1].replace("Bữa ", "") + "</button>"; }).join("") + "</div>"; }
  function addHtml() {
    if (SH.view === "num") return numHtml();
    return head("Thêm món") + mealSeg(SH.meal, "setmeal") + (UI.date !== todayKey() ? '<p class="note">Đang ghi cho ' + friendly(UI.date).toLowerCase() + ".</p>" : "") + '<input id="fq" placeholder="vd: xôi, thịt quay, chút rau" value="' + esc(SH.q) + '" autocomplete="off" aria-label="Ăn gì"><p class="note">Ghi từng thứ, cách nhau dấu phẩy. Có thể ghi lượng: 150g gà, 2 quả trứng, 1 chén cơm, nửa tô phở, chút rau.</p>' +
      '<div class="qchips">' + QUICK.map(function (x) { return '<button data-act="qadd" data-v="' + x + '">+ ' + x + "</button>"; }).join("") + '</div><div id="fres">' + searchRes() + "</div>";
  }
  var QUICK = ["cơm", "xôi", "bánh mì", "phở", "bún", "ức gà", "thịt lợn", "thịt bò", "cá", "trứng", "đậu phụ", "rau", "sữa chua", "chuối"];
  var TOOLS = '<div class="tools"><button data-act="dbuild"><span>🍳</span>Món tự nấu</button><button data-act="view" data-v="num"><span>📦</span>Đồ đóng gói (nhập số trên bao bì)</button></div>';
  function frList(list) { return '<p class="label">Món quen</p><div class="list-res">' + list.map(function (r, i) { return '<button data-act="fr" data-v="' + i + '"><span>' + esc(r.n) + '</span><span class="k">' + int(r.base.kcal) + " · " + fmt(r.base.p) + "g</span></button>"; }).join("") + "</div>"; }
  // Tách câu thành từng thứ, áp lựa chọn tay của người dùng (đổi món, chỉnh gram)
  function mealRows() {
    var rows = FitDB.parse(SH.q), segs = rows.map(function (r) { return norm(r.text); });
    segs.forEach(function (t, i) { if (SH.segs[i] !== t) { delete SH.ov[i]; delete SH.adj[i]; } });
    SH.segs = segs;
    return rows.map(function (r, i) {
      if (!r.ok) return r;
      var f = r.food, g = r.grams, byWeight = r.unit.g === 1 || r.unit.g === 1000 || r.unit.n === "lang";
      var ov = SH.ov[i] && SH.ov[i] !== r.food.id;
      if (ov) { f = FitDB.FOODS.filter(function (x) { return x.id === SH.ov[i]; })[0]; if (!byWeight) g = Math.round(r.qty * f.units[0].g); }
      if (SH.adj[i] != null) g = SH.adj[i];
      return { ok: true, text: r.text, food: f, opts: [r.food].concat(r.alts), grams: g, unit: byWeight ? null : (ov ? f.units[0] : r.unit), qty: r.qty, r: FitDB.calc(f, g) };
    });
  }
  function mealSum(rows) {
    return rows.reduce(function (a, r) { if (r.ok) { a.kcal += r.r.kcal; a.p += r.r.p; a.c += r.r.c; a.f += r.r.f; } return a; }, { kcal: 0, p: 0, c: 0, f: 0 });
  }
  function gStep(f) { return Math.max(10, Math.round(f.units[0].g / 2 / 10) * 10); }
  function searchRes() {
    if (!SH.q.trim()) {
      var h = "", fr = frequent().slice(0, 8); SH.fr = fr;
      if (fr.length) h += frList(fr);
      return h + TOOLS;
    }
    var rows = mealRows(), h2 = '<div class="meal">';
    rows.forEach(function (r, i) {
      if (!r.ok) { h2 += '<div class="mrow miss"><span>"' + esc(r.text) + '" chưa có trong dữ liệu, sẽ bỏ qua. Đồ đóng gói thì dùng Nhập số.</span></div>'; return; }
      var name = r.opts.length > 1 ? '<select data-i="' + i + '" aria-label="Chọn đúng món">' + r.opts.map(function (f) { return '<option value="' + f.id + '"' + (f.id === r.food.id ? " selected" : "") + ">" + esc(f.n) + "</option>"; }).join("") + "</select>" : "<b>" + esc(r.food.n) + "</b>";
      var hint = !r.food.noG && r.unit && SH.adj[i] == null ? fmt(r.qty) + " " + r.unit.n : "";
      h2 += '<div class="mrow"><div class="mn">' + name + '<span class="amt">' + gIn('data-gi="' + i + '"', r.food.noG ? r.grams / 100 : r.grams, r.food.noG ? "gói" : r.food.liquid ? "ml" : "g") + (hint ? '<span class="s">' + esc(hint) + "</span>" : "") + '</span></div><span class="step sm"><button data-act="pg" data-i="' + i + '" data-d="-1" aria-label="Bớt">−</button><button data-act="pg" data-i="' + i + '" data-d="1" aria-label="Thêm">+</button></span><span class="k" id="mk' + i + '">' + kCell(r.r) + "</span></div>";
    });
    return h2 + '</div><div class="stick" id="mtot">' + mealTot(mealSum(rows)) + "</div>";
  }
  // Ô nhập lượng: gõ số thật bất kỳ, − / + chỉ để chỉnh nhanh
  function gIn(attr, val, unit) { return '<span class="gin"><input ' + attr + ' inputmode="decimal" value="' + fmt(Math.round(val * 10) / 10) + '" aria-label="Lượng"><i>' + unit + "</i></span>"; }
  function kCell(r) { return "<b>" + int(r.kcal) + "</b><span>" + fmt(Math.round(r.p * 10) / 10) + "g đạm</span>"; }
  function mealTot(t) { return totals(t) + '<p class="note num" style="margin:0">Tinh bột ' + int(t.c) + "g · béo " + int(t.f) + 'g. Số gần đúng, món nấu ở quán có thể lệch 15–25%.</p><button class="btn" data-act="addmeal"' + (t.kcal ? "" : " disabled") + ">Thêm</button>"; }
  function mealItem() {
    var rows = mealRows().filter(function (r) { return r.ok; }), t = mealSum(rows), txt = SH.q.trim().replace(/\s+/g, " ");
    t.n = txt.charAt(0).toUpperCase() + txt.slice(1); t.parts = rows.map(function (r) { return { id: r.food.id, g: r.grams }; });
    return t;
  }
  function regCustom() { (S.custom || []).forEach(FitDB.addCustom); }
  // Đồ đóng gói: nhập số trên bao bì (trên 100g hoặc trên 1 gói), app tự nhân theo lượng ăn thật
  function numHtml() {
    var per = SH.nb !== "pack", inp = function (id, lab, ph) { return '<label class="field">' + lab + '<input id="' + id + '" inputmode="decimal" placeholder="' + (ph || "") + '" value="' + esc((SH.nv || {})[id] || "") + '"></label>'; };
    return head("Đồ đóng gói") + '<label class="field">Tên<input id="nN" autocomplete="off" placeholder="vd: Sữa chua Vinamilk, bánh Cosy" value="' + esc((SH.nv || {}).nN || "") + '"></label>' +
      '<p class="label">Bao bì ghi số cho</p><div class="seg"><button data-act="nb" data-v="100" aria-pressed="' + per + '">100g (100ml)</button><button data-act="nb" data-v="pack" aria-pressed="' + !per + '">1 gói / 1 phần</button></div>' +
      '<div class="grid2">' + inp("nK", "Calo (kcal)") + inp("nP", "Đạm (g)") + inp("nC", "Tinh bột (g)", "không bắt buộc") + inp("nF", "Béo (g)", "không bắt buộc") + "</div>" +
      '<p class="label">Bạn ăn bao nhiêu?</p><div class="grid2">' + (per ? inp("nE", "Lượng ăn (g hoặc ml)", "vd: 45") + inp("nG", "1 gói nặng (g)", "không bắt buộc") : inp("nE", "Số gói / phần", "1") + inp("nG", "1 gói nặng (g)", "không bắt buộc")) + "</div>" +
      '<label class="eq" style="margin-top:4px"><input type="checkbox" id="nSave"' + (SH.nsave === false ? "" : " checked") + '><span>Lưu lại, lần sau gõ tên là ra</span></label>' +
      '<div class="stick"><div id="nres">' + numRes() + '</div><button class="btn" data-act="addnum">Thêm</button><button class="link" data-act="view" data-v="search">‹ Quay lại</button></div>';
  }
  function numVals() {
    var v = SH.nv || {}, per = SH.nb !== "pack", k = num(v.nK), pk = num(v.nG), e = num(v.nE);
    if (e == null) e = per ? (pk || 100) : 1;
    var mul = per ? e / 100 : e;
    return { ok: k != null, per: per, mul: mul, eat: e, pack: pk, base: { kcal: k || 0, p: num(v.nP) || 0, c: num(v.nC) || 0, f: num(v.nF) || 0 },
      kcal: (k || 0) * mul, p: (num(v.nP) || 0) * mul, c: (num(v.nC) || 0) * mul, f: (num(v.nF) || 0) * mul };
  }
  function numRes() {
    var r = numVals();
    if (!r.ok) return '<p class="note">Nhập calo và đạm trên bao bì, app tự tính theo lượng bạn ăn.</p>';
    var how = r.per ? fmt(r.base.kcal) + " kcal/100g × " + fmt(r.eat) + "g" : fmt(r.base.kcal) + " kcal/gói × " + fmt(r.eat) + " gói";
    return totals(r) + '<p class="note num" style="margin:0">' + how + (r.c || r.f ? " · tinh bột " + fmt(Math.round(r.c)) + "g · béo " + fmt(Math.round(r.f)) + "g" : "") + "</p>";
  }
  // ---- Ghép bữa tối ----
  function openDinner(o) {
    var meal = SH.kind === "add" && SH.meal ? SH.meal : "d", b = dinnerBudget(UI.date);
    o = o || dAuto({ pro: "ga", cut: "ga_uc", sty: "xao", flav: "sa", veg: DVEG[parseKey(UI.date).getDate() % DVEG.length], vegG: 250, eggs: 0 }, b);
    SH = { kind: "dinner", o: Object.assign({}, o), meal: meal }; openSheet(dinnerHtml());
  }
  function dChips(act, list, cur) { return '<div class="chips">' + list.map(function (x) { return '<button class="chip" data-act="' + act + '" data-v="' + x[0] + '" aria-pressed="' + (String(cur) === String(x[0])) + '">' + x[1] + "</button>"; }).join("") + "</div>"; }
  function dinnerHtml() {
    var o = SH.o, b = dinnerBudget(UI.date), egg = o.pro === "trung";
    var h = head("Ghép bữa tối") + '<p class="note">Còn ≈ ' + int(Math.max(0, b.kcal)) + " kcal · " + int(Math.max(0, b.p)) + "g đạm hôm nay. App tự tính lượng thịt và cơm cho vừa; muốn khác thì sửa số.</p>";
    h += '<p class="label">Đạm chính</p>' + dChips("dpro", Object.keys(DPRO).map(function (k) { return [k, DPRO[k].n]; }), o.pro);
    if (!egg) h += '<p class="label">Phần thịt</p>' + dChips("dcut", DPRO[o.pro].cuts, o.cut);
    h += '<p class="label">Cách nấu</p>' + dChips("dsty", Object.keys(DSTY).map(function (k) { return [k, DSTY[k].n]; }), o.sty);
    if (!(egg && (o.sty === "luoc" || o.sty === "ap" || o.sty === "xao"))) h += '<p class="label">Vị</p>' + dChips("dflav", DSTY[o.sty].flav.map(function (k) { return [k, DFLAV[k][0]]; }), o.flav);
    h += '<p class="label">Rau</p><select id="dVeg">' + DVEG.map(function (id) { return '<option value="' + id + '"' + (id === o.veg ? " selected" : "") + ">" + esc(fid(id).n) + "</option>"; }).join("") + "</select>";
    if (!egg) h += '<p class="label">Thêm trứng</p>' + dChips("deggs", [[0, "Không"], [1, "1 quả"], [2, "2 quả"], [3, "3 quả"]], o.eggs);
    h += '<p class="label">Lượng</p><div class="ing">' +
      (egg ? "<div><span>Trứng</span>" + gIn('data-di="eggs"', o.eggs, "quả") + "</div>" : "<div><span>" + esc(fid(o.cut).n.replace(" (sống)", "")) + ' <span class="note">cân sống</span></span>' + gIn('data-di="meat"', o.meat, "g") + "</div>") +
      "<div><span>" + esc(fid(o.veg).n) + "</span>" + gIn('data-di="vegG"', o.vegG, "g") + "</div><div><span>Cơm chín</span>" + gIn('data-di="rice"', o.rice, "g") + "</div><div><span>Dầu ăn</span>" + gIn('data-di="oil"', o.oil, "g") + "</div></div>";
    h += '<div id="dprep">' + dPrep(o) + "</div>";
    return h + '<div class="stick"><div id="dtot">' + dTot(o, b) + '</div><button class="btn" data-act="deat">Đã ăn món này</button></div>';
  }
  function dPrep(o) {
    var need = [o.pro === "trung" ? o.eggs + " quả trứng" : fid(o.cut).n.replace(" (sống)", "").toLowerCase() + " " + o.meat + "g"];
    if (o.eggs && o.pro !== "trung") need.push(o.eggs + " quả trứng");
    need.push(fid(o.veg).n.split(" (")[0].toLowerCase() + " " + o.vegG + "g");
    if (!(o.pro === "trung" && o.sty !== "kho")) need.push(DFLAV[o.flav][1]);
    if (o.pro === "trung" && o.sty === "xao") need.push("1–2 quả cà chua");
    return '<div class="dprep"><p class="label">' + esc(dName(o)) + " · khoảng " + DSTY[o.sty].min + " phút</p><p><b>Cần chuẩn bị:</b> " + esc(need.join(", ")) + ', nước mắm, tỏi.</p><ol class="steps">' + dSteps(o).map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ol><p class="note">Không có cân: 100g thịt sống ≈ bằng lòng bàn tay, dày khoảng 1 đốt ngón tay. 150g cơm ≈ 1 chén.</p></div>';
  }
  function dTot(o, b) {
    var t = dSum(o), over = t.kcal - Math.max(0, b.kcal), short = b.p - t.p, msg = [];
    if (over > 60) msg.push("Vượt khoảng " + int(over) + " kcal: bớt cơm hoặc chọn phần nạc hơn.");
    if (short > 10) msg.push("Còn thiếu " + int(short) + "g đạm" + (o.cut === "lon_bachi" || o.cut === "ga_dui_da" ? " (phần này nhiều mỡ, ít đạm)" : "") + ": bù bằng sữa chua Hy Lạp hoặc whey ở bữa phụ.");
    return totals(t) + (msg.length ? '<p class="note" style="margin:0">' + msg.join(" ") + "</p>" : "");
  }
  function dRefresh(auto) {
    var o = SH.o; if (auto) dAuto(o, dinnerBudget(UI.date));
    reSheet(dinnerHtml());
  }
  // ---- Ghi cardio ----
  function openCardio(type, id) {
    var e = id ? S.cardio.filter(function (c) { return c.id === id; })[0] : null;
    type = e ? e.type : type || "bad";
    SH = { kind: "cardio", id: e ? e.id : null, date: e ? e.date : todayKey() };
    cSetType(type, e); openSheet(cardioHtml());
  }
  function cSetType(type, e) {
    var d = e || (S.cardioLast || {})[type] || CDEF[type];
    SH.type = type; SH.lv = d.lv || 0; SH.min = d.min || CDEF[type].min; SH.spd = d.spd != null ? d.spd : CDEF[type].spd; SH.inc = d.inc != null ? d.inc : CDEF[type].inc; SH.hr = d.hr || null;
  }
  function cardioHtml() {
    var C = CARDIO[SH.type], t = todayKey(), y = shiftKey(t, -1);
    var h = head(SH.id ? "Sửa buổi cardio" : "Ghi cardio") + '<div class="ctypes">' + Object.keys(CARDIO).map(function (k) { return '<button aria-pressed="' + (SH.type === k) + '" data-act="ctype" data-v="' + k + '"><span>' + CARDIO[k].ic + "</span>" + CARDIO[k].n + "</button>"; }).join("") + "</div>";
    if (SH.type === "walk") {
      h += '<div class="grid2"><div><p class="label">Tốc độ</p>' + gIn('id="cSpd"', SH.spd || 0, "km/h") + '</div><div><p class="label">Độ dốc</p>' + gIn('id="cInc"', SH.inc || 0, "%") + "</div></div><p class=\"note\">Xem trên màn hình máy. Không vịn tay vào máy để số ước tính sát hơn.</p>";
    } else if (C.lv.length > 1) {
      h += '<p class="label">Cường độ</p><div class="seg">' + C.lv.map(function (l, i) { return '<button aria-pressed="' + (SH.lv === i) + '" data-act="clv" data-v="' + i + '">' + l[0] + "</button>"; }).join("") + "</div>";
    }
    if (SH.type === "ell") h += '<p class="label">Nhịp tim trung bình (không bắt buộc)</p>' + gIn('id="cHr"', SH.hr || "", "nhịp/phút") + '<p class="note">Có số này thì app tính theo nhịp tim, sát hơn chọn cường độ. Lấy từ đồng hồ hoặc tay cầm đo nhịp của máy.</p>';
    h += '<p class="label">' + (SH.type === "bad" ? "Thời gian đánh thật (không tính lúc ngồi nghỉ)" : "Thời gian") + '</p><div class="amt">' + gIn('id="cMin"', SH.min, "phút") + '<span class="mchips">' + CMIN[SH.type].map(function (m) { return '<button data-act="cmin" data-v="' + m + '" aria-pressed="' + (SH.min === m) + '">' + m + "</button>"; }).join("") + "</span></div>";
    h += '<p class="label">Ngày</p><div class="seg"><button aria-pressed="' + (SH.date === t) + '" data-act="cdate" data-v="' + t + '">Hôm nay</button><button aria-pressed="' + (SH.date === y) + '" data-act="cdate" data-v="' + y + '">Hôm qua</button><label class="cpick"><input type="date" id="cDate" max="' + t + '" value="' + SH.date + '"></label></div>';
    return h + '<div class="stick"><div id="cres">' + cardioRes() + '</div><button class="btn" data-act="savecardio">' + (SH.id ? "Lưu thay đổi" : "Lưu") + "</button></div>";
  }
  function cardioRes() {
    var r = cardioCalc(SH);
    return '<div class="row between" style="align-items:flex-end"><div><span class="huge num">' + int(r.kcal) + '</span> <span class="note">kcal đốt thêm</span></div><span class="note num" style="text-align:right">' + fmt(r.met) + " MET · " + (r.met >= 6 ? "vận động mạnh" : "vận động vừa") + "<br>" + r.how + "</span></div>";
  }
  // ---- Sửa món ----
  var MULS = [0.5, 0.75, 1, 1.25, 1.5, 2];
  function findFood(id) { return dayFood(UI.date).filter(function (m) { return m.id === id; })[0]; }
  function foodById(id) { return FitDB.FOODS.filter(function (f) { return f.id === id; })[0]; }
  function openEdit(id) {
    var m = findFood(id), eg = null;
    // Món ghi theo thành phần: sửa gram từng thứ (cần tra được hết trong dữ liệu)
    if (m.parts && m.parts.every(function (x) { return foodById(x.id); })) eg = m.parts.map(function (x) { return { food: foodById(x.id), g: x.g }; });
    SH = { kind: "edit", id: id, eg: eg }; openSheet(editHtml());
  }
  function editHtml() {
    var m = findFood(SH.id), mul = m.mul || 1;
    var h = head("Sửa món") + "<p><b>" + esc(m.n) + '</b></p><p class="label">Bữa</p>' + mealSeg(mealOf(m), "movemeal");
    if (SH.eg) {
      h += '<p class="label">Lượng từng thứ</p><div class="meal">' + SH.eg.map(function (x, i) {
        return '<div class="mrow"><div class="mn"><b>' + esc(x.food.n) + '</b><span class="amt">' + gIn('data-ei="' + i + '"', x.food.noG ? x.g / 100 : x.g, x.food.noG ? "gói" : x.food.liquid ? "ml" : "g") + '</span></div><span class="k" id="ek' + i + '">' + kCell(FitDB.calc(x.food, x.g)) + "</span></div>";
      }).join("") + '</div><div id="etot">' + totals(editSum()) + "</div>";
    } else {
      var b0 = m.base || m;
      h += '<p class="label">Ăn nhiều hay ít hơn?</p><div class="seg">' + MULS.map(function (x) { return '<button aria-pressed="' + (x === mul) + '" data-act="mul" data-v="' + x + '">×' + fmt(x) + "</button>"; }).join("") + "</div>" +
        '<p class="label">Hoặc sửa số trực tiếp</p><div class="grid2"><label class="field">Calo (kcal)<input id="eK" inputmode="decimal" value="' + int(m.kcal) + '"></label><label class="field">Đạm (g)<input id="eP" inputmode="decimal" value="' + fmt(m.p) + '"></label></div>';
      SH.b0 = b0;
    }
    return h + '<button class="btn" data-act="saveedit">Lưu</button><button class="btn ghost" data-act="delfood">Xoá món này</button>';
  }
  function editSum() {
    return SH.eg.reduce(function (a, x) { var r = FitDB.calc(x.food, x.g); a.kcal += r.kcal; a.p += r.p; a.c += r.c; a.f += r.f; return a; }, { kcal: 0, p: 0, c: 0, f: 0 });
  }
  // ---- Đổi bài ----
  function openSwap(ei) {
    var e = S.draft.ex[ei], slot = SLOT[e.slot];
    SH = { kind: "swap", ei: ei };
    var h = head("Đổi bài") + '<p class="note">Vị trí: <b>' + slot.role + "</b>. Bài xếp theo ưu tiên. " + (slot.t === "C" ? "Bài chính nên giữ 4–6 tuần để đo được tiến bộ." : "Bài phụ đổi thoải mái.") + " Lựa chọn được nhớ cho các buổi sau.</p><div class=\"list-res\">";
    slot.c.forEach(function (id) {
      var ok = hasEq(id), ls = lastSets(id);
      h += '<button data-act="doswap" data-v="' + id + '"' + (ok ? "" : " disabled") + "><span>" + esc(EXDB[id].n) + (id === e.id ? " ✓" : "") + '</span><span class="k">' + (!ok ? "không có máy" : ls ? "lần trước " + fmt(Math.max.apply(null, ls.sets.map(function (s) { return s.kg; }))) + "kg" : "") + "</span></button>";
    });
    return openSheet(h + '</div><button class="link" data-act="equip">Sửa danh sách dụng cụ</button>');
  }
  function openEquip() {
    SH = { kind: "equip" };
    openSheet(head("Dụng cụ phòng tập") + '<p class="note">Bỏ chọn những thứ phòng bạn không có. App sẽ tự chọn bài thay thế phù hợp.</p><div class="eqlist">' + EQUIP.map(function (q) { return '<label class="eq"><input type="checkbox" data-eq="' + q[0] + '"' + (S.equip[q[0]] !== false ? " checked" : "") + "><span>" + q[1] + "</span></label>"; }).join("") + '</div><button class="btn" data-act="saveequip">Lưu</button>');
  }
  // ---- Cài đặt ----
  function openSettings() {
    SH = { kind: "settings" };
    var lb = S.lastBackup;
    openSheet(head("Cài đặt") + '<div class="grid2"><button class="btn ghost" data-act="profile">Hồ sơ, mục tiêu</button><button class="btn ghost" data-act="equip">Dụng cụ phòng tập</button></div>' +
      '<div class="card"><h2>Sao lưu</h2><p class="note">Dữ liệu chỉ nằm trên máy này. Sao lưu ra file rồi cất vào Drive hoặc Zalo.' + (lb ? " Lần gần nhất " + new Date(lb).toLocaleDateString("vi-VN") + "." : "") + '</p><div class="grid2"><button class="btn" data-act="backup">Sao lưu</button><button class="btn ghost" data-act="restore">Khôi phục</button></div></div>' +
      '<div class="card"><h2>Cách app tính</h2><ul style="margin:0;padding-left:18px;font-size:13px;display:flex;flex-direction:column;gap:4px"><li><b>1RM ước tính</b> = kg × (1 + (rep + RIR) / 30).</li><li><b>Hiệp nặng</b>: hiệp có RIR 0–3. Vùng nên đạt 10–20 hiệp mỗi nhóm cơ lớn mỗi tuần.</li><li><b>Tăng tạ</b> khi đạt đỉnh khoảng rep ở mọi hiệp mà vẫn còn dư rep.</li><li><b>Chững</b>: 3 buổi liền không vượt kỷ lục 1RM cũ.</li><li><b>Chọn bài</b>: mỗi vị trí trong giáo án có vài bài xếp theo ưu tiên; app lấy bài đầu tiên bạn có dụng cụ. Báo đau khớp, hoặc 2/3 buổi không cảm nhận cơ, thì app khuyên đổi bài.</li><li><b>Cân xu hướng</b>: trung bình trượt, mỗi ngày lấy 10% số cân mới.</li><li><b>% mỡ</b>: công thức Hải quân Mỹ từ vòng bụng, vòng cổ, chiều cao (nữ thêm vòng hông). Khối mỡ = cân xu hướng × % mỡ, khối nạc = phần còn lại.</li><li><b>TDEE</b> = calo ăn trung bình − thay đổi cân xu hướng × 7.700 kcal/kg, tính trên 3 tuần gần nhất.</li></ul></div>' +
      '<div class="card"><h2>Cơ sở dữ liệu</h2><p class="note">Xem calo, đạm của thực phẩm và lưu ý kỹ thuật từng bài tập.</p><a class="btn ghost" href="du-lieu.html" style="display:block;text-align:center;text-decoration:none">Mở trang dữ liệu</a></div>' +
      '<div class="card"><h2>Xoá toàn bộ</h2><button class="btn ghost" data-act="wipe">Xoá mọi dữ liệu</button></div><p class="note" style="text-align:center">FitCore · bản 4.4</p>');
  }

  // =====================================================================
  // Đồng hồ nghỉ, thông báo
  // =====================================================================
  var timerEl = document.getElementById("timer"), timer = null, tick = null, wake = null;
  function startTimer(sec, label) {
    timer = { end: Date.now() + sec * 1000, label: label }; if (!tick) tick = setInterval(drawTimer, 250);
    try { if (navigator.wakeLock && !wake) navigator.wakeLock.request("screen").then(function (l) { wake = l; l.addEventListener("release", function () { wake = null; }); }).catch(function () {}); } catch (e) {}
    drawTimer();
  }
  function stopTimer() { timer = null; clearInterval(tick); tick = null; timerEl.hidden = true; document.body.classList.remove("has-timer"); if (wake) { try { wake.release(); } catch (e) {} wake = null; } }
  function drawTimer() {
    if (!timer) return stopTimer();
    var left = Math.round((timer.end - Date.now()) / 1000), over = left <= 0, a = Math.abs(left);
    timerEl.hidden = false; timerEl.className = "timer" + (over ? " over" : ""); document.body.classList.add("has-timer");
    if (over && !timer.buzzed) { timer.buzzed = true; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {} beep(); }
    timerEl.innerHTML = '<div class="in"><span class="clock num">' + (over ? "+" : "") + Math.floor(a / 60) + ":" + pad(a % 60) + '</span><span class="what"><b>' + (over ? "Vào hiệp tiếp" : "Đang nghỉ") + "</b>" + esc(timer.label) + '</span><button data-t="add">+30s</button><button data-t="stop">Tắt</button></div>';
    if (left < -600) stopTimer();
  }
  var actx = null;
  function beep() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); var o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + 0.35); } catch (e) {} }
  timerEl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b || !timer) return; if (b.getAttribute("data-t") === "add") { timer.end += 30000; timer.buzzed = false; drawTimer(); } else stopTimer(); });
  var toastEl = document.getElementById("toast"), toastT = null;
  function toast(msg) { toastEl.textContent = msg; toastEl.style.marginBottom = timerEl.hidden ? "" : "64px"; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 2800); }

  // =====================================================================
  // Sự kiện
  // =====================================================================
  document.getElementById("nav").addEventListener("click", function (e) { var b = e.target.closest("[data-tab]"); if (!b) return; UI.tab = b.getAttribute("data-tab"); UI.banner = ""; if (UI.tab === "food") UI.date = todayKey(); render(); window.scrollTo(0, 0); });
  document.getElementById("gear").addEventListener("click", function () { if (S.profile) openSettings(); else openProfile(); });
  fab.addEventListener("click", function () { openAdd(); });

  view.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]"); if (!b || b.tagName === "INPUT" || b.tagName === "SELECT") return;
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v"), i = +b.getAttribute("data-i"), j = +b.getAttribute("data-j");
    if (a === "profile") openProfile();
    else if (a === "sel") { UI.sel = v; render(); }
    else if (a === "start") startWorkout(UI.sel);
    else if (a === "finish") finishWorkout();
    else if (a === "cancel") { if (b.getAttribute("data-armed")) { S.draft = null; stopTimer(); flush(); render(); toast("Đã huỷ buổi tập"); } else { b.setAttribute("data-armed", "1"); b.textContent = "Bấm lần nữa để huỷ, mọi hiệp sẽ mất"; } }
    else if (a === "rir") { S.draft.ex[i].sets[j].rir = +v; save(); render(); }
    else if (a === "exopen") { var sk = S.draft.ex[i].slot; UI.exOpen[sk] = !UI.exOpen[sk]; render(); }
    else if (a === "exmove") { moveEx(i, v); }
    else if (a === "fb") { S.draft.ex[i].fb = v; UI.exOpen[S.draft.ex[i].slot] = false; save(); render(); if (v === "pain" || v === "nofeel") toast(v === "pain" ? "Đã ghi. Buổi sau app sẽ đề xuất bài thay thế." : "Đã ghi. Nếu lặp lại, app sẽ đề xuất đổi bài."); }
    else if (a === "quickswap") { doSwap(i, v); }
    else if (a === "equip") openEquip();
    else if (a === "done") {
      var ex = S.draft.ex[i], s = ex.sets[j], E = EXDB[ex.id];
      if (!s.done) {
        if ((s.kg === "" || s.kg == null) && !E.bw) { toast("Nhập kg cho hiệp này"); var el = document.getElementById("kg" + i + "_" + j); if (el) el.focus(); return; }
        if (!(s.reps > 0)) { toast("Nhập số rep"); return; }
        if (s.rir == null) { toast("Chọn RIR: còn làm thêm được mấy rep"); return; }
        s.done = true; if (s.kg === "") s.kg = 0;
        var nx = ex.sets[j + 1]; if (nx && !nx.done) nx.kg = s.kg;
        startTimer(E.t === "C" ? 150 : 90, E.n + " · hiệp " + (j + 1) + "/" + ex.sets.length);
      } else s.done = false;
      save(); render();
    }
    else if (a === "addset") { var st = S.draft.ex[i].sets, ls = st[st.length - 1]; st.push({ kg: ls ? ls.kg : "", reps: ls ? ls.reps : 8, rir: ls ? ls.rir : 2, done: false }); save(); render(); }
    else if (a === "delset") { S.draft.ex[i].sets.pop(); save(); render(); }
    else if (a === "swap") openSwap(i);
    else if (a === "prev") { UI.date = shiftKey(UI.date, -1); render(); }
    else if (a === "next") { if (UI.date < todayKey()) { UI.date = shiftKey(UI.date, 1); render(); } }
    else if (a === "savew") { var w = num(document.getElementById("wIn").value); if (!(w >= 30 && w <= 250)) { toast("Nhập cân nặng bằng kg, ví dụ 79,6"); return; } S.weight[todayKey()] = w; flush(); render(); toast("Đã lưu " + fmt(w) + " kg"); }
    else if (a === "clearw") { delete S.weight[todayKey()]; flush(); render(); }
    else if (a === "edit") openEdit(v);
    else if (a === "addto") openAdd(v);
    else if (a === "didea") openDinner(UI.ideas[+v]);
    else if (a === "dbuild") openDinner();
    else if (a === "waist") openMeasure();
    else if (a === "toclaude") shareClaude();
    else if (a === "recalc") { var r = estimateTDEE(), np = planFrom(r.tdee), old = S.plan.kcal; S.checkins.unshift({ date: todayKey(), tdee: np.tdee, est: r.est, kcal: np.kcal, p: np.p, from: old }); S.plan = np; flush(); UI.banner = "Mục tiêu mới: " + int(np.kcal) + " kcal (" + (np.kcal >= old ? "+" : "") + int(np.kcal - old) + "), " + np.p + "g đạm."; render(); }
    else if (a === "calmode") { UI.calMode = v; render(); }
    else if (a === "alllifts") { UI.allLifts = !UI.allLifts; render(); }
    else if (a === "calprev" || a === "calnext") { var cm = UI.calMonth.split("-"), dt = new Date(+cm[0], +cm[1] - 1 + (a === "calnext" ? 1 : -1), 1); UI.calMonth = dt.getFullYear() + "-" + pad(dt.getMonth() + 1); render(); }
    else if (a === "yrprev" || a === "yrnext") { UI.calMonth = (+UI.calMonth.slice(0, 4) + (a === "yrnext" ? 1 : -1)) + "-01"; render(); }
    else if (a === "calmonth") { UI.calMonth = v; UI.calMode = "month"; render(); }
    else if (a === "goday") { UI.date = v; UI.tab = "food"; UI.banner = ""; render(); window.scrollTo(0, 0); }
    else if (a === "cardio") openCardio(v);
    else if (a === "editcardio") openCardio(null, v);
    else if (a === "delcardio") { if (b.getAttribute("data-armed")) { S.cardio = S.cardio.filter(function (c) { return c.id !== v; }); flush(); render(); toast("Đã xoá"); } else { b.setAttribute("data-armed", "1"); b.textContent = "Xoá?"; } }
    else if (a === "delw") { if (b.getAttribute("data-armed")) { S.workouts = S.workouts.filter(function (w2) { return w2.id !== v; }); flush(); render(); } else { b.setAttribute("data-armed", "1"); b.textContent = "Xoá?"; } }
  });
  view.addEventListener("input", function (e) {
    var t = e.target, a = t.getAttribute("data-act"); if (!S.draft || (a !== "kg" && a !== "reps")) return;
    var s = S.draft.ex[+t.getAttribute("data-i")].sets[+t.getAttribute("data-j")];
    if (a === "kg") { var n = num(t.value); s.kg = n == null ? "" : n; } else s.reps = parseInt(t.value, 10) || 0;
    save();
  });
  view.addEventListener("change", function (e) { if (e.target.getAttribute("data-act") === "chartex") { UI.chartEx = e.target.value; render(); } });

  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) return closeSheet();
    var b = e.target.closest("[data-act]"); if (!b) return;
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v");
    if (a === "close") closeSheet();
    else if (a === "saveprofile") {
      var g = function (id) { return document.getElementById(id).value; };
      var p = { sex: g("pSex"), age: num(g("pAge")), height: num(g("pH")), weight: num(g("pW")), act: +g("pAct"), rate: +g("pRate"), pkg: +g("pPkg"), weekly: +g("pWk"), goalBf: +g("pBf") };
      if (!(p.age >= 14 && p.age <= 90 && p.height >= 130 && p.height <= 220 && p.weight >= 35 && p.weight <= 250)) { toast("Kiểm tra lại tuổi, chiều cao (cm), cân nặng (kg)"); return; }
      var first = !S.profile;
      p.tdee0 = Math.round(bmr(p, p.weight) * p.act); p.start = (S.profile && S.profile.start) || todayKey();
      S.profile = p;
      if (first && S.weight[todayKey()] == null) S.weight[todayKey()] = p.weight;
      S.plan = planFrom(estimateTDEE().tdee);
      flush(); closeSheet(); render(); toast("Mục tiêu: " + int(S.plan.kcal) + " kcal · " + S.plan.p + "g đạm mỗi ngày");
    }
    else if (a === "profile") openProfile();
    else if (a === "view") { SH.view = v; reSheet(addHtml()); }
    else if (a === "setmeal") { SH.meal = v; sb.querySelectorAll('[data-act="setmeal"]').forEach(function (q) { q.setAttribute("aria-pressed", q === b); }); var fr0 = document.getElementById("fres"); if (fr0 && !SH.q.trim()) fr0.innerHTML = searchRes(); }
    else if (a === "movemeal") { var mm0 = findFood(SH.id); mm0.meal = v; flush(); render(); sb.querySelectorAll('[data-act="movemeal"]').forEach(function (q) { q.setAttribute("aria-pressed", q === b); }); toast("Đã chuyển sang " + mealName(v).toLowerCase()); }
    else if (a === "qadd") { var fq = document.getElementById("fq"); SH.q = (SH.q.trim() ? SH.q.replace(/[\s,]+$/, "") + ", " : "") + v; fq.value = SH.q; document.getElementById("fres").innerHTML = searchRes(); }
    else if (a === "pg") { var i = +b.getAttribute("data-i"), row = mealRows()[i]; SH.adj[i] = clamp(row.grams + +b.getAttribute("data-d") * gStep(row.food), 0, 2000); document.getElementById("fres").innerHTML = searchRes(); }
    else if (a === "addmeal") { var ml = mealItem(); if (!ml.kcal) return; ml.meal = SH.meal; addFood(UI.date, ml); closeSheet(); render(); toast("Đã thêm " + int(ml.kcal) + " kcal · " + fmt(ml.p) + "g đạm"); }
    else if (a === "fr") { var fr = SH.fr[+v]; addFood(UI.date, { n: fr.n, kcal: fr.base.kcal, p: fr.base.p, c: fr.base.c, f: fr.base.f, rid: fr.rid, meal: SH.meal }); closeSheet(); render(); toast("Đã thêm " + fr.n); }
    else if (a === "ctype") { cSetType(v); reSheet(cardioHtml()); }
    else if (a === "cmin") { SH.min = +v; document.getElementById("cMin").value = v; sb.querySelectorAll('[data-act="cmin"]').forEach(function (q) { q.setAttribute("aria-pressed", q === b); }); document.getElementById("cres").innerHTML = cardioRes(); }
    else if (a === "clv") { SH.lv = +v; reSheet(cardioHtml()); }
    else if (a === "cdate") { SH.date = v; reSheet(cardioHtml()); }
    else if (a === "savecardio") {
      if (!(SH.min > 0 && SH.min <= 600)) { toast("Nhập số phút"); return; }
      if (SH.type === "walk" && !(SH.spd >= 2 && SH.spd <= 20)) { toast("Nhập tốc độ trên máy (km/h)"); return; }
      var cr = cardioCalc(SH), ent = { id: SH.id || uid(), date: SH.date, type: SH.type, lv: SH.lv, min: SH.min, met: cr.met, kcal: cr.kcal };
      if (SH.type === "walk") { ent.spd = SH.spd; ent.inc = SH.inc || 0; }
      if (SH.type === "ell" && SH.hr >= 80) ent.hr = SH.hr;
      S.cardio = (S.cardio || []).filter(function (c) { return c.id !== ent.id; }).concat([ent]);
      S.cardioLast = S.cardioLast || {}; S.cardioLast[SH.type] = { lv: ent.lv, min: ent.min, spd: ent.spd, inc: ent.inc, hr: ent.hr || null };
      var cn = CARDIO[SH.type].n, was = SH.id; flush(); closeSheet(); render(); toast((was ? "Đã sửa " : "Đã ghi ") + cn.toLowerCase() + ": khoảng " + int(cr.kcal) + " kcal");
    }
    else if (a === "nb") { SH.nb = v; reSheet(addHtml()); }
    else if (a === "addnum") {
      var nv = SH.nv || {}, nn = (nv.nN || "").trim(), R0 = numVals();
      if (!nn || !R0.ok) { toast("Cần tên và số calo"); return; }
      if (document.getElementById("nSave").checked) {
        // Lưu theo 100g; bao bì ghi theo gói mà biết cân nặng gói thì quy đổi về 100g
        var cid = "my_" + norm(nn).replace(/[^a-z0-9]+/g, "_"), cu, b0 = R0.base;
        if (R0.per) cu = { id: cid, n: nn, kcal: b0.kcal, p: b0.p, c: b0.c, f: b0.f, units: R0.pack ? [{ n: "gói", g: R0.pack }, { n: "g", g: 1 }] : [{ n: "phần 100g", g: 100 }] };
        else if (R0.pack) { var q0 = 100 / R0.pack; cu = { id: cid, n: nn, kcal: b0.kcal * q0, p: b0.p * q0, c: b0.c * q0, f: b0.f * q0, units: [{ n: "gói", g: R0.pack }] }; }
        else cu = { id: cid, n: nn, kcal: b0.kcal, p: b0.p, c: b0.c, f: b0.f, units: [{ n: "gói", g: 100 }], noG: true };
        S.custom = (S.custom || []).filter(function (x) { return x.id !== cid; }).concat([cu]); FitDB.addCustom(cu);
      }
      var label = nn + " (" + (R0.per ? fmt(R0.eat) + "g" : fmt(R0.eat) + " gói") + ")";
      addFood(UI.date, { n: label, kcal: R0.kcal, p: R0.p, c: R0.c, f: R0.f, meal: SH.meal }); closeSheet(); render(); toast("Đã thêm " + int(R0.kcal) + " kcal · " + fmt(Math.round(R0.p * 10) / 10) + "g đạm");
    }
    else if (a === "dbuild") openDinner();
    else if (a === "dpro") { var o0 = SH.o; o0.pro = v; o0.cut = DPRO[v].cuts[0][0]; o0.eggs = v === "trung" ? 3 : 0; if (DSTY[o0.sty].flav.indexOf(o0.flav) < 0) o0.flav = DSTY[o0.sty].flav[0]; dRefresh(true); }
    else if (a === "dcut") { SH.o.cut = v; dRefresh(true); }
    else if (a === "dsty") { SH.o.sty = v; if (DSTY[v].flav.indexOf(SH.o.flav) < 0) SH.o.flav = DSTY[v].flav[0]; dRefresh(true); }
    else if (a === "dflav") { SH.o.flav = v; dRefresh(false); }
    else if (a === "deggs") { SH.o.eggs = +v; dRefresh(true); }
    else if (a === "deat") {
      var od = SH.o, td = dSum(od); if (!td.kcal) return;
      addFood(UI.date, { n: dName(od) + ", cơm " + od.rice + "g", kcal: td.kcal, p: td.p, c: td.c, f: td.f, rid: "dn", meal: SH.meal || "d", parts: dParts(od) });
      closeSheet(); render(); toast("Đã ghi " + int(td.kcal) + " kcal · " + int(td.p) + "g đạm");
    }
    else if (a === "mul") { var x = +v, bb = SH.b0; SH.mul = x; document.getElementById("eK").value = int(bb.kcal * x); document.getElementById("eP").value = fmt(Math.round(bb.p * x * 10) / 10); sb.querySelectorAll('[data-act="mul"]').forEach(function (q) { q.setAttribute("aria-pressed", q === b); }); }
    else if (a === "saveedit") {
      var m = findFood(SH.id);
      if (SH.eg) {
        var es = editSum(); m.kcal = Math.round(es.kcal); m.p = Math.round(es.p * 10) / 10; m.c = Math.round(es.c * 10) / 10; m.f = Math.round(es.f * 10) / 10;
        m.parts = SH.eg.map(function (q) { return { id: q.food.id, g: q.g }; }); m.base = { kcal: m.kcal, p: m.p, c: m.c, f: m.f }; m.mul = 1;
      } else {
        var ek = num(document.getElementById("eK").value), ep = num(document.getElementById("eP").value);
        if (ek == null) { toast("Nhập số calo"); return; }
        var bb2 = SH.b0, ratio = bb2.kcal ? ek / bb2.kcal : 1;
        m.kcal = Math.round(ek); m.p = ep == null ? 0 : Math.round(ep * 10) / 10; m.c = Math.round((bb2.c || 0) * ratio * 10) / 10; m.f = Math.round((bb2.f || 0) * ratio * 10) / 10;
        if (!m.base) m.base = bb2; m.mul = Math.round(ratio * 100) / 100;
      }
      flush(); closeSheet(); render(); toast("Đã lưu: " + int(m.kcal) + " kcal · " + fmt(m.p) + "g đạm");
    }
    else if (a === "delfood") { S.food[UI.date] = dayFood(UI.date).filter(function (mm) { return mm.id !== SH.id; }); flush(); closeSheet(); render(); toast("Đã xoá"); }
    else if (a === "doswap") { doSwap(SH.ei, v); closeSheet(); }
    else if (a === "equip") openEquip();
    else if (a === "saveequip") {
      sb.querySelectorAll("input[data-eq]").forEach(function (x) { S.equip[x.getAttribute("data-eq")] = x.checked; });
      S.equipSet = true;
      // Bài đang tập dở mà không còn dụng cụ thì đổi sang bài có dụng cụ
      if (S.draft) S.draft.ex.forEach(function (e, k) { if (!hasEq(e.id) && !e.sets.some(function (s2) { return s2.done; })) doSwap(k, actualEx(SLOT[e.slot]).id, true); });
      flush(); closeSheet(); render(); toast("Đã lưu dụng cụ");
    }
    else if (a === "savewaist") {
      var wa = num(document.getElementById("waIn").value), ne = num(document.getElementById("neIn").value), hpEl = document.getElementById("hpIn"), hp = hpEl ? num(hpEl.value) : null;
      if (!(wa >= 40 && wa <= 200)) { toast("Nhập vòng bụng bằng cm"); return; }
      if (ne != null && !(ne >= 25 && ne <= 60)) { toast("Vòng cổ thường 30–50 cm, kiểm tra lại"); return; }
      var tk = todayKey(); S.waist[tk] = wa; if (ne != null) S.neck[tk] = ne; if (hp != null && hp >= 60 && hp <= 180) S.hip[tk] = hp;
      flush(); closeSheet(); render();
      var bs = bodySeries(); toast(bs.length && bs[bs.length - 1].k === tk ? "Mỡ ước tính " + fmt(bs[bs.length - 1].raw) + "%" : "Đã lưu số đo");
    }
    else if (a === "copyclaude") { var ta = document.getElementById("clText"); ta.select(); try { navigator.clipboard.writeText(ta.value).then(function () { toast("Đã chép. Dán vào chat với Claude."); }, function () { toast("Bấm giữ vào ô chữ để chép."); }); } catch (er) { toast("Bấm giữ vào ô chữ để chép."); } }
    else if (a === "backup") backup();
    else if (a === "shareclaude") { navigator.share({ title: "FitCore", text: document.getElementById("clText").value }).catch(function () {}); }
    else if (a === "restore") document.getElementById("importFile").click();
    else if (a === "wipe") { if (b.getAttribute("data-armed")) { S = blank(); flush(); closeSheet(); render(); openProfile(); toast("Đã xoá toàn bộ"); } else { b.setAttribute("data-armed", "1"); b.textContent = "Bấm lần nữa để xoá hẳn"; } }
  });
  sheet.addEventListener("input", function (e) {
    if (e.target.id === "nSave") { SH.nsave = e.target.checked; return; }
    if (/^c(Min|Spd|Inc|Hr)$/.test(e.target.id)) {
      var cv = num(e.target.value), f0 = { cMin: "min", cSpd: "spd", cInc: "inc", cHr: "hr" }[e.target.id]; SH[f0] = cv == null ? (f0 === "hr" ? null : 0) : cv;
      if (f0 === "min") sb.querySelectorAll('[data-act="cmin"]').forEach(function (q) { q.setAttribute("aria-pressed", +q.getAttribute("data-v") === SH.min); });
      document.getElementById("cres").innerHTML = cardioRes(); return;
    }
    if (e.target.id === "cDate") { if (e.target.value && e.target.value <= todayKey()) { SH.date = e.target.value; sb.querySelectorAll('[data-act="cdate"]').forEach(function (q) { q.setAttribute("aria-pressed", q.getAttribute("data-v") === SH.date); }); } return; }
    var t = e.target, gv = num(t.value); if (gv == null || gv < 0) gv = 0;
    if (t.hasAttribute("data-gi")) {
      var gi = +t.getAttribute("data-gi"), rows = mealRows(); SH.adj[gi] = rows[gi].food.noG ? gv * 100 : gv;
      rows = mealRows(); document.getElementById("mk" + gi).innerHTML = kCell(rows[gi].r); document.getElementById("mtot").innerHTML = mealTot(mealSum(rows)); return;
    }
    if (t.hasAttribute("data-ei")) {
      var ei = +t.getAttribute("data-ei"), it = SH.eg[ei]; it.g = it.food.noG ? gv * 100 : gv;
      document.getElementById("ek" + ei).innerHTML = kCell(FitDB.calc(it.food, it.g)); document.getElementById("etot").innerHTML = totals(editSum()); return;
    }
    if (t.hasAttribute("data-di")) {
      SH.o[t.getAttribute("data-di")] = t.getAttribute("data-di") === "eggs" ? Math.round(gv) : gv;
      document.getElementById("dtot").innerHTML = dTot(SH.o, dinnerBudget(UI.date)); document.getElementById("dprep").innerHTML = dPrep(SH.o); return;
    }
    if (SH.view === "num" && e.target.id) { SH.nv = SH.nv || {}; SH.nv[e.target.id] = e.target.value; var nr = document.getElementById("nres"); if (nr) nr.innerHTML = numRes(); return; }
    if (e.target.id !== "fq") return;
    SH.q = e.target.value; document.getElementById("fres").innerHTML = searchRes();
  });
  // Bấm vào ô số thì chọn sẵn cả số để gõ đè
  sheet.addEventListener("focusin", function (e) {
    var t = e.target; if (!t.closest || !t.closest(".gin")) return;
    var v0 = t.value; try { t.select(); } catch (er) {}
    setTimeout(function () { if (t.value === v0) try { t.setSelectionRange(0, v0.length); } catch (er) {} }, 0); // Safari trên iPhone
  });
  sheet.addEventListener("change", function (e) {
    if (e.target.id === "dVeg") { SH.o.veg = e.target.value; dRefresh(false); return; }
    var i = e.target.getAttribute("data-i"); if (i == null || e.target.tagName !== "SELECT") return;
    SH.ov[+i] = e.target.value; delete SH.adj[+i]; document.getElementById("fres").innerHTML = searchRes();
  });

  function doSwap(ei, id, silent) {
    var ex = S.draft.ex[ei], slot = SLOT[ex.slot];
    if (id === slot.c.filter(hasEq)[0]) delete S.swaps[slot.id]; else S.swaps[slot.id] = id;
    var sg = suggest(slot); ex.id = id; ex.why = sg.why; ex.fb = null;
    ex.sets = ex.sets.map(function () { return { kg: sg.kg == null ? "" : sg.kg, reps: sg.reps, rir: sg.rir, done: false }; });
    flush(); render(); if (!silent) toast("Đã đổi sang " + EXDB[id].n);
  }

  // ---- Sao lưu ----
  function backup() {
    flush();
    var name = "fitcore-" + todayKey() + ".json", blob = new Blob([JSON.stringify(Object.assign({ app: "fitcore3" }, S))], { type: "application/json" });
    var done = function () { S.lastBackup = Date.now(); flush(); toast("Đã tạo " + name); };
    var dl = function () { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); done(); };
    try { var file = new File([blob], name, { type: "application/json" }); if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: "Sao lưu FitCore" }).then(done).catch(function (er) { if (er && er.name !== "AbortError") dl(); }); return; } } catch (er) {}
    dl();
  }
  document.getElementById("importFile").addEventListener("change", function () {
    var inp = this, f = inp.files && inp.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () { try { var o = JSON.parse(r.result); if (!o || o.app !== "fitcore3") throw 0; delete o.app; S = Object.assign(blank(), o); regCustom(); flush(); closeSheet(); render(); toast("Đã khôi phục"); } catch (er) { toast("File này không phải bản sao lưu FitCore 3."); } inp.value = ""; };
    r.readAsText(f);
  });

  // Đồng hồ thời gian buổi tập
  setInterval(function () { var el = document.getElementById("elapsed"); if (el && S.draft) { var n = 0, t = 0; S.draft.ex.forEach(function (x) { x.sets.forEach(function (s) { t++; if (s.done) n++; }); }); el.textContent = Math.round((Date.now() - +el.getAttribute("data-start")) / 60000) + " phút · " + n + "/" + t + " hiệp"; } }, 20000);
  // Sang ngày mới khi đang mở app
  var lastDay = todayKey();
  setInterval(function () { var t = todayKey(); if (t !== lastDay) { if (UI.date === lastDay) UI.date = t; lastDay = t; autoCheckin(); render(); } }, 60000);

  // =====================================================================
  // Khởi động
  // =====================================================================
  load();
  regCustom();
  autoCheckin();
  render();
  if (!S.profile) openProfile();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  if ("serviceWorker" in navigator && location.protocol !== "file:") window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
})();
