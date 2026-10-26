# FitCore: ghi chú cho Claude

App PWA ghi tập gym, ăn uống, cardio cho **một người dùng duy nhất** (chủ repo). Chạy tại https://paul1803-coding.github.io/so-tap/ (GitHub Pages, nhánh `main`, tự triển khai khi push). Không backend, dữ liệu nằm trong `localStorage` của điện thoại (khoá `fitcore3`).

## Người dùng
- Không biết code. Viết tiếng Việt thân mật, ngắn, không thuật ngữ. Trả lời bằng tiếng Việt.
- Hay chê khi: làm ẩu rồi sửa nhiều lần, không tự review từ góc người dùng, giao diện nhiều chữ, nhập liệu chậm. Tiêu chí: **nhanh, gọn, dễ**, ít chạm.
- Với tính năng lớn: **đọc tài liệu chuyên môn trước, hỏi điểm cần chốt, rồi làm một lần**. Nêu nguồn khi đưa số liệu khoa học.
- Không dùng AI trả phí, không gửi dữ liệu đi đâu.
- Mục tiêu: recomp (giảm mỡ, giữ/tăng cơ). Đo bằng thước dây và cân thường.
- Tập tạ 4 buổi/tuần Upper/Lower (đã cân nhắc PPL và chọn giữ U/L), **ngày không cố định**, tập buổi tối. Mỗi buổi Upper theo chủ đề: A ngực + lưng dày, phụ ép ngực, tay sau; B vai + lưng rộng, phụ bay vai, tay trước. Không để buổi quá dài: tay sau, tay trước cuối buổi dài là không tập nổi. Phòng tập **không có leg curl ngồi**; leg press sau RDL làm mỏi lưng dưới.
- Cầu lông 1 buổi/tuần (thứ 7 hoặc CN), 2–3 tiếng, đánh căng. Có máy chạy bộ chỉnh dốc và elliptical.
- Ăn: sáng mua ngoài (bánh mì, xôi), trưa cơm căng tin, tối tự nấu. **Không ăn cá.** Đạm chính: bò, lợn, gà, trứng; cơm, rau tuỳ ý; gia vị sả, gừng, tỏi…
- Calo mục tiêu giữ nguyên mỗi ngày (không ăn bù calo cardio).

## Tệp
- `index.html`: khung, 3 tab (Tập, Ăn, Tiến độ), bảng trượt `#sheet`, nạp `db.js` rồi `app.js`.
- `db.js` → `window.FitDB`: ~215 thực phẩm (macro trên 100g, đơn vị "tên:gram", tên gọi khác), 55 bài tập, `parse("150g gà, 1 chén cơm")`, `search`, `calc`, `addCustom` (đồ đóng gói người dùng lưu). Thịt cá: tên chung → bản **chín**; bản sống cần chữ "sống".
- `app.js`: một IIFE, ES5, render bằng chuỗi HTML, sự kiện qua `data-act` (`view` cho trang, `sheet` cho bảng trượt). Các phần chính:
  - Dữ liệu: `MUSCLES`, `EQUIP`, `EXL` (thư viện bài), `PROGRAM` (UA, LA, UB, LB theo vị trí, mỗi vị trí có danh sách bài xếp ưu tiên), `DPRO`, `DSTY`, `DFLAV`, `DVEG` (ghép bữa tối), `CARDIO` (MET).
  - Trạng thái `S` (`blank()`): `profile`, `plan`, `workouts`, `draft`, `food{ngày:[{meal s|t|c|d, n, kcal, p, c, f, parts:[{id,g}]}]}`, `weight`, `waist`, `neck`, `cardio`, `cardioLast`, `custom`, `swaps`, `equip`.
  - Tập: `todayPlan` (gợi ý theo lịch thực tế, hôm sau cầu lông đẩy Upper lên), `nextKey` (buổi lâu chưa tập nhất), `suggest` (tăng tiến kép theo RIR), `vWorkout`, `moveEx`, `finishWorkout`.
  - Ăn: `vFood` (vòng calo, 4 khối bữa), `openAdd`, `mealRows` (thêm món theo thành phần), `numHtml` (đồ đóng gói), `dinnerCard`, `dAuto`, `openDinner` (ghép bữa tối).
  - Cardio: `cardioCalc` (ACSM cho đi bộ dốc, Keytel cho elliptical có nhịp tim, Compendium cho phần còn lại), `openCardio`.
  - Tiến độ: `estimateTDEE` (TDEE tự học), `autoCheckin` (thứ Hai), `bodyAnalysis` (công thức Hải quân Mỹ), `progressHero`, `reportCard`, `strengthReport`, `volume`, `calendarCard`, `claudeText` (xuất dữ liệu cho Claude).
- `styles.css`: token màu sáng/tối ở `:root`; phần thêm sau ghi chú `/* vX.Y: ... */` ở cuối.
- `sw.js`: bộ nhớ đệm offline, **tăng `VERSION` mỗi lần phát hành**.
- `du-lieu.html`: trang tra cứu dữ liệu thực phẩm, bài tập.
- `tests/smoke.js` + `tests/seed.js`: chạy thử các luồng chính với dữ liệu giả lập 3 tuần.
- `README.md`: hướng dẫn cho người dùng và bảng "Cách tính".

## Quy ước
- Giữ ES5 và phong cách sẵn có (`var`, `function`, chuỗi nối). Chú thích tiếng Việt, ngắn.
- Ô nhập số dùng `gIn(...)` (gõ tự do, bấm vào là chọn sẵn). Không dùng nút ± bước cố định thay cho ô nhập.
- Mọi chỗ nhập theo ngày phải chọn được ngày khác hôm nay; mọi món ăn phải chọn được bữa.
- Khi đổi cấu trúc dữ liệu, vẫn đọc được dữ liệu cũ của người dùng (không xoá).
- Phát hành: dùng skill `release` (tăng phiên bản, chạy thử, commit, push).
- Commit: `git -c user.name="paul1803-coding" -c user.email="paul1803-coding@users.noreply.github.com" commit`, thông điệp tiếng Việt, kết thúc bằng các dòng ghi công mà hệ thống yêu cầu. **Không** đưa email thật của người dùng vào repo. Push thẳng `main`. Không tạo PR nếu không được yêu cầu.
- Repo công khai: không ghi số đo cơ thể hay thông tin cá nhân vào tệp.
