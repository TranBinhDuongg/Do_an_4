import { useEffect, useRef, useState } from 'react';
import './tai-khoan.css';

export function TrangTaiKhoan() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const feedback = useRef(null);
  useEffect(() => {
    document.title = 'Đăng nhập điều phối | Trạm cứu hộ';
  }, []);
  useEffect(() => { if (notice) feedback.current?.focus(); }, [notice]);
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next = {};
    if (!String(data.get('email') || '').trim() || !form.elements.email.validity.valid) next.email = 'Nhập đúng địa chỉ email do trung tâm cấp.';
    if (!data.get('password')) next.password = 'Vui lòng nhập mật khẩu.';
    setErrors(next); setNotice('');
    if (Object.keys(next).length) { form.elements[Object.keys(next)[0]].focus(); return; }
    // No authentication endpoint exists. Never simulate a session or store credentials.
    setNotice('Chức năng đăng nhập chưa được kết nối. Thông tin của bạn chưa được gửi hoặc lưu.');
  }
  function field(name, label, type, placeholder) {
    return <div className="dispatch-field"><label htmlFor={name}>{label}</label><div className="dispatch-input"><input id={name} name={name} type={type === 'password' && showPassword ? 'text' : type} autoComplete={name === 'email' ? 'username' : 'current-password'} placeholder={placeholder} required autoCapitalize="none" spellCheck={false} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={() => { setErrors(current => ({...current, [name]: undefined})); setNotice(''); }} />{name === 'password' && <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword}>{showPassword ? 'Ẩn' : 'Hiện'}</button>}</div>{errors[name] && <p className="dispatch-error" id={`${name}-error`}>{errors[name]}</p>}</div>;
  }
  return <div className="dispatch-auth">
    <a className="skip-link" href="#login-form">Đến biểu mẫu đăng nhập</a>
    <header className="dispatch-header"><a className="dispatch-brand" href="#dang-nhap"><span className="dispatch-monogram" aria-hidden="true">CH</span><span>Trạm cứu hộ<small>QUẢN LÝ & ĐIỀU PHỐI</small></span></a><span className="internal-label">Cổng nhân viên <span aria-hidden="true">/</span> Điều phối cứu hộ</span></header>
    <main className="dispatch-layout">
      <aside className="dispatch-story" aria-label="Hoạt động cứu hộ động vật"><div><span className="dispatch-eyebrow">ĐỒNG HÀNH CÙNG ĐỘI CỨU HỘ</span><h1>Kết nối kịp thời.<br />Cứu hộ đúng lúc.</h1><p>Từ tin báo đầu tiên đến khi bàn giao.<br />Phối hợp cùng đội ngũ trong từng ca cứu hộ.</p></div><img className="dispatch-photo" src="/images/cho-meo-cuu-ho.png" alt="Chó và mèo được chăm sóc tại trung tâm cứu hộ" width="1086" height="1448" fetchPriority="high" /><div className="dispatch-workflow"><span>Tiếp nhận</span><span aria-hidden="true">→</span><span>Điều phối</span><span aria-hidden="true">→</span><span>Bàn giao</span></div></aside>
      <section className="dispatch-login" aria-labelledby="login-heading"><div className="dispatch-form-wrap"><div className="dispatch-role">KHÔNG GIAN LÀM VIỆC NỘI BỘ</div><h2 id="login-heading">Đăng nhập điều phối</h2><p className="dispatch-intro">Sử dụng tài khoản được cấp để tiếp nhận tin báo và điều phối đội cứu hộ.</p>
        <form id="login-form" onSubmit={submit} noValidate tabIndex={-1}>{field('email', 'Email nhân viên', 'email', 'Nhập email được cấp')}{field('password', 'Mật khẩu', 'password', 'Nhập mật khẩu')}<button className="dispatch-submit" type="submit">Đăng nhập <span aria-hidden="true">→</span></button>{notice && <p className="dispatch-feedback" role="status" ref={feedback} tabIndex={-1}>{notice}</p>}</form>
        <div className="dispatch-access"><span className="dispatch-access-mark" aria-hidden="true">i</span><p><strong>Tài khoản do trung tâm cấp</strong><br />Nếu chưa có quyền truy cập, vui lòng liên hệ quản trị viên.</p></div></div><p className="dispatch-form-footer">Dành cho nhân viên tiếp nhận và điều phối cứu hộ.</p></section>
    </main><footer className="dispatch-footer"><span>Hệ thống quản lý và điều phối hoạt động cứu hộ động vật</span><span>Trạm cứu hộ · Cổng nội bộ</span></footer>
  </div>;
}

