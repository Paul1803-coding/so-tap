(function () {
  "use strict";

  // =====================================================================
  // Kế hoạch lấy từ project "Xây dựng chế độ dinh dưỡng"
  // =====================================================================
  var DEFAULT_TARGETS = { kcal: 2150, p: 140, f: 65, c: 250 };
  var DEFAULT_GOALS = { weight: 74.5, waistDrop: 7, weekly: 5 };

  var PROGRAM = {
    UA: { name: "Upper A", sub: "Ngực · lưng nặng", ex: [
      { id: "smbench", n: "Smith bench press", t: "C", s: 3, r: "6–8", q: "smith machine bench press form", note: "Đòn chạm ngang hoặc ngay dưới đầu ti · khuỷu 45–60° · ép bả vai ra sau và xuống" },
      { id: "brow", n: "Barbell row", t: "C", s: 3, r: "8–10", q: "barbell row form" },
      { id: "incdb", n: "Incline DB press", t: "C", s: 3, r: "8–12", q: "incline dumbbell press form", db: true },
      { id: "latpd", n: "Lat pulldown", t: "C", s: 3, r: "10–12", q: "lat pulldown form" },
      { id: "tripd", n: "Triceps pushdown", t: "I", s: 3, r: "10–15", q: "cable triceps pushdown form" },
      { id: "dbcurl", n: "DB curl", t: "I", s: 3, r: "10–15", q: "dumbbell curl form", db: true },
      { id: "latraise", n: "Lateral raise", t: "I", s: 3, r: "12–15", q: "dumbbell lateral raise form", fst: true, db: true }
    ]},
    LA: { name: "Lower A", sub: "Squat làm chính", ex: [
      { id: "squat", n: "Back squat", t: "C", s: 3, r: "6–8", q: "barbell back squat form" },
      { id: "rdl", n: "Romanian deadlift", t: "C", s: 3, r: "8–10", q: "romanian deadlift form" },
      { id: "legpress", n: "Leg press", t: "C", s: 3, r: "10–12", q: "leg press form" },
      { id: "calfst", n: "Calf raise đứng", t: "I", s: 3, r: "12–15", q: "standing calf raise form" },
      { id: "crunch", n: "Cable crunch", t: "I", s: 3, r: "12–15", q: "kneeling cable crunch form" },
      { id: "legcurl", n: "Leg curl", t: "I", s: 3, r: "10–15", q: "lying leg curl form", fst: true }
    ]},
    UB: { name: "Upper B", sub: "Vai · xô", ex: [
      { id: "smohp", n: "Smith OHP ngồi", t: "C", s: 3, r: "6–10", q: "seated smith machine shoulder press form", note: "Đòn đi trước mặt, không đẩy sau gáy · lùi ghế để đòn qua mặt · lưng tựa sát ghế" },
      { id: "pullup", n: "Pull-up / pulldown tay ngửa", t: "C", s: 3, r: "6–10", q: "underhand lat pulldown form", bw: true },
      { id: "dbbench", n: "DB bench press", t: "C", s: 3, r: "8–12", q: "dumbbell bench press form", db: true },
      { id: "cablerow", n: "Seated cable row", t: "C", s: 3, r: "10–12", q: "seated cable row form" },
      { id: "latcable", n: "Lateral raise (cáp)", t: "I", s: 3, r: "12–15", q: "cable lateral raise form" },
      { id: "inccurl", n: "Incline curl", t: "I", s: 3, r: "10–15", q: "incline dumbbell curl form", db: true },
      { id: "ohtri", n: "Triceps qua đầu (cáp)", t: "I", s: 3, r: "10–15", q: "overhead cable triceps extension form" },
      { id: "pecdeck", n: "Pec deck / cable fly", t: "I", s: 3, r: "12–15", q: "pec deck fly form", fst: true }
    ]},
    LB: { name: "Lower B", sub: "Deadlift làm chính", ex: [
      { id: "dl", n: "Deadlift", t: "C", s: 3, r: "4–6", q: "conventional deadlift form" },
      { id: "bss", n: "Bulgarian split squat", t: "C", s: 3, r: "8–10 mỗi chân", q: "bulgarian split squat form", db: true },
      { id: "seatcurl", n: "Seated leg curl", t: "I", s: 3, r: "10–12", q: "seated leg curl form" },
      { id: "calfsit", n: "Calf raise ngồi", t: "I", s: 3, r: "12–15", q: "seated calf raise form" },
      { id: "hlr", n: "Hanging leg raise", t: "I", s: 3, r: "10–15", q: "hanging leg raise form", bw: true },
      { id: "legext", n: "Leg extension", t: "I", s: 3, r: "12–15", q: "leg extension form", fst: true }
    ]}
  };
  var ORDER = ["UA", "LA", "UB", "LB"];

  // Bài thay thế cùng nhóm cơ, cùng kiểu chuyển động. Compound chỉ đổi sang biến thể gần nhất.
  var ALTS = {
    smbench: [["bbbench", "Barbell bench press", "barbell bench press form"], ["machpress", "Chest press máy", "machine chest press form"]],
    brow: [["tbar", "T-bar row có tựa ngực", "chest supported t bar row form"], ["dbrow", "DB row 1 tay", "one arm dumbbell row form", 1]],
    incdb: [["incsmith", "Incline Smith press", "incline smith machine press form"], ["incmach", "Incline chest press máy", "incline machine chest press form"]],
    latpd: [["latpdn", "Lat pulldown tay hẹp", "close grip lat pulldown form"], ["apull", "Pull-up máy trợ lực", "assisted pull up machine form"]],
    tripd: [["rope", "Rope pushdown", "rope triceps pushdown form"], ["skull", "Skull crusher EZ", "ez bar skull crusher form"], ["dipmach", "Dips máy", "seated dip machine form"]],
    dbcurl: [["ezcurl", "EZ bar curl", "ez bar curl form"], ["cablecurl", "Cable curl", "cable curl form"], ["hammer", "Hammer curl", "hammer curl form", 1]],
    latraise: [["latcab2", "Lateral raise cáp", "cable lateral raise form"], ["latmach", "Lateral raise máy", "machine lateral raise form"]],
    squat: [["smsquat", "Smith squat", "smith machine squat form"], ["hack", "Hack squat", "hack squat form"]],
    rdl: [["dbrdl", "DB Romanian deadlift", "dumbbell romanian deadlift form", 1], ["smrdl", "Smith Romanian deadlift", "smith machine romanian deadlift form"]],
    legpress: [["hack2", "Hack squat", "hack squat form"], ["lunge", "Walking lunge tạ đơn", "dumbbell walking lunge form", 1]],
    calfst: [["calflp", "Calf raise trên máy đạp đùi", "leg press calf raise form"], ["calfsm", "Smith calf raise", "smith machine calf raise form"]],
    crunch: [["abmach", "Ab crunch máy", "ab crunch machine form"], ["kneeraise", "Gập gối trên ghế dips", "captains chair knee raise form", 0, 1]],
    legcurl: [["seatcurl2", "Seated leg curl", "seated leg curl form"], ["ballcurl", "Leg curl với bóng", "stability ball leg curl form", 0, 1]],
    smohp: [["dbohp", "DB shoulder press ngồi", "seated dumbbell shoulder press form", 1], ["machohp", "Shoulder press máy", "machine shoulder press form"]],
    pullup: [["apull2", "Pull-up máy trợ lực", "assisted pull up machine form"], ["latpdu", "Lat pulldown tay ngửa", "underhand lat pulldown form"]],
    dbbench: [["machpress2", "Chest press máy", "machine chest press form"], ["bbbench2", "Barbell bench press", "barbell bench press form"]],
    cablerow: [["machrow", "Row máy tựa ngực", "chest supported machine row form"], ["dbrow2", "DB row 1 tay", "one arm dumbbell row form", 1]],
    latcable: [["latdb", "Lateral raise tạ đơn", "dumbbell lateral raise form", 1], ["latmach2", "Lateral raise máy", "machine lateral raise form"]],
    inccurl: [["preacher", "Preacher curl", "preacher curl form"], ["bayes", "Bayesian cable curl", "bayesian cable curl form"]],
    ohtri: [["dbohtri", "DB triceps qua đầu", "dumbbell overhead triceps extension form", 1], ["skull2", "Skull crusher EZ", "ez bar skull crusher form"]],
    pecdeck: [["cablefly", "Cable fly", "cable fly form"], ["dbfly", "DB fly", "dumbbell fly form", 1]],
    dl: [["trapbar", "Trap bar deadlift", "trap bar deadlift form"], ["rackpull", "Rack pull dưới gối", "rack pull below knee form"]],
    bss: [["smsplit", "Smith split squat", "smith machine split squat form"], ["lunge2", "Walking lunge tạ đơn", "dumbbell walking lunge form", 1]],
    seatcurl: [["lycurl", "Lying leg curl", "lying leg curl form"]],
    calfsit: [["calfst2", "Calf raise đứng", "standing calf raise form"], ["calflp2", "Calf raise trên máy đạp đùi", "leg press calf raise form"]],
    hlr: [["kneeraise2", "Gập gối trên ghế dips", "captains chair knee raise form", 0, 1], ["crunch2", "Cable crunch", "kneeling cable crunch form"]],
    legext: [["legext1", "Leg extension 1 chân", "single leg extension form"], ["sissy", "Sissy squat máy", "sissy squat machine form", 0, 1]]
  };
  var EXDB = {};
  Object.keys(PROGRAM).forEach(function (k) { PROGRAM[k].ex.forEach(function (e) { EXDB[e.id] = e; }); });
  Object.keys(ALTS).forEach(function (sid) {
    ALTS[sid].forEach(function (a) { if (!EXDB[a[0]]) EXDB[a[0]] = { id: a[0], n: a[1], q: a[2], db: !!a[3], bw: !!a[4] }; });
  });

  var WARM = {
    UA: [
      { id: "w-pec", n: "Pec deck fly nhẹ", d: "1 × 15 · tạ khoảng 40% mức tập, mở ngực hết biên độ" },
      { id: "w-pull", n: "Kéo xà hoặc lat pulldown nhẹ", d: "1 × 10 · kéo xà dùng máy trợ lực, hoặc pulldown thật nhẹ" },
      { id: "ramp", n: "Làm nóng bài ngực đầu tiên", d: "50% × 8, rồi 75% × 4 · nghỉ 1 phút giữa 2 hiệp" }
    ],
    UB: [
      { id: "w-lat", n: "Lateral raise cáp nhẹ", d: "1 × 15 mỗi tay · tạ khoảng 40% mức tập" },
      { id: "w-pull", n: "Kéo xà hoặc lat pulldown nhẹ", d: "1 × 10 · kéo xà dùng máy trợ lực, hoặc pulldown thật nhẹ" },
      { id: "ramp", n: "Làm nóng bài vai đầu tiên", d: "50% × 8, rồi 75% × 4 · nghỉ 1 phút giữa 2 hiệp" }
    ],
    LA: [
      { id: "w-ext", n: "Leg extension nhẹ", d: "1 × 15 · làm nóng gối và đùi trước" },
      { id: "w-curl", n: "Leg curl nhẹ", d: "1 × 15 · làm nóng đùi sau" },
      { id: "ramp", n: "Làm nóng squat", d: "Đòn trống × 10 → 50% × 6 → 75% × 3" }
    ],
    LB: [
      { id: "w-curl", n: "Seated leg curl nhẹ", d: "1 × 15 · làm nóng đùi sau" },
      { id: "w-ext", n: "Leg extension nhẹ", d: "1 × 15 · làm nóng gối, chuẩn bị cho Bulgarian" },
      { id: "ramp", n: "Làm nóng deadlift", d: "40% × 8 → 60% × 5 → 80% × 2" }
    ]
  };

  // Ngày ăn mẫu. Tick là ghi luôn vào nhật ký ăn của ngày đó.
  var PLAN_MEALS = [
    { id: "sang", slot: "Sáng", t: "Bữa sáng", d: "Bánh mì kẹp 2 trứng (hoặc nửa suất xôi + trứng/thịt)", kcal: 430, p: 21, c: 48, f: 17 },
    { id: "g7", slot: "Phụ", t: "1 gói G7", d: "Không thêm trà sữa, nước ngọt", kcal: 70, p: 0.5, c: 11, f: 2.5 },
    { id: "trua", slot: "Trưa", t: "Trưa căng tin", d: "Cơm 1 nắm tay · thịt 2 lòng bàn tay · nửa đĩa rau · tránh đồ chiên", kcal: 650, p: 40, c: 75, f: 20 },
    { id: "toi", slot: "Tối", t: "Bữa tối", d: "", kcal: 650, p: 50, c: 63, f: 13 },
    { id: "phu", slot: "Phụ", t: "Bữa sau tập", d: "3 trứng + 1 hộp sữa chua không đường + 1 quả chuối", kcal: 370, p: 24, c: 33, f: 17 }
  ];
  var OTHER_HABITS = [
    { id: "buoc", t: "Đủ 8.000 bước", d: "Xem đếm bước trên điện thoại" },
    { id: "ngu", t: "Ngủ từ 7 tiếng", d: "Tính cho đêm qua" }
  ];
  var HABIT_COUNT = PLAN_MEALS.length + OTHER_HABITS.length;

  // ---------- Bữa tối ----------
  var TYPES = {
    ga:     { meat: "Ức gà 218g", rice: "200g cơm ≈ ½ cốc gạo", riceG: 200, oil: "2 thìa cà phê dầu", p: 50, k: 660 },
    than:   { meat: "Thăn lợn 200g", rice: "200g cơm ≈ ½ cốc gạo", riceG: 200, oil: "2 thìa cà phê dầu", p: 43, k: 690 },
    duiTo:  { meat: "Đùi gà to 342g (bỏ da)", rice: "200g cơm ≈ ½ cốc gạo", riceG: 200, oil: "2 thìa cà phê dầu", p: 39, k: 650 },
    duiNho: { meat: "Đùi gà nhỏ 278g (bỏ da) + 1 trứng", rice: "200g cơm ≈ ½ cốc gạo", riceG: 200, oil: "2 thìa cà phê dầu", p: 38, k: 680 },
    bo:     { meat: "Bò xay 161g + 150g đậu phụ", rice: "120g cơm ≈ ⅓ cốc gạo", riceG: 120, oil: "không dầu, chắt mỡ", p: 41, k: 720 },
    lon:    { meat: "Lợn xay 202g + 100g đậu phụ", rice: "100g cơm ≈ ¼ cốc gạo", riceG: 100, oil: "không dầu, chắt mỡ", p: 42, k: 740 }
  };
  var RECIPES = [
    { id: "xaosa", n: "Ức gà xào sả ớt", for: "Đợt 1 · 2 hộp", steps: [
      "Thái ức gà lát mỏng ngang thớ.",
      "Ướp 15 phút: 1 thìa cà phê nước mắm mỗi hộp, tiêu, tỏi băm, 2 cây sả băm, ớt.",
      "Phi tỏi với 2 thìa cà phê dầu mỗi hộp, xào lửa to 5–6 phút đến khi gà vừa săn."],
      tip: "Không xào quá lâu, ức gà hâm lại sẽ khô. Gà vừa hết hồng là tắt bếp." },
    { id: "nhoi", n: "Đậu phụ nhồi lợn xay sốt cà chua", for: "Đợt 1 và đợt 3 · mỗi đợt 1 hộp", steps: [
      "Trộn lợn xay với hành lá, ½ thìa cà phê nước mắm, tiêu.",
      "Cắt đậu phụ thành miếng vuông, rạch một đường giữa, nhồi thịt vào.",
      "Áp chảo mặt có thịt trước, không cho dầu (mỡ thịt tự ra), lật đều các mặt.",
      "Cho 2 quả cà chua băm vào, thêm ít nước, đun lửa nhỏ 10 phút."],
      tip: "Thịt thừa không nhồi hết thì vo viên, cho chung vào sốt." },
    { id: "rim", n: "Thăn lợn rim tiêu", for: "Đợt 2 · 2 hộp", steps: [
      "Thái thăn miếng dày khoảng 1cm.",
      "Ướp: nước mắm, nhiều tiêu, hành tím băm, ½ thìa cà phê đường cho cả mẻ.",
      "Áp chảo săn 2 mặt với 2 thìa cà phê dầu mỗi hộp, thêm ½ bát nước, rim lửa nhỏ 15 phút đến khi nước sệt lại."],
      tip: "Rim cho nước còn sệt, đừng để cạn khô. Phần nước rim chan cơm giúp thịt hâm lại vẫn mềm." },
    { id: "kho", n: "Đùi gà kho gừng", for: "Đợt 2 · 1 hộp (đùi to)", steps: [
      "Lột da, chặt đùi thành 3–4 miếng.",
      "Ướp: nước mắm, gừng thái sợi, tiêu, hành tím.",
      "Đảo săn với 2 thìa cà phê dầu, thêm nước ngập nửa thịt, kho lửa nhỏ 25 phút."],
      tip: "Đây là món để 3–4 ngày càng ngấm, nên xếp vào ngày cuối của đợt." },
    { id: "xaodau", n: "Bò xay xào đậu phụ, hành tây", for: "Đợt 2 và đợt 4 · mỗi đợt 1 hộp", steps: [
      "Phi tỏi trên chảo nóng, không cho dầu, cho bò xay vào đảo tơi.",
      "Bò ra mỡ thì nghiêng chảo, chắt bớt mỡ đi.",
      "Thêm 150g đậu phụ cắt hạt lựu, ½ củ hành tây, ½ quả cà chua, nước mắm, tiêu. Đảo 5 phút."],
      tip: "Bò xay không dai khi hâm như bò thái lát, nên nấu sẵn được." },
    { id: "aptieu", n: "Ức gà áp chảo tiêu đen", for: "Đợt 3 · 2 hộp", steps: [
      "Lạng ức gà dày khoảng 1cm hoặc dần mỏng cho đều.",
      "Ướp: muối, nhiều tiêu đen xay, tỏi băm, 15 phút.",
      "Chảo thật nóng với 2 thìa cà phê dầu mỗi hộp, áp 3–4 phút mỗi mặt, không lật nhiều.",
      "Để nghỉ 5 phút rồi mới thái, gà giữ được nước."],
      tip: "Ăn kèm nước chấm chanh muối tiêu cho đỡ khô." },
    { id: "nuongsa", n: "Nướng sả cả mẻ: ức gà, thăn, đùi gà", for: "Đợt 4 · 3 hộp", steps: [
      "Thái ức gà và thăn miếng to, đùi gà lột da để nguyên.",
      "Ướp chung 30 phút: 3 cây sả băm, tỏi, nước mắm, tiêu, 1 thìa cà phê mật ong cho cả mẻ, 2 thìa cà phê dầu mỗi hộp.",
      "Nồi chiên không dầu 180°C: ức gà và thăn 15–18 phút, đùi gà có xương 25 phút. Lật một lần ở giữa."],
      tip: "Hộp đùi gà nhỏ (ngày 31/10) thêm 1 quả trứng luộc cho đủ đạm." }
  ];
  var RNAME = {}; RECIPES.forEach(function (r) { RNAME[r.id] = r.n; });

  var DAYS = [
    { d: "2026-10-17", tasks: [
      { id: "chia", k: "prep", t: "Chia 14 túi thịt sống", s: "Xem mục Khẩu phần. 3 túi đợt 1 (2 ức gà + 1 lợn xay) để ngăn mát, 11 túi còn lại cho ngăn đông ngay tối nay." } ] },
    { d: "2026-10-18", prep: 1, tasks: [
      { id: "mua", k: "prep", t: "Mua đồ nấu đợt 1", s: "Sả 2 cây, ớt, tỏi (đậu phụ và cà chua đã dùng cho bữa tối nay)" },
      { id: "toinay", k: "eat", t: "Bữa tối nay: đậu phụ sốt lợn xay", s: "Đã dùng túi lợn xay 202g + 100g đậu phụ + 300g cải xanh luộc · ¼ cốc gạo · không dầu" },
      { id: "nau", k: "prep", t: "Nấu đợt 1: 2 hộp", s: "2 ức gà xào sả ớt · nấu 1 cốc gạo. Hộp lợn xay ngày 21/10 nấu tươi hôm đó" } ] },
    { d: "2026-10-19", tasks: [
      { id: "ngoai", k: "eat", t: "Ăn ngoài: Gogi", s: "Không tập (ngày nghỉ theo lịch). Mai ăn và tập lại bình thường, không bỏ bữa để bù." },
      { id: "dong", k: "thaw", t: "Cho 1 hộp ức gà xào sả ớt vào ngăn đông", s: "Hộp chưa ăn tối nay, để dành làm bữa tối 02/11" } ] },
    { d: "2026-10-20", box: ["lon", "nhoi"], veg: "Bông cải xanh 250g", thaw: "2 túi thăn, 1 đùi gà to (342g), 1 túi bò xay" },
    { d: "2026-10-21", box: ["ga", "xaosa"], veg: "Cải ngọt 300g", prep: 2, tasks: [
      { id: "mua", k: "prep", t: "Mua đồ nấu đợt 2", s: "Đậu phụ 150g, hành tây 1 củ, cà chua ½ quả, gừng, hành tím, tiêu" },
      { id: "nau", k: "prep", t: "Nấu đợt 2: 4 hộp", s: "2 thăn rim tiêu + 1 đùi gà kho gừng + 1 bò xay xào đậu phụ · nấu gần 2 cốc gạo. Tối nay ăn hộp ức gà còn lại của đợt 1" } ] },
    { d: "2026-10-22", box: ["than", "rim"], veg: "Mồng tơi 300g (nấu canh)" },
    { d: "2026-10-23", box: ["than", "rim"], veg: "Đậu que 250g" },
    { d: "2026-10-24", box: ["bo", "xaodau"], veg: "Cải thảo 250g", thaw: "2 túi ức gà (lợn xay mua tươi ngày mai)" },
    { d: "2026-10-25", box: ["duiTo", "kho"], veg: "Su su + cà rốt 250g", prep: 3, tasks: [
      { id: "mua", k: "prep", t: "Mua đồ nấu đợt 3", s: "Lợn xay 200g (thay túi đã ăn tối 18/10), đậu phụ 100g, cà chua 2 quả, tỏi, tiêu đen, chanh" },
      { id: "nau", k: "prep", t: "Nấu đợt 3: 3 hộp", s: "2 ức gà áp chảo tiêu đen + 1 đậu phụ nhồi lợn xay · nấu 1¼ cốc gạo" } ] },
    { d: "2026-10-26", box: ["ga", "aptieu"], veg: "Rau dền 300g" },
    { d: "2026-10-27", box: ["lon", "nhoi"], veg: "Bắp cải 250g", thaw: "1 túi ức gà, 1 túi thăn, 1 đùi gà nhỏ (278g), 1 túi bò xay" },
    { d: "2026-10-28", box: ["ga", "aptieu"], veg: "Bí xanh 300g", prep: 4, tasks: [
      { id: "mua", k: "prep", t: "Mua đồ nấu đợt 4", s: "Đậu phụ 150g, hành tây 1 củ, sả 3 cây, tỏi, 1 thìa cà phê mật ong, 1 quả trứng" },
      { id: "nau", k: "prep", t: "Nấu đợt 4: 4 hộp", s: "Ức gà, thăn, đùi gà nướng sả cùng mẻ + 1 bò xay xào đậu phụ · nấu gần 2 cốc gạo" } ] },
    { d: "2026-10-29", box: ["ga", "nuongsa"], veg: "Rau muống 300g" },
    { d: "2026-10-30", box: ["than", "nuongsa"], veg: "Bông cải xanh 250g" },
    { d: "2026-10-31", box: ["duiNho", "nuongsa"], veg: "Cải ngọt 300g" },
    { d: "2026-11-01", box: ["bo", "xaodau"], veg: "Đậu que + cà rốt 250g", thaw: "Hộp ức gà xào sả ớt đông lạnh từ 19/10" },
    { d: "2026-11-02", box: ["ga", "xaosa"], veg: "Rau muống 300g", tasks: [
      { id: "ket", k: "prep", t: "Tổng kết 2 tuần", s: "Ghi lại món nào ngán, món nào muốn ăn tiếp, rồi đi chợ thịt cho chu kỳ mới từ 03/11." } ] }
  ];
  var DAY_BY_DATE = {}; DAYS.forEach(function (d) { DAY_BY_DATE[d.d] = d; });

  // ---------- Món tra cứu nhanh: tên, khẩu phần, kcal, đạm, tinh bột, béo ----------
  var FOODS = [
    ["Cơm trắng", "1 chén (150g)", 195, 4, 43, 0.4],
    ["Cơm trắng", "100g", 130, 2.7, 28, 0.3],
    ["Bánh mì kẹp 2 trứng", "1 ổ", 430, 21, 48, 17],
    ["Bánh mì thịt", "1 ổ", 420, 18, 50, 15],
    ["Bánh mì không", "1 ổ", 240, 8, 48, 2],
    ["Xôi đậu", "1 gói", 420, 10, 82, 6],
    ["Xôi + trứng/thịt", "nửa suất", 380, 16, 50, 12],
    ["Phở bò", "1 tô", 450, 25, 55, 12],
    ["Bún bò Huế", "1 tô", 480, 25, 60, 14],
    ["Bún chả", "1 phần", 600, 28, 65, 25],
    ["Hủ tiếu", "1 tô", 420, 20, 58, 11],
    ["Cơm tấm sườn", "1 đĩa", 650, 30, 75, 24],
    ["Cơm gà, ít cơm", "1 đĩa", 600, 40, 60, 18],
    ["Cơm căng tin chuẩn", "1 khay", 650, 40, 75, 20],
    ["Gỏi cuốn", "2 cuốn", 180, 9, 28, 3],
    ["Mì gói", "1 gói", 350, 7, 47, 14],
    ["Ức gà (chín)", "100g", 165, 31, 0, 3.6],
    ["Đùi gà bỏ da (chín)", "100g", 175, 24, 0, 8],
    ["Thịt bò nạc", "100g", 170, 26, 0, 7],
    ["Thăn lợn", "100g", 145, 21, 0, 6],
    ["Cá hồi", "100g", 208, 20, 0, 13],
    ["Cá basa", "100g", 125, 18, 0, 5],
    ["Tôm", "100g", 100, 21, 0, 1.5],
    ["Trứng gà", "1 quả", 72, 6.3, 0.4, 4.8],
    ["Đậu phụ", "100g", 76, 8, 1.9, 4.8],
    ["Sữa tươi không đường", "1 hộp 180ml", 110, 6, 8, 6],
    ["Sữa chua không đường", "1 hộp 100g", 60, 3.5, 4.7, 3.3],
    ["Sữa chua có đường", "1 hộp 100g", 95, 3.5, 15, 2.5],
    ["Whey protein", "1 muỗng 30g", 120, 24, 3, 1.5],
    ["Yến mạch", "40g", 150, 5, 27, 2.7],
    ["Khoai lang luộc", "100g", 86, 1.6, 20, 0.1],
    ["Chuối", "1 quả", 105, 1.3, 27, 0.4],
    ["Táo", "1 quả", 95, 0.5, 25, 0.3],
    ["Rau luộc / xào ít dầu", "1 đĩa 250g", 60, 4, 9, 1.5],
    ["Dầu ăn", "1 thìa cà phê (5g)", 45, 0, 0, 5],
    ["Cà phê G7 3in1", "1 gói", 70, 0.5, 11, 2.5],
    ["Cà phê sữa đá", "1 ly", 150, 2, 24, 5],
    ["Trà sữa trân châu", "1 ly size M", 400, 4, 65, 14],
    ["Nước ngọt có ga", "1 lon 330ml", 140, 0, 35, 0],
    ["Bia", "1 lon 330ml", 145, 1, 13, 0],
    ["Đậu phộng", "30g", 170, 7, 5, 14],
    ["Lẩu / nướng Hàn (ăn vừa)", "1 bữa", 1100, 60, 80, 55]
  ];
  var SLOTS = ["Sáng", "Trưa", "Tối", "Phụ"];

  // =====================================================================
  // Ngày giờ & tiện ích
  // =====================================================================
  var WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  var WDL = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  var MONTHS = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function keyOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseKey(k) { var p = String(k).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function todayKey() { return keyOf(new Date()); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; }
  function shiftKey(k, n) { return keyOf(addDays(parseKey(k), n)); }
  function shortDate(k) { var d = parseKey(k); return WD[d.getDay()] + " " + pad(d.getDate()) + "/" + pad(d.getMonth() + 1); }
  function longDate(k) { var d = parseKey(k); return WDL[d.getDay()] + " " + pad(d.getDate()) + "/" + pad(d.getMonth() + 1); }
  function friendly(k) { var t = todayKey(); return k === t ? "Hôm nay" : k === shiftKey(t, -1) ? "Hôm qua" : shortDate(k); }
  function weekStart(d) { return addDays(d, -((d.getDay() + 6) % 7)); }
  function fmt(v) { return String(Math.round(v * 10) / 10).replace(".", ","); }
  function int(v) { return Math.round(v).toLocaleString("vi-VN"); }
  function num(s) { var n = parseFloat(String(s == null ? "" : s).replace(",", ".")); return isNaN(n) ? null : n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d"); }
  function range(r) { var m = String(r).match(/(\d+)\s*[–-]\s*(\d+)/); return m ? { lo: +m[1], hi: +m[2] } : { lo: parseInt(r, 10) || 8, hi: parseInt(r, 10) || 12 }; }
  var CHECK_SVG = '<span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span>';

  // =====================================================================
  // Lưu trữ: dữ liệu chữ trong localStorage, ảnh trong IndexedDB
  // =====================================================================
  var LS_KEY = "so-tap-recomp-app-v1";
  var S = blankState();

  function blankState() {
    return {
      v: 2,
      settings: { startDate: null, targets: Object.assign({}, DEFAULT_TARGETS), goals: Object.assign({}, DEFAULT_GOALS), lastBackup: null },
      prog: { nextIndex: null, drafts: {} },
      swaps: {},         // bài gốc -> bài thay thế
      sessions: [],      // mới nhất trước
      days: {},          // ngày -> { meals, c, w, waist, events, adj, adjNote, photos }
      checks: {}         // việc trong lịch bữa tối
    };
  }
  function load() {
    try { var raw = localStorage.getItem(LS_KEY); if (raw) S = migrate(JSON.parse(raw)); }
    catch (e) { S = blankState(); }
  }
  function migrate(o) {
    var b = blankState();
    if (!o || typeof o !== "object") return b;
    var st = o.settings || {};
    b.settings = Object.assign(b.settings, st);
    b.settings.targets = Object.assign({}, DEFAULT_TARGETS, st.targets || {});
    b.settings.goals = Object.assign({}, DEFAULT_GOALS, st.goals || {});
    b.prog = Object.assign(b.prog, o.prog || {});
    if (!b.prog.drafts) b.prog.drafts = {};
    // Bản 1 lưu bản nháp dạng tick + 1 mức kg; bỏ đi để dựng lại theo từng hiệp.
    Object.keys(b.prog.drafts).forEach(function (k) { var d = b.prog.drafts[k]; if (!d || !d.sets) b.prog.drafts[k] = null; });
    b.swaps = o.swaps && typeof o.swaps === "object" ? o.swaps : {};
    b.sessions = Array.isArray(o.sessions) ? o.sessions : [];
    b.days = o.days && typeof o.days === "object" ? o.days : {};
    b.checks = o.checks && typeof o.checks === "object" ? o.checks : {};
    b.v = 2;
    return b;
  }
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 150);
  }
  function flush() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
    catch (e) { toast("Không lưu được: bộ nhớ trình duyệt đầy hoặc bị chặn."); }
  }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });

  function day(k) {
    var d = S.days[k];
    if (!d) d = S.days[k] = {};
    if (!d.meals) d.meals = [];
    if (!d.c) d.c = {};
    if (!d.events) d.events = [];
    if (!d.photos) d.photos = [];
    return d;
  }
  var EMPTY_DAY = { meals: [], c: {}, events: [], photos: [] };
  function peekDay(k) { var d = S.days[k]; if (!d) return EMPTY_DAY; return { meals: d.meals || [], c: d.c || {}, events: d.events || [], photos: d.photos || [], w: d.w, waist: d.waist, adj: d.adj, adjNote: d.adjNote }; }
  function hasData() { return S.sessions.length > 0 || Object.keys(S.days).length > 0; }
  function addEvent(k, t, note) { var d = day(k); d.events = d.events.filter(function (e) { return e.t !== t; }); d.events.push({ t: t, note: note || "", ts: Date.now() }); }
  function hasEvent(k, t) { return peekDay(k).events.some(function (e) { return e.t === t; }); }

  // ---------- Ảnh ----------
  var photoDb = null, thumbCache = {};
  function idb() {
    return new Promise(function (res, rej) {
      if (photoDb) return res(photoDb);
      if (!window.indexedDB) return rej(new Error("no-idb"));
      var r = indexedDB.open("so-tap-photos", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("p", { keyPath: "id" }); };
      r.onsuccess = function () { photoDb = r.result; res(photoDb); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idbDo(mode, fn) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction("p", mode), st = tx.objectStore("p"), out = fn(st);
        tx.oncomplete = function () { res(out && out.result !== undefined ? out.result : undefined); };
        tx.onerror = function () { rej(tx.error); };
      });
    });
  }
  function putPhoto(rec) { return idbDo("readwrite", function (st) { return st.put(rec); }); }
  function getPhoto(id) { return idbDo("readonly", function (st) { return st.get(id); }); }
  function delPhoto(id) { return idbDo("readwrite", function (st) { return st.delete(id); }); }
  function allPhotos() { return idbDo("readonly", function (st) { return st.getAll(); }); }
  function shrink(file, max, q) {
    return new Promise(function (res, rej) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(u);
        c.toBlob(function (b) { b ? res(b) : rej(new Error("blob")); }, "image/jpeg", q);
      };
      img.onerror = function () { URL.revokeObjectURL(u); rej(new Error("img")); };
      img.src = u;
    });
  }
  function hydratePhotos(root) {
    (root || document).querySelectorAll("img[data-ph]").forEach(function (el) {
      var id = el.getAttribute("data-ph");
      if (thumbCache[id]) { el.src = thumbCache[id]; return; }
      getPhoto(id).then(function (rec) {
        if (!rec) { el.closest(".ph") && el.closest(".ph").remove(); return; }
        thumbCache[id] = URL.createObjectURL(rec.thumb || rec.blob);
        el.src = thumbCache[id];
      }).catch(function () {});
    });
  }

  // =====================================================================
  // Tính toán
  // =====================================================================
  function T() { return S.settings.targets; }
  function G() { return S.settings.goals; }
  function targetFor(k) {
    var t = T(), adj = peekDay(k).adj || 0;
    return { kcal: t.kcal + adj, p: t.p, f: t.f, c: Math.max(0, Math.round(t.c + adj / 4)), adj: adj };
  }
  function currentWeek() {
    if (!S.settings.startDate) return 1;
    var days = Math.floor((parseKey(todayKey()) - parseKey(S.settings.startDate)) / 86400000);
    return Math.max(1, Math.floor(days / 7) + 1);
  }
  function isDeload(w) { return w >= 8 && w % 8 === 0; }
  function phaseInfo(w) {
    if (isDeload(w)) return { cls: "warn", t: "Tuần giảm tải", d: "Bớt 1/3 số hiệp, giữ mức tạ. Tuần sau tiếp tục tăng tiến." };
    if (w <= 4) return { cls: "", t: "Đủ khối lượng", d: "Đủ số hiệp, dừng khi còn khoảng 2 rep, tạ tăng dần về mức cũ." };
    return { cls: "", t: "Tăng tiến kép · FST-7 bật", d: "Mọi hiệp chạm đỉnh khoảng rep thì tăng tạ (+2,5kg đòn, +2kg tạ đơn)." };
  }
  function rx(ex, w) {
    var sets = ex.s, reps = ex.r, rest = ex.t === "C" ? "2–3 phút" : "1–1,5 phút", restSec = ex.t === "C" ? 150 : 75, fst = false;
    if (isDeload(w)) sets = Math.max(1, Math.round(ex.s * 2 / 3));
    else if (ex.fst && w >= 5) { sets = 7; reps = "8–12"; rest = "30–45 giây"; restSec = 35; fst = true; }
    return { sets: sets, reps: reps, rest: rest, restSec: restSec, fst: fst };
  }
  function actualEx(slot) { var a = S.swaps[slot.id]; return a && EXDB[a] ? EXDB[a] : slot; }
  function nextKey() {
    var i = typeof S.prog.nextIndex === "number" ? S.prog.nextIndex : (S.sessions.length ? (ORDER.indexOf(S.sessions[0].key) + 1) % 4 : 0);
    return ORDER[((i % 4) + 4) % 4];
  }

  // Thời gian ước tính: hiệp compound ~1 phút tập + 2,5 phút nghỉ; hiệp cô lập ~0,75 + 1,25.
  var MIN_C = 3.5, MIN_I = 2, MIN_FST = 1.3, MIN_PAIR = 3.2, MIN_WARM = 10;
  function planSession(key, w, d) {
    var items = PROGRAM[key].ex.map(function (slot) {
      var r = rx(slot, w), it = { slot: slot, sets: r.sets, reps: r.reps, rest: r.rest, restSec: r.restSec, fst: r.fst, dropped: false, pair: null, note: "" };
      if (d.tired) {
        if (it.fst) { it.fst = false; it.sets = 2; it.reps = slot.r; it.rest = "1–1,5 phút"; it.restSec = 75; }
        else it.sets = Math.max(2, it.sets - 1);
      }
      if (d.removed && d.removed[slot.id]) { it.dropped = true; it.note = "bỏ"; }
      return it;
    });
    function est() {
      var m = MIN_WARM, seen = {};
      items.forEach(function (it) {
        if (it.dropped || seen[it.slot.id]) return;
        if (it.pair) { var p = items.filter(function (x) { return x.slot.id === it.pair; })[0]; seen[it.pair] = true; m += Math.max(it.sets, p.sets) * MIN_PAIR; }
        else m += it.sets * (it.fst ? MIN_FST : it.slot.t === "C" ? MIN_C : MIN_I);
      });
      return Math.round(m);
    }
    var full = est(), steps = [];
    if (d.budget && full > d.budget) {
      var B = d.budget;
      // 1. FST-7 về 3 hiệp thường
      items.forEach(function (it) { if (est() > B && it.fst && !it.dropped) { it.fst = false; it.sets = 3; it.reps = it.slot.r; it.rest = "1–1,5 phút"; it.restSec = 75; steps.push(it.slot.n + ": bỏ FST-7, làm 3 hiệp thường"); } });
      // 2. Ghép bài cô lập thành superset
      if (est() > B) {
        var iso = items.filter(function (it) { return it.slot.t === "I" && !it.dropped; });
        for (var i = 0; i + 1 < iso.length; i += 2) { iso[i].pair = iso[i + 1].slot.id; iso[i + 1].pair = iso[i].slot.id; iso[i + 1].sets = iso[i].sets = Math.min(iso[i].sets, 3); }
        if (iso.length > 1) steps.push("Ghép bài cô lập thành từng cặp superset, nghỉ sau khi xong cả cặp");
      }
      // 3. Bỏ bài cô lập từ cuối lên
      for (var j = items.length - 1; j >= 0 && est() > B; j--) {
        var it = items[j];
        if (it.slot.t !== "I" || it.dropped) continue;
        it.dropped = true; it.note = "rút gọn";
        if (it.pair) { items.forEach(function (x) { if (x.slot.id === it.pair) x.pair = null; }); it.pair = null; }
        steps.push("Bỏ " + actualEx(it.slot).n + " hôm nay");
      }
      // 4. Compound từ bài thứ 3 trở đi còn 2 hiệp
      var comp = items.filter(function (it) { return it.slot.t === "C" && !it.dropped; });
      for (var c = comp.length - 1; c >= 2 && est() > B; c--) { if (comp[c].sets > 2) { comp[c].sets = 2; steps.push(actualEx(comp[c].slot).n + ": còn 2 hiệp"); } }
      for (var c2 = 1; c2 < 2 && c2 < comp.length && est() > B; c2++) { if (comp[c2].sets > 2) { comp[c2].sets = 2; steps.push(actualEx(comp[c2].slot).n + ": còn 2 hiệp"); } }
      // 5. Bỏ compound cuối, luôn giữ 2 bài đầu
      for (var c3 = comp.length - 1; c3 >= 2 && est() > B; c3--) { comp[c3].dropped = true; comp[c3].note = "rút gọn"; steps.push("Bỏ " + actualEx(comp[c3].slot).n + " hôm nay"); }
    }
    return { items: items, full: full, est: est(), steps: steps };
  }

  function lastFor(exId, beforeTs) {
    for (var i = 0; i < S.sessions.length; i++) {
      var s = S.sessions[i];
      if (beforeTs && s.ts >= beforeTs) continue;
      var log = s.log && s.log[exId];
      if (log && log.length) return { sets: log, kg: Math.max.apply(null, log.map(function (x) { return x.kg; })), date: s.date };
      var w = s.weights && s.weights[exId];
      if (typeof w === "number") return { sets: null, kg: w, date: s.date, full: !!(s.full && s.full[exId]) };
    }
    return null;
  }
  function draftFor(key, w) {
    var d = S.prog.drafts[key];
    if (!d) d = S.prog.drafts[key] = { sets: {}, warm: {}, removed: {} };
    d.sets = d.sets || {}; d.warm = d.warm || {}; d.removed = d.removed || {}; d.exOf = d.exOf || {};
    var plan = planSession(key, w, d);
    plan.items.forEach(function (it) {
      var act = actualEx(it.slot), arr = d.sets[it.slot.id], last = lastFor(act.id), rg = range(it.reps);
      // Bài đã đổi giữa chừng thì làm lại các hiệp; chưa có ghi nhận bài nào thì coi như bài hiện tại
      if (!d.exOf[it.slot.id]) d.exOf[it.slot.id] = act.id;
      if (!arr || d.exOf[it.slot.id] !== act.id) { arr = []; d.exOf[it.slot.id] = act.id; }
      var out = [];
      for (var j = 0; j < it.sets; j++) {
        if (arr[j]) { out.push(arr[j]); continue; }
        var ls = last && last.sets && (last.sets[j] || last.sets[last.sets.length - 1]);
        out.push({ kg: ls ? ls.kg : last ? last.kg : (act.bw ? 0 : ""), reps: ls ? ls.reps : rg.lo, done: false });
      }
      // Giữ lại hiệp đã xong nếu số hiệp giảm (ví dụ vừa bật chế độ mệt)
      for (var x = it.sets; x < arr.length; x++) if (arr[x] && arr[x].done) out.push(arr[x]);
      d.sets[it.slot.id] = out;
    });
    return { d: d, plan: plan };
  }
  function draftIsFresh(key) {
    var d = S.prog.drafts[key];
    if (!d || !d.sets) return true;
    return !Object.keys(d.sets).some(function (k) { return (d.sets[k] || []).some(function (s) { return s.done; }); });
  }
  function sessionsInRange(a, b) { return S.sessions.filter(function (s) { return s.date >= a && s.date <= b; }); }
  function sessionsThisWeek() {
    var ws = keyOf(weekStart(new Date())), we = keyOf(addDays(weekStart(new Date()), 6));
    return sessionsInRange(ws, we).length;
  }
  function boxFor(k) {
    var dd = DAY_BY_DATE[k];
    if (dd && dd.box) {
      var t = TYPES[dd.box[0]], c = Math.round(t.riceG * 0.28 + 8), f = Math.max(0, Math.round((t.k - t.p * 4 - c * 4) / 9));
      return { name: RNAME[dd.box[1]], d: t.meat + " · " + t.rice + " · " + t.oil, kcal: t.k, p: t.p, c: c, f: f, riceG: t.riceG };
    }
    return { name: "Meal prep ức gà", d: "200g ức gà sống + 200g cơm + 300g rau + 10g dầu", kcal: 650, p: 50, c: 63, f: 13, riceG: 200 };
  }
  function planMeal(id, k) {
    var m = PLAN_MEALS.filter(function (x) { return x.id === id; })[0];
    if (id !== "toi") return m;
    var b = boxFor(k);
    return { id: "toi", slot: "Tối", t: "Bữa tối: " + b.name, d: b.d, kcal: b.kcal, p: b.p, c: b.c, f: b.f };
  }
  function hasPlanMeal(k, id) { return peekDay(k).meals.some(function (m) { return m.q === id; }); }
  function sum(meals) {
    return meals.reduce(function (a, m) { return { kcal: a.kcal + (+m.kcal || 0), p: a.p + (+m.p || 0), c: a.c + (+m.c || 0), f: a.f + (+m.f || 0) }; }, { kcal: 0, p: 0, c: 0, f: 0 });
  }
  function habitsDone(k) {
    var d = peekDay(k), n = 0;
    PLAN_MEALS.forEach(function (m) { if (d.meals.some(function (x) { return x.q === m.id; })) n++; });
    OTHER_HABITS.forEach(function (h) { if (d.c[h.id]) n++; });
    return n;
  }
  function weighIns() {
    return Object.keys(S.days).filter(function (k) { return typeof S.days[k].w === "number"; }).sort().map(function (k) { return { k: k, w: S.days[k].w }; });
  }
  function avg(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : null; }
  function trend() {
    var wi = weighIns(), t = new Date();
    var c1 = keyOf(addDays(t, -6)), c0 = keyOf(addDays(t, -13)), c00 = keyOf(addDays(t, -20)), tomorrow = keyOf(addDays(t, 1));
    function ab(a, b) { return avg(wi.filter(function (x) { return x.k >= a && x.k < b; }).map(function (x) { return x.w; })); }
    return { a1: ab(c1, tomorrow), a0: ab(c0, c1), a00: ab(c00, c0), wi: wi };
  }
  function waistList() {
    return Object.keys(S.days).filter(function (k) { return typeof S.days[k].waist === "number"; }).sort().map(function (k) { return { k: k, v: S.days[k].waist }; });
  }
  function dayStatus(k) {
    var d = peekDay(k), t = targetFor(k), s = sum(d.meals), trained = S.sessions.some(function (x) { return x.date === k; });
    var logged = d.meals.length > 0, foodOk = logged && Math.abs(s.kcal - t.kcal) <= t.kcal * 0.1 && s.p >= t.p * 0.9;
    var busy = d.events.some(function (e) { return e.t === "busy"; });
    var hab = habitsDone(k), score = 0;
    if (trained) score += 2;
    if (foodOk) score += 1; else if (hab >= 4) score += 1;
    return { trained: trained, logged: logged, foodOk: foodOk, busy: busy, photos: d.photos.length, score: Math.min(3, score), session: trained ? S.sessions.filter(function (x) { return x.date === k; })[0] : null };
  }

  // =====================================================================
  // Giao diện
  // =====================================================================
  var UI = { tab: "today", date: todayKey(), sel: null, confirm: false, armDel: null, q: "", pick: null, prepTab: "lich", warmShow: false, banner: "", calMode: "month", calMonth: todayKey().slice(0, 7), showDropped: false };
  var view = document.getElementById("view");

  function render() {
    var ae = document.activeElement, focusId = ae && ae.id && view.contains(ae) ? ae.id : null, ss = null, se = null;
    try { if (focusId && ae.selectionStart != null) { ss = ae.selectionStart; se = ae.selectionEnd; } } catch (e) {}
    if (UI.date > todayKey()) UI.date = todayKey();
    document.querySelectorAll("#nav button").forEach(function (b) {
      if (b.getAttribute("data-tab") === UI.tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    var h = UI.tab === "today" ? vToday() : UI.tab === "train" ? vTrain() : UI.tab === "food" ? vFood() : UI.tab === "prep" ? vPrep() : vProgress();
    view.innerHTML = h;
    if (UI.tab === "food") renderResults();
    hydratePhotos(view);
    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) { el.focus({ preventScroll: true }); try { if (ss != null) el.setSelectionRange(ss, se); } catch (e) {} }
    }
  }

  function dateBar() {
    var t = todayKey();
    return '<div class="datebar"><button class="icon" data-act="prev" aria-label="Ngày trước">‹</button><span class="d">' + friendly(UI.date) + '</span><button class="icon" data-act="next" aria-label="Ngày sau"' + (UI.date >= t ? " disabled" : "") + ">›</button></div>";
  }
  function macro(label, color, val, tgt) {
    var pct = Math.min(100, tgt ? val / tgt * 100 : 0);
    return '<div class="macro"><div class="top-line"><span>' + label + '</span><b class="num">' + Math.round(val) + "/" + tgt + 'g</b></div><div class="bar"><i style="width:' + pct + "%;background:var(" + color + ')"></i></div></div>';
  }
  function energyCard(k, withButton) {
    var d = peekDay(k), s = sum(d.meals), t = targetFor(k), left = t.kcal - Math.round(s.kcal);
    var h = '<div class="card"><div class="row between"><span class="label">Năng lượng · ' + friendly(k).toLowerCase() + '</span><span class="note">Mục tiêu ' + int(t.kcal) + " kcal</span></div>";
    if (t.adj) h += '<p class="adj">' + (t.adj < 0 ? "Đã giảm " + int(-t.adj) : "Đã tăng " + int(t.adj)) + " kcal · " + esc(d.adjNote || "điều chỉnh") + "</p>";
    h += '<div class="row between" style="align-items:flex-end"><div><div class="huge num">' + int(s.kcal) + '</div><div class="note">kcal đã ăn</div></div>';
    h += '<div style="text-align:right"><div class="big num" style="color:' + (left < 0 ? "var(--accent-ink)" : "var(--fg)") + '">' + (left < 0 ? "+" + int(-left) : int(left)) + '</div><div class="note">' + (left < 0 ? "kcal vượt mục tiêu" : "kcal còn lại") + "</div></div></div>";
    h += '<div class="meter' + (left < 0 ? " over" : "") + '"><i style="width:' + Math.min(100, s.kcal / t.kcal * 100) + '%"></i></div>';
    h += '<div class="grid3">' + macro("Đạm", "--accent", s.p, t.p) + macro("Tinh bột", "--blue", s.c, t.c) + macro("Chất béo", "--fat", s.f, t.f) + "</div>";
    // Thiếu đạm: tính cả các bữa còn lại trong kế hoạch, chỉ nhắc khi vẫn hụt
    if (d.meals.length) {
      var restP = PLAN_MEALS.filter(function (m) { return !hasPlanMeal(k, m.id); }).reduce(function (a, m) { return a + planMeal(m.id, k).p; }, 0);
      var gap = Math.round(t.p - s.p - restP);
      if (gap >= 12) h += '<p class="adj">Theo kế hoạch còn lại, hôm nay vẫn thiếu khoảng ' + gap + "g đạm. Thêm " + (gap >= 28 ? "100g ức gà hoặc thịt nạc (≈30g)" : gap >= 18 ? "3 lòng trắng + 1 trứng + 1 hộp sữa chua (≈20g)" : "2 trứng luộc (≈13g)") + ".</p>";
    }
    if (withButton) h += '<button class="btn ghost sm" data-goto="food" style="align-self:flex-start">+ Thêm món ngoài kế hoạch</button>';
    return h + "</div>";
  }
  var EVENT_LABEL = { busy: "Bận, không tập", offplan: "Ăn lệch kế hoạch", mealtime: "Lỡ giờ ăn", tired: "Mệt / ngủ ít", short: "Tập rút gọn" };

  // ---------- Hôm nay ----------
  function vToday() {
    var k = UI.date, d = peekDay(k), w = currentWeek(), nk = nextKey(), count = sessionsThisWeek(), h = "", isToday = k === todayKey();
    if (!S.settings.startDate) {
      h += '<div class="card"><h2>Bắt đầu</h2><p class="note">Chọn ngày bắt đầu giáo án (tuần 1). App dùng ngày này để tính tuần giảm tải và lúc bật FST-7.</p>';
      h += '<div class="row"><input type="date" id="startDate" value="' + todayKey() + '" style="flex:1"><button class="btn sm" data-act="save-start">Lưu</button></div></div>';
    }
    if (UI.banner) h += '<div class="phase good">' + esc(UI.banner) + "</div>";
    h += staleBanner();
    // Thứ Hai và thứ Ba: hiện tổng kết tuần trước cho tới khi bấm đã xem
    var dow = new Date().getDay(), wkA = keyOf(addDays(weekStart(new Date()), -7));
    if (isToday && (dow === 1 || dow === 2) && S.settings.checkinSeen !== wkA && hasData()) h += checkinCard(true);
    h += dateBar();
    h += energyCard(k, true);

    // Có chuyện hôm nay
    h += '<div class="card"><div class="row between"><h2>Hôm nay có gì khác kế hoạch?</h2></div><div class="sit">';
    [["busy", "Bận, không tập được"], ["offplan", "Ăn lệch kế hoạch"], ["mealtime", "Lỡ giờ ăn"], ["tired", "Mệt / ngủ ít"], ["short", "Thiếu thời gian tập"]].forEach(function (x) {
      var on = hasEvent(k, x[0]);
      h += '<button class="sit-btn' + (on ? " on" : "") + '" data-act="sit" data-v="' + x[0] + '">' + x[1] + "</button>";
    });
    h += "</div>";
    if (d.events.length) h += '<p class="note">Đã ghi: ' + d.events.map(function (e) { return EVENT_LABEL[e.t] || e.t; }).join(" · ") + "</p>";
    h += "</div>";

    // Checklist
    h += '<div class="card"><div class="row between"><h2>Kế hoạch trong ngày</h2><span class="note num">' + habitsDone(k) + "/" + HABIT_COUNT + "</span></div><div>";
    PLAN_MEALS.forEach(function (m0) {
      var m = planMeal(m0.id, k), on = hasPlanMeal(k, m.id);
      if (m.id === "phu" && hasEvent(k, "busy")) m = { id: "phu", t: "Bữa phụ tối (ngày nghỉ)", d: "3 trứng + 1 hộp sữa chua, bỏ chuối", kcal: 265, p: 22 };
      h += '<button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="plan" data-v="' + m.id + '">' + CHECK_SVG + '<span><span class="t">' + esc(m.t) + '</span><br><span class="d">' + esc(m.d) + '</span></span><span class="kc num">' + m.kcal + " kcal</span></button>";
    });
    OTHER_HABITS.forEach(function (x) {
      var on = !!d.c[x.id];
      h += '<button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="habit" data-v="' + x.id + '">' + CHECK_SVG + '<span><span class="t">' + x.t + '</span><br><span class="d">' + x.d + "</span></span></button>";
    });
    h += '</div><button class="btn ghost sm" data-act="photo" data-kind="meal" style="align-self:flex-start">📷 Chụp ảnh bữa ăn</button></div>';

    // Workout
    h += '<div class="strip"><div class="cell"><span class="label">Tuần</span><span class="big num">' + w + '</span></div><div class="cell"><span class="label">Buổi tuần này</span><span class="big num">' + count + '<span class="muted" style="font-size:18px"> /' + G().weekly + '</span></span></div><div class="cell"><span class="label">Buổi kế tiếp</span><span class="big">' + PROGRAM[nk].name + "</span></div></div>";
    if (isToday) {
      var trained = S.sessions.some(function (s) { return s.date === k; });
      if (trained) h += '<div class="phase good"><b>Đã tập hôm nay.</b> Nhớ ăn bữa sau tập và ngủ sớm.</div>';
      else if (hasEvent(k, "busy")) h += '<div class="phase"><b>Hôm nay nghỉ.</b> Buổi ' + PROGRAM[nk].name + " dời sang lần tập tới.</div>";
      else h += '<button class="btn dark" data-goto="train">Vào buổi ' + PROGRAM[nk].name + "</button>";
    }

    // Measurements
    h += '<div class="card"><h2>Số đo sáng ' + friendly(k).toLowerCase() + '</h2><div class="grid2">';
    h += '<label class="field" for="m-w">Cân nặng (kg)<input id="m-w" inputmode="decimal" placeholder="80,0" value="' + (typeof d.w === "number" ? fmt(d.w) : "") + '" data-act="measure" data-v="w"></label>';
    h += '<label class="field" for="m-waist">Vòng bụng ngang rốn (cm)<input id="m-waist" inputmode="decimal" placeholder="1 lần/tuần" value="' + (typeof d.waist === "number" ? fmt(d.waist) : "") + '" data-act="measure" data-v="waist"></label>';
    h += '</div><p class="note">Cân 3–4 buổi sáng mỗi tuần, sau khi đi vệ sinh, trước khi ăn.</p></div>';

    // 7 days
    h += '<div class="card"><h2>7 ngày gần nhất</h2><div class="week7">';
    for (var i = 6; i >= 0; i--) {
      var dk = keyOf(addDays(new Date(), -i)), n = habitsDone(dk);
      h += '<button class="day' + (dk === k ? " now" : "") + '" data-act="goday" data-v="' + dk + '"><div class="sq"><i style="height:' + Math.round(n / HABIT_COUNT * 100) + '%"></i></div><span>' + WD[parseKey(dk).getDay()] + '</span><span class="num">' + n + "/" + HABIT_COUNT + "</span></button>";
    }
    h += "</div></div>";
    return h;
  }

  // ---------- Tập ----------
  function vTrain() {
    var w = currentWeek(), ph = phaseInfo(w), nk = nextKey(), count = sessionsThisWeek();
    if (!UI.sel) UI.sel = nk;
    var key = UI.sel, P = PROGRAM[key], r0 = draftFor(key, w), d = r0.d, plan = r0.plan, h = staleBanner();
    h += '<div class="phase ' + ph.cls + '"><b>Tuần ' + w + " · " + ph.t + ":</b> " + ph.d + "</div>";
    if (count >= G().weekly) h += '<div class="phase warn"><b>Đủ ' + G().weekly + ' buổi tạ tuần này.</b> Ngày còn lại đi bộ dốc hoặc đạp xe nhẹ 40–45 phút, hoặc nghỉ hẳn.</div>';
    h += '<div class="pick">';
    ORDER.forEach(function (k) {
      h += '<button class="chip" aria-pressed="' + (k === key) + '" data-act="sel" data-v="' + k + '"><span class="k">' + PROGRAM[k].name + '</span><span class="s">' + PROGRAM[k].sub + "</span>" + (k === nk ? '<span class="tag">Kế tiếp</span>' : "") + "</button>";
    });
    h += "</div>";

    // Thời gian & chế độ
    h += '<div class="card"><div class="row between"><h2>Hôm nay có bao nhiêu phút?</h2><span class="note num">Đủ bài ≈ ' + plan.full + "′</span></div>";
    h += '<div class="seg4">';
    [[0, "Đủ giờ"], [75, "75′"], [60, "60′"], [45, "45′"]].forEach(function (x) {
      var on = (d.budget || 0) === x[0];
      h += '<button aria-pressed="' + on + '" data-act="budget" data-v="' + x[0] + '">' + x[1] + "</button>";
    });
    h += "</div>";
    if (d.budget && plan.steps.length) h += '<div class="phase warn"><b>Rút gọn còn ≈ ' + plan.est + ' phút:</b><ul class="plain" style="margin-top:4px">' + plan.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul><p class=\"note\" style=\"margin-top:6px\">Giữ bài compound là giữ được 80% hiệu quả buổi tập.</p></div>";
    else if (d.budget) h += '<p class="note">Buổi này vừa đủ ' + d.budget + " phút, không cần cắt bài. Nghỉ giữa hiệp đúng giờ là kịp.</p>";
    h += '<label class="toggle"><input type="checkbox" id="tiredBox" data-act="tired"' + (d.tired ? " checked" : "") + '><span><b>Chế độ mệt / ngủ ít</b><br><span class="note">Bớt 1 hiệp mỗi bài, tắt FST-7, dừng khi còn 2–3 rep, giữ mức tạ</span></span></label>';
    h += "</div>";

    var items = plan.items.filter(function (it) { return !it.dropped; }), dropped = plan.items.filter(function (it) { return it.dropped; });
    var done = 0, total = 0;
    items.forEach(function (it) { (d.sets[it.slot.id] || []).forEach(function (s) { total++; if (s.done) done++; }); });
    var elapsed = d.startedAt ? Math.round((Date.now() - d.startedAt) / 60000) : 0;
    h += '<div class="progress"><div class="bar"><i style="width:' + (total ? Math.round(done / total * 100) : 0) + '%"></i></div><span class="num">' + done + "/" + total + " hiệp" + (d.startedAt ? ' · <span id="elapsed" data-start="' + d.startedAt + '">' + elapsed + "′</span>" : "") + "</span></div>";

    var wl = WARM[key], wd = wl.filter(function (x) { return d.warm[x.id]; }).length, wDone = wd === wl.length;
    h += '<div class="card"><div class="row between"><h2>Khởi động · khoảng 5 phút</h2><span class="note num">' + wd + "/" + wl.length + "</span></div>";
    if (wDone && !UI.warmShow) h += '<button class="btn ghost sm" data-act="warm-show">Đã khởi động xong · Xem lại</button>';
    else {
      var ramp = rampText(key, d);
      wl.forEach(function (x) {
        var on = !!d.warm[x.id];
        h += '<button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="warm" data-v="' + x.id + '">' + CHECK_SVG + '<span><span class="t">' + esc(x.n) + '</span><br><span class="d">' + esc(x.d) + "</span>" + (x.id === "ramp" && ramp ? '<br><span class="d"><b>' + esc(ramp) + "</b></span>" : "") + "</span></button>";
      });
      h += '<p class="note">Bài compound thứ 2 trở đi: làm 1 hiệp 60% × 6 trước hiệp chính.</p>';
    }
    h += "</div>";

    var lastSameKey = S.sessions.filter(function (s) { return s.key === key; })[0];
    items.forEach(function (it) { h += exCard(key, it, d, w, lastSameKey, plan); });

    if (dropped.length) {
      h += '<div class="card"><div class="row between"><h2>Bỏ hôm nay</h2><span class="note">' + dropped.length + " bài</span></div>";
      dropped.forEach(function (it) {
        h += '<div class="item"><div class="t"><b>' + esc(actualEx(it.slot).n) + '</b><div class="s">' + (it.note === "rút gọn" ? "Cắt vì thiếu thời gian" : "Bạn đã bỏ bài này") + "</div></div>" + (it.note === "bỏ" ? '<button class="btn ghost sm" data-act="restore-ex" data-v="' + it.slot.id + '">Làm lại</button>' : "") + "</div>";
      });
      h += "</div>";
    }

    if (UI.confirm) {
      h += '<div class="confirm"><p>Còn <b>' + (total - done) + ' hiệp</b> chưa xong. Vẫn lưu buổi này? Bài chưa làm sẽ được ghi là bỏ, buổi sau cùng loại app sẽ nhắc.</p><div class="row"><button class="btn" data-act="finish-yes">Lưu buổi tập</button><button class="btn ghost" data-act="finish-no">Tập tiếp</button></div></div>';
    } else {
      h += '<button class="btn" data-act="finish"' + (done ? "" : " disabled") + ">Hoàn thành " + P.name + "</button>";
    }
    h += '<p class="note">Bấm tên bài để xem video kỹ thuật. Chỉnh kg và rep rồi bấm ✓ khi xong hiệp, đồng hồ nghỉ tự chạy.</p>';
    return h;
  }
  function progressHint(it, act, w) {
    var rg = range(it.reps), last = lastFor(act.id), step = act.db ? 2 : 2.5;
    if (!last) return act.bw ? "Lần đầu: ghi số rep làm được, kg để 0 nếu không đeo thêm tạ." : "Lần đầu: chọn mức tạ làm được khoảng " + rg.hi + " rep mà vẫn đúng kỹ thuật, còn dư 2 rep.";
    var desc = last.sets ? last.sets.map(function (s) { return (s.kg ? fmt(s.kg) + "×" : "") + s.reps; }).join(", ") : fmt(last.kg) + " kg";
    var h = "Lần trước (" + shortDate(last.date) + "): <b>" + desc + "</b>";
    if (isDeload(w)) return h + " → tuần giảm tải: giữ <b>" + fmt(last.kg) + " kg</b>, ít hiệp hơn.";
    if (it.fst) return h + " → FST-7: hạ tạ khoảng 30% so với hiệp thường, nghỉ ngắn 30–45 giây.";
    var hit = last.sets ? (last.sets.length >= Math.min(it.slot.s, it.sets) && last.sets.every(function (s) { return s.reps >= rg.hi && s.kg >= last.kg; })) : last.full;
    if (hit) return h + " → đã chạm " + rg.hi + " rep mọi hiệp: hôm nay lên <b>" + fmt(last.kg + step) + " kg</b>, bắt đầu lại từ " + rg.lo + " rep.";
    return h + " → giữ <b>" + (act.bw && !last.kg ? "thân người" : fmt(last.kg) + " kg") + "</b>, cố thêm 1 rep ở hiệp chưa đạt " + rg.hi + ".";
  }
  function exCard(key, it, d, w, lastSameKey, plan) {
    var slot = it.slot, act = actualEx(slot), sets = d.sets[slot.id] || [], allDone = sets.length && sets.every(function (s) { return s.done; }), h = "";
    var swapped = act.id !== slot.id;
    var pairName = it.pair ? actualEx(EXDB[it.pair]).n : "";
    UI.open = UI.open || {};
    if (allDone && !UI.open[slot.id]) {
      return '<button class="ex done compact" data-act="exopen" data-v="' + slot.id + '"><span class="tickmini">✓</span><span class="t"><b>' + esc(act.n) + '</b><span class="s num">' + sets.map(function (s) { return (s.kg ? fmt(s.kg) + "×" : "") + s.reps; }).join(", ") + '</span></span><span class="note">Sửa</span></button>';
    }
    var nextIdx = -1; sets.some(function (s, j) { if (!s.done) { nextIdx = j; return true; } return false; });
    h += '<div class="ex' + (allDone ? " done" : "") + (it.pair ? " paired" : "") + '"><div class="ex-head"><div style="min-width:0"><div class="ex-name"><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(act.q) + '" target="_blank" rel="noopener">' + esc(act.n) + "</a></div>";
    h += '<div class="ex-rx"><b>' + it.sets + " × " + it.reps + "</b> · nghỉ " + (it.pair ? "sau khi xong cả cặp" : it.rest) + "</div>";
    if (swapped) h += '<p class="note">Thay cho ' + esc(slot.n) + "</p>";
    if (slot.note && !swapped) h += '<p class="ex-note">' + esc(slot.note) + "</p>";
    if (it.pair) h += '<p class="ex-note">Superset với <b>' + esc(pairName) + "</b>: làm 1 hiệp bài này, sang ngay 1 hiệp bài kia, rồi mới nghỉ.</p>";
    h += '</div><div class="pills"><span class="pill ' + (slot.t === "C" ? "c" : "i") + '">' + (slot.t === "C" ? "Compound" : "Cô lập") + "</span>" + (it.fst ? '<span class="pill f">FST-7</span>' : "") + "</div></div>";
    if (lastSameKey && lastSameKey.skipped && lastSameKey.skipped.indexOf(slot.id) >= 0) h += '<p class="hint"><b>Buổi trước đã bỏ bài này.</b> Hôm nay cố làm đủ.</p>';
    h += '<p class="hint">' + progressHint(it, act, w) + "</p>";
    h += '<div class="srows">';
    sets.forEach(function (s, j) {
      var idp = key + "-" + slot.id + "-" + j;
      h += '<div class="srow' + (s.done ? " on" : "") + (j === nextIdx ? " next" : "") + '"><span class="sn">' + (j + 1) + "</span>";
      h += '<label class="sk"><input id="kg-' + idp + '" inputmode="decimal" value="' + esc(s.kg === "" ? "" : fmt(s.kg)) + '" placeholder="kg" data-act="skg" data-ex="' + slot.id + '" data-i="' + j + '" aria-label="Kg hiệp ' + (j + 1) + '"><small>kg</small></label>';
      h += '<span class="step"><button data-act="rep" data-d="-1" data-ex="' + slot.id + '" data-i="' + j + '" aria-label="Bớt 1 rep">−</button><input id="rp-' + idp + '" inputmode="numeric" value="' + esc(s.reps) + '" data-act="srep" data-ex="' + slot.id + '" data-i="' + j + '" aria-label="Số rep hiệp ' + (j + 1) + '"><button data-act="rep" data-d="1" data-ex="' + slot.id + '" data-i="' + j + '" aria-label="Thêm 1 rep">+</button></span>';
      h += '<button class="tick' + (s.done ? " on" : "") + '" data-act="sdone" data-ex="' + slot.id + '" data-i="' + j + '" aria-pressed="' + s.done + '" aria-label="Xong hiệp ' + (j + 1) + '">✓</button></div>';
    });
    h += "</div>";
    if (BARBELL[act.id] && nextIdx >= 0) { var pl = plates(sets[nextIdx].kg); if (pl) h += '<p class="hint">Lắp mỗi bên (đòn 20kg): <b>' + pl + "</b></p>"; }
    h += '<div class="row" style="gap:6px"><button class="btn ghost sm" data-act="swap" data-v="' + slot.id + '">Đổi bài</button>' + (lastFor(act.id) ? '<button class="btn ghost sm" data-act="hist" data-v="' + act.id + '">Lịch sử</button>' : "") + (!sets.some(function (s) { return s.done; }) ? '<button class="btn ghost sm" data-act="drop-ex" data-v="' + slot.id + '">Bỏ hôm nay</button>' : "") + (allDone ? '<button class="btn ghost sm" data-act="exopen" data-v="' + slot.id + '">Thu gọn</button>' : "") + "</div>";
    return h + "</div>";
  }
  // Bài dùng đòn tạ tự do 20kg (Smith có đòn đã cân bằng, khác nhau theo phòng tập nên không tính)
  var BARBELL = { brow: 1, squat: 1, rdl: 1, dl: 1, bbbench: 1, bbbench2: 1, rackpull: 1 };
  function plates(kg) {
    kg = +kg; if (!(kg > 20)) return "";
    var side = (kg - 20) / 2, out = [];
    [25, 20, 15, 10, 5, 2.5, 1.25].forEach(function (p) { while (side >= p - 0.001) { out.push(fmt(p)); side -= p; } });
    return out.join(" + ") + (side > 0.01 ? " (lệch " + fmt(side * 2) + "kg)" : "");
  }
  function rampText(key, d) {
    var first = PROGRAM[key].ex[0], s = d.sets[first.id] && d.sets[first.id][0], kg = s ? +s.kg : 0;
    if (!(kg > 20)) return "";
    var r5 = function (x) { return Math.max(20, Math.round(x / 2.5) * 2.5); };
    var steps = { UA: [[0.5, 8], [0.75, 4]], UB: [[0.5, 8], [0.75, 4]], LA: [[0, 10], [0.5, 6], [0.75, 3]], LB: [[0.4, 8], [0.6, 5], [0.8, 2]] }[key];
    return "Với " + fmt(kg) + "kg: " + steps.map(function (x) { return (x[0] ? fmt(r5(kg * x[0])) + "kg" : "đòn trống") + " × " + x[1]; }).join(" → ");
  }
  function openHistory(exId) {
    var ex = EXDB[exId], rows = [];
    S.sessions.forEach(function (s) {
      var log = s.log && s.log[exId];
      if (log && log.length) rows.push({ date: s.date, txt: log.map(function (x) { return (x.kg ? fmt(x.kg) + "×" : "") + x.reps; }).join(", "), e: Math.max.apply(null, log.map(function (x) { return e1rm(x.kg, x.reps); })), pr: (s.prs || []).some(function (p) { return p.ex === exId; }) });
      else if (s.weights && typeof s.weights[exId] === "number") rows.push({ date: s.date, txt: fmt(s.weights[exId]) + " kg", e: s.weights[exId], pr: false });
    });
    var h = sheetHead("Lịch sử: " + esc(ex.n));
    var pts = rows.slice(0, 20).reverse().filter(function (r) { return r.e > 0; }).map(function (r) { return { k: r.date, v: r.e }; });
    if (pts.length >= 2) h += '<div class="card"><h2>Sức mạnh ước tính (1 rep tối đa)</h2>' + lineChart(pts, true) + '<p class="note">Tính từ hiệp tốt nhất mỗi buổi. Đường đi lên là bạn đang mạnh hơn.</p></div>';
    h += '<div class="card"><div>' + rows.slice(0, 12).map(function (r) { return '<div class="h-row"><div><p class="h-title">' + shortDate(r.date) + (r.pr ? " 🏆" : "") + '</p><p class="h-sub num">' + r.txt + '</p></div><span class="note num">' + (r.e ? "≈" + fmt(Math.round(r.e * 2) / 2) + "kg" : "") + "</span></div>"; }).join("") + "</div></div>";
    openSheet(h);
  }

  // ---------- Ăn ----------
  function vFood() {
    var k = UI.date, d = peekDay(k), h = dateBar();
    h += energyCard(k, false);
    h += '<div class="card"><h2>Đã ăn</h2>';
    if (!d.meals.length) h += '<p class="empty">Chưa ghi món nào. Tick các bữa trong kế hoạch ở mục Hôm nay, hoặc tìm món bên dưới.</p>';
    SLOTS.forEach(function (sl) {
      var items = d.meals.filter(function (m) { return m.slot === sl; });
      if (!items.length) return;
      h += '<div class="slot">' + sl + '</div><div class="list">';
      items.forEach(function (m) {
        h += '<div class="item"><div class="t"><b>' + esc(m.name) + '</b><div class="s num">Đạm ' + fmt(m.p) + "g · Tinh bột " + fmt(m.c) + "g · Béo " + fmt(m.f) + 'g</div></div><span class="num">' + int(m.kcal) + '</span><button class="x" data-act="delmeal" data-v="' + esc(m.id) + '" aria-label="Xoá món">×</button></div>';
      });
      h += "</div>";
    });
    h += "</div>";

    h += '<div class="card"><div class="row between"><h2>Ảnh bữa ăn</h2><button class="btn ghost sm" data-act="photo" data-kind="meal">📷 Chụp / chọn ảnh</button></div>';
    var mp = d.photos.filter(function (p) { return p.kind === "meal"; });
    h += mp.length ? photoGrid(mp) : '<p class="empty">Chụp lại bữa ăn làm checkpoint, sau này xem lại bạn đã ăn gì những ngày cân giảm hay đứng.</p>';
    h += "</div>";

    var slotSel = function (id) {
      var def = defaultSlot();
      return '<select id="' + id + '">' + SLOTS.map(function (s) { return "<option" + (s === def ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select>";
    };
    UI.recent = recentFoods();
    if (UI.recent.length) {
      h += '<div class="card"><h2>Hay ăn gần đây</h2><div class="sit">' + UI.recent.map(function (r, i) {
        return '<button class="sit-btn" data-act="recent" data-v="' + i + '">+ ' + esc(r.name) + ' <span class="muted num">' + int(r.kcal) + "</span></button>";
      }).join("") + '</div><p class="note">Bấm một lần là thêm vào bữa ' + defaultSlot().toLowerCase() + ".</p></div>";
    }
    h += '<div class="card"><h2>Thêm món</h2><input id="q" placeholder="Tìm: phở, cơm, ức gà, trứng…" value="' + esc(UI.q) + '" autocomplete="off" aria-label="Tìm món">';
    h += '<div class="results" id="results"></div><div class="grid2"><label class="field">Số phần<input id="qty" inputmode="decimal" value="1"></label><label class="field">Bữa' + slotSel("slotA") + "</label></div>";
    h += '<button class="btn dark" data-act="addfood">Thêm món đã chọn</button><p class="note">Số liệu là ước tính trung bình cho khẩu phần thường gặp.</p></div>';

    h += '<details class="card"><summary>Tự nhập số liệu</summary><label class="field">Tên món<input id="cName"></label><div class="grid2">';
    h += '<label class="field">Calo (kcal)<input id="cK" inputmode="decimal"></label><label class="field">Đạm (g)<input id="cP" inputmode="decimal"></label>';
    h += '<label class="field">Tinh bột (g)<input id="cC" inputmode="decimal"></label><label class="field">Chất béo (g)<input id="cF" inputmode="decimal"></label></div>';
    h += '<label class="field">Bữa' + slotSel("slotC") + '</label><button class="btn dark" data-act="addcustom">Thêm</button></details>';
    return h;
  }
  function photoGrid(list) {
    return '<div class="phgrid">' + list.map(function (p) {
      return '<button class="ph" data-act="viewphoto" data-v="' + esc(p.id) + '"><img data-ph="' + esc(p.id) + '" alt="Ảnh ' + esc(p.slot || p.kind) + '"><span>' + esc(p.label || p.slot || "") + "</span></button>";
    }).join("") + "</div>";
  }
  // Món ngoài kế hoạch đã ghi trong 30 ngày, xếp theo số lần ăn rồi độ gần đây
  function recentFoods() {
    var map = {}, t = todayKey(), from = shiftKey(t, -30);
    Object.keys(S.days).filter(function (k) { return k >= from && k <= t; }).sort().forEach(function (k) {
      (S.days[k].meals || []).forEach(function (m) {
        if (m.q || !m.name) return;
        var key = norm(m.name), r = map[key] || (map[key] = { name: m.name, n: 0, last: "" });
        r.n++; r.last = k; r.kcal = m.kcal; r.p = m.p; r.c = m.c; r.f = m.f;
      });
    });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return b.n - a.n || (b.last > a.last ? 1 : -1); }).slice(0, 8);
  }
  function defaultSlot() { var hr = new Date().getHours(); return hr < 10 ? "Sáng" : hr < 15 ? "Trưa" : hr < 21 ? "Tối" : "Phụ"; }
  function renderResults() {
    var el = document.getElementById("results"); if (!el) return;
    var q = norm(UI.q.trim()), list = [];
    FOODS.forEach(function (f, i) { if (!q || norm(f[0]).indexOf(q) >= 0) list.push(i); });
    el.innerHTML = list.length ? list.map(function (i) {
      var f = FOODS[i];
      return '<button data-pick="' + i + '" class="' + (UI.pick === i ? "sel" : "") + '"><span><b>' + esc(f[0]) + '</b> <span class="p">' + esc(f[1]) + '</span><br><span class="p">Đạm ' + fmt(f[3]) + "g · TB " + fmt(f[4]) + "g · Béo " + fmt(f[5]) + 'g</span></span><span class="num">' + f[2] + "</span></button>";
    }).join("") : '<p class="empty" style="padding:10px 12px">Không thấy món này. Dùng phần "Tự nhập số liệu" bên dưới.</p>';
  }

  // ---------- Bữa tối ----------
  function prepTasks(dd) {
    var out = [];
    if (dd.box) {
      var t = TYPES[dd.box[0]];
      out.push({ key: dd.d + ":box", box: true, k: "eat", kl: "Bữa tối", t: RNAME[dd.box[1]], s: t.meat + " · " + t.rice + " · " + t.oil + " · ≈" + t.p + "g đạm, " + t.k + " kcal" });
    }
    if (dd.veg) out.push({ key: dd.d + ":veg", k: "veg", kl: "Rau hôm nay", t: dd.veg, s: "Mua và luộc hoặc xào ngay khi ăn" });
    if (dd.thaw) out.push({ key: dd.d + ":thaw", k: "thaw", kl: "Tối nay rã đông", t: "Chuyển xuống ngăn mát", s: dd.thaw });
    (dd.tasks || []).forEach(function (x) { out.push({ key: dd.d + ":" + x.id, k: x.k, kl: x.id === "mua" ? "Đi chợ" : x.id === "nau" ? "Nấu" : "Việc", t: x.t, s: x.s }); });
    return out;
  }
  function taskOn(x) { return x.box ? hasPlanMeal(x.key.slice(0, 10), "toi") : !!S.checks[x.key]; }
  function prepCard(dd, isToday) {
    var ts = prepTasks(dd), done = ts.length && ts.every(taskOn), b = "";
    if (isToday) b += '<span class="badge now">Hôm nay</span>';
    if (dd.prep) b += '<span class="badge prep">Nấu đợt ' + dd.prep + "</span>";
    if (done) b += '<span class="badge done">Xong</span>';
    var h = '<div class="card' + (isToday ? " today" : "") + '"><div class="day-head"><span class="day-date">' + longDate(dd.d) + '</span><span class="row" style="gap:6px">' + b + "</span></div><div>";
    ts.forEach(function (x) {
      var on = taskOn(x);
      h += '<button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="task" data-v="' + esc(x.key) + '">' + CHECK_SVG + '<span><span class="k ' + x.k + '">' + x.kl + '</span><br><span class="t">' + esc(x.t) + '</span><br><span class="d">' + esc(x.s) + "</span></span></button>";
    });
    return h + "</div></div>";
  }
  function vPrep() {
    var today = todayKey(), first = DAYS[0].d, last = DAYS[DAYS.length - 1].d, h = "";
    var eaten = DAYS.filter(function (d) { return d.box && hasPlanMeal(d.d, "toi"); }).length;
    var nextPrep = DAYS.filter(function (d) { return d.prep && d.d >= today && !S.checks[d.d + ":nau"]; })[0];
    var nextBox = DAYS.filter(function (d) { return d.box && d.d >= today; })[0];
    h += '<div class="strip"><div class="cell"><span class="label">Bữa tối đã ăn</span><span class="big num">' + eaten + '<span class="muted" style="font-size:18px"> /14</span></span></div>';
    h += '<div class="cell"><span class="label">Đợt nấu tới</span><span class="mid">' + (nextPrep ? "Đợt " + nextPrep.prep + " · " + shortDate(nextPrep.d) : "Đã nấu hết") + "</span></div>";
    h += '<div class="cell"><span class="label">Bữa tối tới</span><span class="mid">' + (nextBox ? esc(RNAME[nextBox.box[1]]) : "Hết chu kỳ") + "</span></div></div>";
    if (DAY_BY_DATE[today]) h += prepCard(DAY_BY_DATE[today], true);
    else if (today < first) h += '<div class="card"><p class="empty">Lịch bắt đầu từ ' + longDate(first) + ".</p></div>";
    else if (today > last) h += '<div class="card"><p class="empty">Chu kỳ 2 tuần đã kết thúc ' + longDate(last) + '. Bữa tối vẫn tính theo hộp chuẩn (ức gà 200g, 650 kcal). Nhờ Claude lên lịch 2 tuần mới rồi cập nhật app.</p></div>';

    h += '<div class="seg" role="tablist">';
    [["lich", "Lịch 14 ngày"], ["mon", "Công thức"], ["kp", "Khẩu phần"]].forEach(function (t) {
      h += '<button role="tab" aria-selected="' + (UI.prepTab === t[0]) + '" data-act="preptab" data-v="' + t[0] + '">' + t[1] + "</button>";
    });
    h += "</div>";
    if (UI.prepTab === "lich") {
      var wk = "";
      DAYS.forEach(function (d) {
        var lbl = d.d <= "2026-10-18" ? "Chuẩn bị" : d.d <= "2026-10-25" ? "Tuần 1 · 19–25/10" : "Tuần 2 · 26/10–02/11";
        if (lbl !== wk) { h += '<p class="week-label">' + lbl + "</p>"; wk = lbl; }
        h += prepCard(d, d.d === today);
      });
    } else if (UI.prepTab === "mon") {
      RECIPES.forEach(function (r) {
        h += '<div class="card recipe"><h2>' + r.n + '</h2><p class="note">' + r.for + "</p><ol>" + r.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ol><p class="tip">' + esc(r.tip) + "</p></div>";
      });
      h += '<div class="card"><h2>Quy tắc chung</h2><ul class="plain"><li>10g dầu ≈ 2 thìa cà phê (không phải 1 thìa canh).</li><li>Nấu xong để nguội nhanh, cất tủ lạnh trong vòng 2 tiếng, nhất là cơm.</li><li>Hâm nóng đều cả hộp. Hộp đã nấu dùng tối đa 4 ngày.</li><li>Rau không cho vào hộp: mua và nấu vào ngày ăn.</li></ul></div>';
    } else {
      h += '<div class="card"><h2>Chia thịt sống (14 túi)</h2><div class="tbl-wrap"><table><tr><th>Loại</th><th class="n">Tổng</th><th class="n">Túi</th><th class="n">Mỗi túi</th></tr>' +
        '<tr><td>Ức gà</td><td class="n">1.088g</td><td class="n">5</td><td class="n">218g</td></tr><tr><td>Thăn lợn</td><td class="n">600g</td><td class="n">3</td><td class="n">200g</td></tr>' +
        '<tr><td>Đùi gà (bỏ da)</td><td class="n">620g</td><td class="n">2</td><td class="n">1 đùi</td></tr><tr><td>Bò xay</td><td class="n">322g</td><td class="n">2</td><td class="n">161g</td></tr>' +
        '<tr><td>Lợn xay</td><td class="n">404g</td><td class="n">2</td><td class="n">202g</td></tr></table></div></div>';
      h += '<div class="card"><h2>Mỗi hộp gồm gì</h2><div class="tbl-wrap"><table><tr><th>Hộp</th><th>Cơm</th><th>Dầu</th><th class="n">Đạm</th><th class="n">kcal</th></tr>';
      Object.keys(TYPES).forEach(function (k) { var t = TYPES[k]; h += "<tr><td>" + esc(t.meat) + "</td><td>" + esc(t.rice) + "</td><td>" + esc(t.oil) + '</td><td class="n">' + t.p + 'g</td><td class="n">' + t.k + "</td></tr>"; });
      h += '</table></div><p class="note">Trung bình 14 hộp ≈ 690 kcal, 44g đạm. Cốc gạo = cốc đong của nồi cơm điện (≈150g gạo).</p></div>';
      h += '<div class="card"><h2>Chia không cần cân</h2><ul class="plain"><li><b>Thịt xay:</b> cho vào túi zip, ép dẹt đều, lấy đũa ấn đường chia đôi.</li><li><b>Thăn:</b> cắt 3 khúc dài bằng nhau, khúc đầu to cắt ngắn hơn một chút.</li><li><b>Ức gà:</b> thái miếng, chia lần lượt vào 5 túi như chia bài, rồi so độ đầy.</li><li><b>Cơm:</b> đong gạo theo cốc, nấu xong chia đều bằng muôi.</li></ul></div>';
    }
    return h;
  }

  // ---------- Tiến độ ----------
  function vProgress() {
    var tr = trend(), wi = tr.wi, waists = waistList(), t = T(), g = G(), h = "";
    var lb = S.settings.lastBackup;
    if (hasData() && (!lb || (Date.now() - lb) > 14 * 86400000)) {
      h += '<div class="phase warn"><b>Nên sao lưu.</b> Dữ liệu chỉ nằm trên điện thoại này. ' + (lb ? "Lần sao lưu gần nhất: " + new Date(lb).toLocaleDateString("vi-VN") + "." : "Bạn chưa sao lưu lần nào.") + ' <button class="btn sm dark" data-act="backup" style="margin-top:8px">Sao lưu ngay</button></div>';
    }

    h += checkinCard(false);

    // Mục tiêu
    var startW = wi.length ? wi[0].w : 80, curW = tr.a1 != null ? tr.a1 : (wi.length ? wi[wi.length - 1].w : null);
    h += '<div class="card"><h2>Mục tiêu</h2>';
    if (curW == null) h += '<p class="empty">Ghi cân nặng ở mục Hôm nay để app tính tiến độ về ' + fmt(g.weight) + " kg.</p>";
    else {
      var lost = startW - curW, need = startW - g.weight, pct = need > 0 ? Math.max(0, Math.min(100, lost / need * 100)) : 100, remain = Math.max(0, curW - g.weight);
      var weeks = Math.ceil(remain / 0.45), eta = addDays(new Date(), weeks * 7);
      h += '<div class="goal"><div class="row between"><span><b>Cân nặng</b> ' + fmt(startW) + " → " + fmt(g.weight) + ' kg</span><span class="num">' + (remain > 0 ? "còn " + fmt(remain) + " kg" : "Đã đạt 🎉") + '</span></div><div class="meter"><i style="width:' + pct + '%;background:var(--good)"></i></div>';
      if (remain > 0) h += '<p class="note">Giữ nhịp 0,3–0,6 kg/tuần thì khoảng <b>' + MONTHS[eta.getMonth()].toLowerCase() + "/" + eta.getFullYear() + "</b> sẽ đạt.</p>";
      h += "</div>";
      if (waists.length) {
        var w0 = waists[0].v, wc = waists[waists.length - 1].v, wg = w0 - g.waistDrop, wpct = Math.max(0, Math.min(100, (w0 - wc) / g.waistDrop * 100));
        h += '<div class="goal"><div class="row between"><span><b>Vòng bụng</b> ' + fmt(w0) + " → " + fmt(wg) + ' cm</span><span class="num">' + (wc > wg ? "còn " + fmt(wc - wg) + " cm" : "Đã đạt 🎉") + '</span></div><div class="meter"><i style="width:' + wpct + '%;background:var(--good)"></i></div></div>';
      }
    }
    h += "</div>";

    // Lịch
    h += calendarCard();

    h += '<div class="card"><h2>Cân nặng</h2>';
    if (!wi.length) h += '<p class="empty">Chưa có số cân. Ghi cân buổi sáng ở mục Hôm nay, sau 1–2 tuần biểu đồ sẽ hiện ở đây.</p>';
    else {
      h += '<div class="row" style="gap:18px;align-items:flex-end"><div><span class="label">TB 7 ngày</span><div class="big num">' + (tr.a1 != null ? fmt(tr.a1) : "–") + ' <span style="font-size:16px">kg</span></div></div>';
      if (tr.a1 != null && tr.a0 != null) {
        var dl = tr.a1 - tr.a0, ok = dl <= -0.3 && dl >= -0.6;
        h += '<div><span class="label">So với tuần trước</span><div class="big num" style="color:' + (ok ? "var(--good)" : "var(--fg)") + '">' + (dl > 0 ? "+" : "") + fmt(dl) + ' <span style="font-size:16px">kg</span></div><div class="note">' + (ok ? "Đúng nhịp 0,3–0,6 kg/tuần" : dl < -0.6 ? "Giảm nhanh hơn mục tiêu" : "Chậm hơn mục tiêu 0,3–0,6 kg/tuần") + "</div></div>";
      }
      if (waists.length) h += '<div><span class="label">Vòng bụng</span><div class="big num">' + fmt(waists[waists.length - 1].v) + ' <span style="font-size:16px">cm</span></div><div class="note">' + shortDate(waists[waists.length - 1].k) + "</div></div>";
      h += "</div>" + lineChart(wi.slice(-60).map(function (x) { return { k: x.k, v: x.w }; }));
    }
    h += "</div>";

    if (tr.a1 != null && tr.a0 != null && tr.a00 != null && waists.length >= 3) {
      var noWeight = tr.a1 >= tr.a0 && tr.a0 >= tr.a00, wl = waists.slice(-3), noWaist = wl[2].v >= wl[1].v && wl[1].v >= wl[0].v;
      if (noWeight && noWaist) h += '<div class="phase warn"><b>Đến lúc điều chỉnh:</b> 2 tuần liền cả cân và vòng bụng không giảm. Bớt khoảng 50g cơm bữa tối (≈65 kcal) và đi thêm 2.000 bước mỗi ngày.</div>';
    }

    // Ảnh checkpoint
    var body = [];
    Object.keys(S.days).sort().forEach(function (k) { (S.days[k].photos || []).forEach(function (p) { if (p.kind === "body") body.push(Object.assign({ label: shortDate(k) }, p)); }); });
    h += '<div class="card"><div class="row between"><h2>Ảnh checkpoint</h2><button class="btn ghost sm" data-act="photo" data-kind="body">📷 Chụp ảnh</button></div>';
    if (!body.length) h += '<p class="empty">Chụp ảnh cơ thể 2 tuần một lần: cùng chỗ, cùng ánh sáng, buổi sáng trước khi ăn. Cân đứng yên mà ảnh thay đổi là recomp đang chạy.</p>';
    else {
      if (body.length >= 2) h += '<p class="label">Đầu tiên và mới nhất</p><div class="phcmp">' + photoGrid([body[0], body[body.length - 1]]).replace('class="phgrid"', 'class="phgrid two"') + "</div>";
      h += '<p class="label">Tất cả (' + body.length + ")</p>" + photoGrid(body.slice().reverse());
    }
    h += "</div>";

    var today = todayKey(), last7 = [];
    for (var i = 6; i >= 0; i--) last7.push(shiftKey(today, -i));
    var kc = last7.map(function (k) { return sum(peekDay(k).meals); }), logged = kc.filter(function (x) { return x.kcal > 0; });
    h += '<div class="card"><div class="row between"><h2>Calo 7 ngày</h2>' + (logged.length ? '<span class="note num">TB ' + int(avg(logged.map(function (x) { return x.kcal; }))) + " kcal · " + int(avg(logged.map(function (x) { return x.p; }))) + "g đạm</span>" : "") + "</div>" + barChart(last7, kc.map(function (x) { return x.kcal; }), t.kcal) + "</div>";

    var vol = S.sessions.length;
    h += '<div class="card"><div class="row between"><h2>Các buổi đã tập</h2><span class="note num">' + vol + " buổi</span></div><div>";
    if (!vol) h += '<p class="empty">Chưa có buổi nào. Ghi hiệp ở mục Tập rồi bấm "Hoàn thành" để lưu buổi đầu tiên.</p>';
    S.sessions.slice(0, 80).forEach(function (s) {
      var P = PROGRAM[s.key], parts = [];
      if (s.log) Object.keys(s.log).forEach(function (id) { var e = EXDB[id]; if (e && (e.t === "C" || !e.t) && s.log[id].length) parts.push(e.n + " " + s.log[id].map(function (x) { return (x.kg ? fmt(x.kg) + "×" : "") + x.reps; }).join(", ")); });
      else if (P) P.ex.forEach(function (ex) { if (ex.t === "C" && s.weights && typeof s.weights[ex.id] === "number") parts.push(ex.n + " " + fmt(s.weights[ex.id]) + "kg"); });
      var tags = (s.mode && s.mode !== "full" ? " · " + (s.mode === "short" ? "rút gọn" : s.mode === "tired" ? "chế độ mệt" : "rút gọn + mệt") : "") + (s.minutes ? " · " + s.minutes + "′" : "");
      h += '<div class="h-row"><div style="min-width:0"><p class="h-title">' + shortDate(s.date) + " · " + (P ? P.name : esc(s.key)) + '</p><p class="h-sub">Tuần ' + s.week + " · " + s.done + "/" + s.total + " hiệp" + tags + (parts.length ? " · " + esc(parts.slice(0, 4).join(" · ")) : "") + "</p></div>";
      h += '<button class="h-del' + (UI.armDel === s.id ? " arm" : "") + '" data-act="del" data-v="' + esc(s.id) + '">' + (UI.armDel === s.id ? "Bấm lần nữa để xoá" : "Xoá") + "</button></div>";
    });
    h += "</div></div>";
    return h;
  }

  // Tổng kết tuần trước (thứ Hai đến Chủ nhật), kiểu check-in hằng tuần
  function weekCheckin() {
    var ws = weekStart(new Date()), a = keyOf(addDays(ws, -7)), b = keyOf(addDays(ws, -1)), pa = keyOf(addDays(ws, -14)), pb = keyOf(addDays(ws, -8));
    var t = T(), g = G(), ses = sessionsInRange(a, b).length, days = [];
    // Chỉ tính ngày ghi tương đối đủ (từ nửa mục tiêu trở lên), tránh ngày quên ghi kéo trung bình xuống
    for (var i = 0; i < 7; i++) { var s = sum(peekDay(shiftKey(a, i)).meals); if (s.kcal >= t.kcal * 0.5) days.push(s); }
    var kcal = avg(days.map(function (x) { return x.kcal; })), p = avg(days.map(function (x) { return x.p; }));
    var wi = weighIns(), wA = wi.filter(function (x) { return x.k >= a && x.k <= b; }), wP = wi.filter(function (x) { return x.k >= pa && x.k <= pb; });
    var avgA = avg(wA.map(function (x) { return x.w; })), avgP = avg(wP.map(function (x) { return x.w; })), dw = avgA != null && avgP != null ? avgA - avgP : null;
    var wl = waistList(), waA = wl.filter(function (x) { return x.k >= a && x.k <= b; }).pop(), waP = wl.filter(function (x) { return x.k < a; }).pop(), dwa = waA && waP ? waA.v - waP.v : null;
    var v = "", cls = "";
    if (days.length < 4 && wA.length < 3) v = "Chưa đủ dữ liệu để kết luận. Mỗi tuần cần ghi ăn đủ ít nhất 4 ngày và cân 3 buổi sáng.";
    else if (days.length >= 3 && p != null && p < t.p * 0.9) { v = "Đạm trung bình chỉ " + int(p) + "g, thiếu so với " + t.p + "g. Ưu tiên ăn đủ đạm trước, đây là thứ giữ cơ khi đang giảm mỡ."; cls = "warn"; }
    else if (dw == null) v = "Đã có số liệu ăn uống. Cân thêm 3 buổi sáng tuần này để so được cân nặng.";
    else if (dw <= -0.8) { v = "Giảm " + fmt(-dw) + " kg, nhanh hơn mục tiêu. Thêm khoảng 100–150 kcal mỗi ngày (nửa chén cơm) để không mất cơ."; cls = "warn"; }
    else if (dw <= -0.25) { v = "Giảm " + fmt(-dw) + " kg, đúng nhịp. Giữ nguyên mọi thứ."; cls = "good"; }
    else if (dwa != null && dwa < 0) { v = "Cân gần như đứng nhưng vòng bụng nhỏ đi " + fmt(-dwa) + " cm: recomp đang chạy. Giữ nguyên."; cls = "good"; }
    else if (kcal != null && kcal > t.kcal * 1.05) { v = "Ăn trung bình " + int(kcal) + " kcal, cao hơn mục tiêu " + int(t.kcal) + ". Bám đúng mục tiêu một tuần trước khi cắt thêm."; cls = "warn"; }
    else { v = "Cân và vòng bụng chưa giảm. Nếu hết tuần này vẫn vậy: bớt 50g cơm bữa tối và đi thêm 2.000 bước mỗi ngày."; cls = "warn"; }
    if (ses < g.weekly - 1) v += " Tập " + ses + "/" + g.weekly + " buổi, cố giữ ít nhất " + (g.weekly - 1) + " buổi.";
    return { a: a, b: b, ses: ses, kcal: kcal, p: p, nDays: days.length, nW: wA.length, dw: dw, dwa: dwa, v: v, cls: cls, wk: a };
  }
  function checkinCard(dismiss) {
    var c = weekCheckin(), g = G();
    var h = '<div class="card checkin ' + c.cls + '"><div class="row between"><h2>Tổng kết tuần ' + parseKey(c.a).getDate() + "/" + (parseKey(c.a).getMonth() + 1) + "–" + parseKey(c.b).getDate() + "/" + (parseKey(c.b).getMonth() + 1) + "</h2>" + (dismiss ? '<button class="x" data-act="checkin-seen" data-v="' + c.wk + '" aria-label="Đã xem">✕</button>' : "") + "</div>";
    h += '<div class="grid4"><div><span class="label">Buổi tập</span><b class="num">' + c.ses + "/" + g.weekly + '</b></div><div><span class="label">Kcal TB</span><b class="num">' + (c.kcal != null ? int(c.kcal) : "–") + '</b></div><div><span class="label">Đạm TB</span><b class="num">' + (c.p != null ? int(c.p) + "g" : "–") + '</b></div><div><span class="label">Cân nặng</span><b class="num">' + (c.dw != null ? (c.dw > 0 ? "+" : "") + fmt(c.dw) : "–") + "</b></div></div>";
    return h + '<p>' + esc(c.v) + "</p></div>";
  }

  function calendarCard() {
    var h = '<div class="card"><div class="row between"><h2>Lịch tổng quan</h2><div class="seg2"><button aria-pressed="' + (UI.calMode === "month") + '" data-act="calmode" data-v="month">Tháng</button><button aria-pressed="' + (UI.calMode === "year") + '" data-act="calmode" data-v="year">Năm</button></div></div>';
    var today = todayKey();
    if (UI.calMode === "month") {
      var ym = UI.calMonth.split("-"), y = +ym[0], m = +ym[1] - 1, first = new Date(y, m, 1), dim = new Date(y, m + 1, 0).getDate(), off = (first.getDay() + 6) % 7;
      var monthKeyA = keyOf(first), monthKeyB = keyOf(new Date(y, m, dim)), ses = sessionsInRange(monthKeyA, monthKeyB).length, ok = 0, busy = 0;
      h += '<div class="datebar"><button class="icon" data-act="calprev" aria-label="Tháng trước">‹</button><span class="d">' + MONTHS[m] + " " + y + '</span><button class="icon" data-act="calnext" aria-label="Tháng sau"' + (UI.calMonth >= today.slice(0, 7) ? " disabled" : "") + ">›</button></div>";
      h += '<div class="cal"><span class="cw">T2</span><span class="cw">T3</span><span class="cw">T4</span><span class="cw">T5</span><span class="cw">T6</span><span class="cw">T7</span><span class="cw">CN</span>';
      for (var i = 0; i < off; i++) h += "<span></span>";
      for (var dd = 1; dd <= dim; dd++) {
        var k = keyOf(new Date(y, m, dd)), st = dayStatus(k), fut = k > today;
        if (st.foodOk) ok++; if (st.busy) busy++;
        var cls = "cd" + (k === today ? " now" : "") + (fut ? " fut" : "") + (st.trained ? " tr" : "");
        h += '<button class="' + cls + '" data-act="goday" data-v="' + k + '"' + (fut ? " disabled" : "") + '><span class="dn">' + dd + "</span>";
        h += '<span class="tg">' + (st.trained ? esc(PROGRAM[st.session.key] ? PROGRAM[st.session.key].name.replace("pper ", "").replace("ower ", "") : "") : st.busy ? "nghỉ" : "") + "</span>";
        h += '<span class="ft ' + (st.foodOk ? "ok" : st.logged ? "off" : "") + '"></span>' + (st.photos ? '<span class="pd"></span>' : "") + "</button>";
      }
      h += "</div>";
      h += '<div class="legend"><span><i class="lg tr"></i>Có tập</span><span><i class="lg ok"></i>Ăn đúng mục tiêu</span><span><i class="lg off"></i>Ăn lệch</span><span><i class="lg pd"></i>Có ảnh</span></div>';
      h += '<p class="note">Tháng này: <b>' + ses + "</b> buổi tập · <b>" + ok + "</b> ngày ăn đúng" + (busy ? " · " + busy + " ngày bận" : "") + ". Bấm vào một ngày để xem chi tiết.</p>";
    } else {
      var yr = +UI.calMonth.slice(0, 4), totalS = sessionsInRange(yr + "-01-01", yr + "-12-31").length;
      h += '<div class="datebar"><button class="icon" data-act="yrprev" aria-label="Năm trước">‹</button><span class="d">Năm ' + yr + '</span><button class="icon" data-act="yrnext" aria-label="Năm sau"' + (yr >= new Date().getFullYear() ? " disabled" : "") + ">›</button></div>";
      h += '<div class="yr">';
      for (var mm = 0; mm < 12; mm++) {
        var f1 = new Date(yr, mm, 1), dm = new Date(yr, mm + 1, 0).getDate(), o1 = (f1.getDay() + 6) % 7, cnt = sessionsInRange(keyOf(f1), keyOf(new Date(yr, mm, dm))).length;
        h += '<button class="ym" data-act="calmonth" data-v="' + yr + "-" + pad(mm + 1) + '"><span class="ymh"><b>' + MONTHS[mm].replace("Tháng ", "T") + "</b>" + (cnt ? '<span class="num">' + cnt + " buổi</span>" : "") + '</span><span class="ymg">';
        for (var e = 0; e < o1; e++) h += "<i></i>";
        for (var d2 = 1; d2 <= dm; d2++) { var k2 = keyOf(new Date(yr, mm, d2)); h += '<i class="s' + (k2 > today ? "f" : dayStatus(k2).score) + '"></i>'; }
        h += "</span></button>";
      }
      h += "</div>";
      h += '<div class="legend"><span>Ít</span><i class="lg s0"></i><i class="lg s1"></i><i class="lg s2"></i><i class="lg s3"></i><span>Nhiều</span></div>';
      h += '<p class="note">Năm ' + yr + ": <b>" + totalS + "</b> buổi tập. Ô đậm nhất là ngày vừa tập vừa ăn đúng. Bấm một tháng để xem chi tiết.</p>";
    }
    return h + "</div>";
  }
  function lineChart(pts, plain) {
    if (pts.length < 2) return '<p class="note">Cần ít nhất 2 lần cân để vẽ biểu đồ.</p>';
    var W = 600, H = 200, L = 40, R = 14, Tp = 14, B = 26;
    var vs = pts.map(function (p) { return p.v; }), mn = Math.min.apply(null, vs), mx = Math.max.apply(null, vs);
    if (mx - mn < 2) { var m = (mx + mn) / 2; mn = m - 1; mx = m + 1; }
    mn = Math.floor(mn); mx = Math.ceil(mx);
    var t0 = parseKey(pts[0].k).getTime(), t1 = parseKey(pts[pts.length - 1].k).getTime(), span = Math.max(1, t1 - t0);
    function X(p) { return L + (W - L - R) * (parseKey(p.k).getTime() - t0) / span; }
    function Y(v) { return Tp + (H - Tp - B) * (1 - (v - mn) / (mx - mn)); }
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + X(p).toFixed(1) + " " + Y(p.v).toFixed(1); }).join(" ");
    var area = line + " L" + X(pts[pts.length - 1]).toFixed(1) + " " + (H - B) + " L" + L + " " + (H - B) + " Z";
    var ticks = [mn, (mn + mx) / 2, mx], lp = pts[pts.length - 1], gw = G().weight;
    var g = ticks.map(function (t) { return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(t).toFixed(1) + '" y2="' + Y(t).toFixed(1) + '" stroke="var(--line)"/><text x="' + (L - 6) + '" y="' + (Y(t) + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + fmt(t) + "</text>"; }).join("");
    if (!plain && gw >= mn && gw <= mx) g +='<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(gw).toFixed(1) + '" y2="' + Y(gw).toFixed(1) + '" stroke="var(--good)" stroke-dasharray="5 4"/>';
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + (plain ? "Biểu đồ sức mạnh" : "Biểu đồ cân nặng") + '">' + g +
      '<path d="' + area + '" fill="var(--accent)" fill-opacity="0.12"/><path d="' + line + '" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<circle cx="' + X(lp).toFixed(1) + '" cy="' + Y(lp.v).toFixed(1) + '" r="5" fill="var(--accent)"/>' +
      '<text x="' + L + '" y="' + (H - 6) + '" font-size="12" fill="var(--muted)">' + shortDate(pts[0].k) + '</text><text x="' + (W - R) + '" y="' + (H - 6) + '" font-size="12" text-anchor="end" fill="var(--muted)">' + shortDate(lp.k) + "</text></svg></div>";
  }
  function barChart(keys, vals, target) {
    var W = 600, H = 180, B = 26, Tp = 18, maxV = Math.max(target * 1.25, Math.max.apply(null, vals)), bw = (W - 20) / keys.length;
    function Y(v) { return Tp + (H - Tp - B) * (1 - v / maxV); }
    var bars = keys.map(function (k, i) {
      var v = vals[i], y = Y(v), x = 10 + i * bw;
      return (v ? '<rect x="' + (x + bw * .18).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw * .64).toFixed(1) + '" height="' + Math.max(0, H - B - y).toFixed(1) + '" rx="4" fill="' + (v > target * 1.05 ? "var(--accent)" : "var(--fg)") + '"/><text x="' + (x + bw / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle" font-size="11" fill="var(--muted)">' + Math.round(v) + "</text>" : "") +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle" font-size="12" fill="var(--muted)">' + WD[parseKey(k).getDay()] + "</text>";
    }).join("");
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Calo 7 ngày"><line x1="10" x2="' + (W - 10) + '" y1="' + Y(target).toFixed(1) + '" y2="' + Y(target).toFixed(1) + '" stroke="var(--good)" stroke-dasharray="5 4" stroke-width="1.5"/>' + bars + "</svg></div>";
  }

  // =====================================================================
  // Bảng trượt: tình huống, đổi bài, cài đặt, xem ảnh
  // =====================================================================
  var sheet = document.getElementById("sheet"), sheetBody = document.getElementById("sheet-body"), SH = {};
  function openSheet(html) { sheetBody.innerHTML = html; sheet.hidden = false; sheetBody.scrollTop = 0; hydratePhotos(sheetBody); }
  function closeSheet() { sheet.hidden = true; SH = {}; }
  function sheetHead(title) { return '<div class="row between"><h2 id="sheet-title">' + title + '</h2><button class="x" data-act="close" aria-label="Đóng">✕</button></div>'; }

  function weekLeft() {
    var now = new Date(), we = addDays(weekStart(now), 6), left = Math.round((we - parseKey(todayKey())) / 86400000);
    return Math.max(0, left);
  }
  function openSituation(t) {
    SH = { kind: "sit", t: t, k: UI.date };
    var k = UI.date, h = "", isToday = k === todayKey();
    if (t === "busy") {
      var done = sessionsThisWeek(), W = G().weekly, left = weekLeft(), can = Math.min(Math.max(0, W - done), left);
      var dinner = boxFor(k), cut = Math.round(dinner.riceG * 0.5 * 1.3) + 105;
      h += sheetHead("Bận, không tập được");
      h += '<div class="card"><h2>Buổi tập</h2><p>Không sao. Lịch xoay vòng nên <b>' + PROGRAM[nextKey()].name + "</b> chỉ dời sang lần tập tới, không mất bài nào.</p>";
      h += '<p class="note">Tuần này đã tập <b>' + done + "/" + W + "</b> buổi, còn <b>" + left + "</b> ngày. " + (can >= W - done ? "Vẫn đủ ngày để tập đủ tuần, mỗi ngày 1 buổi." : "Tuần này tập được tối đa thêm " + can + " buổi. Đừng dồn 2 buổi một ngày; tuần ít hơn 1 buổi không ảnh hưởng gì đáng kể.") + "</p></div>";
      h += '<div class="card"><h2>Ăn uống hôm nay</h2><ul class="plain"><li>Giữ đủ <b>' + T().p + "g đạm</b>, ngày nghỉ cơ vẫn cần đạm để giữ cơ.</li><li>Bữa tối ăn <b>nửa phần cơm</b> (bớt khoảng " + Math.round(dinner.riceG * 0.5 * 1.3) + " kcal), giữ nguyên thịt và rau.</li><li>Bữa sau tập đổi thành bữa phụ tối: <b>3 trứng + sữa chua, bỏ chuối</b>.</li><li>Đi bộ 20–30 phút cho đủ 8.000 bước.</li></ul>";
      h += '<p class="note">Mục tiêu hôm nay sẽ giảm khoảng ' + cut + " kcal, còn " + int(T().kcal - cut) + " kcal.</p></div>";
      h += '<button class="btn" data-act="apply-busy" data-v="' + cut + '">' + (hasEvent(k, "busy") ? "Đã áp dụng · Bấm để huỷ" : "Áp dụng cho " + friendly(k).toLowerCase()) + "</button>";
    } else if (t === "offplan") {
      h += sheetHead("Ăn lệch kế hoạch");
      h += '<p class="note">Một bữa lệch không phá được kế hoạch. Quan trọng là không nhịn bù và không bỏ tập.</p>';
      h += '<div class="card"><h2>Bạn đã ăn gì?</h2><div class="sit">';
      [["0", "Đã ghi món ở mục Ăn"], ["350", "Ăn thêm nhẹ (≈350)"], ["700", "Một bữa ngoài vừa (≈700)"], ["1200", "Tiệc, lẩu, nhậu (≈1.200)"]].forEach(function (x) {
        h += '<button class="sit-btn' + (SH.extra === x[0] ? " on" : "") + '" data-act="off-pick" data-v="' + x[0] + '">' + x[1] + "</button>";
      });
      h += '</div><p class="note">Nếu ăn thay hẳn một bữa trong kế hoạch, bỏ tick bữa đó ở mục Hôm nay.</p></div><div id="offRes"></div>';
    } else if (t === "mealtime") {
      h += sheetHead("Lỡ giờ ăn");
      h += '<p class="note">Kế hoạch chuẩn: bữa tối 17–18h, tập 19–21h, bữa sau tập 22h. Chọn tình huống của bạn:</p>';
      h += mtCard("Bỏ bữa trưa hoặc ăn trưa rất muộn", ["Ăn ngay một bữa nhẹ có đạm: bánh mì 2 trứng, hoặc 1 hộp sữa + 1 bánh mì (khoảng 400 kcal, 20g đạm).", "Không ăn bù gấp đôi vào bữa tối.", "Nếu đã ăn trưa sau 15h: ăn bữa tối sau khi tập, trước tập chỉ cần 1 quả chuối."]);
      h += mtCard("Ăn bữa tối sát giờ tập (dưới 1 tiếng)", ["Chia đôi hộp: ăn nửa thịt và nửa cơm trước tập 45–60 phút.", "Tập xong ăn nửa còn lại + rau, thay cho bữa sau tập (bỏ 3 trứng, giữ sữa chua).", "Tổng calo trong ngày không đổi."]);
      h += mtCard("Tập muộn, về sau 22h30", ["Bữa sau tập rút gọn: 3 trứng + sữa chua, bỏ chuối để dễ ngủ.", "Ngủ trong vòng 1 tiếng sau khi ăn, vẫn cố đủ 7 tiếng.", "Hôm sau ăn sáng đúng giờ, không bỏ bữa."]);
      h += mtCard("Không mang được hộp, phải ăn ngoài bữa tối", ["Cơm gà luộc hoặc nướng, xin ít cơm: khoảng 600 kcal, 40g đạm.", "Phở bò tái, thêm 1 trứng: khoảng 500 kcal, 30g đạm.", "Bún chả: ăn nửa bún, hết thịt: khoảng 550 kcal, 30g đạm.", "Cơm văn phòng: 1 món thịt nạc + 1 trứng + rau, nửa bát cơm."], true);
      h += '<button class="btn dark" data-act="apply-event" data-v="mealtime">Ghi lại: hôm nay lỡ giờ ăn</button>';
    } else if (t === "tired") {
      h += sheetHead("Mệt / ngủ ít");
      h += '<div class="card"><ul class="plain"><li>Ngủ dưới 6 tiếng hoặc mệt: <b>vẫn đi tập, nhưng nhẹ hơn</b>.</li><li>App bớt 1 hiệp mỗi bài, tắt FST-7. Mỗi hiệp dừng khi còn 2–3 rep, giữ mức tạ cũ, không thử tạ mới.</li><li>Ăn đúng kế hoạch, không cắt calo vào ngày mệt.</li><li>Ốm, sốt, đau họng: nghỉ hẳn, dùng nút "Bận, không tập được".</li><li>Tối nay ngủ sớm hơn 30 phút.</li></ul></div>';
      h += '<button class="btn" data-act="apply-tired">' + (hasEvent(k, "tired") ? "Đã bật · Bấm để tắt" : "Bật chế độ mệt cho buổi tới") + "</button>";
    } else if (t === "short") {
      closeSheet(); UI.tab = "train"; UI.sel = null; render(); window.scrollTo(0, 0);
      toast("Chọn số phút ở ô \"Hôm nay có bao nhiêu phút?\"");
      return;
    }
    if (!isToday) h += '<p class="note">Đang ghi cho ' + longDate(k) + ".</p>";
    openSheet(h);
  }
  function mtCard(title, lines, withLog) {
    var h = '<details class="card"><summary>' + title + '</summary><ul class="plain">' + lines.map(function (l) { return "<li>" + l + "</li>"; }).join("") + "</ul>";
    if (withLog) h += '<div class="sit"><button class="sit-btn" data-act="log-out" data-v="13">+ Cơm gà</button><button class="sit-btn" data-act="log-out" data-v="7">+ Phở bò</button><button class="sit-btn" data-act="log-out" data-v="9">+ Bún chả</button><button class="sit-btn" data-act="log-out" data-v="12">+ Cơm tấm</button></div>';
    return h + "</details>";
  }
  function offplanResult() {
    var k = SH.k, extra = +SH.extra || 0, t = targetFor(k), eaten = sum(peekDay(k).meals).kcal + extra;
    var rest = PLAN_MEALS.filter(function (m) { return !hasPlanMeal(k, m.id); }).map(function (m) { return planMeal(m.id, k); });
    var projected = eaten + rest.reduce(function (a, m) { return a + m.kcal; }, 0), over = Math.round(projected - t.kcal), h = "";
    h += '<div class="card"><h2>Tính toán</h2><p class="num">Đã ăn ' + int(eaten) + " + phần còn lại theo kế hoạch " + int(projected - eaten) + " = <b>" + int(projected) + " kcal</b> (mục tiêu " + int(t.kcal) + ").</p>";
    if (over <= 100) {
      h += '<p><b>Vẫn trong mục tiêu.</b> Cứ ăn tiếp theo kế hoạch, không cần bù.</p></div>';
      SH.plan = { today: [], perDay: 0, days: 0 };
    } else {
      var fixes = [], cutToday = 0, box = boxFor(k);
      if (!hasPlanMeal(k, "toi")) { var rc = Math.round(box.riceG * 1.3); fixes.push("Bữa tối <b>bỏ cơm</b>, giữ thịt và rau (−" + rc + " kcal)"); cutToday += rc; }
      if (!hasPlanMeal(k, "phu")) { fixes.push("Bữa sau tập <b>bỏ chuối</b> (−105 kcal)"); cutToday += 105; }
      if (!hasPlanMeal(k, "g7")) { fixes.push("<b>Bỏ G7</b> hôm nay (−70 kcal)"); cutToday += 70; }
      cutToday = Math.min(cutToday, over);
      var remain = over - cutToday, days = remain > 0 ? Math.min(3, Math.ceil(remain / 250)) : 0, perDay = days ? Math.min(300, Math.round(remain / days / 10) * 10) : 0, leftover = Math.max(0, remain - perDay * days);
      h += '<p>Dư khoảng <b>' + int(over) + " kcal</b>.</p></div>";
      h += '<div class="card"><h2>Gợi ý</h2><ul class="plain">';
      if (fixes.length) h += "<li><b>Phần còn lại hôm nay:</b><ul class=\"plain\">" + fixes.map(function (f) { return "<li>" + f + "</li>"; }).join("") + "</ul></li>";
      if (days) h += "<li><b>" + days + " ngày tới:</b> mỗi ngày bớt " + perDay + " kcal, chủ yếu bớt cơm. Đạm giữ nguyên.</li>";
      if (leftover > 0) h += "<li>Khoảng " + int(leftover) + " kcal còn lại thì bỏ qua, không cần bù hết. Bù quá tay dễ làm mất cơ và mệt khi tập.</li>";
      h += "<li>Ăn mặn hoặc nhiều tinh bột sẽ làm cân tăng 0,5–1 kg trong 1–2 ngày. Đó là nước, không phải mỡ. Uống nhiều nước, đi thêm 2.000 bước.</li>";
      h += "<li>Vẫn tập bình thường, không nhịn bữa sáng hôm sau.</li></ul></div>";
      SH.plan = { today: fixes, perDay: perDay, days: days };
    }
    h += '<button class="btn" data-act="apply-off">' + (extra ? "Ghi món ăn ngoài và " : "") + (SH.plan.days ? "áp dụng mục tiêu mới" : "ghi lại") + "</button>";
    return h;
  }

  function openSwap(slotId) {
    var slot = EXDB[slotId], cur = actualEx(slot).id, alts = ALTS[slotId] || [], h = sheetHead("Đổi bài");
    h += '<p class="note">' + (slot.t === "C" ? "Đây là bài compound chính, nên giữ ít nhất 4–6 tuần để đo được tiến bộ. Chỉ đổi khi máy bận hoặc muốn đổi không khí." : "Bài cô lập đổi thoải mái, nên giữ bài mới 3–4 tuần rồi hãy đổi tiếp.") + " Bài đã đổi sẽ dùng cho các buổi sau cho đến khi bạn đổi lại.</p><div class=\"list\">";
    [[slot.id, slot.n + " (bài gốc)", slot.q]].concat(alts).forEach(function (a) {
      var on = a[0] === cur;
      h += '<button class="check' + (on ? " on" : "") + '" data-act="do-swap" data-slot="' + slotId + '" data-v="' + a[0] + '">' + CHECK_SVG + '<span><span class="t">' + esc(a[1]) + "</span>" + (lastFor(a[0]) ? '<br><span class="d">Lần gần nhất ' + shortDate(lastFor(a[0]).date) + ": " + fmt(lastFor(a[0]).kg) + " kg</span>" : "") + "</span></button>";
    });
    openSheet(h + "</div>");
  }

  function openSettings() {
    var t = T(), g = G(), lb = S.settings.lastBackup, h = sheetHead("Cài đặt");
    h += '<div class="card"><h2>Giáo án</h2><label class="field">Ngày bắt đầu tuần 1<input type="date" id="setStart" value="' + (S.settings.startDate || todayKey()) + '"></label><label class="field">Số buổi tạ mỗi tuần<input id="setWk" inputmode="numeric" value="' + g.weekly + '"></label></div>';
    h += '<div class="card"><h2>Mục tiêu mỗi ngày</h2><div class="grid2">';
    h += '<label class="field">Calo (kcal)<input id="setK" inputmode="numeric" value="' + t.kcal + '"></label><label class="field">Đạm (g)<input id="setP" inputmode="numeric" value="' + t.p + '"></label>';
    h += '<label class="field">Tinh bột (g)<input id="setC" inputmode="numeric" value="' + t.c + '"></label><label class="field">Chất béo (g)<input id="setF" inputmode="numeric" value="' + t.f + '"></label></div>';
    h += '<p class="note">Mặc định theo kế hoạch recomp: 2.150 kcal · 140g đạm · 250g tinh bột · 65g béo.</p></div>';
    h += '<div class="card"><h2>Mục tiêu dài hạn</h2><div class="grid2"><label class="field">Cân nặng mục tiêu (kg)<input id="setGW" inputmode="decimal" value="' + fmt(g.weight) + '"></label><label class="field">Giảm vòng bụng (cm)<input id="setGB" inputmode="decimal" value="' + fmt(g.waistDrop) + '"></label></div><p class="note">Đề xuất cho 171cm, 80kg làm recomp: khoảng 74–75kg và bụng nhỏ đi 6–8cm sau 4–6 tháng. Cân có thể giảm chậm vì cơ đang lên; vòng bụng mới là thước đo chính.</p></div>';
    h += '<button class="btn dark" data-act="save-settings">Lưu cài đặt</button>';
    h += '<div class="card"><h2>Sao lưu dữ liệu</h2><p class="note">Dữ liệu nằm trên điện thoại này. Sao lưu ra file rồi lưu vào Drive, Zalo "Cloud của tôi" hoặc gửi mail cho chính mình. Đổi máy thì dùng "Khôi phục".' + (lb ? " Lần gần nhất: " + new Date(lb).toLocaleString("vi-VN") + "." : "") + '</p>';
    h += '<label class="toggle"><input type="checkbox" id="bkPhotos"><span>Kèm ảnh (file sẽ nặng hơn)</span></label>';
    h += '<div class="grid2"><button class="btn" data-act="backup">Sao lưu</button><button class="btn ghost" data-act="restore">Khôi phục</button></div></div>';
    h += '<div class="card"><h2>Nhập dữ liệu bằng mã</h2><p class="note">Dán mã bắt đầu bằng SOTAP1: (Claude gửi trong chat). Dữ liệu được gộp thêm, không xoá những gì đã có.</p><textarea id="pasteCode" rows="3" placeholder="SOTAP1:..." autocomplete="off" autocapitalize="off" spellcheck="false"></textarea><button class="btn dark" data-act="paste-import">Nhập</button></div>';
    h += '<div class="card"><h2>Cài app lên điện thoại</h2><ul class="plain"><li><b>iPhone:</b> mở bằng Safari → nút Chia sẻ → "Thêm vào MH chính".</li><li><b>Android:</b> mở bằng Chrome → menu ⋮ → "Cài đặt ứng dụng".</li></ul></div>';
    h += '<div class="card"><h2>Xoá toàn bộ</h2><p class="note">Xoá mọi buổi tập, món ăn, số đo và ảnh trên máy này.</p><button class="btn ghost" data-act="wipe">Xoá toàn bộ dữ liệu</button></div>';
    h += '<p class="note" style="text-align:center">FitCore · bản 2.3</p>';
    SH = { kind: "settings" };
    openSheet(h);
  }

  function openPhoto(id) {
    getPhoto(id).then(function (rec) {
      if (!rec) return;
      var url = URL.createObjectURL(rec.blob);
      SH = { kind: "photo", id: id, url: url };
      openSheet(sheetHead(rec.kind === "body" ? "Ảnh checkpoint" : "Ảnh bữa ăn") + '<img class="phbig" src="' + url + '" alt="Ảnh"><p class="note">' + longDate(rec.date) + (rec.slot ? " · " + esc(rec.slot) : "") + " · " + new Date(rec.ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + '</p><button class="btn ghost" data-act="delphoto">Xoá ảnh</button>');
    });
  }

  // ---------- Chụp ảnh ----------
  var photoIn = document.getElementById("photoIn"), photoCtx = null;
  function askPhoto(kind) {
    photoCtx = { kind: kind, date: UI.date, slot: kind === "meal" ? defaultSlot() : null };
    photoIn.value = "";
    photoIn.click();
  }
  photoIn.addEventListener("change", function () {
    var f = photoIn.files && photoIn.files[0], ctx = photoCtx; if (!f || !ctx) return;
    toast("Đang lưu ảnh…");
    Promise.all([shrink(f, 1280, 0.8), shrink(f, 320, 0.7)]).then(function (b) {
      var id = "p" + uid(), rec = { id: id, date: ctx.date, kind: ctx.kind, slot: ctx.slot, ts: Date.now(), blob: b[0], thumb: b[1] };
      return putPhoto(rec).then(function () {
        day(ctx.date).photos.push({ id: id, kind: ctx.kind, slot: ctx.slot });
        flush(); render(); toast(ctx.kind === "body" ? "Đã lưu ảnh checkpoint" : "Đã lưu ảnh bữa " + (ctx.slot || "").toLowerCase());
      });
    }).catch(function () { toast("Không lưu được ảnh. Thử chọn ảnh khác hoặc giải phóng bộ nhớ máy."); });
  });

  // ---------- Sao lưu ----------
  function blobToData(b) { return new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(b); }); }
  function dataToBlob(u) { var p = u.split(","), bin = atob(p[1]), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: (p[0].match(/:(.*?);/) || [])[1] || "image/jpeg" }); }
  function backup() {
    flush();
    var withPhotos = !!(document.getElementById("bkPhotos") || {}).checked;
    var base = Object.assign({ app: "so-tap-recomp", exportedAt: new Date().toISOString() }, S);
    var p = withPhotos ? allPhotos().then(function (list) {
      return Promise.all(list.map(function (r) { return blobToData(r.blob).then(function (d) { return { id: r.id, date: r.date, kind: r.kind, slot: r.slot, ts: r.ts, data: d }; }); }));
    }).then(function (ph) { base.photosData = ph; return base; }) : Promise.resolve(base);
    p.then(function (obj) {
      var name = "fitcore-" + todayKey() + (withPhotos ? "-anh" : "") + ".json", blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
      var done = function () { S.settings.lastBackup = Date.now(); flush(); toast("Đã tạo file sao lưu " + name); render(); if (SH.kind === "settings") openSettings(); };
      try {
        var file = new File([blob], name, { type: "application/json" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: "Sao lưu FitCore" }).then(done).catch(function (e) { if (e && e.name !== "AbortError") download(blob, name, done); });
          return;
        }
      } catch (e) {}
      download(blob, name, done);
    }).catch(function () { toast("Không tạo được file sao lưu."); });
  }
  function download(blob, name, cb) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    cb();
  }
  // Gộp dữ liệu từ nơi khác vào, không ghi đè thứ đã có
  function mergeIn(o) {
    var out = { sessions: 0, meals: 0, start: null };
    if (o.settings && o.settings.startDate && !S.settings.startDate) { S.settings.startDate = o.settings.startDate; out.start = o.settings.startDate; }
    (o.sessions || []).forEach(function (s) {
      if (!s || !s.id || !PROGRAM[s.key] || S.sessions.some(function (x) { return x.id === s.id; })) return;
      S.sessions.push(s); out.sessions++;
    });
    S.sessions.sort(function (a, b) { return b.ts - a.ts; });
    if (out.sessions && S.sessions.length) S.prog.nextIndex = (ORDER.indexOf(S.sessions[0].key) + 1) % 4;
    Object.keys(o.days || {}).forEach(function (k) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
      var src = o.days[k], d = day(k);
      (src.meals || []).forEach(function (m) {
        if (d.meals.some(function (x) { return x.id === m.id || (m.q && x.q === m.q); })) return;
        d.meals.push(m); out.meals++;
      });
      Object.keys(src.c || {}).forEach(function (h) { if (src.c[h]) d.c[h] = true; });
      if (typeof src.w === "number" && typeof d.w !== "number") d.w = src.w;
      if (typeof src.waist === "number" && typeof d.waist !== "number") d.waist = src.waist;
    });
    Object.keys(o.checks || {}).forEach(function (k) { if (o.checks[k]) S.checks[k] = true; });
    return out;
  }
  var importInput = document.getElementById("importFile");
  importInput.addEventListener("change", function () {
    var f = importInput.files && importInput.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result);
        if (!o || o.app !== "so-tap-recomp") throw new Error("bad");
        var photos = Array.isArray(o.photosData) ? o.photosData : [];
        delete o.photosData;
        S = migrate(o); flush();
        Promise.all(photos.map(function (p) { var b = dataToBlob(p.data); return putPhoto({ id: p.id, date: p.date, kind: p.kind, slot: p.slot, ts: p.ts, blob: b, thumb: b }); })).catch(function () {}).then(function () {
          closeSheet(); UI.sel = null; render();
          toast("Đã khôi phục: " + S.sessions.length + " buổi tập, " + Object.keys(S.days).length + " ngày" + (photos.length ? ", " + photos.length + " ảnh" : ""));
        });
      } catch (e) { toast("File này không phải bản sao lưu của FitCore."); }
      importInput.value = "";
    };
    r.readAsText(f);
  });

  // ---------- Đồng hồ nghỉ ----------
  var timerEl = document.getElementById("timer"), timer = null, tick = null, wakeLock = null;
  function startTimer(sec, label) {
    timer = { end: Date.now() + sec * 1000, label: label };
    if (!tick) tick = setInterval(drawTimer, 250);
    try { if (navigator.wakeLock && !wakeLock) navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; l.addEventListener("release", function () { wakeLock = null; }); }).catch(function () {}); } catch (e) {}
    drawTimer();
  }
  function stopTimer() {
    timer = null; clearInterval(tick); tick = null; timerEl.hidden = true;
    if (wakeLock) { try { wakeLock.release(); } catch (e) {} wakeLock = null; }
  }
  function drawTimer() {
    if (!timer) return stopTimer();
    var left = Math.round((timer.end - Date.now()) / 1000), over = left <= 0, a = Math.abs(left);
    timerEl.hidden = false;
    timerEl.className = "timer" + (over ? " over" : "");
    if (over && !timer.buzzed) { timer.buzzed = true; try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {} beep(); }
    timerEl.innerHTML = '<div class="in"><span class="clock num">' + (over ? "+" : "") + Math.floor(a / 60) + ":" + pad(a % 60) + '</span><span class="what"><b>' + (over ? "Hết giờ nghỉ, vào hiệp tiếp" : "Đang nghỉ") + "</b>" + esc(timer.label) + '</span><button data-t="add">+30s</button><button data-t="stop">Tắt</button></div>';
    if (left < -600) stopTimer();
  }
  var audioCtx = null;
  function beep() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  }
  timerEl.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || !timer) return;
    if (b.getAttribute("data-t") === "add") { timer.end += 30000; timer.buzzed = false; drawTimer(); } else stopTimer();
  });
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && timer) drawTimer(); });

  // ---------- Toast ----------
  var toastEl = document.getElementById("toast"), toastT = null;
  function toast(msg) { toastEl.textContent = msg; toastEl.style.marginBottom = timerEl.hidden ? "" : "64px"; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 2800); }

  // =====================================================================
  // Sự kiện
  // =====================================================================
  document.getElementById("nav").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]"); if (!b) return;
    UI.tab = b.getAttribute("data-tab"); UI.armDel = null; UI.confirm = false; UI.banner = "";
    render(); window.scrollTo(0, 0);
  });
  document.getElementById("gear").addEventListener("click", openSettings);

  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) return closeSheet();
    var b = e.target.closest("[data-act]"); if (!b) return;
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v"), k = SH.k || UI.date;
    if (a === "close") closeSheet();
    else if (a === "save-settings") {
      var gv = function (id) { return num(document.getElementById(id).value); };
      var kc = gv("setK"), p = gv("setP"), c = gv("setC"), f = gv("setF"), wk = gv("setWk"), gw = gv("setGW"), gb = gv("setGB");
      if (!(kc >= 1000 && kc <= 5000) || !(p > 0) || !(c >= 0) || !(f > 0)) { toast("Kiểm tra lại số: calo từ 1.000 đến 5.000, các chất phải lớn hơn 0."); return; }
      if (!(wk >= 1 && wk <= 7)) { toast("Số buổi mỗi tuần từ 1 đến 7."); return; }
      S.settings.targets = { kcal: Math.round(kc), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
      S.settings.goals = { weekly: Math.round(wk), weight: gw > 30 ? gw : DEFAULT_GOALS.weight, waistDrop: gb > 0 ? gb : DEFAULT_GOALS.waistDrop };
      var sd = document.getElementById("setStart").value; if (sd) S.settings.startDate = sd;
      flush(); closeSheet(); render(); toast("Đã lưu cài đặt");
    }
    else if (a === "backup") backup();
    else if (a === "restore") importInput.click();
    else if (a === "paste-import") {
      var raw = (document.getElementById("pasteCode").value || "").replace(/\s+/g, "");
      try {
        if (raw.indexOf("SOTAP1:") !== 0) throw new Error("prefix");
        var obj = JSON.parse(decodeURIComponent(escape(atob(raw.slice(7)))));
        var res = mergeIn(obj); flush(); closeSheet(); UI.sel = null; render();
        toast("Đã nhập: " + res.sessions + " buổi tập, " + res.meals + " món ăn" + (res.start ? ", ngày bắt đầu " + shortDate(res.start) : ""));
      } catch (err) { toast("Mã không đúng. Copy lại toàn bộ mã, kể cả chữ SOTAP1: ở đầu."); }
    }
    else if (a === "wipe") {
      if (b.getAttribute("data-armed")) {
        S = blankState(); flush();
        allPhotos().then(function (l) { return Promise.all(l.map(function (r) { return delPhoto(r.id); })); }).catch(function () {});
        closeSheet(); UI.sel = null; render(); toast("Đã xoá toàn bộ dữ liệu");
      } else { b.setAttribute("data-armed", "1"); b.textContent = "Bấm lần nữa để xoá hẳn"; b.style.color = "var(--accent-ink)"; }
    }
    else if (a === "apply-busy") {
      var d = day(k);
      if (hasEvent(k, "busy")) { d.events = d.events.filter(function (x) { return x.t !== "busy"; }); if (d.adjNote === "ngày nghỉ") { d.adj = 0; d.adjNote = ""; } toast("Đã huỷ ngày nghỉ"); }
      else { addEvent(k, "busy"); d.adj = -(+v); d.adjNote = "ngày nghỉ"; toast("Đã ghi ngày nghỉ, mục tiêu hôm nay " + int(T().kcal - v) + " kcal"); }
      flush(); closeSheet(); render();
    }
    else if (a === "off-pick") { SH.extra = v; document.getElementById("offRes").innerHTML = offplanResult(); sheetBody.querySelectorAll('[data-act="off-pick"]').forEach(function (x) { x.classList.toggle("on", x.getAttribute("data-v") === v); }); }
    else if (a === "apply-off") {
      var extra = +SH.extra || 0, pl = SH.plan || { days: 0 };
      if (extra) day(k).meals.push({ id: uid(), slot: defaultSlot(), name: "Ăn ngoài (ước lượng)", kcal: extra, p: Math.round(extra * 0.05), c: Math.round(extra * 0.1), f: Math.round(extra * 0.045) });
      addEvent(k, "offplan");
      for (var i = 1; i <= pl.days; i++) { var nk2 = shiftKey(k, i), nd = day(nk2); nd.adj = (nd.adj || 0) - pl.perDay; nd.adjNote = "bù bữa lệch " + shortDate(k); }
      flush(); closeSheet(); render(); toast(pl.days ? "Đã giảm " + pl.perDay + " kcal cho " + pl.days + " ngày tới" : "Đã ghi lại");
    }
    else if (a === "apply-event") { addEvent(k, v); flush(); closeSheet(); render(); toast("Đã ghi lại"); }
    else if (a === "log-out") {
      var f2 = FOODS[+v]; day(k).meals.push({ id: uid(), slot: "Tối", name: f2[0] + " (" + f2[1] + ")", kcal: f2[2], p: f2[3], c: f2[4], f: f2[5] });
      addEvent(k, "mealtime"); flush(); render(); toast("Đã thêm " + f2[0]);
    }
    else if (a === "apply-tired") {
      var key = nextKey(), w = currentWeek(), dr = draftFor(key, w).d;
      if (hasEvent(k, "tired")) { day(k).events = day(k).events.filter(function (x) { return x.t !== "tired"; }); dr.tired = false; toast("Đã tắt chế độ mệt"); }
      else { addEvent(k, "tired"); dr.tired = true; toast("Buổi " + PROGRAM[key].name + " sẽ nhẹ hơn hôm nay"); }
      flush(); closeSheet(); render();
    }
    else if (a === "do-swap") {
      var slotId = b.getAttribute("data-slot");
      if (v === slotId) delete S.swaps[slotId]; else S.swaps[slotId] = v;
      var dd = S.prog.drafts[UI.sel]; if (dd && dd.sets) delete dd.sets[slotId];
      flush(); closeSheet(); render(); toast(v === slotId ? "Đã về bài gốc" : "Đã đổi sang " + EXDB[v].n);
    }
    else if (a === "delphoto") {
      if (!b.getAttribute("data-armed")) { b.setAttribute("data-armed", "1"); b.textContent = "Bấm lần nữa để xoá"; b.style.color = "var(--accent-ink)"; return; }
      var pid = SH.id;
      delPhoto(pid).catch(function () {}).then(function () {
        Object.keys(S.days).forEach(function (dk) { var dy = S.days[dk]; if (dy.photos) dy.photos = dy.photos.filter(function (p) { return p.id !== pid; }); });
        if (thumbCache[pid]) { URL.revokeObjectURL(thumbCache[pid]); delete thumbCache[pid]; }
        if (SH.url) URL.revokeObjectURL(SH.url);
        flush(); closeSheet(); render(); toast("Đã xoá ảnh");
      });
    }
  });

  view.addEventListener("click", function (e) {
    var go = e.target.closest("[data-goto]");
    if (go) { UI.tab = go.getAttribute("data-goto"); if (UI.tab === "train") UI.sel = null; render(); window.scrollTo(0, 0); return; }
    var pk = e.target.closest("[data-pick]");
    if (pk) { UI.pick = +pk.getAttribute("data-pick"); renderResults(); return; }
    var b = e.target.closest("[data-act]"); if (!b || b.tagName === "INPUT" || b.tagName === "SELECT") return;
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v"), w = currentWeek();
    var exId = b.getAttribute("data-ex"), si = +b.getAttribute("data-i");

    if (a === "prev") { UI.date = shiftKey(UI.date, -1); render(); }
    else if (a === "next") { if (UI.date < todayKey()) { UI.date = shiftKey(UI.date, 1); render(); } }
    else if (a === "goday") { UI.date = v; UI.tab = "today"; render(); window.scrollTo(0, 0); }
    else if (a === "save-start") { var sd = document.getElementById("startDate").value; if (sd) { S.settings.startDate = sd; save(); render(); toast("Đã lưu ngày bắt đầu"); } }
    else if (a === "sit") openSituation(v);
    else if (a === "plan") togglePlan(UI.date, v);
    else if (a === "habit") { var d = day(UI.date); d.c[v] = !d.c[v]; save(); render(); }
    else if (a === "photo") askPhoto(b.getAttribute("data-kind"));
    else if (a === "viewphoto") openPhoto(v);
    else if (a === "sel") { UI.sel = v; UI.confirm = false; render(); }
    else if (a === "budget") { var dd = draftFor(UI.sel, w).d; dd.budget = +v || null; if (+v) addEvent(todayKey(), "short"); save(); render(); }
    else if (a === "warm") { var dw = draftFor(UI.sel, w).d; dw.warm[v] = !dw.warm[v]; save(); render(); }
    else if (a === "warm-show") { UI.warmShow = !UI.warmShow; render(); }
    else if (a === "rep") {
      var dr = draftFor(UI.sel, w).d, s = dr.sets[exId][si];
      s.reps = Math.max(0, (parseInt(s.reps, 10) || 0) + (+b.getAttribute("data-d")));
      save(); render();
    }
    else if (a === "sdone") {
      var r1 = draftFor(UI.sel, w), dr1 = r1.d, set = dr1.sets[exId][si];
      set.done = !set.done;
      if (set.done) {
        var it = r1.plan.items.filter(function (x) { return x.slot.id === exId; })[0], act = actualEx(it.slot);
        if (set.kg === "" || set.kg == null) {
          if (act.bw) set.kg = 0;
          else { set.done = false; toast("Nhập mức tạ (kg) cho hiệp này"); var ki = document.getElementById("kg-" + UI.sel + "-" + exId + "-" + si); if (ki) ki.focus(); return; }
        }
        if (!(parseInt(set.reps, 10) > 0)) { set.done = false; toast("Nhập số rep cho hiệp này"); render(); return; }
        if (!dr1.startedAt) dr1.startedAt = Date.now();
        dr1.lastAt = Date.now();
        var partner = it.pair ? r1.plan.items.filter(function (x) { return x.slot.id === it.pair; })[0] : null;
        var partnerDone = partner ? (dr1.sets[partner.slot.id][si] || {}).done : true;
        if (partner && !partnerDone) toast("Sang ngay " + actualEx(partner.slot).n + " hiệp " + (si + 1));
        else startTimer(it.restSec, act.n + " · hiệp " + (si + 1) + "/" + it.sets + " · nghỉ " + (partner ? "1,5 phút" : it.rest));
        // Hiệp sau mặc định dùng mức tạ vừa làm
        var next = dr1.sets[exId][si + 1];
        if (next && !next.done) next.kg = set.kg;
      }
      save(); render();
    }
    else if (a === "swap") openSwap(v);
    else if (a === "hist") openHistory(v);
    else if (a === "exopen") { UI.open = UI.open || {}; UI.open[v] = !UI.open[v]; render(); }
    else if (a === "stale-save") { finish(v, b.getAttribute("data-d")); }
    else if (a === "stale-drop") {
      if (!b.getAttribute("data-armed")) { b.setAttribute("data-armed", "1"); b.textContent = "Bấm lần nữa để bỏ"; return; }
      S.prog.drafts[v] = null; flush(); render(); toast("Đã bỏ buổi dở");
    }
    else if (a === "recent") {
      var rc = UI.recent && UI.recent[+v]; if (!rc) return;
      day(UI.date).meals.push({ id: uid(), slot: defaultSlot(), name: rc.name, kcal: rc.kcal, p: rc.p, c: rc.c, f: rc.f });
      save(); render(); toast("Đã thêm " + rc.name);
    }
    else if (a === "checkin-seen") { S.settings.checkinSeen = v; flush(); render(); }
    else if (a === "drop-ex") { var dx = draftFor(UI.sel, w).d; dx.removed[v] = true; save(); render(); toast("Đã bỏ bài này cho hôm nay"); }
    else if (a === "restore-ex") { var dz = draftFor(UI.sel, w).d; delete dz.removed[v]; save(); render(); }
    else if (a === "finish") {
      var r2 = draftFor(UI.sel, w), dn = 0, tt = 0;
      r2.plan.items.forEach(function (it) { if (it.dropped) return; r2.d.sets[it.slot.id].forEach(function (s) { tt++; if (s.done) dn++; }); });
      if (dn < tt) { UI.confirm = true; render(); } else finish();
    }
    else if (a === "finish-yes") finish();
    else if (a === "finish-no") { UI.confirm = false; render(); }
    else if (a === "addfood") {
      if (UI.pick == null) { toast("Chọn một món trong danh sách trước"); return; }
      var f = FOODS[UI.pick], q = num(document.getElementById("qty").value) || 1;
      day(UI.date).meals.push({ id: uid(), slot: document.getElementById("slotA").value, name: (q !== 1 ? fmt(q) + " × " : "") + f[0] + " (" + f[1] + ")", kcal: f[2] * q, p: f[3] * q, c: f[4] * q, f: f[5] * q });
      UI.pick = null; UI.q = ""; save(); render(); toast("Đã thêm " + f[0]);
    }
    else if (a === "addcustom") {
      var name = document.getElementById("cName").value.trim(), kc = num(document.getElementById("cK").value);
      if (!name || kc == null || kc < 0) { toast("Cần nhập tên món và số calo"); return; }
      day(UI.date).meals.push({ id: uid(), slot: document.getElementById("slotC").value, name: name, kcal: kc, p: num(document.getElementById("cP").value) || 0, c: num(document.getElementById("cC").value) || 0, f: num(document.getElementById("cF").value) || 0 });
      save(); render(); toast("Đã thêm " + name);
    }
    else if (a === "delmeal") { var dm = day(UI.date); dm.meals = dm.meals.filter(function (m) { return m.id !== v; }); save(); render(); }
    else if (a === "preptab") { UI.prepTab = v; render(); }
    else if (a === "task") {
      if (/:box$/.test(v)) togglePlan(v.slice(0, 10), "toi");
      else { if (S.checks[v]) delete S.checks[v]; else S.checks[v] = true; save(); render(); }
    }
    else if (a === "del") {
      if (UI.armDel === v) { UI.armDel = null; S.sessions = S.sessions.filter(function (s) { return s.id !== v; }); save(); toast("Đã xoá buổi tập"); }
      else UI.armDel = v;
      render();
    }
    else if (a === "backup") backup();
    else if (a === "calmode") { UI.calMode = v; render(); }
    else if (a === "calprev" || a === "calnext") { var cm = UI.calMonth.split("-"), dt = new Date(+cm[0], +cm[1] - 1 + (a === "calnext" ? 1 : -1), 1); UI.calMonth = dt.getFullYear() + "-" + pad(dt.getMonth() + 1); render(); }
    else if (a === "yrprev" || a === "yrnext") { UI.calMonth = (+UI.calMonth.slice(0, 4) + (a === "yrnext" ? 1 : -1)) + "-01"; render(); }
    else if (a === "calmonth") { UI.calMonth = v; UI.calMode = "month"; render(); }
  });

  view.addEventListener("input", function (e) {
    var t = e.target, a = t.getAttribute && t.getAttribute("data-act");
    if (t.id === "q") { UI.q = t.value; UI.pick = null; renderResults(); return; }
    if (a === "skg" || a === "srep") {
      var dr = draftFor(UI.sel, currentWeek()).d, s = dr.sets[t.getAttribute("data-ex")][+t.getAttribute("data-i")];
      if (a === "skg") { var n = num(t.value); s.kg = n == null ? "" : n; } else s.reps = parseInt(t.value, 10) || "";
      save();
    }
    else if (a === "measure") {
      var d = day(UI.date), n2 = num(t.value), field = t.getAttribute("data-v");
      var ok = field === "w" ? n2 >= 30 && n2 <= 250 : n2 >= 40 && n2 <= 200;
      d[field] = ok ? n2 : null; save();
    }
  });
  view.addEventListener("change", function (e) {
    var t = e.target;
    if (t.getAttribute("data-act") === "tired") { var dr = draftFor(UI.sel, currentWeek()).d; dr.tired = t.checked; if (t.checked) addEvent(todayKey(), "tired"); save(); render(); }
  });

  function togglePlan(k, id) {
    var d = day(k), idx = -1;
    d.meals.forEach(function (m, i) { if (m.q === id) idx = i; });
    if (idx >= 0) d.meals.splice(idx, 1);
    else {
      var m = planMeal(id, k);
      if (id === "phu" && hasEvent(k, "busy")) m = { slot: "Phụ", t: "Bữa phụ tối (ngày nghỉ)", kcal: 265, p: 22, c: 6, f: 17 };
      d.meals.push({ id: uid(), q: id, slot: m.slot, name: m.t, kcal: m.kcal, p: m.p, c: m.c, f: m.f });
    }
    save(); render();
  }

  function e1rm(kg, reps) { return kg * (1 + reps / 30); }
  function bestBefore(exId) {
    var b = { kg: 0, e: 0 };
    S.sessions.forEach(function (s) {
      var log = s.log && s.log[exId];
      if (log) log.forEach(function (x) { b.kg = Math.max(b.kg, x.kg); b.e = Math.max(b.e, e1rm(x.kg, x.reps)); });
      else if (s.weights && typeof s.weights[exId] === "number") b.kg = Math.max(b.kg, s.weights[exId]);
    });
    return b;
  }
  function finish(keyArg, dateArg) {
    var key = keyArg || UI.sel, w = currentWeek(), r = draftFor(key, w), d = r.d, dn = 0, tt = 0, log = {}, weights = {}, skipped = [], prs = [], vol = 0;
    r.plan.items.forEach(function (it) {
      var act = actualEx(it.slot), sets = d.sets[it.slot.id] || [], done = sets.filter(function (s) { return s.done; });
      if (it.dropped) { skipped.push(it.slot.id); return; }
      tt += sets.length; dn += done.length;
      if (!done.length) { skipped.push(it.slot.id); return; }
      log[act.id] = done.map(function (s) { return { kg: +s.kg || 0, reps: +s.reps || 0 }; });
      weights[act.id] = Math.max.apply(null, log[act.id].map(function (s) { return s.kg; }));
      log[act.id].forEach(function (s) { vol += s.kg * s.reps; });
      // Kỷ lục: so với mọi buổi trước của chính bài này
      var prev = bestBefore(act.id), top = log[act.id].reduce(function (a, s) { return e1rm(s.kg, s.reps) > e1rm(a.kg, a.reps) ? s : a; });
      if (top.kg > 0 && (prev.kg > 0 || prev.e > 0)) {
        if (weights[act.id] > prev.kg) prs.push({ ex: act.id, kg: weights[act.id], reps: log[act.id].filter(function (s) { return s.kg === weights[act.id]; })[0].reps, t: "tạ" });
        else if (prev.e > 0 && e1rm(top.kg, top.reps) > prev.e + 0.01) prs.push({ ex: act.id, kg: top.kg, reps: top.reps, t: "rep" });
      }
    });
    var now = Date.now(), date = dateArg || todayKey(), mode = d.budget && r.plan.steps.length ? (d.tired ? "short-tired" : "short") : d.tired ? "tired" : "full";
    var minutes = d.startedAt ? Math.min(240, Math.round(((dateArg ? (d.lastAt || d.startedAt) : now) - d.startedAt) / 60000)) : null;
    var ts = dateArg ? (d.lastAt || d.startedAt || now) : now;
    S.sessions.push({ id: "s" + now, date: date, ts: ts, key: key, week: w, done: dn, total: tt, log: log, weights: weights, skipped: skipped, mode: mode, minutes: minutes, vol: Math.round(vol), prs: prs });
    S.sessions.sort(function (a, b) { return b.ts - a.ts; });
    S.prog.drafts[key] = null;
    S.prog.nextIndex = (ORDER.indexOf(key) + 1) % 4;
    UI.confirm = false; UI.sel = null; UI.open = {};
    stopTimer(); flush();
    UI.tab = "today"; UI.date = todayKey();
    var msg = "Đã lưu " + PROGRAM[key].name + (dateArg ? " vào " + shortDate(date) : "") + ": " + dn + "/" + tt + " hiệp" + (minutes ? " · " + minutes + " phút" : "") + " · tổng " + int(vol) + " kg đã nâng" + (skipped.length ? " · bỏ " + skipped.length + " bài" : "") + ".";
    if (prs.length) msg += " 🏆 Kỷ lục mới: " + prs.map(function (p) { return EXDB[p.ex].n + " " + fmt(p.kg) + "kg × " + p.reps; }).join(", ") + ".";
    msg += " Buổi tiếp theo: " + PROGRAM[ORDER[S.prog.nextIndex]].name + ".";
    UI.banner = msg;
    render(); window.scrollTo(0, 0);
  }
  function staleDraft() {
    var t = todayKey(), out = null;
    ORDER.forEach(function (k) {
      var d = S.prog.drafts[k];
      if (!d || !d.startedAt || out) return;
      var dk = keyOf(new Date(d.startedAt));
      if (dk >= t) return;
      var n = 0; Object.keys(d.sets || {}).forEach(function (s) { (d.sets[s] || []).forEach(function (x) { if (x.done) n++; }); });
      if (n) out = { key: k, date: dk, n: n };
    });
    return out;
  }
  function staleBanner() {
    var st = staleDraft();
    if (!st) return "";
    return '<div class="phase warn"><b>Buổi ' + PROGRAM[st.key].name + " ngày " + shortDate(st.date) + " chưa bấm Hoàn thành</b> (" + st.n + ' hiệp đã ghi).<div class="row" style="margin-top:8px"><button class="btn sm dark" data-act="stale-save" data-v="' + st.key + '" data-d="' + st.date + '">Lưu vào ' + shortDate(st.date) + '</button><button class="btn sm ghost" data-act="stale-drop" data-v="' + st.key + '">Bỏ buổi dở</button></div></div>';
  }

  // Đồng hồ thời gian tập chạy trên màn Tập
  setInterval(function () {
    var el = document.getElementById("elapsed");
    if (el) el.textContent = Math.round((Date.now() - +el.getAttribute("data-start")) / 60000) + "′";
  }, 20000);

  // Sang ngày mới khi app vẫn mở
  var lastToday = todayKey();
  setInterval(function () { var t = todayKey(); if (t !== lastToday) { if (UI.date === lastToday) UI.date = t; lastToday = t; render(); } }, 60000);

  // =====================================================================
  // Khởi động
  // =====================================================================
  load();
  render();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
