export const stages = ['Chờ xác nhận', 'Đã nhận nhiệm vụ', 'Đang di chuyển', 'Đang cứu hộ', 'Đang vận chuyển', 'Hoàn tất'] as const;
export const actions = ['Xác nhận nhận nhiệm vụ', 'Bắt đầu di chuyển', 'Đã đến hiện trường', 'Bắt đầu vận chuyển', 'Xác nhận bàn giao'];
export const staff = [
  { id: 'NV03', name: 'Lê Mai Chi', initials: 'MC', skills: 'Thú y · Cứu hộ' },
  { id: 'NV04', name: 'Phạm Anh Dũng', initials: 'AD', skills: 'Lái xe · Cứu hộ' },
  { id: 'NV06', name: 'Vũ Minh Hải', initials: 'MH', skills: 'Thú y' },
];
export const staffName = (id: string) => staff.find(person => person.id === id)?.name || id;
export type Handover = { recipient: string; destination: string; count: string; condition: string };
export type Mission = {
  id: string; title: string; address: string; district: string;
  priority: 'Khẩn cấp' | 'Cao' | 'Thông thường'; animal: string; count: number;
  time: string; description: string; stage: number; notes: string;
  members: string[]; leader: string; reporter: string; log: string[]; handover?: Handover;
};
export const initialMissions: Mission[] = [
  { id: 'CH-0247', title: 'Mèo mắc kẹt trong nhà kho', address: 'Khu vực Hiến Nam', district: 'Hưng Yên', priority: 'Cao', animal: 'Mèo', count: 2, time: '09:38', description: 'Người báo tin phát hiện hai mèo trong nhà kho và có thể hướng dẫn nhóm đến vị trí. Cần xác minh lối tiếp cận và tình trạng động vật tại hiện trường.', stage: 0, notes: '', members: ['NV03', 'NV04'], leader: 'NV03', reporter: 'Người báo tin mẫu 02', log: ['09:35 · Ghi nhận tin báo', '09:38 · Điều phối phân công Lê Mai Chi, Phạm Anh Dũng; phụ trách: Lê Mai Chi'] },
  { id: 'CH-0240', title: 'Bàn giao mèo bị thương', address: 'Điểm tiếp nhận trung tâm', district: 'Hưng Yên', priority: 'Cao', animal: 'Mèo', count: 1, time: '08:10', description: 'Mèo bị thương ở chân đã được đưa về trung tâm để nhân viên thú y tiếp nhận.', stage: 5, notes: 'Đã bàn giao để theo dõi và chăm sóc.', members: ['NV03', 'NV06'], leader: 'NV06', reporter: 'Người báo tin mẫu', handover: { recipient: 'Nhân viên tiếp nhận mẫu', destination: 'Trung tâm cứu hộ động vật', count: '1', condition: 'Bị thương ở chân, đã bàn giao theo dõi.' }, log: ['08:10 · Phân công Lê Mai Chi, Vũ Minh Hải; phụ trách: Vũ Minh Hải', '09:00 · Vũ Minh Hải xác nhận bàn giao 1 mèo tại trung tâm · Dữ liệu mẫu'] },
];

// Demo validation only. Real authorization must be enforced by the backend.
export function transitionError(mission: Mission, actor: string, onDuty: boolean, handover?: Handover): string {
  if (!mission.members.includes(actor)) return 'Bạn không được phân công vào ca này.';
  if (mission.leader !== actor) return 'Chỉ người phụ trách ca được xác nhận tiến độ của nhóm.';
  if (mission.stage >= stages.length - 1) return 'Ca cứu hộ đã hoàn tất.';
  if (mission.stage === 0 && !onDuty) return 'Bật trạng thái trong ca trực trước khi nhận nhiệm vụ.';
  if (mission.stage === 4) {
    if (!handover || !handover.recipient.trim() || !handover.destination.trim() || !handover.condition.trim()) return 'Điền đủ người nhận, nơi bàn giao và tình trạng động vật.';
    if (!/^\d+$/.test(handover.count.trim()) || Number(handover.count) < 1 || Number(handover.count) > mission.count) return `Số cá thể bàn giao phải từ 1 đến ${mission.count}.`;
  }
  return '';
}
export function advanceMission(mission: Mission, actor: string, onDuty: boolean, time: string, handover?: Handover): Mission {
  const error = transitionError(mission, actor, onDuty, handover);
  if (error) throw new Error(error);
  const next = mission.stage + 1;
  return { ...mission, stage: next, ...(handover ? { handover, notes: handover.condition.trim() } : {}), log: [...mission.log, `${time} · ${staffName(actor)} · ${stages[next]}${handover ? ` · Bàn giao ${handover.count} ${mission.animal.toLowerCase()} cho ${handover.recipient} tại ${handover.destination}` : ''} · App nhân viên (mẫu)`] };
}
