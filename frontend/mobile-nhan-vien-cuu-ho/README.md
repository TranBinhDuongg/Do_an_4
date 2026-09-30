# App nhân viên cứu hộ động vật

Màn hình và context dùng JSX, điều hướng Expo Router, Expo SDK 57. Các module nghiệp vụ hiện có giữ `.ts`.

## Giao diện

- Mở app lần đầu thấy đăng nhập: email, mật khẩu, hiện/ẩn mật khẩu, ghi nhớ tài khoản; quản trị viên cấp lại mật khẩu.
- Chọn **Xem thử giao diện** để thử ngay khi chưa cấu hình máy chủ. Cá nhân cho đổi hai vai trò mẫu.
- Trang chủ chỉ tập trung vào ca cần xử lý. Nhãn **Bạn là nhóm trưởng / Bạn là thành viên** hiện ngay trên thẻ ca.
- **Tôi đã xem nhiệm vụ**, **Nhận nhiệm vụ** và **Bắt đầu di chuyển** là các thao tác riêng. Nhóm trưởng xác nhận tiến độ, thành viên xác nhận đã xem. Các xác nhận hiện chỉ là dữ liệu mẫu trong bộ nhớ, chưa gửi điều phối.
- Cá nhân có đăng xuất và cài đặt thông báo. Không hiển thị dữ liệu mẫu cho tài khoản thật.

## Đăng nhập thật

1. Áp dụng `backend/migrations/001-rescue-sessions.sql` vào database hiện có trước khi chạy đăng nhập nhân viên. Migration chỉ thêm bảng phiên; chưa tự động áp dụng.
2. Backend cần `JWT_SECRET` tối thiểu 32 byte và tài khoản đang hoạt động với vai trò `cuu_ho`, mật khẩu bcrypt trong bảng tài khoản hiện có. Không có tài khoản/mật khẩu mặc định mới.
3. Đặt `EXPO_PUBLIC_API_URL=http://<IP máy chủ>:5000/api` trong môi trường app. Dùng HTTPS khi triển khai.
4. Nếu thử web tại 8082, backend cần `MOBILE_WEB_ORIGINS=http://localhost:8082`; nhiều origin phân cách bằng dấu phẩy. `CLIENT_URL` của web điều phối được giữ nguyên.
5. Chạy backend và `npm start` trong thư mục mobile. Khởi động lại sau khi đổi biến môi trường.

API: POST `/api/rescue/login`, `/refresh`, `/logout`, `/device`; GET `/me`.
Access token 1 giờ; refresh token tối đa 30 ngày tính từ đăng nhập, đổi sau mỗi lần dùng và lưu dạng băm phía server. Khóa tài khoản chặn refresh và xác thực. Đăng xuất thu hồi refresh token và đăng ký thiết bị gắn với phiên; access JWT đã cấp vẫn hết hạn theo thời hạn 1 giờ (route thiết bị còn kiểm tra phiên).

App lưu refresh token trong SecureStore của Android/iOS khi bật ghi nhớ, không lưu mật khẩu. Mở lại app tự làm mới phiên; lỗi mạng hiển thị thử lại và không xóa phiên. Bản xem web lưu vào localStorage để giữ đăng nhập, chỉ nên dùng thử trên máy tin cậy; trước khi triển khai web production cần chuyển sang cookie HttpOnly và bảo vệ CSRF phù hợp. Nếu không chọn ghi nhớ, phiên chỉ ở bộ nhớ đến khi đóng app.

## Thông báo: phần đã có và phần còn thiếu

Đã có giao diện kiểm tra/bật quyền, kênh Android âm thanh và rung, lấy Expo push token và đăng ký theo phiên vào backend. Chạm thông báo mở trang thông báo bên trong app, không điều hướng theo URL tùy ý từ payload. Web có thông báo rõ chưa hỗ trợ nhận nền.

Chưa có EAS projectId, FCM/APNs credentials hoặc bản cài thử trên điện thoại. Cần cấu hình các mục này và tạo development/release build; Android Expo Go không nhận push từ xa. Không đưa private key vào app.

Nhiệm vụ ở mobile và web điều phối hiện vẫn độc lập. Chưa có API phân công chung, hàng đợi gửi push, xử lý receipts, nhắc lại và chuyển cấp cho điều phối khi chưa xác nhận. Việc đăng ký token không có nghĩa máy đã nhận nhiệm vụ; giao diện không báo hệ thống đã sẵn sàng. Đây là công việc backend tiếp theo để triển khai thực tế, không chỉ thêm khóa dịch vụ.

Máy khóa màn hình có thể nhận push khi được cấp quyền và có mạng. Máy tắt nguồn không nhận ngay. Quy trình thực tế phải theo dõi từng nhân viên đã xem, nhóm trưởng đã nhận/đã xuất phát và có gọi liên hệ khi quá hạn.

## Kiểm tra

`npm run lint`, `npm run typecheck`, `node --test tests/domain.test.cjs`, `npx expo export --platform web --platform android --platform ios`. Backend: `npm test`.
Xuất bundle và unit test không thay thế việc thử đăng nhập với MySQL thật, cũng như thử thông báo trên điện thoại.
