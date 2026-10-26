// Cơ sở dữ liệu FitCore: thực phẩm, món ăn Việt và bài tập.
// Thực phẩm thô: giá trị gần đúng theo Bảng thành phần thực phẩm Việt Nam (Viện Dinh dưỡng) và USDA FoodData Central.
// Món nấu sẵn: ước tính theo công thức và khẩu phần phổ biến, sai số lớn hơn.
(function (root) {
  "use strict";

  var GROUPS = {
    thit: "Thịt, trứng", hai: "Cá, hải sản", dau: "Đậu, hạt", sua: "Sữa, đạm bổ sung", tb: "Cơm, tinh bột", rau: "Rau củ",
    qua: "Trái cây", gv: "Dầu, gia vị", uong: "Đồ uống", mon: "Món Việt", vat: "Ăn vặt, bánh kẹo"
  };

  // Mỗi dòng: mã | tên | nhóm | kcal | đạm | tinh bột | béo (tính trên 100g, đồ uống trên 100ml) | đơn vị "tên:gram" cách nhau bởi "/" (đơn vị đầu là mặc định) | tên gọi khác
  var RAW = [
    // ---- Thịt, trứng ----
    "bo_than|Thịt bò thăn (sống)|thit|140|21|0|6|lạng:100/miếng vừa:80|bo, thit bo, bo than, beef",
    "bo_bap|Thịt bò bắp (sống)|thit|125|21.5|0|4|lạng:100|bo bap, bap bo",
    "bo_bachi|Ba chỉ bò (sống)|thit|250|17|0|20|lạng:100|ba roi bo, bo my, ba chi bo",
    "bo_xay|Bò xay (sống)|thit|215|18|0|15|lạng:100|thit bo xay, bo bam",
    "bo_chin|Thịt bò nạc (chín)|thit|210|30|0|9|lạng:100/miếng vừa:60|bo nuong, bo luoc, bo xao, beef cooked",
    "lon_nac|Thịt lợn nạc thăn (sống)|thit|140|20|0|6.5|lạng:100|lon nac, thit nac, than lon, heo nac, thit heo",
    "lon_vai|Nạc vai lợn (sống)|thit|190|18|0|13|lạng:100|nac vai, vai heo",
    "lon_bachi|Ba chỉ lợn (sống)|thit|390|14|0|37|lạng:100/miếng:40|ba chi, ba roi, thit ba chi, heo ba roi",
    "lon_suon|Sườn lợn (phần ăn được)|thit|290|18|0|24|lạng:100/miếng:50|suon, suon heo, suon non",
    "lon_xay|Thịt lợn xay (sống)|thit|260|17|0|21|lạng:100|thit xay, thit bam, heo xay",
    "lon_luoc|Thịt lợn luộc (vai, ba chỉ)|thit|260|18|0|21|lạng:100/miếng:30|thit luoc, heo luoc",
    "ga_uc|Ức gà bỏ da (sống)|thit|120|22.5|0|2.6|lạng:100/miếng ức:200|uc ga, ga, thit ga, chicken breast",
    "ga_uc_chin|Ức gà (chín)|thit|165|31|0|3.6|lạng:100|uc ga luoc, uc ga nuong, ga luoc",
    "ga_dui|Đùi gà bỏ da (sống)|thit|125|19.5|0|5|lạng:100/đùi to:200|dui ga, chicken thigh",
    "ga_dui_da|Đùi gà có da (sống)|thit|220|17|0|16|lạng:100/đùi to:230|dui ga ca da",
    "ga_dui_chin|Đùi gà bỏ da (chín)|thit|180|25|0|8|lạng:100/đùi:150|dui ga nuong, dui ga luoc",
    "ga_canh|Cánh gà có da (sống)|thit|200|17.5|0|14|cái:45/lạng:100|canh ga, chicken wing",
    "ga_ta|Gà ta có da (luộc)|thit|200|25|0|11|lạng:100/miếng:40|ga ta, ga luoc ca da",
    "vit|Thịt vịt có da|thit|270|17.5|0|22|lạng:100/miếng:40|vit, thit vit, vit quay",
    "trung|Trứng gà|thit|143|12.6|0.7|9.5|quả:50/lạng:100|trung, trung ga, egg, trung luoc",
    "trung_trang|Lòng trắng trứng gà|thit|52|10.9|0.7|0.2|quả:33|long trang, egg white",
    "trung_vit|Trứng vịt|thit|185|12.8|1.5|13.8|quả:70|trung vit, hot vit lon",
    "trung_cut|Trứng cút|thit|158|13|0.4|11|quả:10|trung cut",
    "trung_chien|Trứng chiên / ốp la|thit|196|13.6|0.8|15|quả:55|trung chien, trung op la, trung ran",
    "gan_lon|Gan lợn|thit|134|21|2.5|3.6|lạng:100|gan heo, gan",
    "gan_ga|Gan gà|thit|119|17|0.7|4.8|lạng:100|gan ga",
    "xucxich|Xúc xích|thit|300|12|3|27|cái:40|xuc xich, lap xuong, sausage",
    "baconn|Thịt xông khói|thit|400|13|1.4|38|lát:15|bacon, thit xong khoi",
    "gio_lua|Giò lụa / chả lụa|thit|180|16|3|11|lát:30/khoanh:100|gio lua, cha lua, gio",
    "cha_que|Chả quế / chả chiên|thit|300|14|8|24|miếng:40|cha que, cha chien",
    "nem_chua|Nem chua|thit|140|20|5|4|cái:25|nem chua",
    "ruoc|Ruốc (chà bông) lợn|thit|396|46|20|14|thìa canh:10|ruoc, cha bong",
    // ---- Cá, hải sản ----
    "ca_basa|Cá basa phi lê (sống)|hai|90|15|0|3.5|lạng:100/miếng:150|basa, ca basa, ca tra",
    "ca_rophi|Cá rô phi / diêu hồng (sống)|hai|96|20|0|1.7|lạng:100|ro phi, dieu hong, tilapia",
    "ca_thu|Cá thu (sống)|hai|160|20|0|9|lạng:100/khúc:120|ca thu, mackerel",
    "ca_hoi|Cá hồi (sống)|hai|208|20|0|13|lạng:100/miếng:150|ca hoi, salmon",
    "ca_ngu|Cá ngừ tươi|hai|130|28|0|1|lạng:100|ca ngu, tuna",
    "ca_ngu_hop|Cá ngừ hộp ngâm nước|hai|116|26|0|0.8|hộp (cái):120|ca ngu hop, tuna can",
    "ca_ngu_hopdau|Cá ngừ hộp ngâm dầu|hai|198|29|0|8|hộp (cái):120|ca ngu dau",
    "ca_chep|Cá chép / trắm (sống)|hai|120|18|0|5|lạng:100|ca chep, ca tram",
    "ca_kho|Cá kho (thu, basa)|hai|150|16|5|7|khúc:120|ca kho, ca kho to",
    "tom|Tôm bóc vỏ (sống)|hai|85|18|0.9|1|lạng:100/con to:20|tom, shrimp, tom luoc",
    "muc|Mực (sống)|hai|92|15.6|3|1.4|lạng:100|muc, squid",
    "cua|Thịt cua|hai|87|18|0|1.1|lạng:100|cua, ghe",
    "ngao|Ngao / nghêu (thịt)|hai|74|12.8|2.6|1|lạng:100|ngao, ngheu, so",
    "hau|Hàu|hai|81|9.5|4.7|2.3|con:15/lạng:100|hau, oc",
    // ---- Đậu, hạt ----
    "dauphu|Đậu phụ|dau|90|10|2|5|bìa:150/lạng:100|dau phu, dau hu, tau hu, tofu",
    "dauphu_ran|Đậu phụ rán|dau|270|17|10|20|miếng:30/lạng:100|dau ran, dau hu chien",
    "dau_xanh|Đậu xanh (khô)|dau|347|23|63|1.2|lạng:100|dau xanh",
    "dau_den|Đậu đen (khô)|dau|341|21.6|62|1.4|lạng:100|dau den",
    "dau_nanh|Đậu nành (khô)|dau|446|36|30|20|lạng:100|dau nanh, dau tuong",
    "lac|Lạc (đậu phộng)|dau|567|26|16|49|nắm:30|lac, dau phong, peanut",
    "hat_dieu|Hạt điều|dau|553|18|30|44|nắm:30|hat dieu, cashew",
    "hanh_nhan|Hạnh nhân|dau|579|21|22|50|nắm:30|hanh nhan, almond",
    "oc_cho|Óc chó|dau|654|15|14|65|nắm:30|oc cho, walnut",
    "hat_chia|Hạt chia|dau|486|17|42|31|thìa canh:12|hat chia, chia",
    "bo_lac|Bơ lạc|dau|588|25|20|50|thìa canh:16|bo dau phong, peanut butter",
    // ---- Sữa, đạm bổ sung ----
    "sua_kd|Sữa tươi không đường|sua|61|3.2|4.8|3.3|hộp 180ml:180/cốc:250|sua tuoi, sua khong duong, milk",
    "sua_cd|Sữa tươi có đường|sua|77|3|9|3.2|hộp 180ml:180|sua co duong",
    "sua_tachbeo|Sữa tách béo|sua|34|3.4|5|0.1|hộp 180ml:180|sua tach beo, skim milk",
    "suachua_kd|Sữa chua không đường|sua|61|3.5|4.7|3.3|hộp:100|sua chua, yogurt, yaourt",
    "suachua_cd|Sữa chua có đường|sua|95|3.3|15|2.5|hộp:100|sua chua co duong",
    "suachua_hylap|Sữa chua Hy Lạp không béo|sua|59|10|3.6|0.4|hộp:100|greek yogurt, sua chua hy lap",
    "phomai|Phô mai lát|sua|330|18|5|26|lát:20|pho mai, cheese",
    "phomai_bcl|Phô mai con bò cười|sua|240|10|6|20|miếng:15|bo cuoi, laughing cow",
    "whey|Whey protein (bột)|sua|400|80|8|5|muỗng:30|whey, protein, sua whey",
    "sua_dac|Sữa đặc có đường|sua|321|7.9|54|8.7|thìa canh:20|sua dac, ong tho",
    "sua_daunanh|Sữa đậu nành không đường|sua|33|3.3|1.8|1.6|cốc:300/hộp:200|sua dau nanh, soy milk",
    "sua_daunanh_cd|Sữa đậu nành có đường|sua|50|3|6|1.6|cốc:300/hộp:200|sua dau nanh co duong",
    // ---- Cơm, tinh bột ----
    "com|Cơm trắng|tb|130|2.7|28|0.3|chén:150/bát:150/bát to:250/nắm tay:150|com, com trang, rice",
    "com_lut|Cơm gạo lứt|tb|112|2.3|24|0.8|chén:150|gao lut, com lut",
    "gao|Gạo trắng (sống)|tb|360|6.6|79|0.6|cốc nồi cơm:150|gao",
    "xoi|Xôi trắng|tb|180|3.5|39|0.6|gói:200|xoi, xoi trang, nep",
    "bun|Bún tươi|tb|110|1.7|25|0.1|bát:200|bun",
    "banh_pho|Bánh phở tươi|tb|141|3.2|32|0.4|bát:200|banh pho",
    "mien|Miến (đã nấu)|tb|90|0.1|22|0|bát:200|mien",
    "mi_soi|Mì sợi luộc|tb|138|4.5|25|2|bát:200|mi, mi soi, mi trung",
    "mi_goi|Mì gói (khô)|tb|470|9|63|20|gói:75|mi goi, mi tom, mi an lien, hao hao",
    "banh_mi|Bánh mì không|tb|265|8.5|52|3|ổ:85|banh mi khong, bread",
    "banh_mi_sw|Bánh mì sandwich|tb|265|9|49|3.2|lát:28|sandwich, banh mi lat",
    "khoai_lang|Khoai lang luộc|tb|86|1.6|20|0.1|củ vừa:200|khoai lang",
    "khoai_tay|Khoai tây luộc|tb|87|1.9|20|0.1|củ vừa:150|khoai tay, potato",
    "khoai_tay_chien|Khoai tây chiên|tb|312|3.4|41|15|phần vừa:120|khoai tay chien, french fries",
    "khoai_mon|Khoai môn|tb|112|1.5|26|0.2|củ:150|khoai mon",
    "san|Sắn (khoai mì) luộc|tb|160|1.4|38|0.3|khúc:150|san, khoai mi",
    "ngo|Ngô luộc|tb|96|3.4|21|1.5|bắp:150|ngo, bap, corn",
    "yen_mach|Yến mạch (khô)|tb|389|13.2|67|6.9|chén:40|yen mach, oats, oatmeal",
    "banh_chung|Bánh chưng|tb|230|6|36|6.5|miếng:150|banh chung, banh tet",
    "banh_trang|Bánh tráng (khô)|tb|333|6|77|0.5|lá:10|banh trang, banh da",
    // ---- Rau củ (sống) ----
    "rau_muong|Rau muống|rau|23|3|2.5|0.2|đĩa:200|rau muong",
    "cai_ngot|Cải ngọt / cải xanh|rau|16|1.7|2.1|0.2|đĩa:200|cai ngot, cai xanh, rau cai",
    "bap_cai|Bắp cải|rau|25|1.3|5.8|0.1|đĩa:200|bap cai, cai bap",
    "sup_lo_xanh|Súp lơ xanh (bông cải)|rau|34|2.8|6.6|0.4|đĩa:200|sup lo, bong cai, broccoli",
    "sup_lo_trang|Súp lơ trắng|rau|25|1.9|5|0.3|đĩa:200|sup lo trang",
    "ca_chua|Cà chua|rau|18|0.9|3.9|0.2|quả:100|ca chua, tomato",
    "dua_chuot|Dưa chuột|rau|15|0.7|3.6|0.1|quả:150|dua chuot, dua leo",
    "ca_rot|Cà rốt|rau|41|0.9|9.6|0.2|củ:100|ca rot, carrot",
    "bi_xanh|Bí xanh|rau|13|0.4|3|0.2|bát:200|bi xanh, bi dao",
    "bi_do|Bí đỏ|rau|26|1|6.5|0.1|bát:200|bi do, bi ngo",
    "su_su|Su su|rau|19|0.8|4.5|0.1|quả:200|su su",
    "dau_que|Đậu que|rau|31|1.8|7|0.2|đĩa:150|dau que, dau co ve",
    "mong_toi|Mồng tơi|rau|19|1.8|3.4|0.3|bó:200|mong toi",
    "rau_den|Rau dền|rau|23|2.5|4|0.3|bó:200|rau den",
    "rau_ngot|Rau ngót|rau|35|5.3|3.4|0|bó:150|rau ngot",
    "xa_lach|Xà lách|rau|15|1.4|2.9|0.2|bát:80|xa lach, rau song, salad",
    "hanh_tay|Hành tây|rau|40|1.1|9.3|0.1|củ:120|hanh tay, onion",
    "nam|Nấm (rơm, đùi gà, kim châm)|rau|30|3|4.5|0.3|bát:100|nam, nam rom, nam kim cham",
    "gia|Giá đỗ|rau|30|3|6|0.2|bát:100|gia, gia do",
    "mang_tay|Măng tây|rau|20|2.2|3.9|0.1|bó:150|mang tay, asparagus",
    "rau_luoc|Rau luộc (các loại)|rau|25|2|4|0.3|đĩa:250|rau luoc, rau",
    "rau_xao|Rau xào (các loại)|rau|75|2.5|4.5|5.5|đĩa:200|rau xao, rau muong xao toi",
    // ---- Trái cây (phần ăn được) ----
    "chuoi|Chuối|qua|89|1.1|23|0.3|quả vừa:118|chuoi, banana",
    "tao|Táo|qua|52|0.3|14|0.2|quả:180|tao, apple",
    "cam|Cam|qua|47|0.9|12|0.1|quả:150|cam, orange",
    "buoi|Bưởi|qua|38|0.8|9.6|0|chén múi:150|buoi",
    "xoai|Xoài chín|qua|60|0.8|15|0.4|quả:250|xoai, mango",
    "dua_hau|Dưa hấu|qua|30|0.6|7.6|0.2|miếng:300|dua hau",
    "du_du|Đu đủ|qua|43|0.5|11|0.3|miếng:200|du du",
    "thanh_long|Thanh long|qua|55|1.2|12|0.4|quả:300|thanh long",
    "oi|Ổi|qua|68|2.6|14|1|quả:150|oi, guava",
    "nho|Nho|qua|69|0.7|18|0.2|chùm nhỏ:150|nho, grape",
    "dua|Dứa|qua|50|0.5|13|0.1|miếng:150|dua, thom, khom",
    "bo|Bơ (trái)|qua|160|2|8.5|15|quả:150|qua bo, trai bo, avocado",
    "mit|Mít|qua|95|1.7|23|0.6|múi:30|mit",
    "vai|Vải / nhãn|qua|64|1|16|0.3|quả:12|vai, nhan",
    "chom_chom|Chôm chôm|qua|82|0.7|21|0.2|quả:15|chom chom",
    // ---- Dầu, gia vị ----
    "dau_an|Dầu ăn|gv|884|0|0|100|thìa canh:13/thìa cà phê:5|dau an, dau, oil",
    "mo_lon|Mỡ lợn|gv|900|0|0|100|thìa canh:13|mo, mo heo",
    "bo_dv|Bơ (động vật)|gv|717|0.9|0.1|81|thìa cà phê:5|bo, butter",
    "duong|Đường|gv|387|0|100|0|thìa cà phê:4|duong, sugar",
    "mat_ong|Mật ong|gv|304|0.3|82|0|thìa cà phê:7|mat ong, honey",
    "nuoc_mam|Nước mắm|gv|35|5|3.6|0|thìa canh:15|nuoc mam",
    "xi_dau|Xì dầu|gv|53|8|5|0.6|thìa canh:15|xi dau, nuoc tuong, soy sauce",
    "tuong_ot|Tương ớt|gv|100|1|24|0.5|thìa canh:15|tuong ot",
    "mayo|Mayonnaise|gv|680|1|0.6|75|thìa canh:14|mayonnaise, sot mayo",
    "dau_hao|Dầu hào|gv|51|1.4|11|0.3|thìa canh:15|dau hao",
    // ---- Đồ uống (trên 100ml) ----
    "cafe_den|Cà phê đen không đường|uong|2|0.1|0|0|ly:200|ca phe den, cafe den, americano",
    "cafe_sua|Cà phê sữa đá|uong|75|1|12|2.5|ly:200|ca phe sua, cafe sua, nau da",
    "bac_xiu|Bạc xỉu|uong|95|2|14|3.5|ly:200|bac xiu",
    "g7|Cà phê hoà tan 3in1 (G7)|uong|440|3|69|16|gói:16|g7, ca phe 3in1, nescafe",
    "tra_sua|Trà sữa trân châu|uong|80|0.8|13|2.8|ly M:500/ly L:700|tra sua, tra sua tran chau, bubble tea",
    "nuoc_ngot|Nước ngọt có ga|uong|42|0|10.6|0|lon:330/chai:390|nuoc ngot, coca, pepsi, soda",
    "bia|Bia|uong|43|0.5|3.6|0|lon:330/cốc bia hơi:500|bia, beer",
    "ruou_vang|Rượu vang|uong|85|0.1|2.6|0|ly:150|ruou vang, wine",
    "ruou|Rượu trắng 40 độ|uong|231|0|0|0|chén:30|ruou, ruou trang",
    "nuoc_mia|Nước mía|uong|70|0.2|17.5|0|cốc:300|nuoc mia",
    "nuoc_cam|Nước cam ép|uong|45|0.7|10.4|0.2|cốc:250|nuoc cam",
    "sinh_to_bo|Sinh tố bơ|uong|120|1.7|15|6|ly:300|sinh to bo",
    "nuoc_dua|Nước dừa|uong|19|0.7|3.7|0.2|quả:300|nuoc dua",
    "tra_da|Trà đá / nước lọc|uong|0|0|0|0|cốc:300|tra da, nuoc loc, nuoc",
    // ---- Món Việt (trên 100g món hoàn chỉnh) ----
    "pho_bo|Phở bò|mon|70|4|8.5|2|tô vừa:650/tô lớn:850/bát nhỏ:450|pho, pho bo",
    "pho_ga|Phở gà|mon|65|4|8.5|1.5|tô vừa:650/tô lớn:850|pho ga",
    "bun_bo|Bún bò Huế|mon|75|3.8|9|2.6|tô vừa:650/tô lớn:850|bun bo, bun bo hue",
    "bun_cha|Bún chả|mon|140|6.5|15|6|suất:430|bun cha",
    "bun_rieu|Bún riêu|mon|70|3|8.5|2.2|tô vừa:600|bun rieu",
    "bun_thitnuong|Bún thịt nướng|mon|145|6|17|6|bát:380|bun thit nuong, bun nem",
    "bun_ca|Bún cá|mon|65|3.6|8.5|1.4|tô vừa:600|bun ca",
    "bun_dau|Bún đậu mắm tôm|mon|175|7.5|17.5|8.3|suất:400|bun dau, bun dau mam tom",
    "hu_tieu|Hủ tiếu|mon|70|3.3|9.7|1.8|tô vừa:600|hu tieu",
    "mi_quang|Mì Quảng|mon|105|5|12|3.6|tô vừa:500|mi quang",
    "mien_ga|Miến gà|mon|65|3.7|8.3|1.3|bát:580|mien ga",
    "banh_canh|Bánh canh|mon|75|3.3|10|2.2|tô vừa:600|banh canh",
    "chao|Cháo thịt / cháo gà|mon|70|3.5|8|2.5|bát:450|chao, chao ga, chao thit, chao long",
    "com_tam|Cơm tấm sườn|mon|180|8.3|21|6.9|đĩa:360|com tam, com suon",
    "com_tam_dd|Cơm tấm sườn bì chả|mon|190|8.2|20|8.3|đĩa:420|com tam suon bi cha",
    "com_ga|Cơm gà luộc / nướng|mon|160|10.5|16|5.3|đĩa:380|com ga",
    "com_ga_xm|Cơm gà xối mỡ|mon|200|9.3|21|8|đĩa:380|com ga xoi mo",
    "com_rang|Cơm rang / cơm chiên trứng|mon|175|4.5|23|6.5|đĩa:350|com rang, com chien",
    "com_rang_bo|Cơm rang dưa bò|mon|185|5.8|24|6.9|đĩa:380|com rang dua bo",
    "com_bui|Cơm bụi / văn phòng (2 món + rau)|mon|170|7|20|6.5|đĩa:430/hộp:400|com bui, com van phong, com hop, com cang tin",
    "xoi_xeo|Xôi xéo|mon|210|4.7|33|6.6|gói:220|xoi xeo",
    "xoi_man|Xôi mặn / xôi thịt|mon|220|8|31|6.7|suất:270/nửa suất:170|xoi man, xoi thit, xoi ga",
    "bm_thit|Bánh mì thịt / pate|mon|230|10|27|8.6|ổ:180|banh mi, banh mi thit, banh mi pate",
    "bm_trung|Bánh mì trứng|mon|235|11.5|26|9.4|ổ:185|banh mi trung, banh mi op la",
    "banh_bao|Bánh bao nhân thịt|mon|230|8.5|32|7.5|cái:140|banh bao",
    "banh_cuon|Bánh cuốn (kèm chả)|mon|140|5.2|21|3.6|đĩa:290|banh cuon",
    "banh_xeo|Bánh xèo|mon|210|6|21|11.5|cái:200|banh xeo",
    "goi_cuon|Gỏi cuốn tôm thịt|mon|110|5.5|17|2|cuốn:80|goi cuon",
    "nem_ran|Nem rán / chả giò|mon|260|10|20|16|cái:40|nem ran, cha gio",
    "banh_gio|Bánh giò|mon|180|4.8|23|8|cái:165|banh gio",
    "thit_kho|Thịt kho trứng|mon|230|16|4|17|phần:150|thit kho, thit kho trung",
    "canh_chua|Canh chua cá|mon|35|3.5|3|1|bát:350|canh chua",
    "canh_rau|Canh rau (có ít thịt)|mon|20|1.5|2|0.6|bát:300|canh, canh rau",
    "dauphu_sot|Đậu phụ sốt cà chua|mon|110|8|5|6.5|phần:200|dau sot ca chua, dau phu sot",
    "ga_rang|Gà rang gừng / gà kho|mon|190|22|3|10|phần:150|ga rang, ga kho",
    "suon_xao|Sườn xào chua ngọt|mon|280|14|14|19|phần:150|suon xao chua ngot",
    "lau|Lẩu / nướng (ăn vừa)|mon|185|10|13|9|bữa:600|lau, nuong, buffet, gogi",
    // ---- Ăn vặt, bánh kẹo ----
    "banh_quy|Bánh quy|vat|480|6.5|66|21|cái:10|banh quy, cookie",
    "snack|Snack khoai tây|vat|536|7|53|35|gói:50|snack, bim bim, poca",
    "socola|Sô-cô-la sữa|vat|535|7.6|59|30|thanh:40|socola, chocolate",
    "keo|Kẹo|vat|390|0|97|0|cái:5|keo, candy",
    "che|Chè (đậu, thạch)|vat|120|2|25|1.5|cốc:250|che",
    "kem|Kem|vat|207|3.5|24|11|que:70/cốc:70|kem, ice cream",
    "banh_ngot|Bánh ngọt / bông lan|vat|350|6|50|14|miếng:60|banh ngot, banh bong lan, cake",
    "banh_trungthu|Bánh trung thu|vat|420|7|55|19|miếng (¼ chiếc):40|banh trung thu",
    "banh_trang_tron|Bánh tráng trộn|vat|230|5|33|8.7|túi:150|banh trang tron"
  ];

  var FOODS = RAW.map(function (line) {
    var p = line.split("|");
    return {
      id: p[0], n: p[1], g: p[2], kcal: +p[3], p: +p[4], c: +p[5], f: +p[6],
      units: p[7].split("/").map(function (u) { var i = u.lastIndexOf(":"); return { n: u.slice(0, i), g: +u.slice(i + 1) }; }),
      alias: p[8] || "", liquid: p[2] === "uong" || /^(sua_kd|sua_cd|sua_tachbeo|sua_daunanh)/.test(p[0])
    };
  });

  // ---------------------------------------------------------------------
  // Bài tập
  // Mỗi dòng: mã | tên | tên tiếng Anh | dụng cụ | kiểu động tác | cơ chính | cơ phụ | bước tăng tạ (kg) | không cần tạ (1) | lưu ý kỹ thuật (cách nhau bởi "/")
  // ---------------------------------------------------------------------
  var EQUIP = {
    barbell: "Đòn tạ + giá squat", smith: "Máy Smith", db: "Tạ đơn + ghế", cable: "Máy cáp (pulley)", latpd: "Máy lat pulldown", pullbar: "Xà đơn",
    upm: "Máy thân trên (chest press, row, shoulder press)", pecdeck: "Máy pec deck", legpress: "Máy đạp đùi", hack: "Máy hack squat",
    legext: "Máy leg extension", lycurl: "Máy leg curl nằm", seatcurl: "Máy leg curl ngồi", calfm: "Máy calf đứng", calfseat: "Máy calf ngồi", none: "Không cần dụng cụ"
  };
  var PATTERNS = {
    push_h: "Đẩy ngang", push_v: "Đẩy dọc", pull_h: "Kéo ngang", pull_v: "Kéo dọc", squat: "Squat", hinge: "Gập hông", lunge: "Một chân",
    knee_ext: "Duỗi gối", knee_flex: "Gập gối", calf: "Bắp chân", fly: "Ép ngực", lat: "Vai giữa", rear: "Vai sau", bi: "Tay trước", tri: "Tay sau", core: "Bụng"
  };
  var MUSCLES = { chest: "Ngực", back: "Lưng", delts: "Vai", biceps: "Tay trước", triceps: "Tay sau", quads: "Đùi trước", hams: "Đùi sau, mông", calves: "Bắp chân", abs: "Bụng" };
  var EXRAW = [
    "smbench|Smith bench press|Smith machine bench press|smith|push_h|chest|triceps,delts|2.5|0|Ép bả vai ra sau và xuống, giữ suốt hiệp/Đòn chạm ngang hoặc ngay dưới đầu ti/Khuỷu tay 45–60° so với thân, không bè ngang 90°",
    "bbbench|Barbell bench press|Barbell bench press|barbell|push_h|chest|triceps,delts|2.5|0|Chân bám đất, lưng hơi cong tự nhiên/Hạ đòn có kiểm soát, chạm ngực rồi đẩy/Luôn có người hỗ trợ hoặc dùng thanh chặn an toàn",
    "dbbench|DB bench press|Dumbbell bench press|db|push_h|chest|triceps,delts|2|0|Hạ tạ sâu tới khi thấy giãn ngực/Hai tạ đi theo vòng cung, gần nhau ở trên/Cổ tay thẳng, không gập ra sau",
    "machpress|Chest press máy|Machine chest press|upm|push_h|chest|triceps,delts|2.5|0|Chỉnh ghế để tay cầm ngang giữa ngực/Lưng tựa sát, không nhấc vai/Đi hết biên độ, dừng 1 giây ở điểm giãn",
    "incdb|Incline DB press|Incline dumbbell press|db|push_h|chest|delts,triceps|2|0|Ghế dốc 30°, dốc hơn sẽ thành bài vai/Hạ tạ ngang ngực trên/Không đập hai tạ vào nhau ở trên",
    "incsmith|Incline Smith press|Incline Smith press|smith|push_h|chest|delts,triceps|2.5|0|Ghế dốc 30°/Đòn chạm ngực trên, dưới xương đòn/Ép bả vai như bench phẳng",
    "incbb|Incline barbell press|Incline barbell press|barbell|push_h|chest|delts,triceps|2.5|0|Ghế dốc 30°/Cầm đòn rộng hơn vai một chút/Có người hỗ trợ khi tạ nặng",
    "pecdeck|Pec deck|Pec deck fly|pecdeck|fly|chest||2.5|0|Khuỷu hơi cong, cố định góc suốt hiệp/Mở rộng tới khi giãn ngực rõ/Không để vai đổ về trước",
    "cablefly|Cable fly|Cable fly|cable|fly|chest||2.5|0|Đứng giữa hai cáp, bước lên một chân/Ôm như ôm thùng, tay gặp nhau trước ngực/Kiểm soát lúc mở ra",
    "dbfly|DB fly|Dumbbell fly|db|fly|chest||1|0|Tạ nhẹ, khuỷu hơi cong/Hạ tới khi giãn ngực, không xuống quá vai/Không dùng tạ nặng gây đau vai",
    "brow|Barbell row|Barbell row|barbell|pull_h|back|biceps|2.5|0|Gập người khoảng 45°, lưng thẳng tuyệt đối/Kéo đòn về rốn, khuỷu đi sát thân/Mỏi thắt lưng thì chuyển sang row có tựa ngực",
    "machrow|Row máy tựa ngực|Chest supported machine row|upm|pull_h|back|biceps|2.5|0|Ngực tựa sát đệm, lưng dưới được nghỉ/Kéo bằng khuỷu, ép bả vai cuối động tác/Giãn hết tay ở đầu mỗi rep",
    "cablerow|Seated cable row|Seated cable row|cable|pull_h|back|biceps|2.5|0|Ngồi thẳng, không ngả ra sau lấy đà/Kéo tay cầm về bụng dưới/Để vai đổ về trước một chút ở đầu rep cho xô giãn",
    "dbrow|DB row 1 tay|One arm dumbbell row|db|pull_h|back|biceps|2|0|Một tay một gối chống ghế, lưng song song sàn/Kéo tạ về hông, không về ngực/Không xoay thân để kéo",
    "latpd|Lat pulldown|Lat pulldown|latpd|pull_v|back|biceps|2.5|0|Cầm rộng hơn vai một chút/Kéo thanh về ngực trên, ngực ưỡn nhẹ/Không ngả người quá 15°",
    "pullup|Pulldown tay ngửa|Underhand lat pulldown|latpd|pull_v|back|biceps|2.5|0|Cầm ngửa, rộng bằng vai/Kéo về ngực trên, khuỷu đi xuống sát thân/Giãn hết tay ở trên",
    "chinup|Pull-up xà đơn|Pull up|pullbar|pull_v|back|biceps|0|1|Treo thẳng tay, siết bụng/Kéo tới khi cằm qua xà/Chưa làm được 6 rep thì dùng dây kháng lực hoặc máy trợ lực",
    "smohp|Smith OHP ngồi|Seated Smith shoulder press|smith|push_v|delts|triceps|2.5|0|Đòn đi trước mặt, không đẩy sau gáy/Lùi ghế để đòn đi qua mặt/Lưng tựa sát ghế, không ưỡn quá",
    "dbohp|DB shoulder press ngồi|Seated dumbbell shoulder press|db|push_v|delts|triceps|2|0|Ghế dựng gần thẳng/Hạ tạ ngang tai/Không khoá khớp khuỷu ở trên",
    "machohp|Shoulder press máy|Machine shoulder press|upm|push_v|delts|triceps|2.5|0|Chỉnh ghế để tay cầm ngang vai/Đẩy thẳng lên, lưng tựa sát/Kiểm soát khi hạ",
    "latraise|Lateral raise tạ đơn|Dumbbell lateral raise|db|lat|delts||1|0|Nâng tay sang ngang tới ngang vai/Khuỷu hơi cong, dẫn bằng khuỷu/Tạ nhẹ, không lắc người",
    "latcable|Lateral raise cáp|Cable lateral raise|cable|lat|delts||1.25|0|Cáp đặt thấp, kéo chéo qua người/Lực căng đều suốt biên độ/Không nhún vai",
    "latmach|Lateral raise máy|Machine lateral raise|upm|lat|delts||2.5|0|Vai thẳng trục với điểm xoay của máy/Nâng tới ngang vai/Hạ chậm 2 giây",
    "tripd|Triceps pushdown|Cable triceps pushdown|cable|tri|triceps||2.5|0|Khuỷu ép sát thân, không di chuyển/Duỗi thẳng hết tay, siết 1 giây/Không dùng vai đè xuống",
    "ohtri|Triceps qua đầu (cáp)|Overhead cable triceps extension|cable|tri|triceps||2.5|0|Quay lưng về máy, tay đưa qua đầu/Hạ sâu sau đầu cho cơ giãn tối đa/Khuỷu hướng lên, không bè ra",
    "dbohtri|Triceps qua đầu tạ đơn|Dumbbell overhead triceps extension|db|tri|triceps||2|0|Hai tay giữ một tạ sau đầu/Hạ sâu, khuỷu hướng lên/Ngồi có tựa lưng để ổn định",
    "skull|Skull crusher|EZ bar skull crusher|barbell|tri|triceps||2.5|0|Nằm, đòn EZ hạ về trán hoặc sau đầu/Chỉ khuỷu gập, cánh tay đứng yên/Đau khuỷu thì đổi sang bài cáp",
    "dbcurl|DB curl|Dumbbell curl|db|bi|biceps||1|0|Khuỷu sát thân, không đưa ra trước/Xoay ngửa cổ tay khi nâng/Hạ chậm, duỗi gần hết tay",
    "inccurl|Incline curl|Incline dumbbell curl|db|bi|biceps||1|0|Ghế dốc 45–60°, tay buông thẳng sau thân/Cơ tay trước được kéo giãn tối đa/Tạ nhẹ hơn curl thường",
    "cablecurl|Cable curl|Cable curl|cable|bi|biceps||2.5|0|Đứng thẳng, khuỷu cố định/Lực căng đều cả biên độ/Không ngả người",
    "ezcurl|EZ bar curl|EZ bar curl|barbell|bi|biceps||2.5|0|Cầm đòn EZ rộng bằng vai/Không đung đưa lưng/Hạ chậm",
    "squat|Back squat|Barbell back squat|barbell|squat|quads|hams|2.5|0|Đòn trên vai sau, siết bụng trước khi xuống/Xuống tới khi đùi song song sàn hoặc sâu hơn/Gối đi theo hướng mũi chân",
    "hack|Hack squat|Hack squat machine|hack|squat|quads|hams|5|0|Lưng tựa sát đệm, lưng dưới được nghỉ/Chân đặt giữa bàn, rộng bằng vai/Xuống sâu, đẩy bằng cả bàn chân",
    "smsquat|Smith squat|Smith machine squat|smith|squat|quads|hams|2.5|0|Chân đặt hơi trước đòn/Xuống sâu, lưng thẳng/Không khoá gối ở trên",
    "legpress|Leg press|Leg press|legpress|squat|quads|hams|5|0|Không để mông nhấc khỏi ghế ở đáy động tác/Hạ tới khi đùi gần chạm bụng nhưng lưng vẫn sát ghế/Mỏi lưng dưới thì giảm biên độ hoặc đổi bài",
    "goblet|Goblet squat|Goblet squat|db|squat|quads|hams|2|0|Ôm tạ trước ngực/Xuống sâu, khuỷu nằm trong gối/Lưng thẳng",
    "legext|Leg extension|Leg extension|legext|knee_ext|quads||2.5|0|Đầu gối thẳng trục điểm xoay của máy/Duỗi hết, siết 1 giây/Hạ chậm, không thả rơi",
    "bss|Bulgarian split squat|Bulgarian split squat|db|lunge|quads|hams|2|0|Chân sau gác ghế, chân trước cách ghế khoảng 1 bước/Người thẳng thiên về đùi trước, đổ người về trước thiên về mông/Xuống tới khi gối sau gần chạm sàn",
    "rdl|Romanian deadlift|Romanian deadlift|barbell|hinge|hams|back|2.5|0|Đẩy hông ra sau, gối hơi cong cố định/Đòn sát chân, hạ tới giữa ống chân/Lưng thẳng, dừng khi đùi sau căng rõ",
    "dbrdl|DB Romanian deadlift|Dumbbell Romanian deadlift|db|hinge|hams|back|2|0|Tạ trượt sát đùi/Đẩy hông ra sau/Lưng thẳng, không cong vai",
    "dl|Deadlift|Conventional deadlift|barbell|hinge|hams|back,quads|2.5|0|Đòn sát ống chân, vai trên đòn/Siết bụng, kéo đòn lên bằng chân và hông/Lưng giữ thẳng suốt, không giật",
    "hipthrust|Hip thrust|Barbell hip thrust|barbell|hinge|hams||2.5|0|Lưng trên tựa ghế, đòn trên hông có đệm/Đẩy hông lên tới thân thẳng hàng/Siết mông 1 giây ở trên",
    "seatcurl|Leg curl ngồi|Seated leg curl|seatcurl|knee_flex|hams||2.5|0|Đùi bị ép chặt, hông gập/Gập hết rồi duỗi chậm/Cho cơ đùi sau giãn dài hơn leg curl nằm",
    "legcurl|Leg curl nằm|Lying leg curl|lycurl|knee_flex|hams||2.5|0|Hông ép sát đệm, không nhổm mông/Gập hết, hạ chậm/Có thể kê gối dưới hông để đùi sau giãn hơn",
    "dbcurlham|Leg curl tạ đơn nằm sấp|Dumbbell lying leg curl|db|knee_flex|hams||1|0|Nằm sấp trên ghế, kẹp tạ giữa hai bàn chân/Gập gối chậm/Tạ nhẹ, cẩn thận rơi tạ",
    "nordic|Nordic curl có trợ lực|Assisted nordic curl|none|knee_flex|hams||0|1|Quỳ, cố định gót chân/Ngả người về trước thật chậm bằng đùi sau/Dùng tay đỡ khi gần chạm sàn",
    "calfst|Calf raise đứng (máy)|Standing calf raise|calfm|calf|calves||2.5|0|Hạ gót sâu tới khi bắp chân giãn/Dừng 1–2 giây ở dưới/Nhón cao hết cỡ",
    "calflp|Calf raise máy đạp đùi|Leg press calf raise|legpress|calf|calves||5|0|Mũi chân ở mép bàn đạp/Gối gần thẳng/Hạ sâu, dừng ở dưới",
    "calfsm|Calf raise Smith|Smith machine calf raise|smith|calf|calves||2.5|0|Mũi chân trên bục/Hạ sâu, nhón cao/Giữ thăng bằng bằng đòn",
    "calfdb|Calf raise tạ đơn 1 chân|Single leg dumbbell calf raise|db|calf|calves||2|0|Đứng một chân trên bậc, tay vịn/Hạ sâu, nhón cao/Đổi chân",
    "calfsit|Calf raise ngồi|Seated calf raise|calfseat|calf|calves||2.5|0|Đệm đặt trên đùi, sát gối/Hạ sâu, dừng 1 giây/Tập cơ dép (lớp dưới của bắp chân)",
    "crunch|Cable crunch|Kneeling cable crunch|cable|core|abs||2.5|0|Quỳ, giữ dây sát đầu/Cuộn người bằng bụng, không kéo bằng tay/Hông đứng yên",
    "abmach|Ab crunch máy|Ab crunch machine|upm|core|abs||2.5|0|Cuộn người về trước bằng bụng/Thở ra khi gập/Không giật",
    "hlr|Hanging leg raise|Hanging leg raise|pullbar|core|abs||0|1|Treo trên xà, không đung đưa/Cuộn hông nâng chân/Mới tập thì gập gối",
    "kneeraise|Nâng gối nằm ngửa|Lying knee raise|none|core|abs||0|1|Nằm ngửa, tay dưới hông/Nâng gối về ngực, cuộn hông/Hạ chậm không chạm sàn"
  ];
  var EXERCISES = EXRAW.map(function (line) {
    var p = line.split("|"), m = {};
    m[p[5]] = 1; (p[6] ? p[6].split(",") : []).forEach(function (x) { if (x) m[x] = 0.5; });
    return { id: p[0], n: p[1], en: p[2], eq: p[3], pat: p[4], main: p[5], m: m, inc: +p[7], bw: p[8] === "1", cues: p[9].split("/") };
  });

  // ---------------------------------------------------------------------
  // Hiểu câu nhập: "150g ức gà, 1 chén cơm, 2 quả trứng, nửa tô phở"
  // ---------------------------------------------------------------------
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9.,/ ]/g, " ").replace(/\s+/g, " ").trim(); }
  var NUMW = { "nua": 0.5, "mot": 1, "hai": 2, "ba": 3, "bon": 4, "tu": 4, "nam": 5, "sau": 6, "bay": 7, "tam": 8, "chin": 9, "muoi": 10, "ruoi": 1.5 };
  var GUNITS = { g: 1, gr: 1, gram: 1, gam: 1, kg: 1000, ml: 1, l: 1000, lit: 1000, lang: 100 };
  var INDEX = FOODS.map(function (f) {
    var words = {}; (norm(f.n) + " " + norm(f.alias)).split(/[ ,]+/).forEach(function (w) { if (w.length > 1) words[w] = 1; });
    return { f: f, words: words, phrases: [norm(f.n.replace(/\(.*?\)/g, ""))].concat(f.alias.split(",").map(norm)).filter(Boolean) };
  });
  var UNITW = (function () {
    var w = {}; FOODS.forEach(function (f) { f.units.forEach(function (u) { var nu = norm(u.n); w[nu] = 1; w[nu.split(" ")[0]] = 1; }); });
    "cai con mieng mieng mieng to bat chen dia coc ly hop goi qua lat thia muong suat phan".split(" ").forEach(function (x) { w[x] = 1; });
    return Object.keys(w).sort(function (a, b) { return b.length - a.length; });
  })();
  // Tìm món khớp nhất: ưu tiên khớp nguyên cụm, rồi số từ trùng
  function search(q, limit) {
    var nq = norm(q); if (!nq) return [];
    var qw = nq.split(" ").filter(function (w) { return w.length > 0; });
    var scored = INDEX.map(function (x) {
      var sc = 0;
      x.phrases.forEach(function (ph) { if (ph === nq) sc = Math.max(sc, 100); else if (ph.indexOf(nq) === 0) sc = Math.max(sc, 60); else if ((" " + ph + " ").indexOf(" " + nq + " ") >= 0) sc = Math.max(sc, 50); });
      var hit = qw.filter(function (w) { return x.words[w] || Object.keys(x.words).some(function (k) { return k.indexOf(w) === 0 && w.length >= 2; }); }).length;
      sc += hit / qw.length * 40 - (Object.keys(x.words).length > 8 ? 2 : 0);
      if (/sống/.test(x.f.n)) sc += 1; // món thô hay được tự cân
      return { f: x.f, sc: sc, full: hit === qw.length };
    }).filter(function (x) { return x.sc >= 30 && x.full; });
    return scored.sort(function (a, b) { return b.sc - a.sc; }).slice(0, limit || 8).map(function (x) { return x.f; });
  }
  function calc(f, grams) { var k = grams / 100; return { kcal: Math.round(f.kcal * k), p: Math.round(f.p * k * 10) / 10, c: Math.round(f.c * k * 10) / 10, f: Math.round(f.f * k * 10) / 10 }; }
  // Tách một cụm: [số] [đơn vị] [tên món]
  function parseOne(txt) {
    var t = norm(txt).replace(/,/g, "."), qty = null, unit = null, rest;
    var m = t.match(/^(\d+(?:\.\d+)?|\d+\/\d+)\s*(.*)$/);
    if (m) { qty = m[1].indexOf("/") > 0 ? +m[1].split("/")[0] / +m[1].split("/")[1] : +m[1]; rest = m[2]; }
    else { var w = t.split(" "); if (NUMW[w[0]] != null) { qty = NUMW[w[0]]; rest = w.slice(1).join(" "); } else rest = t; }
    if (/^ruoi /.test(rest)) { qty = (qty || 1) + 0.5; rest = rest.slice(5); }
    var gm = rest.match(/^(kg|gram|gam|gr|g|ml|lit|l|lang)\b\s*(.*)$/);
    if (gm) { unit = { n: gm[1], g: GUNITS[gm[1]] }; rest = gm[2]; }
    // Bỏ chữ đơn vị ("chén", "tô lớn"…) trước khi tìm món
    var said = null;
    if (!unit) UNITW.some(function (w) { if (rest.indexOf(w + " ") === 0) { said = w; return true; } });
    var cands = search(rest, 6); // "1 đùi gà": chữ đầu vừa là đơn vị vừa là tên món
    if (!cands.length && said) cands = search(rest.slice(said.length + 1), 6);
    if (!cands.length) return { text: txt, ok: false };
    var f = cands[0];
    if (!unit) {
      var best = null;
      if (said) {
        f.units.forEach(function (u) { if (!best && norm(u.n) === said) best = u; });
        if (!best) f.units.forEach(function (u) { if (!best && norm(u.n).split(" ")[0] === said.split(" ")[0]) best = u; });
      }
      unit = best || f.units[0];
    }
    var grams = (qty == null ? 1 : qty) * unit.g;
    return { text: txt, ok: true, food: f, alts: cands.slice(1), qty: qty == null ? 1 : qty, unit: unit, grams: Math.round(grams), r: calc(f, grams) };
  }
  function parse(text) {
    return String(text).split(/\s*(?:,|\+|;|\n)\s*|\s+(?:và|va|với|voi)\s+/i).filter(function (x) { return x.trim(); }).map(parseOne);
  }

  root.FitDB = { GROUPS: GROUPS, FOODS: FOODS, EQUIP: EQUIP, PATTERNS: PATTERNS, MUSCLES: MUSCLES, EXERCISES: EXERCISES, search: search, parse: parse, calc: calc, norm: norm };
})(this);
