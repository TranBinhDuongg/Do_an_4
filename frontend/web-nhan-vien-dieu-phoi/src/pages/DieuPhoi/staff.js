export const staff = [
  { id: 'NV01', name: 'Nguyễn Văn An', skills: ['Cứu hộ', 'Lái xe'], onDuty: true },
  { id: 'NV02', name: 'Trần Minh Bình', skills: ['Cứu hộ'], onDuty: true },
  { id: 'NV03', name: 'Lê Mai Chi', skills: ['Thú y', 'Cứu hộ'], onDuty: true },
  { id: 'NV04', name: 'Phạm Anh Dũng', skills: ['Lái xe', 'Cứu hộ'], onDuty: true },
  { id: 'NV05', name: 'Hoàng Thu Hà', skills: ['Cứu hộ'], onDuty: true },
  { id: 'NV06', name: 'Vũ Minh Hải', skills: ['Thú y'], onDuty: true },
  { id: 'NV07', name: 'Đỗ Ngọc Linh', skills: ['Cứu hộ', 'Lái xe'], onDuty: true },
  { id: 'NV08', name: 'Bùi Văn Nam', skills: ['Cứu hộ'], onDuty: false },
];
export const isFinished = item => ['Hoàn tất', 'Đã hủy'].includes(item.status);
export const staffName = id => staff.find(person => person.id === id)?.name || 'Chưa chỉ định';
export const assignmentFor = (reports, id, exceptId) => reports.find(item => item.id !== exceptId && !isFinished(item) && item.members.includes(id));
export function validateAssignment(reports, caseId, members, leader, roster = staff) {
  const report = reports.find(item => item.id === caseId);
  if (!report || isFinished(report)) return 'Ca đã kết thúc hoặc không còn tồn tại.';
  if (!members.length) return 'Chọn ít nhất một nhân viên tham gia.';
  if (new Set(members).size !== members.length) return 'Danh sách nhân viên bị trùng.';
  if (!members.includes(leader)) return 'Chọn người phụ trách trong nhóm tham gia.';
  for (const id of members) {
    const person = roster.find(item => item.id === id);
    if (!person || !person.onDuty) return 'Có nhân viên không trong ca trực.';
    if (assignmentFor(reports, id, caseId)) return `${person.name} đang có nhiệm vụ ở ca khác.`;
  }
  return '';
}
