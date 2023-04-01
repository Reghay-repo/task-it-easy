import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";

const useSpaceTaskCount = (id: string): number => {
    const counters = useLiveQuery(
        async () => {
            const count = await backend.instance.countTasksSpace(id);
            return count;
        },
        [],
        0
    );

    return counters;
};

export default useSpaceTaskCount;
