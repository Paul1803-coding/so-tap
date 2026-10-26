---
name: release
description: Phát hành bản mới của FitCore lên điện thoại người dùng. Dùng sau khi sửa app.js, db.js, styles.css hoặc HTML: tăng phiên bản, chạy thử, cập nhật README, commit và push lên GitHub Pages.
---

# Phát hành FitCore

1. **Tăng phiên bản** (cả hai, cùng lúc):
   - `sw.js`: `VERSION = "fitcore-vN"` → N + 1.
   - `app.js`: chuỗi `FitCore · bản X.Y` trong `openSettings` → tăng Y (tính năng lớn thì tăng X).
2. **Kiểm tra cú pháp:** `node --check app.js && node --check db.js`.
3. **Chạy thử:** `node tests/smoke.js /tmp/fitcore-shots` (tự mở máy chủ, không cần python).
   - Phải ra "Tất cả đều ổn". Có ✗ thì sửa trước, không phát hành.
   - Tính năng mới: thêm một bước kiểm tra vào `tests/smoke.js`.
   - Xem ảnh chụp trong thư mục đó (Read) để tự review giao diện từ góc người dùng.
4. **README.md:** cập nhật mô tả tính năng hoặc bảng "Cách tính" nếu có thay đổi.
5. **Commit và push:**
   ```
   git add -A
   git -c user.name="paul1803-coding" -c user.email="paul1803-coding@users.noreply.github.com" commit -m "Bản X.Y: <tóm tắt>

   - <thay đổi 1>
   - <thay đổi 2>

   <các dòng ghi công hệ thống yêu cầu>"
   git push origin main
   ```
6. **Báo người dùng** (tiếng Việt, ngắn): đã sửa gì, đã thử gì, "mở app khi có mạng là cập nhật, thấy **bản X.Y** ở cuối ⚙️ là đã có bản mới".
