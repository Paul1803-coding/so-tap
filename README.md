# FitCore

App ghi tập gym và ăn uống, tự phân tích tiến bộ theo các phương pháp được dùng trong nghiên cứu và trong các app như Strong, RP Hypertrophy, MacroFactor.

## Ba mục

- **Tập:** giáo án Upper A → Lower A → Upper B → Lower B, bài tự chọn theo dụng cụ phòng tập (khai báo trong ⚙️). Mỗi hiệp ghi kg, rep và RIR (còn dư mấy rep). App đề xuất mức tạ buổi sau theo tăng tiến kép, đồng hồ nghỉ tự chạy, kết thúc buổi có tổng kết và kỷ lục.
- **Cardio và cầu lông:** ghi cầu lông, đi bộ dốc, elliptical, đi bộ ngoài trời (chọn cường độ, số phút, ngày). Mỗi ngày app gợi ý nên tập gì dựa trên những gì đã ghi thật: hôm sau đánh cầu thì đẩy buổi thân trên lên trước, tuần nào chưa đủ 2 buổi cardio nhẹ thì nhắc thêm sau buổi Upper. Buổi kế tiếp là buổi lâu chưa tập nhất, nên đổi thứ tự không bị sót buổi.
- **Ăn:** chỉ hiện calo và đạm còn lại. Thêm món bằng cách gõ từng thứ đã ăn, cách nhau dấu phẩy ("xôi, thịt quay, chút rau" hoặc "150g gà, 1 chén cơm"). App tra cơ sở dữ liệu, cộng từng thành phần, cho đổi món và chỉnh gram từng dòng. Thịt cá mặc định là đã nấu chín, ghi "sống" nếu cân lúc sống. Đồ đóng gói: nhập số trên bao bì (trên 100g hoặc trên 1 gói) và lượng ăn, app tự nhân ra; lưu lại thì lần sau gõ tên là ra. Món quen tự nhớ theo giờ ăn. Buổi chiều có "Tối nay nấu gì?" với 3 món từ 12 công thức, lượng cơm đã chỉnh vừa phần calo còn lại.
- **Tiến độ:** thành phần cơ thể (% mỡ, khối mỡ, khối nạc, kết luận recomp, cân đích theo % mỡ mục tiêu), nút "Gửi dữ liệu cho Claude phân tích", báo cáo tuần (cân xu hướng, TDEE đo được, mục tiêu, sức mạnh, vòng bụng), số hiệp nặng mỗi nhóm cơ, sức mạnh từng bài kèm cảnh báo chững lại và gợi ý giảm tải, biểu đồ, lịch tháng và năm.

## Cơ sở dữ liệu (`db.js`, xem ở `du-lieu.html`)

- **213 thực phẩm và món Việt:** calo, đạm, tinh bột, béo trên 100g (đồ uống trên 100ml), kèm đơn vị quen dùng (1 quả trứng ≈ 50g, 1 chén cơm ≈ 150g, 1 tô phở ≈ 650g) và tên gọi khác để tìm không dấu. Thực phẩm thô lấy gần đúng theo Bảng thành phần thực phẩm Việt Nam và USDA; món nấu sẵn ước tính theo khẩu phần phổ biến.
- **Hiểu câu nhập:** `FitDB.parse("150g ức gà, 1 chén cơm, 2 quả trứng, nửa tô phở")` trả về từng món với số gram và macro.
- **55 bài tập:** cơ chính, cơ phụ, kiểu động tác, dụng cụ, bước tăng tạ, lưu ý kỹ thuật.

## Cách tính

| Chỉ số | Cách tính |
|---|---|
| 1RM ước tính | kg × (1 + (rep + RIR) / 30), công thức Epley có tính RIR |
| Hiệp nặng | Hiệp có RIR 0–3. Cơ chính tính 1, cơ phụ tính ½. Vùng nên đạt khoảng 10–20 hiệp mỗi nhóm cơ lớn mỗi tuần |
| Tăng tạ | Khi mọi hiệp đạt đỉnh khoảng rep mà vẫn còn dư ít nhất (RIR mục tiêu − 1) |
| Chững lại | 3 buổi gần nhất không vượt kỷ lục 1RM trước đó. Từ 2 bài chính chững cùng lúc thì gợi ý tuần giảm tải |
| % mỡ | Công thức Hải quân Mỹ từ vòng bụng, vòng cổ, chiều cao (nữ thêm vòng hông). Khối mỡ = cân xu hướng × % mỡ, khối nạc = phần còn lại. Sai số ±3–4%, dùng để xem xu hướng |
| Cân xu hướng | Trung bình trượt hàm mũ, mỗi ngày lấy 10% số cân mới |
| TDEE | Calo ăn trung bình (chỉ tính ngày ghi đủ) − thay đổi cân xu hướng × 7.700 kcal/kg, trên 3 tuần gần nhất, pha với ước tính Mifflin–St Jeor theo độ tin cậy |
| Mục tiêu calo | TDEE + mức thâm hụt theo tốc độ đã chọn (% cân nặng mỗi tuần). Tự cập nhật mỗi thứ Hai |
| Đạm | 1,6–2,2 g mỗi kg cân nặng, chọn trong hồ sơ |
| Calo cardio | (MET − 1) × cân xu hướng × giờ. MET theo Compendium of Physical Activities: cầu lông 5,5 / 7 / 9, đi bộ dốc 5,3 / 8, elliptical 5 / 7,5, đi bộ nhanh 4,3. Chỉ để tham khảo, calo mục tiêu ngày không đổi vì TDEE tự học đã gồm phần này |
| Phút cardio | Theo WHO: 150–300 phút vận động vừa mỗi tuần, phút vận động mạnh (từ 6 MET) tính gấp đôi. Cardio nhẹ: nói được thành câu, nhịp tim 64–76% nhịp tối đa (220 − tuổi) |
| Chọn bài | Giáo án chia theo vị trí (đẩy ngang, gập hông, gập gối…). Mỗi vị trí có 2–4 bài xếp theo ưu tiên; app lấy bài đầu tiên phòng tập có dụng cụ. Báo đau khớp 1 lần, hoặc không cảm nhận cơ 2/3 buổi, thì app khuyên đổi bài |

Dữ liệu lưu trên điện thoại, không gửi đi đâu. Vào ⚙️ → Sao lưu để xuất file.

## Cài lên điện thoại

- **iPhone:** mở link bằng Safari → nút Chia sẻ → "Thêm vào MH chính".
- **Android:** mở link bằng Chrome → menu ⋮ → "Cài đặt ứng dụng".

## Cập nhật app

Sửa file, tăng `VERSION` trong `sw.js`, đẩy lên GitHub. Mở app khi có mạng là nhận bản mới.
