import { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { useSession } from '../session';
import { Button, colors, Icon, Page, s } from '../ui';

export default function SignIn() {
  const { signIn, demo } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(preview = false) {
    if (busy) return;
    setBusy(true); setError('');
    try { if (preview) await demo(); else await signIn(email.trim(), password, remember); }
    catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  }
  return <Page>
    <View style={{ paddingTop: 40, gap: 20 }}>
      <View style={[s.avatar, { width: 64, height: 64, borderRadius: 22 }]}><Icon name="heart" size={30} color={colors.green}/></View>
      <Text style={s.eyebrow}>TRẠM CỨU HỘ ĐỘNG VẬT</Text>
      <Text style={[s.title, { fontSize: 34 }]}>Sẵn sàng cho{ '\n' }một ca cứu hộ.</Text>
      <Text style={s.body}>Đăng nhập bằng tài khoản nhân viên được cấp.</Text>
    </View>
    <View style={[s.card, { gap: 18, padding: 22 }]}>
      <Text style={s.section}>Đăng nhập</Text>
      <View style={{ gap: 7 }}><Text style={s.body}>Email nhân viên</Text><TextInput accessibilityLabel="Email nhân viên" style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" placeholder="ten@tramcuuho.vn" editable={!busy}/></View>
      <View style={{ gap: 7 }}><Text style={s.body}>Mật khẩu</Text><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><TextInput accessibilityLabel="Mật khẩu" style={[s.input, { flex: 1 }]} value={password} onChangeText={setPassword} secureTextEntry={!visible} autoComplete="current-password" placeholder="Nhập mật khẩu" editable={!busy} onSubmitEditing={() => email && password && submit()}/><Pressable accessibilityRole="button" accessibilityLabel={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} style={{ padding: 12 }} onPress={() => setVisible(!visible)}><Icon name={visible ? 'eye-off' : 'eye'}/></Pressable></View></View>
      <View style={s.row}><Text style={[s.body, { color: colors.ink }]}>Ghi nhớ trên thiết bị này</Text><Switch accessibilityLabel="Ghi nhớ đăng nhập" value={remember} onValueChange={setRemember} disabled={busy} trackColor={{ true: colors.green }}/></View>
      {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.orange }]}>{error}</Text>}
      <Button label={busy ? 'Đang xử lý…' : 'Đăng nhập'} icon="arrow-right" disabled={busy || !email.trim() || !password} onPress={() => submit()}/>
      <Text style={s.small}>Quên mật khẩu? Liên hệ quản trị viên để được cấp lại.</Text>
    </View>
    <Button secondary label="Xem thử giao diện" disabled={busy} onPress={() => submit(true)}/>
    <Text style={[s.small, { textAlign: 'center' }]}>Chế độ xem thử sử dụng nhân viên và nhiệm vụ mẫu.</Text>
  </Page>;
}
