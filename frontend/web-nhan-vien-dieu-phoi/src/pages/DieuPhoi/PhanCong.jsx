import { useState } from 'react';
import { staff, assignmentFor, staffName, validateAssignment } from './staff';

export function PhanCong({ current, reports, onAssign }) {
  const [members, setMembers] = useState(current.members);
  const [leader, setLeader] = useState(current.leader);
  const [error, setError] = useState('');
  const editing = current.members.length > 0;
  const availabilityRank = person => !person.onDuty ? 2 : assignmentFor(reports, person.id, current.id) ? 1 : 0;
  const sortedStaff = [...staff].sort((a, b) => availabilityRank(a) - availabilityRank(b));
  return <form className="coord-action-form coord-assignment" onSubmit={event => {
    event.preventDefault();
    const reason = new FormData(event.currentTarget).get('reason')?.trim() || '';
    const validation = validateAssignment(reports, current.id, members, leader);
    if (validation || (editing && !reason)) { setError(validation || 'Nhập lý do điều chỉnh nhóm.'); return; }
    onAssign(members, leader, reason);
    setError('');
  }}>
    <fieldset><legend>Chọn nhân viên tham gia</legend><p className="coord-assignment-note">Ghép nhóm theo từng ca. Người chưa được chọn vẫn có thể nhận ca khác.</p>
    {sortedStaff.map(person => {
      const other = assignmentFor(reports, person.id, current.id);
      const unavailable = !person.onDuty || Boolean(other);
      return <label className="coord-staff-option" key={person.id}><input type="checkbox" checked={members.includes(person.id)} disabled={unavailable} onChange={event => {
        setMembers(ids => event.target.checked ? [...ids, person.id] : ids.filter(id => id !== person.id));
        if (!event.target.checked && leader === person.id) setLeader('');
        setError('');
      }} /><span><strong>{person.name}</strong><small>{person.skills.join(' · ')}</small><small>{!person.onDuty ? 'Ngoài ca trực' : other ? `Đang bận · ${other.id}` : 'Sẵn sàng cho ca này'}</small></span></label>;
    })}</fieldset>
    <label>Người phụ trách ca<select required value={leader} onChange={event => { setLeader(event.target.value); setError(''); }}><option value="">Chọn người phụ trách</option>{members.map(id => <option value={id} key={id}>{staffName(id)}</option>)}</select></label>
    <p className="coord-assignment-note">Đã chọn {members.length} nhân viên. Điều phối kiểm tra số lượng và kỹ năng phù hợp trước khi giao.</p>
    {editing && <label>Lý do bổ sung hoặc thay người<textarea name="reason" required placeholder="Ghi rõ người bổ sung, người được thay và lý do" /></label>}
    {error && <p className="coord-assignment-error" role="alert">{error}</p>}
    <button className="coord-primary">{editing ? 'Lưu điều chỉnh nhóm' : 'Giao nhiệm vụ cho nhóm'}</button>
  </form>;
}
