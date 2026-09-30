import { useState } from 'react';
import { Linking, Platform, Text, View } from 'react-native';
import { registerPush } from './push';
import { useSession } from './session';
import { Button, s } from './ui';
export function NotificationSettings() {
  const { session, registerDevice } = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Chưa kiểm tra khả năng nhận thông báo trên thiết bị này.');
  async function enable() {
    setBusy(true);
    try {
      if (session.demo) throw new Error('Bạn đang xem thử. Đăng nhập tài khoản nhân viên để đăng ký thiết bị nhận nhiệm vụ.');
      const pushToken = await registerPush();
      await registerDevice(pushToken);
      setMessage('Đã đăng ký thiết bị. Luồng gửi nhiệm vụ từ điều phối chưa được kết nối.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  return <View style={s.card}><Text style={s.cardTitle}>Thông báo nhiệm vụ</Text><Text accessibilityLiveRegion="polite" style={s.body}>{message}</Text><Button label={busy ? 'Đang kiểm tra…' : 'Bật / kiểm tra thông báo'} icon="bell" disabled={busy} onPress={enable}/>{Platform.OS !== 'web' && <Button secondary label="Mở cài đặt điện thoại" onPress={() => Linking.openSettings().catch(() => setMessage('Hãy mở Cài đặt trên điện thoại.'))}/> }<Text style={s.small}>Khi triển khai, thông báo có thể hiện lúc khóa màn hình. Máy phải còn bật và có mạng. Máy tắt nguồn không nhận được ngay; điều phối cần gọi liên hệ nếu chưa có xác nhận.</Text></View>;
}

