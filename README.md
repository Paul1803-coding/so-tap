# FitCore

App theo dõi tập gym và ăn uống cá nhân, dựng theo kế hoạch Recomp trong project "Xây dựng chế độ dinh dưỡng".

- **Hôm nay:** calo và đạm, tinh bột, béo so với mục tiêu (2.150 kcal · 140g · 250g · 65g), tóm tắt 4 bữa, 8.000 bước, ngủ 7 tiếng, cân nặng, vòng bụng.
- **Hôm nay có gì khác kế hoạch?** Bận không tập, ăn lệch, lỡ giờ ăn, mệt/ngủ ít, thiếu thời gian. App gợi ý cách xử lý và tự chỉnh mục tiêu calo hôm nay và các ngày sau.
- **Tập:** giáo án Upper A → Lower A → Upper B → Lower B. Ghi kg và rep từng hiệp, gợi ý tăng tạ theo tăng tiến kép, đồng hồ nghỉ, FST-7 từ tuần 5, giảm tải mỗi 8 tuần. Chọn số phút có được (75/60/45) để app rút gọn buổi tập: giữ compound, ghép superset, cắt bài cô lập. Có chế độ mệt và nút đổi bài sang máy khác.
- **Ăn:** 4 thẻ bữa Sáng, Trưa, Tối, Phụ. Bữa chưa ghi có sẵn món bấm nhanh (bánh mì, xôi buổi sáng; "Cơm công ty" buổi trưa; món meal prep buổi tối; bữa sau tập, cà phê). Bấm món đã ghi để chỉnh khẩu phần ×0,5 đến ×2 hoặc xoá. "Gợi ý bữa tiếp theo" chia phần calo, đạm còn lại. Thêm món bằng một bảng: món có sẵn (khoảng 80 món Việt, cỡ nhỏ/vừa/lớn), ghép đĩa (ước lượng bằng nắm tay, lòng bàn tay, cách nấu) hoặc tự nhập.
- **Thực đơn:** lịch meal prep 14 ngày, công thức, khẩu phần. Tick bữa tối ở đây cũng ghi vào nhật ký ăn.
- **Tiến độ:** mục tiêu dài hạn (cân nặng, vòng bụng), lịch tháng và lịch năm, cân nặng trung bình 7 ngày, ảnh checkpoint cơ thể, calo 7 ngày, lịch sử buổi tập. App tự nhắc khi đến lúc điều chỉnh (2 tuần liền cả cân và vòng bụng không giảm).

Dữ liệu và ảnh lưu trên điện thoại, không gửi đi đâu. Vào ⚙️ Cài đặt → **Sao lưu** để xuất file, **Khôi phục** để nạp lại khi đổi máy.

## Cài lên điện thoại

- **iPhone:** mở link app bằng Safari → nút Chia sẻ → "Thêm vào MH chính".
- **Android:** mở link bằng Chrome → menu ⋮ → "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".

Sau khi cài, app mở toàn màn hình và dùng được cả khi không có mạng.

## Cập nhật app

Sửa file, tăng `VERSION` trong `sw.js` (ví dụ `so-tap-v2`) rồi đẩy lên GitHub. Lần mở thứ hai sau khi cập nhật, điện thoại sẽ dùng bản mới.

## Cấu trúc

| File | Vai trò |
|---|---|
| `index.html` | Khung trang |
| `styles.css` | Giao diện, tự đổi sáng/tối theo điện thoại |
| `app.js` | Toàn bộ logic và dữ liệu kế hoạch |
| `sw.js` | Cho phép chạy không cần mạng |
| `manifest.webmanifest`, `icons/` | Tên, icon khi cài lên điện thoại |

Chạy thử trên máy tính: `python3 -m http.server` trong thư mục này rồi mở http://localhost:8000.
