import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { observePush } from '../../push';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, colors } from '../../ui';
export default function TabLayout() {
    useEffect(() => observePush(() => router.push('/notifications')), []);
    const insets = useSafeAreaInsets();
    return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.green, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.line, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8), height: 64 + Math.max(insets.bottom, 8) }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
  <Tabs.Screen name="index" options={{ title: 'Trang chủ', tabBarIcon: ({ color }) => <Icon name="home" color={color}/> }}/>
  <Tabs.Screen name="missions" options={{ title: 'Nhiệm vụ', tabBarIcon: ({ color }) => <Icon name="clipboard" color={color}/> }}/>
  <Tabs.Screen name="team" options={{ title: 'Nhóm của ca', tabBarIcon: ({ color }) => <Icon name="users" color={color}/> }}/>
  <Tabs.Screen name="profile" options={{ title: 'Cá nhân', tabBarIcon: ({ color }) => <Icon name="user" color={color}/> }}/>
    </Tabs>;
}
