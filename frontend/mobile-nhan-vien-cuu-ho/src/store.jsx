import { createContext, useContext, useState } from 'react';
import { advanceMission, initialMissions, staff, transitionError } from './domain';
import { useSession } from './session';
export { stages, staff, staffName } from './domain';
const Context = createContext(null);
export function RescueProvider({ children }) {
    const { session } = useSession();
    const [allMissions, setMissions] = useState(session?.demo ? initialMissions : []);
    const [userId, setUserId] = useState('NV03');
    const [onDuty, setOnDuty] = useState(true);
    const user = session?.demo || !session ? staff.find(person => person.id === userId) || staff[0] : { ...session.user, initials: session.user.name.split(' ').slice(-2).map(part => part[0]).join('') };
    const [seen, setSeen] = useState({});
    const missions = allMissions.filter(m => m.members.includes(user.id));
    function advance(id, expectedStage, handover) {
        const mission = allMissions.find(m => m.id === id);
        if (!mission || mission.stage !== expectedStage)
            return 'Trạng thái đã thay đổi. Hãy mở lại nhiệm vụ.';
        const error = transitionError(mission, user.id, onDuty, handover);
        if (error)
            return error;
        const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setMissions(current => current.map(m => m.id === id && m.stage === expectedStage ? advanceMission(m, user.id, onDuty, time, handover) : m));
        return '';
    }
    return <Context.Provider value={{ missions, user, setUserId, onDuty, setOnDuty, advance, seen, markSeen: id => setSeen(current => ({ ...current, [`${user.id}:${id}`]: true })), reset: () => { setMissions(session?.demo ? initialMissions : []); setSeen({}); setOnDuty(true); } }}>{children}</Context.Provider>;
}
export function useRescue() {
    const state = useContext(Context);
    if (!state)
        throw new Error('RescueProvider is required');
    return state;
}
