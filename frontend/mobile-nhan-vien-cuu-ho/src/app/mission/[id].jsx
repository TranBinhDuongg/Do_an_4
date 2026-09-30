import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { stages, staffName, useRescue } from '../../store';
import { actions, transitionError } from '../../domain';
import { Badge, Button, colors, Icon, Page, s, Section } from '../../ui';
export default function Detail() {
    const { id } = useLocalSearchParams();
    const { missions, advance, onDuty, user } = useRescue();
    const mission = missions.find(m => m.id === id);
    const [handover, setHandover] = useState({ recipient: '', destination: '', count: '', condition: '' });
    const [confirmStage, setConfirmStage] = useState(null);
    const [error, setError] = useState('');
    const back = () => router.canGoBack() ? router.back() : router.replace('/missions');
    if (!mission)
        return <Page><Text style={s.title}>Không có nhiệm vụ được phân công</Text><Button label="Về danh sách nhiệm vụ" onPress={() => router.replace('/missions')}/></Page>;
    const isLeader = mission.leader === user.id;
    const finished = mission.stage === 5;
    const validation = transitionError(mission, user.id, onDuty, handover);
    const confirming = confirmStage === mission.stage;
    return <Page>
    <View style={s.row}><Pressable accessibilityRole="button" onPress={back} style={s.touch}><Icon name="arrow-left"/><Text style={s.link}>Quay lại</Text></Pressable><Text style={s.small}>{mission.id}</Text></View>
    <Badge label={mission.priority} urgent={mission.priority === 'Khẩn cấp'}/>
    <Text style={s.title}>{mission.title}</Text>
    <Text style={s.small}>Phân công lúc {mission.time} · {mission.members.length} thành viên</Text>
    <View style={s.card}><Section title="Động vật cần cứu hộ"/><Text style={s.cardTitle}>{mission.animal} · {mission.count} cá thể</Text><Text style={s.body}>{mission.description}</Text></View>
    <View style={s.card}><Section title="Thông tin hiện trường"/><View style={s.inline}><Icon name="map-pin" color={colors.green}/><Text style={s.cardTitle}>{mission.address}</Text></View><Text style={s.body}>{mission.district}</Text><Text style={s.body}>Người báo tin: {mission.reporter}</Text><Text style={s.small}>Chưa có số liên hệ trong dữ liệu mẫu. Chưa kết nối định vị hoặc chỉ đường.</Text></View>
    <View style={s.card}><Section title="Nhóm được phân công"/><Text style={s.body}>Nhóm linh hoạt theo ca, do điều phối viên phân công.</Text>{mission.members.map(member => <View key={member} style={s.row}><Text style={[s.body, { color: colors.ink }]}>{staffName(member)}{member === user.id ? ' (Bạn)' : ''}</Text><Badge label={member === mission.leader ? 'Phụ trách ca' : 'Thành viên'}/></View>)}</View>
    {mission.stage === 1 && <View style={[s.card, { backgroundColor: colors.orangePale }]}><Text style={s.cardTitle}>Đã nhận nhiệm vụ — Chờ xác nhận xuất phát</Text><Text style={s.body}>{isLeader ? 'Chỉ bấm “Bắt đầu di chuyển” khi nhóm thực sự lên đường.' : `Chưa có xác nhận xuất phát từ ${staffName(mission.leader)}.`}</Text></View>}
    <View style={s.card}><Section title="Tiến độ ca cứu hộ"/>{stages.map((stage, index) => <View key={stage} style={{ flexDirection: 'row', gap: 13, alignItems: 'center', minHeight: 44, flexWrap: 'wrap' }}><View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: index <= mission.stage ? colors.green : colors.pale, alignItems: 'center', justifyContent: 'center' }}>{index < mission.stage ? <Icon name="check" size={16} color="#fff"/> : <Text style={{ color: index === mission.stage ? '#fff' : colors.muted, fontWeight: '700' }}>{index + 1}</Text>}</View><Text style={[s.body, index === mission.stage && { fontWeight: '700', color: colors.ink }]}>{stage}</Text>{index === mission.stage && <Badge label="Hiện tại"/>}</View>)}</View>
    {mission.stage === 4 && isLeader && <View style={s.card}><Section title="Bàn giao về trung tâm"/>{[{ key: 'recipient', label: 'Người tiếp nhận' }, { key: 'destination', label: 'Nơi bàn giao' }, { key: 'count', label: 'Số cá thể bàn giao' }, { key: 'condition', label: 'Tình trạng động vật và ghi chú' }].map(field => <View key={field.key} style={{ gap: 7 }}><Text style={s.body}>{field.label}</Text><TextInput accessibilityLabel={field.label} value={handover[field.key]} onChangeText={value => { setHandover(current => ({ ...current, [field.key]: value })); setConfirmStage(null); setError(''); }} keyboardType={field.key === 'count' ? 'number-pad' : 'default'} multiline={field.key === 'condition'} maxLength={field.key === 'condition' ? 1000 : 120} style={s.input}/></View>)}<Text style={s.small}>Nếu chưa bàn giao đủ số cá thể, ghi rõ kết quả của các cá thể còn lại trong ghi chú.</Text></View>}
    {finished && mission.handover && <View style={s.card}><Section title="Kết quả bàn giao"/><Text style={s.body}>{mission.handover.count} {mission.animal.toLowerCase()} · {mission.handover.destination}</Text><Text style={s.body}>Người nhận: {mission.handover.recipient}</Text><Text style={s.body}>{mission.handover.condition}</Text></View>}
    {!finished && !isLeader && <View style={s.card}><Text style={s.cardTitle}>Người phụ trách xác nhận tiến độ</Text><Text style={s.body}>Bạn là thành viên ca này. {staffName(mission.leader)} xác nhận nhận nhiệm vụ, xuất phát và cập nhật tiến độ chung của nhóm.</Text></View>}
    {!finished && isLeader && <View style={{ gap: 12 }}>
      {mission.stage === 0 && <Text style={s.body}>Kiểm tra khả năng tham gia của toàn nhóm trước khi xác nhận nhận nhiệm vụ. Xác nhận này chưa có nghĩa nhóm đã xuất phát.</Text>}
      {validation ? <Text style={[s.body, { color: colors.orange }]}>{validation}</Text> : null}
      {!confirming ? <Button label={actions[mission.stage]} disabled={!!validation} icon="check" onPress={() => { setConfirmStage(mission.stage); setError(''); }}/> : <View style={s.card}><Text style={s.cardTitle}>{actions[mission.stage]}?</Text><Text style={s.body}>Ghi nhận {user.name} là người xác nhận. Thao tác mẫu chưa gửi sang web điều phối.</Text><Button label="Xác nhận cập nhật" disabled={!!validation} onPress={() => { const problem = advance(mission.id, mission.stage, mission.stage === 4 ? handover : undefined); setError(problem); if (!problem)
            setConfirmStage(null); }}/><Button secondary label="Hủy" onPress={() => setConfirmStage(null)}/></View>}
      {!!error && <Text accessibilityRole="alert" style={[s.body, { color: colors.orange }]}>{error}</Text>}
    </View>}
    <View style={s.card}><Section title="Lịch sử cập nhật"/>{mission.log.map((entry, index) => <Text key={`${index}-${entry}`} style={s.body}>{entry}</Text>)}</View>
    <Text style={[s.small, { textAlign: 'center' }]}>Dữ liệu mẫu · Chưa đồng bộ với web điều phối</Text>
  </Page>;
}
