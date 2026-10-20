(function () {
  "use strict";

  // =====================================================================
  // Kế hoạch lấy từ project "Xây dựng chế độ dinh dưỡng"
  // =====================================================================
  var DEFAULT_TARGETS = { kcal: 2150, p: 140, f: 65, c: 250 };

  var PROGRAM = {
    UA: { name: "Upper A", sub: "Ngực · lưng nặng", ex: [
      { id: "smbench", n: "Smith bench press", t: "C", s: 3, r: "6–8", q: "smith machine bench press form", note: "Đòn chạm ngang hoặc ngay dưới đầu ti · khuỷu 45–60° · ép bả vai ra sau và xuống · khởi động 2 hiệp 50% và 75%" },
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
      { id: "smohp", n: "Smith OHP ngồi", t: "C", s: 3, r: "6–10", q: "seated smith machine shoulder press form", note: "Đòn đi trước mặt, không đẩy sau gáy · lùi ghế để đòn qua mặt · lưng tựa sát ghế · khởi động 2 hiệp 50% và 75%" },
      { id: "pullup", n: "Pull-up / pulldown tay ngửa", t: "C", s: 3, r: "6–10", q: "underhand lat pulldown form" },
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
      { id: "hlr", n: "Hanging leg raise", t: "I", s: 3, r: "10–15", q: "hanging leg raise form" },
      { id: "legext", n: "Leg extension", t: "I", s: 3, r: "12–15", q: "leg extension form", fst: true }
    ]}
  };
  var ORDER = ["UA", "LA", "UB", "LB"];

  var WARM = {
    UA: [
      { id: "w-pec", n: "Pec deck fly nhẹ", d: "1 × 15 · tạ khoảng 40% mức tập, mở ngực hết biên độ" },
      { id: "w-pull", n: "Kéo xà hoặc lat pulldown nhẹ", d: "1 × 10 · kéo xà dùng máy trợ lực, hoặc pulldown thật nhẹ" },
      { id: "ramp", n: "Làm nóng Smith bench", d: "50% × 8, rồi 75% × 4 · nghỉ 1 phút giữa 2 hiệp" }
    ],
    UB: [
      { id: "w-lat", n: "Lateral raise cáp nhẹ", d: "1 × 15 mỗi tay · tạ khoảng 40% mức tập" },
      { id: "w-pull", n: "Kéo xà hoặc lat pulldown nhẹ", d: "1 × 10 · kéo xà dùng máy trợ lực, hoặc pulldown thật nhẹ" },
      { id: "ramp", n: "Làm nóng Smith OHP ngồi", d: "50% × 8, rồi 75% × 4 · nghỉ 1 phút giữa 2 hiệp" }
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

  // Ngày ăn mẫu. Bấm tick là ghi luôn vào nhật ký ăn của ngày đó.
  var PLAN_MEALS = [
    { id: "sang", slot: "Sáng", t: "Bữa sáng", d: "Bánh mì kẹp 2 trứng (hoặc nửa suất xôi + trứng/thịt)", kcal: 430, p: 21, c: 48, f: 17 },
    { id: "g7", slot: "Phụ", t: "1 gói G7", d: "Không thêm trà sữa, nước ngọt", kcal: 70, p: 0.5, c: 11, f: 2.5 },
    { id: "trua", slot: "Trưa", t: "Trưa căng tin", d: "Cơm 1 nắm tay · thịt 2 lòng bàn tay · nửa đĩa rau · tránh đồ chiên", kcal: 650, p: 40, c: 75, f: 20 },
    { id: "toi", slot: "Tối", t: "Hộp tối", d: "", kcal: 650, p: 50, c: 63, f: 13 },
    { id: "phu", slot: "Phụ", t: "Bữa sau tập", d: "3 trứng + 1 hộp sữa chua không đường + 1 quả chuối", kcal: 370, p: 24, c: 33, f: 17 }
  ];
  var OTHER_HABITS = [
    { id: "buoc", t: "Đủ 8.000 bước", d: "Xem đếm bước trên điện thoại" },
    { id: "ngu", t: "Ngủ từ 7 tiếng", d: "Tính cho đêm qua" }
  ];
  var HABIT_COUNT = PLAN_MEALS.length + OTHER_HABITS.length;

  // ---------- Hộp tối ----------
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
  var CHECK_SVG = '<span class="box"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg></span>';

  // =====================================================================
  // Lưu trữ (trên máy, có sao lưu ra file)
  // =====================================================================
  var LS_KEY = "so-tap-recomp-app-v1";
  var S = blankState();

  function blankState() {
    return {
      v: 1,
      settings: { startDate: null, targets: Object.assign({}, DEFAULT_TARGETS), lastBackup: null },
      prog: { nextIndex: null, drafts: {} },
      sessions: [],      // mới nhất trước
      days: {},          // ngày -> { meals: [], c: {habitId: true}, w, waist }
      checks: {}         // việc trong lịch hộp tối
    };
  }
  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) S = migrate(JSON.parse(raw));
    } catch (e) { S = blankState(); }
  }
  function migrate(o) {
    var b = blankState();
    if (!o || typeof o !== "object") return b;
    b.settings = Object.assign(b.settings, o.settings || {});
    b.settings.targets = Object.assign({}, DEFAULT_TARGETS, (o.settings || {}).targets || {});
    b.prog = Object.assign(b.prog, o.prog || {});
    if (!b.prog.drafts) b.prog.drafts = {};
    b.sessions = Array.isArray(o.sessions) ? o.sessions : [];
    b.days = o.days && typeof o.days === "object" ? o.days : {};
    b.checks = o.checks && typeof o.checks === "object" ? o.checks : {};
    return b;
  }
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
      catch (e) { toast("Không lưu được: bộ nhớ trình duyệt đầy hoặc bị chặn."); }
    }, 150);
  }
  function flush() { clearTimeout(saveTimer); try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} }
  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });

  function day(k) {
    var d = S.days[k];
    if (!d) d = S.days[k] = { meals: [], c: {} };
    if (!d.meals) d.meals = [];
    if (!d.c) d.c = {};
    return d;
  }
  function peekDay(k) { return S.days[k] || { meals: [], c: {} }; }
  function hasData() { return S.sessions.length > 0 || Object.keys(S.days).length > 0; }

  // =====================================================================
  // Tính toán
  // =====================================================================
  function T() { return S.settings.targets; }
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
    var sets = ex.s, reps = ex.r, rest = ex.t === "C" ? "2–3 phút" : "1–1,5 phút", restSec = ex.t === "C" ? 120 : 60, fst = false;
    if (isDeload(w)) sets = Math.max(1, Math.round(ex.s * 2 / 3));
    else if (ex.fst && w >= 5) { sets = 7; reps = "8–12"; rest = "30–45 giây"; restSec = 30; fst = true; }
    return { sets: sets, reps: reps, rest: rest, restSec: restSec, fst: fst };
  }
  function nextKey() {
    var i = typeof S.prog.nextIndex === "number" ? S.prog.nextIndex : (S.sessions.length ? (ORDER.indexOf(S.sessions[0].key) + 1) % 4 : 0);
    return ORDER[((i % 4) + 4) % 4];
  }
  function draftFor(key, w) {
    var d = S.prog.drafts[key];
    if (!d) d = S.prog.drafts[key] = { checks: {}, weights: {}, warm: {} };
    d.checks = d.checks || {}; d.weights = d.weights || {}; d.warm = d.warm || {};
    PROGRAM[key].ex.forEach(function (ex) {
      var n = rx(ex, w).sets, arr = d.checks[ex.id] || [];
      if (arr.length !== n) { var a = []; for (var j = 0; j < n; j++) a.push(!!arr[j]); d.checks[ex.id] = a; }
    });
    return d;
  }
  function lastFor(exId) {
    for (var i = 0; i < S.sessions.length; i++) {
      var s = S.sessions[i], w = s.weights && s.weights[exId];
      if (typeof w === "number") return { kg: w, date: s.date, full: !!(s.full && s.full[exId]) };
    }
    return null;
  }
  function sessionsThisWeek() {
    var ws = keyOf(weekStart(new Date())), we = keyOf(addDays(weekStart(new Date()), 6));
    return S.sessions.filter(function (s) { return s.date >= ws && s.date <= we; }).length;
  }
  function boxFor(k) {
    var dd = DAY_BY_DATE[k];
    if (dd && dd.box) {
      var t = TYPES[dd.box[0]], c = Math.round(t.riceG * 0.28 + 8), f = Math.max(0, Math.round((t.k - t.p * 4 - c * 4) / 9));
      return { name: RNAME[dd.box[1]], d: t.meat + " · " + t.rice + " · " + t.oil, kcal: t.k, p: t.p, c: c, f: f };
    }
    return { name: "Hộp meal prep", d: "200g ức gà sống + 200g cơm + 300g rau + 10g dầu", kcal: 650, p: 50, c: 63, f: 13 };
  }
  function planMeal(id, k) {
    var m = PLAN_MEALS.filter(function (x) { return x.id === id; })[0];
    if (id !== "toi") return m;
    var b = boxFor(k);
    return { id: "toi", slot: "Tối", t: "Hộp tối: " + b.name, d: b.d, kcal: b.kcal, p: b.p, c: b.c, f: b.f };
  }
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
    var c1 = keyOf(addDays(t, -6)), c0 = keyOf(addDays(t, -13)), c00 = keyOf(addDays(t, -20));
    function avgBetween(a, b) { return avg(wi.filter(function (x) { return x.k >= a && x.k < b; }).map(function (x) { return x.w; })); }
    var tomorrow = keyOf(addDays(t, 1));
    return { a1: avgBetween(c1, tomorrow), a0: avgBetween(c0, c1), a00: avgBetween(c00, c0), wi: wi };
  }
  function waistList() {
    return Object.keys(S.days).filter(function (k) { return typeof S.days[k].waist === "number"; }).sort().map(function (k) { return { k: k, v: S.days[k].waist }; });
  }

  // =====================================================================
  // Giao diện
  // =====================================================================
  var UI = { tab: "today", date: todayKey(), sel: null, confirm: false, armDel: null, q: "", pick: null, prepTab: "lich", warmShow: false, banner: "" };
  var view = document.getElementById("view");

  function render() {
    var ae = document.activeElement, focusId = ae && ae.id && view.contains(ae) ? ae.id : null, ss = null, se = null;
    try { if (focusId && ae.selectionStart != null) { ss = ae.selectionStart; se = ae.selectionEnd; } } catch (e) {}

    if (UI.date > todayKey()) UI.date = todayKey();
    document.querySelectorAll("#nav button").forEach(function (b) {
      if (b.getAttribute("data-tab") === UI.tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    var h = "";
    if (UI.tab === "today") h = vToday();
    else if (UI.tab === "train") h = vTrain();
    else if (UI.tab === "food") h = vFood();
    else if (UI.tab === "prep") h = vPrep();
    else h = vProgress();
    view.innerHTML = h;
    if (UI.tab === "food") renderResults();

    if (focusId) {
      var el = document.getElementById(focusId);
      if (el) { el.focus({ preventScroll: true }); try { if (ss != null) el.setSelectionRange(ss, se); } catch (e) {} }
    }
  }

  function dateBar() {
    var t = todayKey();
    return '<div class="datebar"><button class="icon" data-act="prev" aria-label="Ngày trước">‹</button><span class="d">' + friendly(UI.date) + (UI.date === t ? "" : "") + '</span><button class="icon" data-act="next" aria-label="Ngày sau"' + (UI.date >= t ? " disabled" : "") + ">›</button></div>";
  }
  function macro(label, color, val, tgt) {
    var pct = Math.min(100, tgt ? val / tgt * 100 : 0);
    return '<div class="macro"><div class="top-line"><span>' + label + '</span><b class="num">' + Math.round(val) + "/" + tgt + 'g</b></div><div class="bar"><i style="width:' + pct + "%;background:var(" + color + ')"></i></div></div>';
  }
  function energyCard(k, withButton) {
    var d = peekDay(k), s = sum(d.meals), t = T(), left = t.kcal - Math.round(s.kcal);
    var h = '<div class="card"><div class="row between"><span class="label">Năng lượng · ' + friendly(k).toLowerCase() + "</span><span class=\"note\">Mục tiêu " + int(t.kcal) + " kcal</span></div>";
    h += '<div class="row between" style="align-items:flex-end"><div><div class="huge num">' + int(s.kcal) + '</div><div class="note">kcal đã ăn</div></div>';
    h += '<div style="text-align:right"><div class="big num" style="color:' + (left < 0 ? "var(--accent-ink)" : "var(--fg)") + '">' + (left < 0 ? "+" + int(-left) : int(left)) + '</div><div class="note">' + (left < 0 ? "kcal vượt mục tiêu" : "kcal còn lại") + "</div></div></div>";
    h += '<div class="meter' + (left < 0 ? " over" : "") + '"><i style="width:' + Math.min(100, s.kcal / t.kcal * 100) + '%"></i></div>';
    h += '<div class="grid3">' + macro("Đạm", "--accent", s.p, t.p) + macro("Tinh bột", "--blue", s.c, t.c) + macro("Chất béo", "--fat", s.f, t.f) + "</div>";
    if (withButton) h += '<button class="btn ghost sm" data-goto="food" style="align-self:flex-start">+ Thêm món ngoài kế hoạch</button>';
    return h + "</div>";
  }

  // ---------- Hôm nay ----------
  function vToday() {
    var k = UI.date, d = peekDay(k), w = currentWeek(), nk = nextKey(), count = sessionsThisWeek(), h = "";
    if (!S.settings.startDate) {
      h += '<div class="card"><h2>Bắt đầu</h2><p class="note">Chọn ngày bắt đầu giáo án (tuần 1). App dùng ngày này để tính tuần giảm tải và lúc bật FST-7.</p>';
      h += '<div class="row"><input type="date" id="startDate" value="' + todayKey() + '" style="flex:1"><button class="btn sm" data-act="save-start">Lưu</button></div></div>';
    }
    if (UI.banner) h += '<div class="phase good">' + esc(UI.banner) + "</div>";
    h += dateBar();
    h += energyCard(k, true);

    // Checklist
    h += '<div class="card"><div class="row between"><h2>Kế hoạch trong ngày</h2><span class="note num">' + habitsDone(k) + "/" + HABIT_COUNT + "</span></div><div>";
    PLAN_MEALS.forEach(function (m0) {
      var m = planMeal(m0.id, k), on = d.meals.some(function (x) { return x.q === m.id; });
      h += '<button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="plan" data-v="' + m.id + '">' + CHECK_SVG + '<span><span class="t">' + esc(m.t) + '</span><br><span class="d">' + esc(m.d) + '</span></span><span class="kc num">' + m.kcal + " kcal</span></button>";
    });
    OTHER_HABITS.forEach(function (x) {
      var on = !!d.c[x.id];
      h += '<button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="habit" data-v="' + x.id + '">' + CHECK_SVG + '<span><span class="t">' + x.t + '</span><br><span class="d">' + x.d + "</span></span></button>";
    });
    h += "</div></div>";

    // Workout card
    h += '<div class="strip"><div class="cell"><span class="label">Tuần</span><span class="big num">' + w + '</span></div><div class="cell"><span class="label">Buổi tuần này</span><span class="big num">' + count + '<span class="muted" style="font-size:18px"> /5</span></span></div><div class="cell"><span class="label">Buổi kế tiếp</span><span class="big">' + PROGRAM[nk].name + "</span></div></div>";
    var trained = S.sessions.some(function (s) { return s.date === k; });
    if (k === todayKey()) {
      h += trained ? '<div class="phase good"><b>Đã tập hôm nay.</b> Nhớ ăn bữa sau tập và ngủ sớm.</div>'
        : '<button class="btn dark" data-goto="train">Vào buổi ' + PROGRAM[nk].name + "</button>";
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
      h += '<div class="day' + (dk === k ? " now" : "") + '"><div class="sq"><i style="height:' + Math.round(n / HABIT_COUNT * 100) + '%"></i></div><span>' + WD[parseKey(dk).getDay()] + '</span><span class="num">' + n + "/" + HABIT_COUNT + "</span></div>";
    }
    h += "</div></div>";
    return h;
  }

  // ---------- Tập ----------
  function vTrain() {
    var w = currentWeek(), ph = phaseInfo(w), nk = nextKey(), count = sessionsThisWeek();
    if (!UI.sel) UI.sel = nk;
    var key = UI.sel, P = PROGRAM[key], d = draftFor(key, w), h = "";
    h += '<div class="phase ' + ph.cls + '"><b>Tuần ' + w + " · " + ph.t + ":</b> " + ph.d + "</div>";
    if (count >= 5) h += '<div class="phase warn"><b>Đủ 5 buổi tạ tuần này.</b> Ngày còn lại đi bộ dốc hoặc đạp xe nhẹ 40–45 phút, hoặc nghỉ hẳn.</div>';
    h += '<div class="pick">';
    ORDER.forEach(function (k) {
      h += '<button class="chip" aria-pressed="' + (k === key) + '" data-act="sel" data-v="' + k + '"><span class="k">' + PROGRAM[k].name + '</span><span class="s">' + PROGRAM[k].sub + "</span>" + (k === nk ? '<span class="tag">Kế tiếp</span>' : "") + "</button>";
    });
    h += "</div>";

    var done = 0, total = 0;
    P.ex.forEach(function (ex) { d.checks[ex.id].forEach(function (c) { total++; if (c) done++; }); });
    h += '<div class="progress"><div class="bar"><i style="width:' + (total ? Math.round(done / total * 100) : 0) + '%"></i></div><span class="num">' + done + "/" + total + " hiệp</span></div>";

    var wl = WARM[key], wd = wl.filter(function (x) { return d.warm[x.id]; }).length, wDone = wd === wl.length;
    h += '<div class="card"><div class="row between"><h2>Khởi động · khoảng 5 phút</h2><span class="note num">' + wd + "/" + wl.length + "</span></div>";
    if (wDone && !UI.warmShow) h += '<button class="btn ghost sm" data-act="warm-show">Đã khởi động xong · Xem lại</button>';
    else {
      wl.forEach(function (x) {
        var on = !!d.warm[x.id];
        h += '<div class="warm-row"><button class="check' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-act="warm" data-v="' + x.id + '">' + CHECK_SVG + '<span><span class="t">' + esc(x.n) + '</span><br><span class="d">' + esc(x.d) + "</span></span></button></div>";
      });
      h += '<p class="note">Bài compound thứ 2 trở đi: làm 1 hiệp 60% × 6 trước hiệp chính. Giãn cơ tĩnh để dành cho sau buổi tập.</p>';
    }
    h += "</div>";

    P.ex.forEach(function (ex) {
      var r = rx(ex, w), checks = d.checks[ex.id], allDone = checks.every(Boolean), last = lastFor(ex.id);
      h += '<div class="ex' + (allDone ? " done" : "") + '"><div class="ex-head"><div style="min-width:0"><div class="ex-name"><a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.q) + '" target="_blank" rel="noopener">' + esc(ex.n) + "</a></div>";
      h += '<div class="ex-rx"><b>' + r.sets + " × " + r.reps + "</b> · nghỉ " + r.rest + "</div>" + (ex.note ? '<p class="ex-note">' + esc(ex.note) + "</p>" : "") + "</div>";
      h += '<div class="pills"><span class="pill ' + (ex.t === "C" ? "c" : "i") + '">' + (ex.t === "C" ? "Compound" : "Cô lập") + "</span>" + (r.fst ? '<span class="pill f">FST-7</span>' : "") + "</div></div>";
      h += '<div class="sets">';
      checks.forEach(function (c, j) {
        h += '<button class="set' + (c ? " on" : "") + '" aria-pressed="' + c + '" aria-label="Hiệp ' + (j + 1) + '" data-act="set" data-ex="' + ex.id + '" data-i="' + j + '">' + (j + 1) + "</button>";
      });
      var val = d.weights[ex.id] != null ? d.weights[ex.id] : "";
      h += '<label class="kg"><input id="kg-' + key + "-" + ex.id + '" inputmode="decimal" placeholder="' + (last ? fmt(last.kg) : "kg") + '" value="' + esc(val) + '" data-act="kg" data-ex="' + ex.id + '" aria-label="Mức tạ ' + esc(ex.n) + ' (kg)"><small>kg</small></label></div>';
      if (last) {
        var step = ex.db ? 2 : 2.5, tip = "";
        if (w >= 5 && !isDeload(w) && last.full) tip = " → nếu mọi hiệp đã chạm đỉnh " + r.reps + " rep, thử <b>" + fmt(last.kg + step) + " kg</b>";
        else if (isDeload(w)) tip = " → tuần giảm tải: giữ <b>" + fmt(last.kg) + " kg</b>";
        h += '<p class="hint">Lần trước: <b>' + fmt(last.kg) + " kg</b> (" + shortDate(last.date) + (last.full ? ", đủ hiệp" : "") + ")" + tip + "</p>";
      }
      h += "</div>";
    });

    if (UI.confirm) {
      h += '<div class="confirm"><p>Còn <b>' + (total - done) + ' hiệp</b> chưa tick. Vẫn lưu buổi này?</p><div class="row"><button class="btn" data-act="finish-yes">Lưu buổi tập</button><button class="btn ghost" data-act="finish-no">Tập tiếp</button></div></div>';
    } else {
      h += '<button class="btn" data-act="finish"' + (done ? "" : " disabled") + ">Hoàn thành " + P.name + "</button>";
    }
    h += '<p class="note">Bấm tên bài để xem video kỹ thuật. Bấm số hiệp khi xong, đồng hồ nghỉ tự chạy.</p>';
    return h;
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

    var slotSel = function (id) {
      var def = defaultSlot();
      return '<select id="' + id + '">' + SLOTS.map(function (s) { return "<option" + (s === def ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select>";
    };
    h += '<div class="card"><h2>Thêm món</h2><input id="q" placeholder="Tìm: phở, cơm, ức gà, trứng…" value="' + esc(UI.q) + '" autocomplete="off" aria-label="Tìm món">';
    h += '<div class="results" id="results"></div><div class="grid2"><label class="field">Số phần<input id="qty" inputmode="decimal" value="1"></label><label class="field">Bữa' + slotSel("slotA") + "</label></div>";
    h += '<button class="btn dark" data-act="addfood">Thêm món đã chọn</button><p class="note">Số liệu là ước tính trung bình cho khẩu phần thường gặp.</p></div>';

    h += '<details class="card"><summary>Tự nhập số liệu</summary><label class="field">Tên món<input id="cName"></label><div class="grid2">';
    h += '<label class="field">Calo (kcal)<input id="cK" inputmode="decimal"></label><label class="field">Đạm (g)<input id="cP" inputmode="decimal"></label>';
    h += '<label class="field">Tinh bột (g)<input id="cC" inputmode="decimal"></label><label class="field">Chất béo (g)<input id="cF" inputmode="decimal"></label></div>';
    h += '<label class="field">Bữa' + slotSel("slotC") + '</label><button class="btn dark" data-act="addcustom">Thêm</button></details>';
    return h;
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

  // ---------- Hộp tối ----------
  function prepTasks(dd) {
    var out = [];
    if (dd.box) {
      var t = TYPES[dd.box[0]];
      out.push({ key: dd.d + ":box", box: true, k: "eat", kl: "Hộp tối", t: RNAME[dd.box[1]], s: t.meat + " · " + t.rice + " · " + t.oil + " · ≈" + t.p + "g đạm, " + t.k + " kcal" });
    }
    if (dd.veg) out.push({ key: dd.d + ":veg", k: "veg", kl: "Rau hôm nay", t: dd.veg, s: "Mua và luộc hoặc xào ngay khi ăn" });
    if (dd.thaw) out.push({ key: dd.d + ":thaw", k: "thaw", kl: "Tối nay rã đông", t: "Chuyển xuống ngăn mát", s: dd.thaw });
    (dd.tasks || []).forEach(function (x) { out.push({ key: dd.d + ":" + x.id, k: x.k, kl: x.id === "mua" ? "Đi chợ" : x.id === "nau" ? "Nấu" : "Việc", t: x.t, s: x.s }); });
    return out;
  }
  function taskOn(x) { return x.box ? peekDay(x.key.slice(0, 10)).meals.some(function (m) { return m.q === "toi"; }) : !!S.checks[x.key]; }
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
    var eaten = DAYS.filter(function (d) { return d.box && peekDay(d.d).meals.some(function (m) { return m.q === "toi"; }); }).length;
    var nextPrep = DAYS.filter(function (d) { return d.prep && d.d >= today && !S.checks[d.d + ":nau"]; })[0];
    var nextBox = DAYS.filter(function (d) { return d.box && d.d >= today; })[0];
    h += '<div class="strip"><div class="cell"><span class="label">Hộp đã ăn</span><span class="big num">' + eaten + '<span class="muted" style="font-size:18px"> /14</span></span></div>';
    h += '<div class="cell"><span class="label">Đợt nấu tới</span><span class="mid">' + (nextPrep ? "Đợt " + nextPrep.prep + " · " + shortDate(nextPrep.d) : "Đã nấu hết") + "</span></div>";
    h += '<div class="cell"><span class="label">Hộp kế tiếp</span><span class="mid">' + (nextBox ? esc(RNAME[nextBox.box[1]]) : "Hết chu kỳ") + "</span></div></div>";
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
    var tr = trend(), wi = tr.wi, waists = waistList(), t = T(), h = "";
    var lb = S.settings.lastBackup;
    if (hasData() && (!lb || (Date.now() - lb) > 14 * 86400000)) {
      h += '<div class="phase warn"><b>Nên sao lưu.</b> Dữ liệu chỉ nằm trên điện thoại này. ' + (lb ? "Lần sao lưu gần nhất: " + new Date(lb).toLocaleDateString("vi-VN") + "." : "Bạn chưa sao lưu lần nào.") + ' <button class="btn sm dark" data-act="backup" style="margin-top:8px">Sao lưu ngay</button></div>';
    }

    h += '<div class="card"><h2>Cân nặng</h2>';
    if (!wi.length) h += '<p class="empty">Chưa có số cân. Ghi cân buổi sáng ở mục Hôm nay, sau 1–2 tuần biểu đồ sẽ hiện ở đây.</p>';
    else {
      h += '<div class="row" style="gap:18px;align-items:flex-end"><div><span class="label">TB 7 ngày</span><div class="big num">' + (tr.a1 != null ? fmt(tr.a1) : "–") + ' <span style="font-size:16px">kg</span></div></div>';
      if (tr.a1 != null && tr.a0 != null) {
        var dl = tr.a1 - tr.a0, ok = dl <= -0.3 && dl >= -0.6;
        h += '<div><span class="label">So với tuần trước</span><div class="big num" style="color:' + (ok ? "var(--good)" : "var(--fg)") + '">' + (dl > 0 ? "+" : "") + fmt(dl) + ' <span style="font-size:16px">kg</span></div><div class="note">' + (ok ? "Đúng nhịp 0,3–0,6 kg/tuần" : dl < -0.6 ? "Giảm nhanh hơn mục tiêu" : "Chậm hơn mục tiêu 0,3–0,6 kg/tuần") + "</div></div>";
      }
      if (waists.length) h += '<div><span class="label">Vòng bụng</span><div class="big num">' + fmt(waists[waists.length - 1].v) + ' <span style="font-size:16px">cm</span></div><div class="note">' + shortDate(waists[waists.length - 1].k) + "</div></div>";
      h += "</div>" + lineChart(wi.slice(-45).map(function (x) { return { k: x.k, v: x.w }; }), "kg");
    }
    h += "</div>";

    // Quy tắc điều chỉnh: 2 tuần liền cả cân và vòng bụng không giảm
    if (tr.a1 != null && tr.a0 != null && tr.a00 != null && waists.length >= 3) {
      var noWeight = tr.a1 >= tr.a0 && tr.a0 >= tr.a00, wl = waists.slice(-3), noWaist = wl[2].v >= wl[1].v && wl[1].v >= wl[0].v;
      if (noWeight && noWaist) h += '<div class="phase warn"><b>Đến lúc điều chỉnh:</b> 2 tuần liền cả cân và vòng bụng không giảm. Bớt khoảng 50g cơm bữa tối (≈65 kcal) và đi thêm 2.000 bước mỗi ngày.</div>';
    }

    // Calo 7 ngày
    var today = todayKey(), last7 = [];
    for (var i = 6; i >= 0; i--) last7.push(shiftKey(today, -i));
    var kc = last7.map(function (k) { return sum(peekDay(k).meals); });
    var logged = kc.filter(function (x) { return x.kcal > 0; });
    h += '<div class="card"><div class="row between"><h2>Calo 7 ngày</h2>' + (logged.length ? '<span class="note num">TB ' + int(avg(logged.map(function (x) { return x.kcal; }))) + " kcal · " + int(avg(logged.map(function (x) { return x.p; }))) + "g đạm</span>" : "") + "</div>" + barChart(last7, kc.map(function (x) { return x.kcal; }), t.kcal) + "</div>";

    // Lịch sử buổi tập
    var vol = S.sessions.length;
    h += '<div class="card"><div class="row between"><h2>Các buổi đã tập</h2><span class="note num">' + vol + " buổi</span></div><div>";
    if (!vol) h += '<p class="empty">Chưa có buổi nào. Tick hiệp ở mục Tập rồi bấm "Hoàn thành" để lưu buổi đầu tiên.</p>';
    S.sessions.slice(0, 80).forEach(function (s) {
      var P = PROGRAM[s.key], parts = [];
      if (P) P.ex.forEach(function (ex) { if (ex.t === "C" && s.weights && typeof s.weights[ex.id] === "number") parts.push(ex.n + " " + fmt(s.weights[ex.id]) + "kg"); });
      h += '<div class="h-row"><div style="min-width:0"><p class="h-title">' + shortDate(s.date) + " · " + (P ? P.name : esc(s.key)) + '</p><p class="h-sub">Tuần ' + s.week + " · " + s.done + "/" + s.total + " hiệp" + (parts.length ? " · " + esc(parts.join(", ")) : "") + "</p></div>";
      h += '<button class="h-del' + (UI.armDel === s.id ? " arm" : "") + '" data-act="del" data-v="' + esc(s.id) + '">' + (UI.armDel === s.id ? "Bấm lần nữa để xoá" : "Xoá") + "</button></div>";
    });
    h += "</div></div>";
    return h;
  }
  function lineChart(pts, unit) {
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
    var ticks = [mn, (mn + mx) / 2, mx], lp = pts[pts.length - 1];
    var g = ticks.map(function (t) { return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(t).toFixed(1) + '" y2="' + Y(t).toFixed(1) + '" stroke="var(--line)"/><text x="' + (L - 6) + '" y="' + (Y(t) + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="var(--muted)">' + fmt(t) + "</text>"; }).join("");
    return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Biểu đồ cân nặng">' + g +
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

  // ---------- Cài đặt ----------
  var sheet = document.getElementById("sheet"), sheetBody = document.getElementById("sheet-body");
  function openSettings() {
    var t = T(), lb = S.settings.lastBackup, h = "";
    h += '<div class="row between"><h2 id="sheet-title">Cài đặt</h2><button class="x" data-act="close" aria-label="Đóng">✕</button></div>';
    h += '<div class="card"><h2>Giáo án</h2><label class="field">Ngày bắt đầu tuần 1<input type="date" id="setStart" value="' + (S.settings.startDate || todayKey()) + '"></label></div>';
    h += '<div class="card"><h2>Mục tiêu mỗi ngày</h2><div class="grid2">';
    h += '<label class="field">Calo (kcal)<input id="setK" inputmode="numeric" value="' + t.kcal + '"></label><label class="field">Đạm (g)<input id="setP" inputmode="numeric" value="' + t.p + '"></label>';
    h += '<label class="field">Tinh bột (g)<input id="setC" inputmode="numeric" value="' + t.c + '"></label><label class="field">Chất béo (g)<input id="setF" inputmode="numeric" value="' + t.f + '"></label></div>';
    h += '<p class="note">Mặc định theo kế hoạch Recomp: 2.150 kcal · 140g đạm · 250g tinh bột · 65g béo.</p><button class="btn dark" data-act="save-settings">Lưu cài đặt</button></div>';
    h += '<div class="card"><h2>Sao lưu dữ liệu</h2><p class="note">Dữ liệu nằm trên điện thoại này. Sao lưu ra file rồi lưu vào Drive, Zalo "Cloud của tôi" hoặc gửi mail cho chính mình. Đổi máy thì dùng "Khôi phục" để nạp lại.' + (lb ? " Lần gần nhất: " + new Date(lb).toLocaleString("vi-VN") + "." : "") + '</p>';
    h += '<div class="grid2"><button class="btn" data-act="backup">Sao lưu</button><button class="btn ghost" data-act="restore">Khôi phục</button></div></div>';
    h += '<div class="card"><h2>Cài app lên điện thoại</h2><ul class="plain"><li><b>iPhone:</b> mở bằng Safari → nút Chia sẻ → "Thêm vào MH chính".</li><li><b>Android:</b> mở bằng Chrome → menu ⋮ → "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".</li></ul></div>';
    h += '<div class="card"><h2>Xoá toàn bộ</h2><p class="note">Xoá mọi buổi tập, món ăn và số đo trên máy này.</p><button class="btn ghost" data-act="wipe" id="wipeBtn">Xoá toàn bộ dữ liệu</button></div>';
    h += '<p class="note" style="text-align:center">Sổ Tập Recomp · bản 1.0</p>';
    sheetBody.innerHTML = h;
    sheet.hidden = false;
  }
  function closeSettings() { sheet.hidden = true; }

  function backup() {
    flush();
    var data = JSON.stringify(Object.assign({ app: "so-tap-recomp", exportedAt: new Date().toISOString() }, S), null, 1);
    var name = "so-tap-" + todayKey() + ".json";
    var blob = new Blob([data], { type: "application/json" });
    var done = function () { S.settings.lastBackup = Date.now(); save(); toast("Đã tạo file sao lưu " + name); render(); if (!sheet.hidden) openSettings(); };
    try {
      var file = new File([blob], name, { type: "application/json" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Sao lưu Sổ Tập" }).then(done).catch(function (e) { if (e && e.name !== "AbortError") download(blob, name, done); });
        return;
      }
    } catch (e) {}
    download(blob, name, done);
  }
  function download(blob, name, cb) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    cb();
  }
  var importInput = document.getElementById("importFile");
  importInput.addEventListener("change", function () {
    var f = importInput.files && importInput.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result);
        if (!o || o.app !== "so-tap-recomp") throw new Error("bad");
        S = migrate(o); flush(); closeSettings(); UI.sel = null; render();
        toast("Đã khôi phục: " + S.sessions.length + " buổi tập, " + Object.keys(S.days).length + " ngày ghi chép");
      } catch (e) { toast("File này không phải bản sao lưu của Sổ Tập."); }
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
    if (e.target === sheet) return closeSettings();
    var b = e.target.closest("[data-act]"); if (!b) return;
    var a = b.getAttribute("data-act");
    if (a === "close") closeSettings();
    else if (a === "save-settings") {
      var k = num(document.getElementById("setK").value), p = num(document.getElementById("setP").value), c = num(document.getElementById("setC").value), f = num(document.getElementById("setF").value);
      if (!(k >= 1000 && k <= 5000) || !(p > 0) || !(c >= 0) || !(f > 0)) { toast("Kiểm tra lại số: calo từ 1.000 đến 5.000, các chất phải lớn hơn 0."); return; }
      S.settings.targets = { kcal: Math.round(k), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
      var sd = document.getElementById("setStart").value; if (sd) S.settings.startDate = sd;
      save(); closeSettings(); render(); toast("Đã lưu cài đặt");
    }
    else if (a === "backup") backup();
    else if (a === "restore") importInput.click();
    else if (a === "wipe") {
      if (b.getAttribute("data-armed")) { S = blankState(); flush(); closeSettings(); UI.sel = null; render(); toast("Đã xoá toàn bộ dữ liệu"); }
      else { b.setAttribute("data-armed", "1"); b.textContent = "Bấm lần nữa để xoá hẳn"; b.style.color = "var(--accent-ink)"; }
    }
  });

  view.addEventListener("click", function (e) {
    var go = e.target.closest("[data-goto]");
    if (go) { UI.tab = go.getAttribute("data-goto"); if (UI.tab === "train") UI.sel = null; render(); window.scrollTo(0, 0); return; }
    var pk = e.target.closest("[data-pick]");
    if (pk) { UI.pick = +pk.getAttribute("data-pick"); renderResults(); return; }
    var b = e.target.closest("[data-act]"); if (!b || b.tagName === "INPUT" || b.tagName === "SELECT") return;
    var a = b.getAttribute("data-act"), v = b.getAttribute("data-v"), w = currentWeek();

    if (a === "prev") { UI.date = shiftKey(UI.date, -1); render(); }
    else if (a === "next") { if (UI.date < todayKey()) { UI.date = shiftKey(UI.date, 1); render(); } }
    else if (a === "save-start") { var sd = document.getElementById("startDate").value; if (sd) { S.settings.startDate = sd; save(); render(); toast("Đã lưu ngày bắt đầu"); } }
    else if (a === "plan") { togglePlan(UI.date, v); }
    else if (a === "habit") { var d = day(UI.date); d.c[v] = !d.c[v]; save(); render(); }
    else if (a === "sel") { UI.sel = v; UI.confirm = false; render(); }
    else if (a === "warm") { var dw = draftFor(UI.sel, w); dw.warm[v] = !dw.warm[v]; save(); render(); }
    else if (a === "warm-show") { UI.warmShow = !UI.warmShow; render(); }
    else if (a === "set") {
      var exId = b.getAttribute("data-ex"), i = +b.getAttribute("data-i"), dr = draftFor(UI.sel, w);
      dr.checks[exId][i] = !dr.checks[exId][i];
      if (dr.checks[exId][i]) {
        var ex = PROGRAM[UI.sel].ex.filter(function (x) { return x.id === exId; })[0], r = rx(ex, w);
        startTimer(r.restSec, ex.n + " · hiệp " + (i + 1) + "/" + r.sets + " · nghỉ " + r.rest);
      }
      save(); render();
    }
    else if (a === "finish") {
      var d2 = draftFor(UI.sel, w), dn = 0, tt = 0;
      PROGRAM[UI.sel].ex.forEach(function (ex) { d2.checks[ex.id].forEach(function (c) { tt++; if (c) dn++; }); });
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
  });

  view.addEventListener("input", function (e) {
    var t = e.target, a = t.getAttribute && t.getAttribute("data-act");
    if (t.id === "q") { UI.q = t.value; UI.pick = null; renderResults(); return; }
    if (a === "kg") { draftFor(UI.sel, currentWeek()).weights[t.getAttribute("data-ex")] = t.value.trim(); save(); }
    else if (a === "measure") { var d = day(UI.date), n = num(t.value); d[t.getAttribute("data-v")] = n; save(); }
  });

  function togglePlan(k, id) {
    var d = day(k), idx = -1;
    d.meals.forEach(function (m, i) { if (m.q === id) idx = i; });
    if (idx >= 0) d.meals.splice(idx, 1);
    else { var m = planMeal(id, k); d.meals.push({ id: uid(), q: id, slot: m.slot, name: m.t, kcal: m.kcal, p: m.p, c: m.c, f: m.f }); }
    save(); render();
  }

  function finish() {
    var w = currentWeek(), key = UI.sel, d = draftFor(key, w), dn = 0, tt = 0, weights = {}, full = {};
    PROGRAM[key].ex.forEach(function (ex) {
      var c = d.checks[ex.id];
      c.forEach(function (x) { tt++; if (x) dn++; });
      if (c.every(Boolean)) full[ex.id] = true;
      var n = num(d.weights[ex.id]);
      if (n == null) { var l = lastFor(ex.id); if (l && c.some(Boolean)) n = l.kg; }
      if (n != null) weights[ex.id] = n;
    });
    var now = Date.now();
    S.sessions.unshift({ id: "s" + now, date: todayKey(), ts: now, key: key, week: w, done: dn, total: tt, weights: weights, full: full });
    S.prog.drafts[key] = null;
    S.prog.nextIndex = (ORDER.indexOf(key) + 1) % 4;
    UI.confirm = false; UI.sel = null;
    stopTimer(); flush();
    UI.tab = "today"; UI.date = todayKey();
    UI.banner = "Đã lưu " + PROGRAM[key].name + " (" + dn + "/" + tt + " hiệp). Buổi tiếp theo: " + PROGRAM[ORDER[S.prog.nextIndex]].name + ". Nhớ tick bữa sau tập.";
    render(); window.scrollTo(0, 0);
  }

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
