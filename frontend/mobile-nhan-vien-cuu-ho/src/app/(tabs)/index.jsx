import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import { staffName, stages, useRescue } from '../../store';
import { actions, transitionError } from '../../domain';
import { Badge, Button, colors, Icon, Page, s } from '../../ui';
import { useSession } from '../../session';

export default function Home() {
  const { missions, user, onDuty, setOnDuty, advance, seen, markSeen } = useRescue();
  const { session } = useSession();
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const openMissions = missions.filter(m => m.stage < 5);
  const mission = openMissions.find(m => m.stage > 0) || openMissions[0];
  const isLeader = mission?.leader === user.id;
  const confirming = mission && confirmation?.id === mission.id && confirmation?.stage === mission.stage && confirmation?.actor === user.id;
  const blocked = mission && mission.stage < 4 ? transitionError(mission, user.id, onDuty) : '';
  const openDetail = () => router.push(`/mission/${mission.id}`);

  function handleAction() {
    setError('');
    if (mission.stage === 4) {
      openDetail();
      return;
    }
    setConfirmation({ id: mission.id, stage: mission.stage, actor: user.id });
  }

  function confirmAction() {
    const problem = advance(confirmation.id, confirmation.stage);
    setError(problem);
    setConfirmation(null);
  }

  return <Page>
    <View style={s.row}>
      <View style={{ gap: 5 }}>
        <Text style={local.brand}>TRẠM CỨU HỘ</Text>
        <Text accessibilityRole="header" style={local.heading}>Ca cứu hộ của bạn</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Mở hồ sơ cá nhân" onPress={() => router.push('/profile')} style={local.avatar}>
        <Text style={local.initials}>{user.initials}</Text>
      </Pressable>
    </View>

    <View style={local.duty}>
      <View style={s.inline}><View style={[local.dot, { backgroundColor: onDuty ? colors.green : colors.muted }]} /><Text style={local.dutyLabel}>{onDuty ? 'Trong ca trực' : 'Đang nghỉ ca'}</Text></View>
      <Switch accessibilityLabel="Trong ca trực" value={onDuty} onValueChange={setOnDuty} trackColor={{ false: '#CDD6CF', true: colors.green }} thumbColor="#fff" />
    </View>

    <Pressable accessibilityRole="button" onPress={() => router.push('/notifications')} style={[s.inline, { minHeight: 44 }]}><Icon name="bell" size={18} color={colors.orange}/><Text style={[s.body, { flex: 1 }]}>Thông báo nhiệm vụ chưa sẵn sàng</Text><Icon name="chevron-right" size={18}/></Pressable>
    {mission ? <View style={local.task}>
      <View style={local.taskTop}>
        <View style={s.inline}><Icon name="clipboard" size={16} color={colors.green} /><Text style={local.caseId}>{mission.id}</Text></View>
        <Badge label={stages[mission.stage]} urgent={mission.stage === 0} />
      </View>
      <View style={{ backgroundColor: isLeader ? colors.green : colors.pale, padding: 13, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 9 }}><Icon name={isLeader ? 'shield' : 'user'} color={isLeader ? '#fff' : colors.green} size={20}/><Text style={{ color: isLeader ? '#fff' : colors.green, fontSize: 16, fontWeight: '700' }}>{isLeader ? 'Bạn là nhóm trưởng' : 'Bạn là thành viên'}</Text></View>
      <Text accessibilityRole="header" style={local.taskTitle}>{mission.title}</Text>
      <View style={s.inline}><Text style={local.animal}>{mission.animal} · {mission.count} cá thể</Text><Text style={local.priority}>{mission.priority === 'Khẩn cấp' ? 'Khẩn cấp' : 'Ưu tiên ' + mission.priority.toLowerCase()}</Text></View>
      <View style={local.location}>
        <Icon name="map-pin" size={20} color={colors.green} />
        <Text style={[s.body, { flex: 1, color: colors.ink }]}>{mission.address}, {mission.district}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Xem nhóm tham gia" onPress={() => router.push('/team')} style={local.team}>
        <Icon name="users" size={19} color={colors.muted} />
        <Text style={[s.body, { flex: 1 }]}>{isLeader ? `Nhóm ${mission.members.length} người · Bạn xác nhận tiến độ` : `Nhóm trưởng: ${staffName(mission.leader)}`}</Text>
        <Icon name="chevron-right" size={18} color={colors.muted} />
      </Pressable>

      {mission.stage === 0 && (seen[`${user.id}:${mission.id}`] ? <Text style={s.small}>✓ Bạn đã xác nhận xem nhiệm vụ · Bản mẫu</Text> : <Button secondary label="Tôi đã xem nhiệm vụ" icon="check" onPress={() => markSeen(mission.id)}/>)}
      {isLeader ? <View style={local.action}>
        {mission.stage === 0 && <Text style={s.body}>Kiểm tra nhóm có thể tham gia trước khi nhận ca.</Text>}
        {mission.stage === 1 && <Text style={s.body}>Đã nhận ca. Chỉ xác nhận xuất phát khi nhóm thực sự lên đường.</Text>}
        {!!blocked && <Text style={local.error}>{blocked}</Text>}
        {confirming ? <>
          <Text style={s.cardTitle}>{actions[mission.stage]}?</Text>
          <Button label="Xác nhận" icon="check" disabled={!!blocked} onPress={confirmAction} />
          <Button secondary label="Hủy" onPress={() => setConfirmation(null)} />
        </> : <Button label={mission.stage === 4 ? 'Nhập thông tin bàn giao' : actions[mission.stage]} icon="arrow-right" disabled={!!blocked} onPress={handleAction} />}
      </View> : <View style={local.action}>
        <Text style={s.body}>{mission.stage === 0 ? 'Chờ nhóm trưởng xác nhận nhận nhiệm vụ.' : mission.stage === 1 ? 'Chờ nhóm trưởng xác nhận xuất phát.' : 'Nhóm trưởng cập nhật tiến độ chung của ca.'}</Text>
      </View>}
      {!!error && <Text accessibilityRole="alert" style={local.error}>{error}</Text>}
      {!confirming && <Pressable accessibilityRole="button" onPress={openDetail} style={local.detail}><Text style={local.detailText}>Thông tin ca cứu hộ</Text><Icon name="arrow-up-right" size={17} color={colors.green} /></Pressable>}
    </View> : <View style={local.empty}>
      <Icon name="check-circle" size={36} color={colors.green} />
      <Text style={s.section}>Chưa có nhiệm vụ cần xử lý</Text>
      <Text style={[s.body, { textAlign: 'center' }]}>{onDuty ? 'Các ca được phân công sẽ hiển thị tại đây.' : 'Bật ca trực khi bạn sẵn sàng nhận nhiệm vụ.'}</Text>
    </View>}

    {openMissions.length > 1 && <Button secondary label={`Xem ${openMissions.length - 1} ca còn lại`} onPress={() => router.push('/missions')} />}
    <Text style={[s.small, { textAlign: 'center' }]}>{session.demo ? 'Dữ liệu mẫu · Chưa đồng bộ web điều phối' : 'Đã đăng nhập · Chưa kết nối dữ liệu nhiệm vụ từ điều phối'}</Text>
  </Page>;
}

