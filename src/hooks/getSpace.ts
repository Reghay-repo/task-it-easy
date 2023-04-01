import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";
import { Space } from "../types";

const useGetSpace = (id: string | undefined) => {
    const space = useLiveQuery(
        async () => {
            if (!id) return undefined;

            if (id == "inbox") {
                return {
                    id: "inbox",
                    name: "inbox",
                    showCompleted: false,
                    color: { base: "amber", gradient: "100" },
                } as Space;
            }

            const s = await backend.instance.getSpace(id);

            if (!s) return undefined;

            return s;
        },
        [id],
        undefined
    );

    return space;
};

export default useGetSpace;
