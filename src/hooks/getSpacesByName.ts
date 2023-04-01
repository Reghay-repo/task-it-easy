import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";

const useGetSpacesByName = (name: string) => {
    const spaceList = useLiveQuery(
        async () => {
            const data = await backend.instance.getSpacesByName(name);

            return data;
        },
        [name],
        []
    );

    return spaceList;
};

export default useGetSpacesByName;
