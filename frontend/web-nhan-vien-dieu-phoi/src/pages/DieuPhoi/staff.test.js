import test from 'node:test';
import assert from 'node:assert/strict';
import { assignmentFor, validateAssignment } from './staff.js';
const reports = [
  { id: 'A', status: 'Chờ xác nhận', members: ['NV01', 'NV02'], leader: 'NV01' },
  { id: 'B', status: 'Chờ điều phối', members: [], leader: '' },
];
test('only assigned people are reserved, including pending confirmation', () => {
  assert.equal(assignmentFor(reports, 'NV01').id, 'A');
  assert.equal(assignmentFor(reports, 'NV03'), undefined);
  assert.match(validateAssignment(reports, 'B', ['NV01'], 'NV01'), /ca khác/);
  assert.equal(validateAssignment(reports, 'B', ['NV03', 'NV04'], 'NV03'), '');
});
test('requires members, a leader in the group and on-duty staff', () => {
  assert.ok(validateAssignment(reports, 'B', [], ''));
  assert.ok(validateAssignment(reports, 'B', ['NV03'], 'NV04'));
  assert.ok(validateAssignment(reports, 'B', ['NV08'], 'NV08'));
  assert.ok(validateAssignment(reports, 'B', ['unknown'], 'unknown'));
  assert.ok(validateAssignment(reports, 'B', ['NV03', 'NV03'], 'NV03'));
});
test('allows supplementing own group while blocking staff on another case', () => {
  assert.equal(validateAssignment(reports, 'A', ['NV01', 'NV02', 'NV06'], 'NV01'), '');
  const busy = [...reports, { id: 'C', status: 'Đang cứu hộ', members: ['NV06'] }];
  assert.ok(validateAssignment(busy, 'A', ['NV01', 'NV06'], 'NV01'));
});
test('closing or canceling a case releases its people but preserves history', () => {
  for (const status of ['Hoàn tất', 'Đã hủy']) {
    const closed = reports.map(item => item.id === 'A' ? { ...item, status } : item);
    assert.equal(assignmentFor(closed, 'NV01'), undefined);
    assert.equal(validateAssignment(closed, 'B', ['NV01'], 'NV01'), '');
    assert.ok(validateAssignment(closed, 'A', ['NV03'], 'NV03'));
    assert.deepEqual(closed[0].members, ['NV01', 'NV02']);
  }
});
