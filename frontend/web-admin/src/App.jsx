import { useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Chưa kiểm tra kết nối');
  const [failed, setFailed] = useState(false);

  async function checkConnection() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch('/api/health', { signal: controller.signal });
      if (!response.ok) throw new Error('Hệ thống chưa phản hồi. Vui lòng thử lại.');
      const data = await response.json();
      if (data?.status !== 'OK') throw new Error('Chưa nhận được phản hồi hợp lệ từ hệ thống.');
      setStatus('Đã kết nối hệ thống');
    } catch (error) {
      setFailed(true);
      setStatus(controller.signal.aborted ? 'Kết nối quá thời gian chờ. Vui lòng thử lại.' : 'Không thể kết nối hệ thống. Vui lòng kiểm tra dịch vụ và thử lại.');
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <main className="workspace">
      <header className="header">
        <a className="brand" href="/">CỨU HỘ / QUẢN TRỊ</a>
        <span className="version">Bản khởi tạo</span>
      </header>
      <section className="intro" aria-labelledby="title">
        <p className="eyebrow">Dành cho quản trị viên</p>
        <h1 id="title">Quản trị hệ thống cứu hộ</h1>
        <p className="description">Không gian quản lý tài khoản, vai trò và cấu hình chung của hệ thống.</p>
      </section>
      <section className="connection" aria-labelledby="connection-title">
        <div>
          <h2 id="connection-title">Kết nối hệ thống</h2>
          <p role="status" className={failed ? 'error' : ''}>{loading ? 'Đang kiểm tra…' : status}</p>
        </div>
        <button onClick={checkConnection} disabled={loading}>{loading ? 'Đang kiểm tra…' : 'Kiểm tra kết nối'}</button>
      </section>
      <section className="modules" aria-labelledby="modules-title">
        <h2 id="modules-title">Phạm vi quản trị dự kiến</h2>
        <ul>
          <li><div><h3>Tài khoản và phân quyền</h3><p>Quản lý người dùng, nhân viên điều phối và lực lượng cứu hộ.</p></div><span>Chưa triển khai</span></li>
          <li><div><h3>Cấu hình hệ thống</h3><p>Thiết lập các danh mục và thông tin dùng chung.</p></div><span>Chưa triển khai</span></li>
          <li><div><h3>Nhật ký hoạt động</h3><p>Theo dõi các thay đổi trong quá trình vận hành.</p></div><span>Chưa triển khai</span></li>
        </ul>
      </section>
      <footer>Giao diện khởi tạo · Chưa có đăng nhập và chức năng quản trị dữ liệu.</footer>
    </main>
  );
}
