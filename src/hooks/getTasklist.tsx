import { useLiveQuery } from "dexie-react-hooks";
import backend from "../data/BackendFactory";
import { Task } from "../types";
import useGetWorkspace from "./getWorkspace";

const useGetTasklist = (spaceId: string) => {
    const defaultReturn = {
        tasks: undefined,
        completed: undefined,
        emptyMessage: <div role="status" className="flex h-4 w-24 animate-pulse rounded-full bg-skin-secondary"></div>,
        emptyImage: <div role="status" className="flex h-24 w-24 animate-pulse rounded-full bg-skin-secondary"></div>,
    };

    const { showCompletedInbox, showCompletedToday, showCompletedUpcoming } = useGetWorkspace();

    const data = useLiveQuery(
        async () => {
            if (spaceId === "") {
                return defaultReturn;
            }

            let tasks: Task[] | undefined = undefined;
            let completed: Task[] | undefined = undefined;
            let message: string = "";
            let image;

            if (spaceId == "today") {
                tasks = await backend.instance.getTodayTasks();

                if (tasks.length === 0) {
                    image = (await import("../assets/today_no_tasks.svg")).default;
                }

                message = "We're done today, time to relax.";

                if (showCompletedToday) {
                    completed = await backend.instance.getTodayTasks(true);
                }
            } else if (spaceId == "upcoming") {
                tasks = await backend.instance.getUpcomingTasks();

                if (tasks.length === 0) {
                    image = (await import("../assets/upcoming_no_tasks.svg")).default;
                }

                message = "Looks like you gonna have some free time soon.";

                if (showCompletedUpcoming) {
                    completed = await backend.instance.getUpcomingTasks(true);
                }
            } else if (spaceId == "inbox") {
                tasks = await backend.instance.getTasksBySpaceId("inbox");

                if (tasks.length === 0) {
                    image = (await import("../assets/inbox_no_tasks.svg")).default;
                }

                message = "Finishing your tasks is one of the best feeling ever, isn't?";

                if (showCompletedInbox) {
                    completed = await backend.instance.getTasksBySpaceId("inbox", true);
                }
            } else {
                tasks = await backend.instance.getTasksBySpaceId(spaceId);

                const s = await backend.instance.getSpace(spaceId);

                if (s === undefined) {
                    return defaultReturn;
                }

                if (tasks.length === 0) {
                    image = (await import("../assets/space_no_tasks.svg")).default;
                }

                message = "No tasks. time to relax.";

                if (s.showCompleted) {
                    completed = await backend.instance.getTasksBySpaceId(spaceId, true);
                }
            }

            return {
                tasks,
                completed,
                emptyMessage: <span className="text-lg text-skin-muted">{message}</span>,
                emptyImage: <img src={image} alt="" width={384} height={384} />,
            };
        },
        [spaceId, showCompletedInbox, showCompletedToday, showCompletedUpcoming],
        defaultReturn
    );

    return data;
};

export default useGetTasklist;
