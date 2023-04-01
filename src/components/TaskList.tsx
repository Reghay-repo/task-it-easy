import { useRef, useState } from "react";
import TaskComponent from "./Task";
import ArrowDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import useGetTasklist from "../hooks/getTasklist";

interface Props {}

export default function TaskList({}: Props) {
    const spaceReference = useRef<string>("");
    const [spaceId, setSpaceId] = useState<string>(spaceReference.current);
    const [collapsedCompleted, setCollapsedCompleted] = useState<boolean>(false);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/app/today") || location.pathname.includes("/app/inbox") || location.pathname.includes("/app/upcoming")) {
            spaceReference.current = location.pathname.split("/")[2];
            setSpaceId(location.pathname.split("/")[2]);
        } else {
            spaceReference.current = location.pathname.split("/")[3];
            setSpaceId(location.pathname.split("/")[3]);
        }
    }, [location.pathname]);

    const { tasks, completed, emptyImage, emptyMessage } = useGetTasklist(spaceId);

    if (tasks === undefined) {
        return (
            <>
                {new Array(5).fill(0).map((_, index) => (
                    <div key={index} className="flex flex-row space-x-1 border-b p-2">
                        <div role="status" className="animate-pulse">
                            <div className="mb-4 h-6 w-8 rounded-full bg-skin-secondary"></div>
                        </div>
                        <div role="status" className="flex animate-pulse flex-col">
                            <div className="mb-4 h-4 w-64 rounded-full bg-skin-secondary"></div>
                            <div className="w-92 mb-4 h-4 rounded-full bg-skin-secondary"></div>
                            <div className="flex flex-row space-x-2">
                                <div className="mb-4 h-4 w-32 rounded-full bg-skin-secondary"></div>
                                <div className="mb-4 h-4 w-32 rounded-full bg-skin-secondary"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </>
        );
    } else if (tasks.length === 0) {
        return (
            <>
                {completed != undefined ? (
                    <>
                        <button type="button" onClick={() => setCollapsedCompleted((current) => !current)} className="flex flex-row space-x-2 outline-none">
                            <ArrowDownIcon className={"h-5 w-5 text-skin-base" + (!collapsedCompleted ? " -rotate-90" : "")}></ArrowDownIcon>
                            <span className="label">Completed</span>
                        </button>
                        {collapsedCompleted && (
                            <>
                                {completed.map((task) => (
                                    <div key={task.id}>
                                        <TaskComponent key={task.id} task={task}></TaskComponent>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex w-full flex-col items-center justify-center space-y-5 py-10">
                        {emptyImage}
                        <span className="text-lg text-skin-muted">{emptyMessage}</span>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <>
                {tasks.map((task) => (
                    <div key={task.id}>
                        <TaskComponent key={task.id} task={task}></TaskComponent>
                    </div>
                ))}
                <div>
                    {completed != undefined && (
                        <>
                            <button type="button" onClick={() => setCollapsedCompleted((current) => !current)} className="flex flex-row space-x-2 outline-none">
                                <ArrowDownIcon className={"h-5 w-5 text-skin-base" + (!collapsedCompleted ? " -rotate-90" : "")}></ArrowDownIcon>
                                <span className="label">Completed</span>
                            </button>
                            {collapsedCompleted && (
                                <>
                                    {completed.map((task) => (
                                        <div key={task.id}>
                                            <TaskComponent key={task.id} task={task}></TaskComponent>
                                        </div>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }
}
