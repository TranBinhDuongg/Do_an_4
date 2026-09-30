const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const output = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/domain.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const moduleScope = { exports: {} };
vm.runInNewContext(output, { exports: moduleScope.exports });
const { initialMissions, stages, transitionError, advanceMission } = moduleScope.exports;
const mission = initialMissions[0];
const handover = { recipient: 'Người nhận mẫu', destination: 'Trung tâm', count: '2', condition: 'Đã bàn giao đủ hai mèo.' };

test('Nhận nhiệm vụ không đồng nghĩa xuất phát; chỉ lần xác nhận tiếp theo mới di chuyển', () => {
  const accepted = advanceMission(mission, 'NV03', true, '10:00');
  assert.equal(stages[accepted.stage], 'Đã nhận nhiệm vụ');
  const departed = advanceMission(accepted, 'NV03', true, '10:10');
  assert.equal(stages[departed.stage], 'Đang di chuyển');
  assert.match(departed.log.at(-1), /10:10.*Lê Mai Chi.*Đang di chuyển/);
  assert.equal(mission.stage, 0);
});
test('Thành viên và người ngoài ca không được xác nhận thay nhóm trưởng', () => {
  for (let stage = 0; stage < 5; stage++) {
    assert.throws(() => advanceMission({ ...mission, stage }, 'NV04', true, '10:00', handover));
    assert.throws(() => advanceMission({ ...mission, stage }, 'NV06', true, '10:00', handover));
  }
});
test('Nhân viên ngoài ca trực không nhận nhiệm vụ', () => {
  assert.match(transitionError(mission, 'NV03', false), /ca trực/);
});
test('Bàn giao yêu cầu thông tin và số cá thể hợp lệ', () => {
  const transport = { ...mission, stage: 4 };
  assert.ok(transitionError(transport, 'NV03', true));
  for (const count of ['', '0', '-1', '1.5', '3', 'abc']) {
    assert.ok(transitionError(transport, 'NV03', true, { ...handover, count }));
  }
  assert.ok(transitionError(transport, 'NV03', true, { ...handover, recipient: '   ' }));
  const finished = advanceMission(transport, 'NV03', true, '11:00', handover);
  assert.equal(stages[finished.stage], 'Hoàn tất');
  assert.equal(finished.handover.recipient, handover.recipient);
  assert.match(finished.log.at(-1), /Bàn giao 2 mèo/);
  assert.throws(() => advanceMission(finished, 'NV03', true, '11:01', handover));
});
test('Nhóm và người phụ trách thay đổi theo ca', () => {
  assert.notEqual(initialMissions[0].leader, initialMissions[1].leader);
  assert.ok(initialMissions.every(m => m.members.includes(m.leader)));
});
