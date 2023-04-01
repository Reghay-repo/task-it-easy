import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";

const useCounters = (): {
    inboxCount: number;
    todayCount: number;
    upcomingCount: number;
} => {
    const counters = useLiveQuery(
        async () => {
            const inboxCount = await backend.instance.countTasksInbox();
            const todayCount = await backend.instance.countTasksToday();
            const upcomingCount = await backend.instance.countTasksUpcoming();
            return { inboxCount, todayCount, upcomingCount };
        },
        [],
        { inboxCount: 0, todayCount: 0, upcomingCount: 0 }
    );

    return counters;
};

export default useCounters;
