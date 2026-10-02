import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
let notifications;
function getNotifications() {
  if (!notifications) {
    notifications = require('expo-notifications');
    notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });
  }
  return notifications;
}
export async function registerPush() {
  if (isExpoGo) throw new Error('Expo Go không hỗ trợ thông báo đẩy. Cần development build để nhận thông báo nhiệm vụ.');
  const Notifications = getNotifications();
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) throw new Error('Trạm chưa thiết lập dịch vụ thông báo cho bản cài này.');
  if (Platform.OS === 'android') await Notifications.setNotificationChannelAsync('rescue-missions', { name: 'Nhiệm vụ cứu hộ', importance: Notifications.AndroidImportance.MAX, vibrationPattern: [0, 500, 250, 500], sound: 'default' });
  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) throw new Error('Thông báo đang bị tắt. Mở Cài đặt của điện thoại để cho phép thông báo.');
  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}
export function observePush(onOpen) {
  if (isExpoGo) return () => {};
  const Notifications = getNotifications();
  const last = Notifications.getLastNotificationResponse();
  if (last) { onOpen(); Notifications.clearLastNotificationResponseAsync().catch(() => {}); }
  const listener = Notifications.addNotificationResponseReceivedListener(() => onOpen());
  return () => listener.remove();
}
