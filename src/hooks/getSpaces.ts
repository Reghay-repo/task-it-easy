import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";

const useGetSpaces = () => {
    const spaceList = useLiveQuery(
        async () => {
            const data = await backend.instance.getSpaces();

            return data;
        },
        [],
        []
    );

    return spaceList;
};

export default useGetSpaces;
