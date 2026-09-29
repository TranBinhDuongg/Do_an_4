import { useEffect, useRef, useState } from 'react';
import './dieu-phoi.css';
import { staff, staffName, assignmentFor, validateAssignment, isFinished } from './staff';
import { PhanCong } from './PhanCong';

const seed = [
  { id: 'CH-0248', title: 'Chó bị thương bên đường', location: 'Nguyễn Văn Linh, Hưng Yên', animal: 'Chó · 1 cá thể', priority: 'Khẩn cấp', status: 'Tin mới', members: [], leader: '', description: 'Chó nằm gần lề đường, có dấu hiệu bị thương ở chân. Cần kiểm tra vị trí và điều kiện tiếp cận.', reporter: 'Người báo tin mẫu 01', phone: '', log: ['09:42 · Tiếp nhận thông tin ban đầu'] },
  { id: 'CH-0247', title: 'Mèo mắc kẹt trong nhà kho', location: 'Khu vực Hiến Nam, Hưng Yên', animal: 'Mèo · 2 cá thể', priority: 'Cao', status: 'Chờ xác nhận', members: ['NV03', 'NV04'], leader: 'NV03', description: 'Người báo tin phát hiện hai mèo trong nhà kho và có thể hướng dẫn đội đến vị trí.', reporter: 'Người báo tin mẫu 02', phone: '', log: ['09:35 · Ghi nhận tin báo', '09:38 · Phân công Lê Mai Chi, Phạm Anh Dũng; phụ trách: Lê Mai Chi'] },
  { id: 'CH-0246', title: 'Chó đi lạc trong khu dân cư', location: 'Khu vực An Tảo, Hưng Yên', animal: 'Chó · 1 cá thể', priority: 'Thông thường', status: 'Đang cứu hộ', members: ['NV01', 'NV02'], leader: 'NV01', description: 'Đội đang kiểm tra hiện trường và đặc điểm nhận dạng của động vật.', reporter: 'Người báo tin mẫu 03', phone: '', log: ['09:10 · Ghi nhận tin báo', '09:25 · Đội đã đến hiện trường'] },
  { id: 'CH-0245', title: 'Ba mèo con bị bỏ rơi', location: 'Khu vực Lê Lợi, Hưng Yên', animal: 'Mèo · 3 cá thể', priority: 'Cao', status: 'Chờ điều phối', members: [], leader: '', description: 'Mèo con được phát hiện trong thùng giấy. Đã có thông tin vị trí để điều phối.', reporter: 'Người báo tin mẫu 04', phone: '', log: ['08:56 · Ghi nhận tin báo', '09:00 · Chuyển điều phối'] },
  { id: 'CH-0244', title: 'Bàn giao chó được cứu hộ', location: 'Điểm tiếp nhận trung tâm', animal: 'Chó · 1 cá thể', priority: 'Thông thường', status: 'Hoàn tất', members: ['NV05', 'NV07'], leader: 'NV05', description: 'Động vật đã được bàn giao cho nhân viên tiếp nhận.', reporter: 'Người báo tin mẫu 05', phone: '', log: ['08:20 · Tiếp nhận', '09:05 · Bàn giao tại trung tâm'], handover: 'Trung tâm · Người nhận mẫu · 1 chó' },
];
const finished = isFinished;
const nextSteps = { 'Tin mới': ['Chờ điều phối', 'Tiếp nhận yêu cầu'], 'Đang di chuyển': ['Đang cứu hộ', 'Ghi nhận đã đến hiện trường'], 'Đang cứu hộ': ['Đang vận chuyển', 'Ghi nhận đang vận chuyển'] };
const statuses = ['Tin mới', 'Chờ điều phối', 'Chờ xác nhận', 'Đã nhận nhiệm vụ', 'Đang di chuyển', 'Đang cứu hộ', 'Đang vận chuyển', 'Hoàn tất', 'Đã hủy'];
const time = () => new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
const tone = text => text === 'Khẩn cấp' ? 'danger' : ['Cao', 'Chờ xác nhận'].includes(text) ? 'warning' : ['Sẵn sàng', 'Hoàn tất'].includes(text) ? 'success' : 'muted';
function Badge({ children }) { return <span className={`coord-badge ${tone(children)}`}>{children}</span>; }

