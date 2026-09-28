# Hai ứng dụng mobile

- `nguoi-bao-tin`: ứng dụng dành cho người báo tin.
- `nhan-vien-cuu-ho`: ứng dụng dành cho nhân viên cứu hộ.
- Cả hai dùng React Native, Expo và TypeScript, kết nối cùng backend Express.

## Chạy ứng dụng

Yêu cầu Node.js từ 22.13 trở lên. Hai app được khởi tạo với Expo SDK 57.

1. Trong `backend`, chạy `npm install` (lần đầu), sau đó `npm run dev`. Backend mặc định dùng cổng 5000.
2. Trong từng thư mục mobile, sao chép `.env.example` thành `.env` và đặt `EXPO_PUBLIC_API_URL` thành địa chỉ backend, bao gồm `/api`.
3. Chạy `npm install` (lần đầu), rồi `npm start` trong thư mục app muốn mở.
4. Mở Expo Go tương thích phiên bản Expo của dự án và quét QR. Điện thoại và máy tính cần truy cập được nhau qua mạng.

Hai app sử dụng cổng Metro khác nhau: người báo tin 8081, cứu hộ 8082, nên có thể chạy đồng thời trong hai terminal.

### Địa chỉ backend khi phát triển

- Điện thoại thật: `http://<IP-LAN-của-máy-tính>:5000/api`, ví dụ `http://192.168.1.10:5000/api`.
- Android Emulator: `http://10.0.2.2:5000/api`.
- iOS Simulator trên Mac chạy backend: `http://localhost:5000/api`.

`localhost` trên điện thoại trỏ về điện thoại, không phải máy tính. Cho phép cổng backend qua tường lửa trên mạng phát triển tin cậy nếu cần. Khởi động lại Expo sau khi đổi `.env`. Expo tunnel chỉ chuyển tiếp Metro, không tự chuyển tiếp backend.

## Phạm vi hiện tại

Đây là bộ khung khởi đầu với giao diện theo vai trò và nút gọi API thật `GET /api/health`. Chưa có đăng nhập, gửi tin báo, nhận nhiệm vụ, GPS hay thông báo đẩy. Các chức năng này cần API nghiệp vụ và phân quyền phía backend trước khi tích hợp. Vai trò hiển thị trong app không phải cơ chế xác thực.

Mỗi app có `src/config.ts` để đọc địa chỉ API và `src/api.ts` để kiểm tra kết nối. Không đặt mật khẩu, khóa bí mật hay thông tin kết nối database trong biến `EXPO_PUBLIC_*` vì chúng được đóng gói vào app. Khi triển khai thực tế, dùng backend HTTPS.

## Kiểm tra

Trong từng app: `npm run typecheck`, `npm run lint` và `npx expo install --check`.

Đã kiểm tra TypeScript, lint, tính tương thích thư viện, xuất bundle Android/iOS (`npx expo export --platform android --platform ios`) và phản hồi `/api/health` của backend. Chưa kiểm tra trực tiếp trên điện thoại hoặc tạo bản cài APK/IPA.

Khi cài đặt, npm báo 10 cảnh báo bảo mật mức moderate trong cây phụ thuộc của mỗi app. Cần rà soát bằng `npm audit` trước khi phát hành; không tự động chạy `npm audit fix --force` vì có thể làm lệch bộ phiên bản Expo.

Android/iOS có mã định danh khác nhau cho hai app. Các mã `com.doan4.*` là giá trị khởi đầu; đổi sang mã định danh của bạn trước khi phát hành.