const local = StyleSheet.create({
  brand: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: colors.green },
  heading: { fontSize: 25, fontWeight: '700', letterSpacing: -0.7, color: colors.ink },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E4ECDD', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 14, fontWeight: '700', color: colors.ink },
  dot: { width: 7, height: 7, borderRadius: 4 },
  taskTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  caseId: { fontSize: 12, fontWeight: '700', letterSpacing: 0.7, color: colors.green },
  priority: { fontSize: 12, color: colors.orange, marginLeft: 6 },
  location: { flexDirection: 'row', gap: 10, alignItems: 'center', padding: 13, backgroundColor: '#F3F5EE', borderRadius: 12 },
  team: { flexDirection: 'row', gap: 10, alignItems: 'center', minHeight: 44 },
  detail: { flexDirection: 'row', gap: 7, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  detailText: { fontSize: 14, fontWeight: '600', color: colors.green },
  duty: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 12, backgroundColor: '#EAF0E4' },
  dutyLabel: { fontSize: 15, fontWeight: '600', color: colors.ink },
  task: { backgroundColor: '#fff', borderRadius: 22, borderWidth: 1, borderColor: '#DEE5D8', padding: 20, gap: 14 },
  taskTitle: { fontSize: 25, lineHeight: 33, fontWeight: '700', color: colors.ink },
  animal: { fontSize: 15, lineHeight: 23, color: colors.ink },
  action: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 16, gap: 12 },
  error: { fontSize: 14, lineHeight: 22, color: colors.orange },
  empty: { alignItems: 'center', gap: 16, paddingVertical: 32, paddingHorizontal: 20 },
});