export function TrangDieuPhoi({ user, onLogout }) {
  const [reports, setReports] = useState(seed);
  const [section, setSection] = useState('Tổng quan');
  const [selected, setSelected] = useState(seed[0].id);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Tất cả');
  const [notice, setNotice] = useState('');
  const [validation, setValidation] = useState('');
  const dialog = useRef(null);
  const active = reports.filter(item => !finished(item));
  const occupied = id => Boolean(assignmentFor(reports, id));
  const visible = reports.filter(item => (section !== 'Lịch sử' || finished(item)) && (status === 'Tất cả' || item.status === status) && `${item.id} ${item.title} ${item.location}`.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')));
  const current = visible.find(item => item.id === selected) || visible[0];
  useEffect(() => { document.title = 'Bàn điều phối | Trạm cứu hộ'; return () => { document.title = 'Đăng nhập điều phối | Trạm cứu hộ'; }; }, []);
  function changePage(name) { setSection(name); setSearch(''); setStatus('Tất cả'); setNotice(''); }
  function update(patch, description) {
    setReports(items => items.map(item => item.id === current.id ? { ...item, ...patch, log: [...item.log, `${time()} · ${description} · ${user.name}`] } : item));
    setNotice(description);
  }
  function assign(members, leader, reason) {
    const error = validateAssignment(reports, current.id, members, leader);
    if (error) { setNotice(error); return; }
    const before = current.members.map(staffName).join(', ');
    const description = (current.members.length ? 'Điều chỉnh nhóm từ [' + before + '] sang ' : 'Phân công ') + members.map(staffName).join(', ') + '; phụ trách: ' + staffName(leader) + (reason ? '; lý do: ' + reason : '');
    update({ members, leader, status: ['Chờ điều phối', 'Chờ xác nhận', 'Đã nhận nhiệm vụ'].includes(current.status) ? 'Chờ xác nhận' : current.status }, description);
  }
  function create(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (Object.values(data).some(value => !value.trim())) { setValidation('Vui lòng điền đầy đủ thông tin, không chỉ nhập khoảng trắng.'); return; }
    const id = `CH-${Math.max(...reports.map(item => Number(item.id.slice(3)))) + 1}`;
    setReports(items => [{ ...data, id, status: 'Tin mới', members: [], leader: '', log: [`${time()} · Nhập tin báo qua điện thoại · ${user.name}`] }, ...items]);
    changePage('Tin báo cứu hộ'); setSelected(id); setNotice(`Đã thêm ${id} vào dữ liệu mẫu.`); dialog.current.close(); event.currentTarget.reset(); setValidation('');
  }
  return <div className="coord-app">
    <aside className="coord-sidebar"><div className="coord-brand"><span>CH</span><div>Trạm cứu hộ<small>ĐIỀU PHỐI HOẠT ĐỘNG</small></div></div><p className="coord-nav-caption">KHÔNG GIAN LÀM VIỆC</p><nav aria-label="Điều hướng chính">{['Tổng quan', 'Tin báo cứu hộ', 'Nhân sự cứu hộ', 'Lịch sử'].map((name, index) => <button key={name} aria-current={section === name ? 'page' : undefined} onClick={() => changePage(name)}><span aria-hidden="true">{['▦', '☷', '◎', '◷'][index]}</span>{name}{name === 'Tin báo cứu hộ' && <b>{active.length}</b>}</button>)}</nav><div className="coord-sidebar-bottom"><p>Tiếp nhận kịp thời.<br />Phối hợp trong từng ca cứu hộ.</p><div className="coord-user"><span>{user.name?.slice(0, 1) || 'Đ'}</span><div><strong>{user.name}</strong><small>Nhân viên điều phối</small></div></div><button className="coord-logout" onClick={onLogout}>Đăng xuất <span aria-hidden="true">↗</span></button></div></aside>
    <div className="coord-workspace"><header className="coord-topbar"><span>Trung tâm cứu hộ <span className="coord-divider">/</span> {section}</span><span className="coord-sample">Dữ liệu mẫu</span></header><main className="coord-main"><div className="coord-heading"><div><p className="coord-eyebrow">BÀN ĐIỀU PHỐI</p><h1>{section === 'Tổng quan' ? 'Theo dõi từng ca cứu hộ.' : section}</h1><p>Tiếp nhận tin báo, kết nối nhóm cứu hộ và theo dõi bàn giao.</p></div><button className="coord-primary" onClick={() => { setValidation(''); dialog.current.showModal(); }}>＋ Tiếp nhận tin báo</button></div><p className="coord-demo-note">Bản mẫu nghiệp vụ: thay đổi chỉ giữ trong phiên này, chưa gửi thông báo đến nhóm cứu hộ.</p><div className="coord-notice" role="status">{notice}</div>
    <section className="coord-stats" aria-label="Tổng hợp hoạt động">{[['Chờ xử lý', active.filter(item => !item.members.length).length, 'Cần tiếp nhận hoặc phân công'], ['Chờ xác nhận', active.filter(item => item.status === 'Chờ xác nhận').length, 'Cần theo dõi phản hồi của nhóm'], ['Đang thực hiện', active.filter(item => item.members.length > 0 && item.status !== 'Chờ xác nhận').length, 'Đã nhận nhiệm vụ hoặc đang xử lý'], ['Nhân viên sẵn sàng', staff.filter(item => item.onDuty && !occupied(item.id)).length, 'Có thể nhận nhiệm vụ mới']].map(([label, count, caption], index) => <article key={label}><div>{label}<span aria-hidden="true">{['↳', '◷', '↗', '◎'][index]}</span></div><strong>{String(count).padStart(2, '0')}</strong><p>{caption}</p></article>)}</section>
    {section === 'Nhân sự cứu hộ' ? <section className="coord-team-grid" aria-label="Nhân viên cứu hộ">{staff.map(person => { const task = assignmentFor(reports, person.id); return <article key={person.id}><Badge>{!person.onDuty ? 'Ngoài ca trực' : task ? 'Đang có nhiệm vụ' : 'Sẵn sàng'}</Badge><h2>{person.name}</h2><p>{person.id} · {person.skills.join(' · ')}</p><p>{task ? task.id + ' · ' + task.title : 'Chưa có ca được phân công.'}</p>{task && <p>{task.leader === person.id ? 'Phụ trách ca' : 'Thành viên tham gia'}</p>}<button className="coord-secondary" onClick={() => { changePage('Tin báo cứu hộ'); if (task) { setSelected(task.id); setSearch(task.id); } else setStatus('Chờ điều phối'); }}>{task ? 'Xem nhiệm vụ' : 'Xem ca chờ điều phối'} →</button></article>; })}</section> : <div className="coord-columns"><section className="coord-panel"><div className="coord-panel-heading"><div><h2>{section === 'Lịch sử' ? 'Ca đã kết thúc' : 'Tin báo & ca cứu hộ'}</h2><p>{visible.length} yêu cầu</p></div><span aria-hidden="true">↙</span></div><div className="coord-filters"><input aria-label="Tìm kiếm tin báo" placeholder="Tìm mã ca, nội dung, địa điểm…" value={search} onChange={event => setSearch(event.target.value)} /><select aria-label="Lọc trạng thái" value={status} onChange={event => setStatus(event.target.value)}><option>Tất cả</option>{statuses.map(value => <option key={value}>{value}</option>)}</select></div><div className="coord-list">{visible.map(item => <button className={`coord-report ${current?.id === item.id ? 'selected' : ''}`} key={item.id} aria-pressed={current?.id === item.id} onClick={() => { setSelected(item.id); setNotice(''); }}><div className="coord-report-meta"><span>{item.id}</span><Badge>{item.priority}</Badge></div><h3>{item.title}</h3><p>{item.location}</p><div className="coord-report-bottom"><span>{item.status}</span><span>{item.members.length ? item.members.length + ' người · ' + staffName(item.leader) : 'Chưa phân công'} ↗</span></div></button>)}{!visible.length && <div className="coord-empty"><h3>Không có yêu cầu phù hợp</h3><p>Thử thay đổi từ khóa hoặc trạng thái.</p><button className="coord-secondary" onClick={() => { setSearch(''); setStatus('Tất cả'); }}>Xóa bộ lọc</button></div>}</div></section>
    <aside className="coord-panel coord-detail" aria-label="Chi tiết yêu cầu"><div className="coord-panel-heading"><h2>Chi tiết yêu cầu</h2><span>{current?.id || '—'}</span></div>{current ? <div className="coord-detail-content" key={current.id}><Badge>{current.priority}</Badge><h2>{current.title}</h2><p className="coord-description">{current.description}</p><dl><dt>Địa điểm</dt><dd>{current.location}</dd><dt>Động vật</dt><dd>{current.animal}</dd><dt>Người báo</dt><dd>{current.reporter}</dd><dt>Liên hệ</dt><dd>{current.phone ? <a href={`tel:${current.phone}`}>{current.phone}</a> : 'Chưa có số trong dữ liệu mẫu'}</dd><dt>Phụ trách ca</dt><dd>{staffName(current.leader)}</dd><dt>Nhóm tham gia</dt><dd>{current.members.length ? current.members.map(staffName).join(', ') : 'Chưa phân công'}</dd><dt>Trạng thái</dt><dd>{current.status}</dd></dl>
    {nextSteps[current.status] && <button className="coord-primary coord-full" onClick={() => update({ status: nextSteps[current.status][0] }, nextSteps[current.status][1])}>{nextSteps[current.status][1]}</button>}
    {current.status === 'Đã nhận nhiệm vụ' && <div className="coord-waiting" role="status">
      <p><strong>Chờ nhóm trưởng xác nhận xuất phát</strong></p>
      <p>Nhóm đã nhận nhiệm vụ. Chưa có xác nhận xuất phát từ {staffName(current.leader)}.</p>
      <p>Nhóm trưởng xác nhận trên app khi bắt đầu di chuyển.</p>
    </div>}
    {current.status === 'Chờ xác nhận' && <div className="coord-waiting">
      <p><strong>Đang chờ nhóm xác nhận trên app</strong></p>
      <p>Người phụ trách ca xác nhận sau khi kiểm tra khả năng tham gia của nhóm.</p>
      <details className="coord-exception"><summary>Xác nhận thay qua cuộc gọi</summary>
        <form className="coord-action-form" onSubmit={event => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const contact = String(data.get('contact') || '');
          const confirmation = String(data.get('confirmation') || '').trim();
          if (!current.members.includes(contact) || !confirmation) { setNotice('Chọn người đã liên hệ và nhập nội dung xác nhận.'); return; }
          update({ status: 'Đã nhận nhiệm vụ' }, `Xác nhận thay qua cuộc gọi; người liên hệ: ${staffName(contact)}; nội dung: ${confirmation}`);
        }}>
          <p>Chỉ ghi nhận sau khi đã gọi và được xác nhận nhóm có thể nhận nhiệm vụ.</p>
          <label>Người đã liên hệ<select name="contact" required defaultValue=""><option value="" disabled>Chọn thành viên đã xác nhận</option>{current.members.map(id => <option key={id} value={id}>{staffName(id)}{id === current.leader ? ' — Phụ trách ca' : ''}</option>)}</select></label>
          <label>Nội dung xác nhận<textarea name="confirmation" required maxLength={1000} placeholder="Ghi rõ nội dung trao đổi và khả năng tham gia của nhóm" /></label>
          <button className="coord-secondary" type="submit">Lưu xác nhận qua cuộc gọi</button>
        </form>
      </details>
    </div>}
    {current.status === 'Chờ điều phối' && <PhanCong key={current.id + current.log.length} current={current} reports={reports} onAssign={assign} />}
    {current.members.length > 0 && !finished(current) && <details className="coord-exception"><summary>Bổ sung / điều chỉnh nhân sự</summary><PhanCong key={current.id + current.log.length} current={current} reports={reports} onAssign={assign} /></details>}
    {current.status === 'Đang vận chuyển' && <form className="coord-action-form" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); const fields = ['place', 'receiver', 'animals'].map(key => data.get(key).trim()); if (fields.some(value => !value)) { setNotice('Vui lòng điền đủ thông tin bàn giao.'); return; } const handover = fields.join(' · '); update({ status: 'Hoàn tất', handover }, `Bàn giao: ${handover}`); }}><label>Nơi tiếp nhận<input name="place" required /></label><label>Người nhận<input name="receiver" required /></label><label>Động vật và tình trạng<textarea name="animals" required /></label><button className="coord-primary">Bàn giao & đóng ca</button></form>}
    {current.handover && <p className="coord-handover">Đã bàn giao: {current.handover}</p>}
    {!finished(current) && <details className="coord-exception"><summary>Không thể tiếp tục xử lý?</summary><form className="coord-action-form" onSubmit={event => { event.preventDefault(); const reason = new FormData(event.currentTarget).get('reason').trim(); if (reason) update({ status: 'Đã hủy' }, `Kết thúc không thành công: ${reason}`); else setNotice('Cần nhập lý do kết thúc ca.'); }}><label>Lý do kết thúc<textarea name="reason" required placeholder="Không tìm thấy động vật, yêu cầu trùng…" /></label><button className="coord-secondary">Ghi nhận kết thúc không thành công</button></form></details>}
    <div className="coord-timeline"><h3>Lịch sử xử lý</h3><ol>{current.log.map((entry, index) => <li key={index}>{entry}</li>)}</ol></div></div> : <p className="coord-empty">Chọn một yêu cầu để xem thông tin.</p>}</aside></div>}
    </main><footer className="coord-footer"><span>Trạm cứu hộ · Cổng điều phối</span><span>Tiếp nhận → Điều phối → Cứu hộ → Bàn giao</span></footer></div>
    <dialog ref={dialog} className="coord-dialog" aria-labelledby="report-title"><form onSubmit={create}><div className="coord-panel-heading"><h2 id="report-title">Tiếp nhận tin báo</h2><button type="button" className="coord-close" aria-label="Đóng" onClick={() => dialog.current.close()}>×</button></div><p>Ghi nhận thông tin được cung cấp qua điện thoại.</p><label>Nội dung tin báo<input name="title" required maxLength={120} /></label><label>Địa điểm<input name="location" required /></label><div className="coord-form-row"><label>Người báo tin<input name="reporter" required /></label><label>Số điện thoại<input name="phone" type="tel" pattern="[+0-9 ()-]{9,20}" required /></label></div><div className="coord-form-row"><label>Động vật và số lượng<input name="animal" required placeholder="Chó · 1 cá thể" /></label><label>Mức ưu tiên<select name="priority"><option>Thông thường</option><option>Cao</option><option>Khẩn cấp</option></select></label></div><label>Mô tả hiện trường<textarea name="description" rows={3} required /></label>{validation && <p role="alert">{validation}</p>}<button className="coord-primary coord-full">Lưu tin báo</button></form></dialog>
  </div>;
}
