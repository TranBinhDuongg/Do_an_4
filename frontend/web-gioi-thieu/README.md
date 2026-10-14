# Trang giới thiệu trung tâm cứu hộ

Website dành cho cộng đồng và người báo tin, độc lập với cổng nhân viên.

## Chạy cục bộ

```powershell
cd E:\Do_an_4\frontend\web-gioi-thieu
npm install
npm run dev
```

Mở http://localhost:5175. Build bằng `npm run build`.

## Chuyển phần

Trên màn hình từ 1024px: mỗi thao tác cuộn chuyển một màn giới thiệu sang ngang. Ngưỡng wheel 32px và nhịp khóa 550ms; độ trễ bám cuộn 350ms; không chặn phóng to hoặc cuộn ngang. Cuộn qua màn cuối tiếp tục tới hướng dẫn báo tin. Thanh điều hướng chuyển tới từng phần; nút Cách báo tin bỏ qua phần giới thiệu.

Ba bước hướng dẫn được trình bày theo chiều dọc. Thanh tiến trình cố định trên đầu màn hình chỉ xuất hiện từ phần Giới thiệu trung tâm (Một nơi để kết nối) trở xuống, gồm 9 mốc đến câu hỏi thường gặp; thanh ẩn trong bốn màn mở đầu. Mốc hiện tại cập nhật theo phần đang xem; bấm mốc để chuyển tới phần tương ứng. Thanh không hiển thị nhãn Hướng dẫn báo tin hoặc số bước. Một đường tiến trình mảnh thể hiện vị trí cuộn trong các phần nội dung này. Nội dung hiện lên 20px trong 400-450ms, khối giải thích trễ 60ms và nền parallax nhẹ (±50px). Các câu hỏi có hiệu ứng mở nội dung và xoay ký hiệu. Chuyển động dùng GSAP ScrollTrigger, IntersectionObserver và CSS; không đăng ký listener scroll riêng.

Trên màn hình nhỏ hoặc khi bật giảm chuyển động, nội dung dùng luồng cuộn dọc bình thường. Các hiệu ứng được dọn khi component unmount.

## Nội dung

Sửa nội dung và danh sách phần tại `src/pages/GioiThieu/TrangGioiThieu.jsx`; giao diện tại `gioi-thieu.css`. Ảnh dùng lại tài nguyên chó mèo sẵn có trong dự án, không dùng ảnh từ trang tham khảo.

Tên hiển thị là Trạm cứu hộ động vật. Địa chỉ minh họa: 25 đường 39A, xã Yên Mỹ, tỉnh Hưng Yên. Đường và xã là địa danh thực; số nhà 25 được chọn cho bản thiết kế, chưa xác minh một cơ sở cứu hộ hoạt động tại địa chỉ này. Liên kết bản đồ tìm địa chỉ minh họa. Nội dung chi tiết tại `ThongTinTrungTam.jsx` gồm giới thiệu, trường hợp thường gặp, quy trình, mẫu tin báo, địa điểm và câu hỏi thường gặp.

Chưa có số điện thoại, giờ tiếp nhận hoặc URL kênh báo tin chính thức. Trang không có chức năng gửi tin báo. Cần xác nhận địa chỉ và bổ sung thông tin đó trước khi công bố cho người dùng thực tế; không có số liệu, chi phí hoặc cam kết thời gian phản hồi giả định.

Giao diện dùng nền kem, xanh đậm #153F38 và cam đất #B84D32, kết hợp Segoe UI của web điều phối. Nội dung theo cách trình bày cũ: tiêu đề lớn, hai cột trên desktop, số bước lớn và khối giải thích mở; không đóng nội dung trong thẻ bo góc. Trên mobile chuyển một cột. Mặc định sáng, có nút chuyển tối trong header. Icon dùng Phosphor, ảnh dùng lại tài nguyên của hệ thống. Không đổi tên hoặc luồng nghiệp vụ trong các ứng dụng khác.

