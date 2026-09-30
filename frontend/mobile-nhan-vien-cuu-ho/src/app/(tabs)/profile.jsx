import { useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { staff, useRescue } from '../../store';
import { useSession } from '../../session';
import { NotificationSettings } from '../../notification-settings';
import { Badge, Button, colors, Heading, Page, s } from '../../ui';
export default function Profile() {
  const { onDuty, setOnDuty, reset, user, setUserId } = useRescue();
  const { session, signOut } = useSession();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function logout() {
    setBusy(true); setError('');
    try { await signOut(); } catch (problem) { setError(problem.message); } finally { setBusy(false); }
  }
  return <Page>
    <Heading title="Cá nhân" subtitle="Tài khoản và thiết bị nhận nhiệm vụ."/>
    <View style={s.card}><View style={s.inline}><View style={s.avatar}><Text style={s.avatarText}>{user.initials}</Text></View><View style={{ flex: 1 }}><Text style={s.cardTitle}>{user.name}</Text><Text style={s.body}>{session.demo ? 'Tài khoản xem thử' : session.user.email}</Text></View></View><Badge label="Vai trò nhóm trưởng được giao theo từng ca"/></View>
    <View style={s.card}><View style={s.row}><Text style={s.cardTitle}>Trong ca trực</Text><Switch accessibilityLabel="Trong ca trực" value={onDuty} onValueChange={setOnDuty} trackColor={{ true: colors.green }}/></View><Text style={s.small}>Trạng thái trên thiết bị · Chưa đồng bộ điều phối</Text></View>
    <NotificationSettings/>
    {session.demo && <View style={s.card}><Badge label="XEM THỬ"/><Text style={s.cardTitle}>Thử vai trò trong nhóm</Text>{staff.slice(0, 2).map(person => <Button key={person.id} secondary={user.id !== person.id} label={`${person.name} · ${person.id === 'NV03' ? 'Nhóm trưởng' : 'Thành viên'}`} onPress={() => setUserId(person.id)}/>)}<Button secondary label="Đặt lại nhiệm vụ mẫu" onPress={reset}/><Text style={s.small}>Nhiệm vụ và xác nhận chỉ minh họa trên thiết bị.</Text></View>}
    {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.orange }]}>{error}</Text>}
    {confirm ? <View style={s.card}><Text style={s.cardTitle}>Đăng xuất khỏi thiết bị này?</Text><Text style={s.body}>Lần mở sau bạn cần đăng nhập lại.</Text><Button label={busy ? 'Đang đăng xuất…' : 'Xác nhận đăng xuất'} disabled={busy} onPress={logout}/><Button secondary label="Ở lại" disabled={busy} onPress={() => setConfirm(false)}/></View> : <Button secondary label={session.demo ? 'Thoát xem thử' : 'Đăng xuất'} icon="log-out" onPress={() => setConfirm(true)}/>}
  </Page>;
}
