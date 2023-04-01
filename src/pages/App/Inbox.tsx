import { useState } from "react";
import InboxIcon from "@heroicons/react/24/solid/ArchiveBoxArrowDownIcon";
import Facade from "../../components/Facade";
import OptionsIcon from "@heroicons/react/24/outline/EllipsisHorizontalIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/outline/ArchiveBoxXMarkIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Bars3BottomLeftIcon from "@heroicons/react/24/outline/Bars3BottomLeftIcon";
import useDocumentTitle from "../../utils/documentTitle";
import { useOutletContext } from "react-router-dom";
import { AppContext } from "../../layouts/AppLayout";
import useGetWorkspace from "../../hooks/getWorkspace";
import backend from "../../data/BackendFactory";
import { useToastStore } from "../../stores/toast";

export default function Inbox() {
    useDocumentTitle("Inbox");

    const { setSlideOver } = useOutletContext<AppContext>();
    const [renderMenu, setRenderMenu] = useState<boolean>(false);

    const { showCompletedInbox } = useGetWorkspace();

    const setShowCompleted = (showCompleted: boolean) => {
        backend.instance.setWorkspaceData({ showCompletedInbox: showCompleted });
    };

    const { addToast } = useToastStore();

    const handleClearCompleted = async () => {
        const result = await backend.instance.clearCompletedTasksFromSpace("inbox");

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }
    };

    const handleClearAll = async () => {
        const result = await backend.instance.clearTasksFromSpace("inbox");

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }
    };

    return (
        <>
            <div className="flex flex-row items-center space-x-3">
                <button type="button" onClick={() => setSlideOver(true)} className="flex items-center outline-none lg:hidden">
                    <Bars3BottomLeftIcon className="h-6 w-6 text-skin-base"></Bars3BottomLeftIcon>
                </button>
                <div className="flex flex-row items-center space-x-2">
                    <InboxIcon className="h-6 w-6 text-yellow-700"></InboxIcon>
                    <span className="text-2xl font-bold text-skin-base">Inbox</span>
                </div>
            </div>
            <Facade
                render={renderMenu}
                facade={
                    <button
                        type="button"
                        onClick={() => {
                            setRenderMenu(true);
                        }}
                    >
                        <OptionsIcon className="bg-animation h-8 w-8 p-1 text-skin-secondary hover:bg-skin-secondary hover:text-skin-secondaryhover"></OptionsIcon>
                    </button>
                }
                element={() => import("../../components/Select")}
                props={{
                    trigger: <OptionsIcon className="bg-animation h-8 w-8 p-1 text-skin-secondary hover:bg-skin-secondary hover:text-skin-secondaryhover"></OptionsIcon>,
                    className: "z-[100] flex w-44 flex-col space-y-1 rounded-md shadow-lg bg-skin-secondary",
                    labels: [
                        <button
                            onClick={() => {
                                setRenderMenu(false);
                                setShowCompleted(!showCompletedInbox);
                            }}
                            type="button"
                            className="flex w-full flex-row items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                        >
                            {showCompletedInbox ? <EyeSlashIcon className="h-5 w-5 flex-none"></EyeSlashIcon> : <EyeIcon className="h-5 w-5 flex-none"></EyeIcon>}
                            <span>{showCompletedInbox ? "Hide completed" : "Show completed"}</span>
                        </button>,
                        <button
                            onClick={() => {
                                setRenderMenu(false);
                                handleClearCompleted();
                            }}
                            type="button"
                            className="flex w-full flex-row items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                        >
                            <ArchiveBoxXMarkIcon className="h-5 w-5 flex-none"></ArchiveBoxXMarkIcon>
                            <span>Clear completed</span>
                        </button>,
                        <button
                            onClick={() => {
                                setRenderMenu(false);
                                handleClearAll();
                            }}
                            type="button"
                            className="flex w-full flex-row items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                        >
                            <TrashIcon className="h-5 w-5 flex-none"></TrashIcon>
                            <span>Clear all</span>
                        </button>,
                    ],
                }}
            />
        </>
    );
}
