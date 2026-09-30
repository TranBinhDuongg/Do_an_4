import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { useRescue } from '../store';
import { Button, Heading, MissionCard, Page, s } from '../ui';
import { NotificationSettings } from '../notification-settings';
export default function Notifications() {
    const { missions } = useRescue();
    const pending = missions.filter(m => m.stage === 0);
    return <Page><Button secondary label="Quay lại" icon="arrow-left" onPress={() => router.canGoBack() ? router.back() : router.replace('/')}/><Heading title="Thông báo" subtitle="Thiết bị và nhiệm vụ đang chờ xác nhận."/><NotificationSettings/>{pending.map(m => <MissionCard key={m.id} mission={m}/>)}{!pending.length && <View style={s.empty}><Text style={s.cardTitle}>Chưa có nhiệm vụ hiển thị</Text><Text style={s.body}>Luồng phân công từ điều phối chưa được kết nối.</Text></View>}<Text style={s.small}>Thông báo minh họa · Chưa kết nối thông báo đẩy</Text></Page>;
}

