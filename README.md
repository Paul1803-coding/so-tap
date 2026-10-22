# FitCore

App ghi tập gym và ăn uống, tự phân tích tiến bộ theo các phương pháp được dùng trong nghiên cứu và trong các app như Strong, RP Hypertrophy, MacroFactor.

## Ba mục

- **Tập:** giáo án Upper A → Lower A → Upper B → Lower B. Mỗi hiệp ghi kg, rep và RIR (còn dư mấy rep). App đề xuất mức tạ buổi sau theo tăng tiến kép, đồng hồ nghỉ tự chạy, kết thúc buổi có tổng kết và kỷ lục.
- **Ăn:** chỉ hiện calo và đạm còn lại. Thêm món bằng tìm kiếm, món quen (tự nhớ theo giờ ăn), ước lượng đĩa cơm bằng bàn tay, hoặc nhập số. Buổi chiều có "Tối nay nấu gì?" với 3 món từ 12 công thức, lượng cơm đã chỉnh vừa phần calo còn lại.
- **Tiến độ:** báo cáo tuần (cân xu hướng, TDEE đo được, mục tiêu, sức mạnh, vòng bụng), số hiệp nặng mỗi nhóm cơ, sức mạnh từng bài kèm cảnh báo chững lại và gợi ý giảm tải, biểu đồ, lịch tháng và năm.

## Cách tính

| Chỉ số | Cách tính |
|---|---|
| 1RM ước tính | kg × (1 + (rep + RIR) / 30), công thức Epley có tính RIR |
| Hiệp nặng | Hiệp có RIR 0–3. Cơ chính tính 1, cơ phụ tính ½. Vùng nên đạt khoảng 10–20 hiệp mỗi nhóm cơ lớn mỗi tuần |
| Tăng tạ | Khi mọi hiệp đạt đỉnh khoảng rep mà vẫn còn dư ít nhất (RIR mục tiêu − 1) |
| Chững lại | 3 buổi gần nhất không vượt kỷ lục 1RM trước đó. Từ 2 bài chính chững cùng lúc thì gợi ý tuần giảm tải |
| Cân xu hướng | Trung bình trượt hàm mũ, mỗi ngày lấy 10% số cân mới |
| TDEE | Calo ăn trung bình (chỉ tính ngày ghi đủ) − thay đổi cân xu hướng × 7.700 kcal/kg, trên 3 tuần gần nhất, pha với ước tính Mifflin–St Jeor theo độ tin cậy |
| Mục tiêu calo | TDEE + mức thâm hụt theo tốc độ đã chọn (% cân nặng mỗi tuần). Tự cập nhật mỗi thứ Hai |
| Đạm | 1,6–2,2 g mỗi kg cân nặng, chọn trong hồ sơ |

Dữ liệu lưu trên điện thoại, không gửi đi đâu. Vào ⚙️ → Sao lưu để xuất file.

## Cài lên điện thoại

- **iPhone:** mở link bằng Safari → nút Chia sẻ → "Thêm vào MH chính".
- **Android:** mở link bằng Chrome → menu ⋮ → "Cài đặt ứng dụng".

## Cập nhật app

Sửa file, tăng `VERSION` trong `sw.js`, đẩy lên GitHub. Mở app khi có mạng là nhận bản mới.
