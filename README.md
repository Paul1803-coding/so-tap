# Sổ Tập Recomp

App theo dõi tập gym và ăn uống cá nhân, dựng theo kế hoạch Recomp trong project "Xây dựng chế độ dinh dưỡng".

- **Hôm nay:** calo và đạm, tinh bột, béo so với mục tiêu (2.150 kcal · 140g · 250g · 65g). Checklist các bữa theo ngày ăn mẫu: tick bữa nào là bữa đó tự ghi vào nhật ký ăn. Thêm 8.000 bước, ngủ 7 tiếng, cân nặng, vòng bụng.
- **Tập:** giáo án Upper A → Lower A → Upper B → Lower B, có khởi động, đồng hồ nghỉ, FST-7 từ tuần 5, giảm tải mỗi 8 tuần, gợi ý tăng tạ theo lần trước.
- **Ăn:** nhật ký ăn từng ngày, danh sách món Việt thường gặp, tự nhập số liệu.
- **Hộp tối:** lịch meal prep 14 ngày, công thức, khẩu phần. Tick hộp tối ở đây cũng ghi vào nhật ký ăn.
- **Tiến độ:** cân nặng trung bình 7 ngày so với mục tiêu giảm 0,3–0,6 kg/tuần, vòng bụng, calo 7 ngày, lịch sử buổi tập. App tự nhắc khi đến lúc điều chỉnh (2 tuần liền cả cân và vòng bụng không giảm).

Dữ liệu lưu trên điện thoại, không gửi đi đâu. Vào ⚙️ Cài đặt → **Sao lưu** để xuất file, **Khôi phục** để nạp lại khi đổi máy.

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
