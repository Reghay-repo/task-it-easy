import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";
import { Workspace } from "../types";

const useGetWorkspace = () => {
    const workspace = useLiveQuery(
        async () => {
            const data = await backend.instance.getWorkspaceData();

            return {
                name: data.name,
                createdAt: data.createdAt,
                theme: data.theme,
                accent: data.accent,
                showCompletedInbox: data.showCompletedInbox,
                showCompletedToday: data.showCompletedToday,
                showCompletedUpcoming: data.showCompletedUpcoming,
                useSheets: data.useSheets,
            } as Workspace;
        },
        [],
        {
            name: "",
            createdAt: 0,
            theme: "theme-dark",
            accent: "theme-accent-default",
            showCompletedInbox: false,
            showCompletedToday: false,
            showCompletedUpcoming: false,
        } as Workspace
    );

    return workspace;
};

export default useGetWorkspace;
