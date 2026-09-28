import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { checkHealth } from './src/api';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Chưa kiểm tra kết nối');
  const [failed, setFailed] = useState(false);

  async function connect() {
    setLoading(true);
    setFailed(false);
    try {
      setMessage(await checkHealth());
    } catch (error) {
      setFailed(true);
      setMessage(error instanceof Error ? error.message : 'Có lỗi khi kiểm tra kết nối.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.page}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brand}>CỨU HỘ / 04</Text>
            <Text style={styles.badge}>BẢN KHỞI TẠO</Text>
          </View>
          <Text style={styles.eyebrow}>NGƯỜI BÁO TIN</Text>
          <Text accessibilityRole="header" style={styles.title}>{"Kết nối để\nđược hỗ trợ."}</Text>
          <Text style={styles.description}>Báo tin và theo dõi hỗ trợ cứu hộ trong cùng một ứng dụng.</Text>
          <View style={styles.connection}>
            <Text style={styles.cardTitle}>Kết nối hệ thống</Text>
            <Text accessibilityLiveRegion="polite" style={[styles.message, failed && styles.error]}>{message}</Text>
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: loading, busy: loading }} disabled={loading} onPress={connect}
              style={({ pressed }) => [styles.button, (pressed || loading) && styles.dimmed]}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kiểm tra kết nối</Text>}
            </Pressable>
          </View>
          <Text style={styles.sectionTitle}>CHỨC NĂNG DỰ KIẾN</Text>
          <View style={styles.feature}>
            <Text style={styles.number}>01</Text>
            <View style={styles.featureBody}>
              <Text style={styles.cardTitle}>Gửi tin báo</Text>
              <Text style={styles.message}>Mô tả sự cố, bổ sung vị trí và hình ảnh.</Text>
              <Text style={styles.pending}>Chưa triển khai</Text>
            </View>
          </View>
<View style={styles.feature}>
            <Text style={styles.number}>02</Text>
            <View style={styles.featureBody}>
              <Text style={styles.cardTitle}>Theo dõi xử lý</Text>
              <Text style={styles.message}>Theo dõi tiến độ hỗ trợ từ đội cứu hộ.</Text>
              <Text style={styles.pending}>Chưa triển khai</Text>
            </View>
          </View>
          <Text style={styles.footer}>Bộ khung ứng dụng · Chưa tiếp nhận yêu cầu cứu hộ</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F4EF' },
  content: { padding: 24, gap: 20, width: '100%', maxWidth: 640, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  brand: { fontSize: 16, fontWeight: '800', color: '#172C29' },
  badge: { fontSize: 10, color: '#53635D', borderWidth: 1, borderColor: '#D5DBD4', borderRadius: 6, padding: 7 },
  eyebrow: { color: '#A13D24', letterSpacing: 2, fontSize: 12, fontWeight: '700' },
  title: { fontSize: 40, lineHeight: 48, fontWeight: '800', color: '#172C29' },
  description: { fontSize: 16, lineHeight: 25, color: '#53635D' },
  connection: { padding: 22, backgroundColor: '#FFFFFF', borderRadius: 18, gap: 14, borderWidth: 1, borderColor: '#E2E6DF', marginVertical: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#172C29' },
  message: { fontSize: 14, lineHeight: 22, color: '#53635D' },
  error: { color: '#A12F25' },
  button: { backgroundColor: '#A13D24', borderRadius: 10, minHeight: 50, padding: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  dimmed: { opacity: 0.65 },
  sectionTitle: { fontSize: 11, letterSpacing: 1.5, color: '#53635D', fontWeight: '700' },
  feature: { flexDirection: 'row', gap: 18, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#DBE0D8' },
  number: { fontSize: 16, color: '#A13D24', fontWeight: '700', paddingTop: 2 },
  featureBody: { flex: 1, gap: 6 },
  pending: { fontSize: 12, color: '#A13D24' },
  footer: { fontSize: 12, lineHeight: 19, color: '#53635D', marginVertical: 12 },
});
