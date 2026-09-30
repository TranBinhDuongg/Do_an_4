import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
export async function registerPush() {
  if (Constants.appOwnership === 'expo') throw new Error('Cần bản cài ứng dụng trên điện thoại để nhận thông báo nhiệm vụ.');
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) throw new Error('Trạm chưa thiết lập dịch vụ thông báo cho bản cài này.');
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('rescue-missions', { name: 'Nhiệm vụ cứu hộ', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 500, 250, 500], sound: 'default' });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Thông báo đang bị tắt. Mở Cài đặt của điện thoại để cho phép thông báo.');
  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}
export function observePush(onOpen) {
  const last = Notifications.getLastNotificationResponse();
  if (last) { onOpen(); Notifications.clearLastNotificationResponseAsync().catch(() => {}); }
  const listener = Notifications.addNotificationResponseReceivedListener(() => onOpen());
  return () => listener.remove();
}
