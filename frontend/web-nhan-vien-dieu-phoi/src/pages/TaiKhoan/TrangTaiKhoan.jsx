import { useEffect, useRef, useState } from 'react';
import './tai-khoan.css';
import { login, currentUser, readSession, clearSession } from '../../services/auth';
import { TrangDieuPhoi } from '../DieuPhoi/TrangDieuPhoi';

export function TrangTaiKhoan() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const submitting = useRef(false);
  const feedback = useRef(null);
  useEffect(() => {
    document.title = 'Đăng nhập điều phối | Trạm cứu hộ';
  }, []);
  useEffect(() => { if (notice) feedback.current?.focus(); }, [notice]);
  useEffect(() => {
    let active = true;
    const saved = readSession();
    if (!saved) { setChecking(false); return; }
    currentUser(saved).then(account => {
      if (active) { setUser(account); setSession(saved); }
    }).catch(error => {
      if (active) { clearSession(); setNotice(error.message); }
    }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!session) return;
    const expire = () => {
      clearSession(); setSession(null); setUser(null);
      setNotice('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    };
    const checkExpiry = () => { if (Date.now() >= session.expiresAt) expire(); };
    const timer = setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    window.addEventListener('focus', checkExpiry);
    return () => { clearTimeout(timer); window.removeEventListener('focus', checkExpiry); };
  }, [session]);
  function logout() {
    clearSession(); setUser(null); setSession(null); setShowPassword(false);
    setNotice('Bạn đã đăng xuất.');
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current || checking) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const next = {};
    if (!String(data.get('email') || '').trim() || !form.elements.email.validity.valid) next.email = 'Nhập đúng địa chỉ email do trung tâm cấp.';
    if (!data.get('password')) next.password = 'Vui lòng nhập mật khẩu.';
    setErrors(next); setNotice('');
    if (Object.keys(next).length) { form.elements[Object.keys(next)[0]].focus(); return; }
    submitting.current = true; setPending(true);
    try {
      const result = await login(String(data.get('email')), String(data.get('password')));
      form.reset(); setShowPassword(false);
      setUser(result.user); setSession(result.session);
      setNotice('Đăng nhập thành công.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      submitting.current = false; setPending(false);
    }
  }
  function field(name, label, type, placeholder) {
    return <div className="dispatch-field"><label htmlFor={name}>{label}</label><div className="dispatch-input"><input id={name} name={name} type={type === 'password' && showPassword ? 'text' : type} autoComplete={name === 'email' ? 'username' : 'current-password'} placeholder={placeholder} required autoCapitalize="none" spellCheck={false} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} onChange={() => { setErrors(current => ({...current, [name]: undefined})); setNotice(''); }} />{name === 'password' && <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword}>{showPassword ? 'Ẩn' : 'Hiện'}</button>}</div>{errors[name] && <p className="dispatch-error" id={`${name}-error`}>{errors[name]}</p>}</div>;
  }
  if (user) return <TrangDieuPhoi user={user} onLogout={logout} />;
  return <div className="dispatch-auth">
    <a className="skip-link" href="#login-form">Đến biểu mẫu đăng nhập</a>
    <header className="dispatch-header"><a className="dispatch-brand" href="#dang-nhap"><span className="dispatch-monogram" aria-hidden="true">CH</span><span>Trạm cứu hộ<small>QUẢN LÝ & ĐIỀU PHỐI</small></span></a><span className="internal-label">Cổng nhân viên <span aria-hidden="true">/</span> Điều phối cứu hộ</span></header>
    <main className="dispatch-layout">
      <aside className="dispatch-story" aria-label="Hoạt động cứu hộ động vật"><div><span className="dispatch-eyebrow">ĐỒNG HÀNH CÙNG ĐỘI CỨU HỘ</span><h1>Kết nối kịp thời.<br />Cứu hộ đúng lúc.</h1><p>Từ tin báo đầu tiên đến khi bàn giao.<br />Phối hợp cùng đội ngũ trong từng ca cứu hộ.</p></div><img className="dispatch-photo" src="/images/cho-meo-cuu-ho.png" alt="Chó và mèo được chăm sóc tại trung tâm cứu hộ" width="1086" height="1448" fetchPriority="high" /><div className="dispatch-workflow"><span>Tiếp nhận</span><span aria-hidden="true">→</span><span>Điều phối</span><span aria-hidden="true">→</span><span>Bàn giao</span></div></aside>
      <section className="dispatch-login" aria-labelledby="login-heading"><div className="dispatch-form-wrap"><div className="dispatch-role">KHÔNG GIAN LÀM VIỆC NỘI BỘ</div><h2 id="login-heading">{user ? `Xin chào, ${user.name}` : 'Đăng nhập điều phối'}</h2><p className="dispatch-intro">Sử dụng tài khoản được cấp để tiếp nhận tin báo và điều phối đội cứu hộ.</p>
        {user ? <div id="login-form" tabIndex={-1}><p className="dispatch-intro">Bạn đã đăng nhập bằng tài khoản {user.email}.</p><button className="dispatch-submit" type="button" onClick={logout}>Đăng xuất</button></div> : <form id="login-form" onSubmit={submit} noValidate tabIndex={-1} aria-busy={pending || checking}><fieldset disabled={pending || checking} className="dispatch-fields">{field('email', 'Email nhân viên', 'email', 'Nhập email được cấp')}{field('password', 'Mật khẩu', 'password', 'Nhập mật khẩu')}<button className="dispatch-submit" type="submit">{checking ? 'Đang kiểm tra phiên…' : pending ? 'Đang đăng nhập…' : 'Đăng nhập'} <span aria-hidden="true">→</span></button></fieldset></form>}{notice && <p className="dispatch-feedback" role="status" ref={feedback} tabIndex={-1}>{notice}</p>}
        <div className="dispatch-access"><span className="dispatch-access-mark" aria-hidden="true">i</span><p><strong>Tài khoản do trung tâm cấp</strong><br />Nếu chưa có quyền truy cập, vui lòng liên hệ quản trị viên.</p></div></div><p className="dispatch-form-footer">Dành cho nhân viên tiếp nhận và điều phối cứu hộ.</p></section>
    </main><footer className="dispatch-footer"><span>Hệ thống quản lý và điều phối hoạt động cứu hộ động vật</span><span>Trạm cứu hộ · Cổng nội bộ</span></footer>
  </div>;
}
