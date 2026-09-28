# Các giao diện của hệ thống

```text
frontend/
├── web-nhan-vien-dieu-phoi/   # React + Vite, cổng 5173
├── web-admin/                # React + Vite, cổng 5174
├── mobile-nguoi-bao-tin/      # Expo, cổng 8081
└── mobile-nhan-vien-cuu-ho/   # Expo, cổng 8082
```

Backend dùng chung nằm tại `../backend`, mặc định cổng 5000.

Mỗi thư mục là một dự án độc lập, có `package.json` và lockfile riêng. Chạy `npm install` trong từng thư mục khi mới tải dự án. Không chạy cài đặt ở thư mục `frontend` vì đây chỉ là thư mục nhóm; React của web và Expo được giữ độc lập.

## Chạy web

Trong `web-nhan-vien-dieu-phoi` hoặc `web-admin`, chạy `npm run dev`. Kiểm tra bản dựng bằng `npm run build`.

Web admin là bộ khung ban đầu, có nút gọi `GET /api/health` thật. Chưa có đăng nhập, phân quyền hay quản lý dữ liệu. Vai trò admin phải được backend xác thực khi bổ sung các chức năng quản trị.

Web admin dùng cùng bộ phiên bản React/Vite với web điều phối. Khi cài đặt, npm báo 2 cảnh báo bảo mật (1 moderate, 1 high); cần rà soát và nâng cấp thư viện trước khi phát hành.

Khi phát triển, Vite của web admin chuyển tiếp `/api` đến `http://localhost:5000`. Nếu backend dùng địa chỉ khác, sao chép `web-admin/.env.example` thành `.env` trong cùng thư mục và đổi `BACKEND_URL`, sau đó khởi động lại Vite. Khi triển khai bản build hoặc dùng `vite preview`, cần reverse proxy `/api` đến backend; proxy phát triển của Vite không nằm trong bản build.

## Chạy mobile

Trong mỗi thư mục mobile, cấu hình `.env` rồi chạy `npm start`. Xem [hướng dẫn mobile](../MOBILE.md) để cấu hình IP cho điện thoại thật.
