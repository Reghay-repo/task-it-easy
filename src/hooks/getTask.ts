import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";

const useGetTask = (id: string | undefined) => {
    const task = useLiveQuery(
        async () => {
            if (!id) return undefined;

            const t = await backend.instance.getTask(id ?? "");

            if (!t) return undefined;

            return t;
        },
        [id],
        undefined
    );

    return task;
};

export default useGetTask;
