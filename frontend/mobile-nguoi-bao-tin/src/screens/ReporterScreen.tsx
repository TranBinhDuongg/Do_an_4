import { useRef, useState } from 'react';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const phone = (process.env.EXPO_PUBLIC_RESCUE_PHONE ?? '').trim();
const ink = '#153F38';
type IconName = React.ComponentProps<typeof Feather>['name'];
const Icon = ({ name, color = ink, size = 24 }: { name: IconName; color?: string; size?: number }) => <Feather name={name} color={color} size={size} />;
function Button({ title, onPress, secondary = false, disabled = false, icon }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean; icon?: IconName }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, (pressed || disabled) && s.dim]}>{icon && <Icon name={icon} color={secondary ? ink : '#fff'} size={20} />}<Text style={[s.buttonText, secondary && s.secondaryText]}>{title}</Text></Pressable>;
}

export default function ReporterScreen() {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<string>();
  const [position, setPosition] = useState<Location.LocationObject>();
  const [busy, setBusy] = useState<'camera' | 'location' | null>(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [review, setReview] = useState(false);
  const lock = useRef(false);
  async function call() {
    if (!/^\+?[0-9]{3,15}$/.test(phone)) { Alert.alert('Chưa có số trực cứu hộ', 'Số điện thoại của đơn vị cứu hộ chưa được cấu hình.'); return; }
    try { await Linking.openURL(`tel:${phone}`); } catch { Alert.alert('Không mở được cuộc gọi', `Vui lòng gọi trực tiếp số ${phone}.`); }
  }
  async function capture() {
    if (lock.current) return;
    lock.current = true; setBusy('camera'); setError('');
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) { setError('Cần quyền camera để chụp hiện trường. Hãy cấp quyền trong cài đặt thiết bị.'); return; }
      const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled) { setPhoto(result.assets[0].uri); setReview(false); }
    } catch { setError('Không mở được camera. Hãy thử lại trên điện thoại có camera.'); }
    finally { setBusy(null); lock.current = false; }
  }
  async function locate() {
    if (lock.current) return;
    lock.current = true; setBusy('location'); setError(''); setPosition(undefined);
    let subscription: Location.LocationSubscription | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let finished = false;
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) { setError('Cần quyền vị trí để đính kèm nơi bạn đang đứng. Hãy cấp quyền trong cài đặt thiết bị.'); return; }
      if (!await Location.hasServicesEnabledAsync()) { setError('Hãy bật dịch vụ vị trí trên thiết bị rồi thử lại.'); return; }
      const current = await new Promise<Location.LocationObject>((resolve, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), 20000);
        Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, resolve).then(value => {
          if (finished) value.remove(); else subscription = value;
        }).catch(reject);
      });
      setPosition(current);
    } catch { setError('Chưa lấy được vị trí. Hãy ra nơi thoáng và thử lại, hoặc báo tin qua điện thoại.'); }
    finally { finished = true; if (timer) clearTimeout(timer); subscription?.remove(); setBusy(null); lock.current = false; }
  }
  function close() { if (!busy) setOpen(false); }
  return <SafeAreaView style={s.page}>
    <StatusBar style="dark" />
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.header}><View style={s.row}><View style={s.brandIcon}><FontAwesome5 name="paw" color="#fff" size={22} /></View><View><Text style={s.brand}>CỨU HỘ</Text><Text style={s.brandSub}>ĐỘNG VẬT</Text></View></View><Pressable accessibilityRole="button" accessibilityLabel="Hướng dẫn báo tin" onPress={() => Alert.alert('Cùng giúp một sinh linh', 'Gọi đội cứu hộ hoặc chụp ảnh con vật và khu vực xung quanh. Lấy vị trí máy khi bạn ở gần hiện trường và mô tả tình trạng con vật. Giữ khoảng cách an toàn.')} style={s.help}><Icon name="help-circle" size={22} /></Pressable></View>
      <View style={s.hero}>
        <View pointerEvents="none" style={s.heroCircle} />
        <View style={s.heroBadge}><Icon name="heart" size={13} color="#D6EAC9" /><Text style={s.heroBadgeText}>MỖI SINH LINH ĐỀU QUAN TRỌNG</Text></View>
        <Text accessibilityRole="header" style={s.heroTitle}>{'Một tin báo.\nMột cơ hội\nđược cứu.'}</Text>
        <Text style={s.heroCopy}>Cùng giúp những con vật bị thương, bị bỏ rơi hoặc mắc kẹt.</Text>
        <View style={s.heroFoot}><View style={s.row}><Icon name="unlock" size={14} color="#D6EAC9" /><Text style={s.heroTrustText}>Không cần đăng nhập</Text></View><View style={s.pawMedallion}><FontAwesome5 name="paw" size={40} color="#234E40" /></View></View>
      </View>
      <View style={s.sectionHeading}><Text style={s.sectionTitle}>Bạn có thể giúp ngay</Text><Text style={s.sectionCaption}>Chọn cách báo tin</Text></View>
      <Pressable accessibilityRole="button" onPress={() => { setOpen(true); setError(''); }} style={({ pressed }) => [s.reportCard, pressed && s.dim]}>
        <View style={s.header}><View style={s.reportIcon}><Icon name="camera" size={29} color="#fff" /></View><View style={s.recommended}><Text style={s.recommendedText}>ẢNH + VỊ TRÍ</Text></View></View>
        <Text style={s.reportTitle}>Để chúng tôi nhìn thấy</Text><Text style={s.reportCopy}>{'Chụp hiện trường. Chia sẻ vị trí.\nGiúp đội cứu hộ đến đúng nơi.'}</Text>
        <View style={s.reportSteps}><Icon name="camera" size={16} color="#8D3A21" /><Text style={s.reportStepText}>Chụp ảnh</Text><Icon name="chevron-right" size={14} color="#AF795F" /><Icon name="map-pin" size={16} color="#8D3A21" /><Text style={s.reportStepText}>Lấy vị trí</Text></View>
        <View style={s.reportAction}><Text style={s.reportActionText}>{photo ? 'Tiếp tục tin báo' : 'Báo tin bằng ảnh'}</Text><View style={s.arrowBubble}><Icon name="arrow-up-right" color="#fff" size={22} /></View></View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`Gọi đội cứu hộ ${phone}`} onPress={call} style={({ pressed }) => [s.hotlineCard, pressed && s.dim]}><View style={s.hotlineIcon}><Icon name="phone-call" size={24} color="#fff" /></View><View style={s.flex}><Text style={s.hotlineLabel}>Cần trao đổi trực tiếp?</Text><Text style={s.hotlineNumber}>{phone || 'Gọi đội cứu hộ'}</Text></View><Icon name="arrow-up-right" size={21} /></Pressable>
      <View style={s.safetyCard}><Icon name="shield" size={20} /><View style={s.flex}><Text style={s.smallTitle}>Giúp đỡ từ khoảng cách an toàn</Text><Text style={s.small}>Tránh làm con vật hoảng sợ. Chụp từ nơi an toàn và mô tả những gì bạn quan sát được.</Text></View></View>
      <View style={s.privacy}><Icon name="lock" size={12} color="#6C7B76" /><Text style={s.footer}>Bạn quyết định ảnh và vị trí được chia sẻ.</Text></View>
    </ScrollView>
    <Modal visible={open} animationType="slide" onRequestClose={close}><SafeAreaView style={s.page}><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[s.header, s.modalHeader]}><Pressable accessibilityRole="button" accessibilityLabel={review ? 'Quay lại chỉnh sửa' : 'Đóng tin báo'} disabled={!!busy} onPress={() => review ? setReview(false) : close()} style={s.help}><Icon name={review ? 'arrow-left' : 'x'} /></Pressable><Text style={s.modalTitle}>{review ? 'Xem lại tin báo' : 'Báo tin bằng ảnh'}</Text><View style={{ width: 44 }} /></View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.form}>
        <View style={s.progressRow}>{[{ label: 'Ảnh hiện trường', done: !!photo, icon: 'camera' as const }, { label: 'Vị trí', done: !!position, icon: 'map-pin' as const }, { label: 'Xem lại', done: review, icon: 'check' as const }].map((step, index) => <View key={step.label} style={s.progressItem}><View style={[s.progressCircle, step.done && s.progressDone]}><Icon name={step.done ? 'check' : step.icon} size={17} color={step.done ? '#fff' : '#667A6C'} /></View><Text style={s.progressText}>{index + 1}. {step.label}</Text></View>)}</View>
        <Text style={s.formTitle}>{review ? 'Kiểm tra trước khi gửi' : 'Con vật đang\ngặp chuyện gì?'}</Text><Text style={s.copy}>{review ? 'Ảnh và vị trí hiện tại sẽ được đính kèm tin báo.' : 'Chụp ảnh con vật và đính kèm vị trí máy hiện tại. Hãy báo tin khi bạn ở gần hiện trường.'}</Text>
        <Text style={s.label}>Ảnh hiện trường <Text style={s.required}>*</Text></Text>
        {photo ? <View style={s.imageWrap}><Image source={{ uri: photo }} style={s.image} accessibilityLabel="Ảnh hiện trường vừa chụp" />{!review && <Button title="Chụp lại ảnh" icon="camera" secondary disabled={!!busy} onPress={capture} />}</View> : <Pressable accessibilityRole="button" disabled={!!busy} onPress={capture} style={s.capture}><Icon name="camera" size={36} color="#B64C2B" /><Text style={s.photoTitle}>Chụp ảnh hiện trường</Text><Text style={s.small}>Chỉ chụp khi bạn đang ở nơi an toàn</Text></Pressable>}
        <Text style={s.label}>Vị trí hiện tại <Text style={s.required}>*</Text></Text>
        <View style={s.location}><View style={s.row}><Icon name="map-pin" /><View style={s.flex}><Text style={s.smallTitle}>{position ? 'Đã lấy vị trí của bạn' : 'Chưa có vị trí'}</Text><Text style={s.small}>{position ? `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}` : 'Dùng vị trí thiết bị tại nơi bạn đang đứng.'}</Text>{position && <Text style={s.small}>{position.coords.accuracy != null ? `Độ chính xác khoảng ${Math.ceil(position.coords.accuracy)} m · ` : ''}{new Date(position.timestamp).toLocaleTimeString('vi-VN')}</Text>}</View></View>{!review && <Button title={position ? 'Cập nhật vị trí' : 'Lấy vị trí hiện tại'} secondary icon="crosshair" onPress={locate} disabled={!!busy} />}</View>
        {busy && <View style={s.privacy}><ActivityIndicator color={ink} /><Text accessibilityLiveRegion="polite" style={s.small}>{busy === 'camera' ? 'Đang mở camera…' : 'Đang tìm vị trí của bạn…'}</Text></View>}
        {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
        <Text style={s.label}>Thông tin thêm <Text style={s.optional}>(không bắt buộc)</Text></Text>
        {review ? <Text style={s.copy}>{note.trim() || 'Không có thông tin thêm.'}</Text> : <TextInput accessibilityLabel="Mô tả con vật và tình trạng hiện tại" multiline maxLength={500} value={note} onChangeText={setNote} placeholder="Ví dụ: Một chú chó bị thương ở chân, gần cổng công viên…" placeholderTextColor="#7C8983" style={s.input} textAlignVertical="top" />}
        <View style={s.safety}><Icon name="lock" size={18} /><Text style={[s.small, s.flex]}>Vị trí chỉ được lấy khi bạn yêu cầu. Không cần tài khoản để báo tin.</Text></View>
        {review && <View style={s.notice}><Text style={s.smallTitle}>Tin báo chưa được gửi</Text><Text style={s.small}>Chức năng gửi ảnh đang được hoàn thiện. Hãy gọi đội cứu hộ động vật để báo tin.</Text></View>}
        <Button title={review ? 'Gọi đội cứu hộ' : 'Xem lại tin báo'} icon={review ? 'phone' : 'arrow-right'} onPress={review ? call : () => setReview(true)} disabled={!review && (!photo || !position || !!busy)} />
        <Text style={s.footer}>{review ? 'Ảnh và nội dung vẫn được giữ khi quay lại chỉnh sửa.' : 'Cần ảnh và vị trí để tiếp tục.'}</Text>
      </ScrollView>
    </KeyboardAvoidingView></SafeAreaView></Modal>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  hero: { backgroundColor: '#234E40', borderRadius: 30, padding: 25, overflow: 'hidden', marginTop: 8 }, heroCircle: { position: 'absolute', width: 240, height: 240, borderRadius: 120, backgroundColor: '#315B49', right: -110, top: 30 }, heroBadge: { flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 22 }, heroBadgeText: { color: '#D6EAC9', fontSize: 9, fontWeight: '700', letterSpacing: 1.1 }, heroTitle: { color: '#FFFDF3', fontSize: 37, lineHeight: 43, fontWeight: '800', letterSpacing: -1.3 }, heroCopy: { color: '#D2DFCD', fontSize: 13, lineHeight: 21, maxWidth: 245, marginTop: 16 }, heroFoot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 14 }, heroTrustText: { color: '#D6EAC9', fontSize: 11 }, pawMedallion: { width: 75, height: 75, borderRadius: 26, backgroundColor: '#DDE9B8', justifyContent: 'center', alignItems: 'center', transform: [{ rotate: '-14deg' }] },
  sectionHeading: { gap: 5, marginTop: 9 }, sectionTitle: { color: ink, fontSize: 21, fontWeight: '800', letterSpacing: -0.5 }, sectionCaption: { color: '#738074', fontSize: 12 }, reportCard: { padding: 23, backgroundColor: '#F9E1CF', borderRadius: 26, gap: 12, borderWidth: 1, borderColor: '#F0D2BA' }, reportIcon: { width: 54, height: 54, borderRadius: 18, backgroundColor: '#B84D32', alignItems: 'center', justifyContent: 'center' }, recommended: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: 20, backgroundColor: '#FFF3E9' }, recommendedText: { color: '#91452D', fontSize: 9, fontWeight: '800', letterSpacing: 0.9 }, reportTitle: { color: '#603522', fontSize: 23, fontWeight: '800', letterSpacing: -0.6, marginTop: 4 }, reportCopy: { color: '#835C48', fontSize: 14, lineHeight: 22 }, reportSteps: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 9, marginVertical: 4 }, reportStepText: { color: '#8D3A21', fontSize: 12, fontWeight: '600' }, reportAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E7C5AF' }, reportActionText: { color: '#87371F', fontSize: 16, fontWeight: '800' }, arrowBubble: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#B84D32', alignItems: 'center', justifyContent: 'center' },
  hotlineCard: { padding: 18, gap: 14, flexDirection: 'row', alignItems: 'center', borderRadius: 23, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3E7DB', shadowColor: '#244630', shadowOpacity: 0.04, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 1 }, hotlineIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: ink, justifyContent: 'center', alignItems: 'center' }, hotlineLabel: { color: '#6C7B70', fontSize: 11, marginBottom: 5 }, hotlineNumber: { color: ink, fontSize: 21, fontWeight: '800', letterSpacing: 0.6 }, safetyCard: { flexDirection: 'row', gap: 12, padding: 17, borderRadius: 20, backgroundColor: '#EDF0E1', marginTop: 2 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 8, backgroundColor: '#EDF0E1', borderRadius: 20, marginBottom: 5 }, progressItem: { flex: 1, alignItems: 'center', gap: 7 }, progressCircle: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: '#D1D9C6', backgroundColor: '#FAF8F2', alignItems: 'center', justifyContent: 'center' }, progressDone: { backgroundColor: ink, borderColor: ink }, progressText: { color: '#667A6C', fontSize: 10 },
  page: { flex: 1, backgroundColor: '#FAF8F2' }, flex: { flex: 1 }, content: { padding: 24, paddingBottom: 30, gap: 18, width: '100%', maxWidth: 520, alignSelf: 'center' }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, row: { flexDirection: 'row', alignItems: 'center', gap: 10 }, brandIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: ink, alignItems: 'center', justifyContent: 'center' }, brand: { color: ink, fontSize: 16, fontWeight: '800', letterSpacing: 1.6 }, brandSub: { color: '#687D75', fontSize: 11, marginTop: 3 }, help: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8EDE7', justifyContent: 'center', alignItems: 'center' },
  intro: { gap: 14, paddingTop: 12 }, tag: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#E5EDE4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }, tagText: { color: ink, fontSize: 11, fontWeight: '600' }, title: { fontSize: 38, lineHeight: 46, fontWeight: '800', letterSpacing: -1.3, color: ink }, copy: { color: '#596F63', fontSize: 15, lineHeight: 23 },
  callCard: { backgroundColor: ink, padding: 24, borderRadius: 24, gap: 12 }, callIcon: { width: 54, height: 54, backgroundColor: '#30584E', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 6 }, callPill: { color: '#D1E4D8', fontSize: 10, fontWeight: '700', letterSpacing: 1.2 }, callTitle: { color: '#fff', fontSize: 26, fontWeight: '700' }, callCopy: { color: '#C6D9CE', lineHeight: 21, fontSize: 14 }, callBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, marginTop: 8, borderTopWidth: 1, borderTopColor: '#416459' }, callAction: { color: '#fff', fontSize: 18, fontWeight: '600' },
  or: { flexDirection: 'row', alignItems: 'center', gap: 12 }, line: { height: 1, backgroundColor: '#DCE3D9', flex: 1 }, orText: { fontSize: 11, color: '#65756B' }, photoCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E2E7DE', gap: 12 }, photoIcon: { backgroundColor: '#FBEEE5', width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }, photoTitle: { fontSize: 22, fontWeight: '700', color: ink }, meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, paddingVertical: 8 }, metaText: { color: '#536D62', fontSize: 11 }, photoAction: { backgroundColor: '#B84D32', borderRadius: 14, minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  safety: { flexDirection: 'row', gap: 12, paddingVertical: 4 }, smallTitle: { fontSize: 13, fontWeight: '700', color: ink, marginBottom: 5 }, small: { fontSize: 12, lineHeight: 19, color: '#596F63' }, privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }, footer: { fontSize: 11, lineHeight: 18, color: '#627368', textAlign: 'center' },
  modalHeader: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E7DE' }, modalTitle: { fontSize: 16, fontWeight: '700', color: ink }, form: { padding: 24, paddingBottom: 40, gap: 16, width: '100%', maxWidth: 520, alignSelf: 'center' }, formTitle: { fontSize: 28, lineHeight: 36, fontWeight: '800', color: ink, letterSpacing: -0.7 }, label: { color: ink, fontSize: 14, fontWeight: '700', marginTop: 8 }, required: { color: '#BD512D' }, optional: { color: '#627368', fontSize: 12, fontWeight: '400' }, capture: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#C6D3C8', borderRadius: 20, backgroundColor: '#fff', minHeight: 190, justifyContent: 'center', alignItems: 'center', gap: 14, padding: 16 }, imageWrap: { gap: 10 }, image: { width: '100%', height: 240, borderRadius: 18 }, location: { padding: 18, gap: 16, backgroundColor: '#EAF0E7', borderRadius: 18 }, input: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#DCE3D9', padding: 16, minHeight: 110, fontSize: 15, lineHeight: 23, color: ink },
  button: { backgroundColor: '#B84D32', padding: 16, minHeight: 54, borderRadius: 14, flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }, buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' }, secondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CFDBCE' }, secondaryText: { color: ink }, dim: { opacity: 0.5 }, error: { color: '#A23F28', backgroundColor: '#FBEDE5', padding: 14, borderRadius: 12, fontSize: 13, lineHeight: 21 }, notice: { backgroundColor: '#F6EBDD', borderRadius: 14, padding: 18 },
});
