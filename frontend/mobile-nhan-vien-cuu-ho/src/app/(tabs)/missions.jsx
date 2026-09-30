import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRescue } from '../../store';
import { colors, Heading, Icon, MissionCard, Page, s } from '../../ui';
const filters = ['Tất cả', 'Chờ nhận', 'Đang làm', 'Đã xong'];
export default function Missions() {
    const { missions } = useRescue();
    const [filter, setFilter] = useState(0);
    const [query, setQuery] = useState('');
    const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
    const visible = missions.filter(m => (filter === 0 || (filter === 1 && m.stage === 0) || (filter === 2 && m.stage > 0 && m.stage < 5) || (filter === 3 && m.stage === 5)) && normalize(`${m.title} ${m.id} ${m.address}`).includes(normalize(query)));
    return <Page><Heading title="Nhiệm vụ" subtitle="Theo dõi từng bước, hỗ trợ kịp thời."/><View style={[s.input, s.inline]}><Icon name="search" size={19} color={colors.muted}/><TextInput accessibilityLabel="Tìm nhiệm vụ" placeholder="Tìm mã, địa chỉ, nhiệm vụ…" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} style={{ flex: 1, minHeight: 28, color: colors.ink }}/></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{filters.map((f, index) => <Pressable key={f} accessibilityRole="button" accessibilityState={{ selected: filter === index }} onPress={() => setFilter(index)} style={{ backgroundColor: filter === index ? colors.ink : '#fff', borderRadius: 10, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' }}><Text style={{ color: filter === index ? '#fff' : colors.muted, fontWeight: '600' }}>{f}</Text></Pressable>)}</ScrollView><Text style={s.small}>{visible.length} nhiệm vụ · Dữ liệu minh họa</Text>{visible.map(m => <MissionCard key={m.id} mission={m}/>)}{!visible.length && <View style={s.empty}><Icon name="inbox" size={32}/><Text style={s.cardTitle}>Chưa có nhiệm vụ phù hợp</Text><Text style={[s.body, { textAlign: 'center' }]}>Thử từ khóa khác hoặc chọn bộ lọc Tất cả.</Text></View>}</Page>;
}
