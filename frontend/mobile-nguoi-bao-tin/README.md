# App báo tin cứu hộ động vật

Ứng dụng dành cho người phát hiện động vật bị thương, bị bỏ rơi hoặc mắc kẹt. Giao diện không yêu cầu đăng nhập. Màn hình chính gồm gọi đội cứu hộ và báo bằng ảnh hiện trường kèm vị trí máy hiện tại.

## Chạy ứng dụng

Sao chép `.env.example` thành `.env`, điền số trực chính thức vào `EXPO_PUBLIC_RESCUE_PHONE` rồi chạy `npm start`. Mở trên điện thoại để thử camera, vị trí và trình gọi điện. Không có số mặc định để tránh gọi nhầm đơn vị.

## Luồng báo tin

Chụp ảnh → lấy vị trí → bổ sung mô tả tùy chọn → xem lại. Camera và vị trí chỉ xin quyền khi người dùng bấm thao tác tương ứng. Vị trí có thời gian ghi nhận và độ chính xác; có thể cập nhật hoặc chụp lại ảnh. Khi không có quyền, GPS tắt hoặc hết thời gian tìm vị trí, ứng dụng hiển thị hướng dẫn thử lại. Ảnh và mô tả được giữ trong bộ nhớ khi đóng màn hình, mất khi khởi động lại ứng dụng.

Backend hiện chưa có API tiếp nhận tin báo công khai. Màn hình xem lại ghi rõ tin chưa được gửi và cung cấp thao tác gọi điện; chưa có thao tác gửi hoặc xác nhận tiếp nhận giả. Cần bổ sung API nhận ảnh và vị trí trước khi đưa chức năng gửi tin vào sử dụng.

Kiểm tra: `npm run typecheck`, `npm run lint`. Camera, quyền vị trí và cuộc gọi cần kiểm tra thêm trên điện thoại thật.
