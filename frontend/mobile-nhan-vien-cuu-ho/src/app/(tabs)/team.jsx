import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Badge, colors, Heading, Icon, Page, s, Section } from '../../ui';
import { staff, staffName, stages, useRescue } from '../../store';
const equipment = ['Lồng vận chuyển động vật', 'Găng tay bảo hộ, khăn phủ', 'Túi sơ cứu thú y', 'Dây dắt, dụng cụ tiếp cận'];
export default function Team() {
    const { missions, user } = useRescue();
    const [selected, setSelected] = useState('');
    const [checkedByCase, setCheckedByCase] = useState({});
    const mission = missions.find(m => m.id === selected) || missions.find(m => m.stage < 5) || missions[0];
    const checked = mission ? checkedByCase[mission.id] || [] : [];
    return <Page>
    <Heading title="Nhóm của từng ca" subtitle="Thành viên và người phụ trách do điều phối phân công."/>
    <View style={{ gap: 10 }}>{missions.map(m => <Pressable accessibilityRole="button" accessibilityState={{ selected: mission?.id === m.id }} key={m.id} onPress={() => setSelected(m.id)} style={[s.card, mission?.id === m.id && { borderColor: colors.green, backgroundColor: colors.pale }]}><Text style={s.cardTitle}>{m.id} · {m.title}</Text><Text style={s.small}>{stages[m.stage]} · {m.members.length} thành viên</Text></Pressable>)}</View>
    {!mission ? <View style={s.empty}><Text style={s.body}>Bạn chưa được phân công vào ca nào.</Text></View> : <>
      <View style={[s.card, { backgroundColor: colors.ink }]}><Icon name="users" color="#BADBC9" size={32}/><Text style={[s.section, { color: '#fff' }]}>Nhóm ca {mission.id}</Text><Text style={[s.body, { color: '#C6D9CE' }]}>Phụ trách: {staffName(mission.leader)}</Text><Text style={[s.small, { color: '#C6D9CE' }]}>Nhóm được lập riêng cho ca này, không phải đội cố định.</Text></View>
      <Section title="Thành viên tham gia"/>
      <View style={s.card}>{mission.members.map(id => {
                const member = staff.find(person => person.id === id);
                return <View key={id} style={[s.inline, { paddingVertical: 10, gap: 14 }]}><View style={s.avatar}><Text style={s.avatarText}>{member?.initials}</Text></View><View style={{ flex: 1, gap: 5 }}><Text style={[s.cardTitle, { fontSize: 16 }]}>{staffName(id)}{id === user.id ? ' (Bạn)' : ''}</Text><Text style={s.small}>{member?.skills}</Text><Badge label={id === mission.leader ? 'Nhóm trưởng của ca' : 'Thành viên'}/></View></View>;
            })}</View>
      {mission.stage < 5 && <><View style={s.row}><Text style={s.section}>Thiết bị trước khi xuất phát</Text><Badge label={`${checked.length}/${equipment.length}`}/></View><View style={s.card}>{equipment.map(item => <Pressable key={item} accessibilityRole="checkbox" accessibilityState={{ checked: checked.includes(item) }} onPress={() => setCheckedByCase(current => { const list = current[mission.id] || []; return { ...current, [mission.id]: list.includes(item) ? list.filter(x => x !== item) : [...list, item] }; })} style={[s.inline, { minHeight: 48, gap: 13 }]}><Icon name={checked.includes(item) ? 'check-square' : 'square'} color={checked.includes(item) ? colors.green : colors.muted}/><Text style={[s.body, { color: colors.ink, flex: 1 }]}>{item}</Text></Pressable>)}</View></>}
    </>}
    <Text style={s.small}>Dữ liệu mẫu · Danh sách kiểm tra cá nhân, chưa gửi cho nhóm hoặc điều phối.</Text>
  </Page>;
}
