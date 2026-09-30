import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RescueProvider } from '../store';
import { SessionProvider, useSession } from '../session';
import { ActivityIndicator, Text } from 'react-native';
import { Button, Page, s } from '../ui';
function Navigator() {
  const { session, loading, restoreError, restore, signOut } = useSession();
  if (loading) return <Page><ActivityIndicator/><Text style={s.body}>Đang mở tài khoản của bạn…</Text></Page>;
  if (restoreError) return <Page><Text style={s.cardTitle}>Chưa thể mở tài khoản</Text><Text style={s.body}>{restoreError}</Text><Button label="Thử lại" onPress={restore}/><Button secondary label="Về đăng nhập" onPress={() => signOut().catch(() => {})}/></Page>;
  return <RescueProvider key={session?.user?.id || 'guest'}><Stack screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!session}><Stack.Screen name="sign-in"/></Stack.Protected>
    <Stack.Protected guard={!!session}><Stack.Screen name="(tabs)"/><Stack.Screen name="mission/[id]"/><Stack.Screen name="notifications" options={{ presentation: 'modal' }}/></Stack.Protected>
  </Stack></RescueProvider>;
}
export default function Layout() { return <SessionProvider><StatusBar style="dark"/><Navigator/></SessionProvider>; }
