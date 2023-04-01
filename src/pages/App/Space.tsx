import { useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import EditableText from "../../components/EditableText";
import Facade from "../../components/Facade";
import OptionsIcon from "@heroicons/react/24/outline/EllipsisHorizontalIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/outline/ArchiveBoxXMarkIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import DocumentMinusIcon from "@heroicons/react/24/outline/DocumentMinusIcon";
import Bars3BottomLeftIcon from "@heroicons/react/24/outline/Bars3BottomLeftIcon";
import useDocumentTitle from "../../utils/documentTitle";
import { AppContext } from "../../layouts/AppLayout";
import useGetSpace from "../../hooks/getSpace";
import { useToastStore } from "../../stores/toast";
import backend from "../../data/BackendFactory";

export default function Space() {
    const { spaceId } = useParams();
    const navigate = useNavigate();
    const { setSlideOver } = useOutletContext<AppContext>();
    const spaceData = useGetSpace(spaceId);

    const { addToast } = useToastStore();

    useDocumentTitle(spaceData ? spaceData.name : "Space");

    const onChangeSpaceName = async (name: string) => {
        const result = await backend.instance.editSpace(spaceId!, { name });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const [renderMenu, setRenderMenu] = useState<boolean>(false);

    const { pathname } = useLocation();

    const handleDeleteSpace = async () => {
        const result = await backend.instance.deleteSpace(spaceId!);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }

        if (pathname.includes(spaceId!)) {
            navigate("/app/today");
        }
    };

    const handleDuplicate = async () => {
        const result = await backend.instance.addSpace({
            name: spaceData!.name,
            color: spaceData!.color,
            showCompleted: false,
        });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const setShowCompleted = async (completed: boolean) => {
        const result = await backend.instance.editSpace(spaceId!, { showCompleted: completed });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    let handleClearTasks = async () => {
        const result = await backend.instance.clearTasksFromSpace(spaceId!);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const handleClearCompleted = async () => {
        const result = await backend.instance.clearCompletedTasksFromSpace(spaceId!);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    return (
        <>
            <div className="flex flex-row items-center space-x-3">
                <div onClick={() => setSlideOver(true)} className="flex cursor-pointer items-center lg:hidden">
                    <Bars3BottomLeftIcon className="h-6 w-6 text-skin-base"></Bars3BottomLeftIcon>
                </div>
                {!spaceData ? <div className="h-8 w-64 animate-pulse rounded-full bg-skin-secondary"></div> : <EditableText className="text-2xl font-bold text-skin-base" onChange={onChangeSpaceName} defaultValue={spaceData.name}></EditableText>}
            </div>
            {spaceData == undefined ? (
                <div role="status" className="flex h-5 w-5 animate-pulse rounded-md bg-skin-secondary"></div>
            ) : (
                <Facade
                    render={renderMenu}
                    facade={
                        <button
                            type="button"
                            onClick={() => {
                                setRenderMenu(true);
                            }}
                        >
                            <OptionsIcon className="bg-animation hover:text-secondaryhover h-8 w-8 p-1 text-skin-secondary hover:bg-skin-secondary"></OptionsIcon>
                        </button>
                    }
                    element={() => import("../../components/Select")}
                    props={{
                        trigger: <OptionsIcon className="bg-animation hover:text-secondaryhover h-8 w-8 p-1 text-skin-secondary hover:bg-skin-secondary"></OptionsIcon>,
                        className: "z-[100] flex w-44 flex-col space-y-2 rounded-mdshadow-lg bg-skin-secondary",
                        labels: [
                            <Link to={location.pathname + `/edit-space/${spaceId}`} className="flex w-full items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover">
                                <PencilIcon className="h-5 w-5 flex-none"></PencilIcon>
                                <span>Edit</span>
                            </Link>,
                            <button
                                onClick={() => {
                                    setRenderMenu(false);
                                    handleDuplicate();
                                }}
                                type="button"
                                className="flex w-full items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                            >
                                <DocumentDuplicateIcon className="h-5 w-5 flex-none"></DocumentDuplicateIcon>
                                <span>Duplicate</span>
                            </button>,
                            <button
                                onClick={() => {
                                    setRenderMenu(false);
                                    handleClearTasks();
                                }}
                                type="button"
                                className="flex w-full items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                            >
                                <DocumentMinusIcon className="h-5 w-5"></DocumentMinusIcon>
                                <span>Clear tasks</span>
                            </button>,
                            <Alert
                                title="Delete Space"
                                message="Are you sure? all the tasks will be deleted."
                                confirmText="Yes, delete"
                                onCancel={() => {
                                    setRenderMenu(false);
                                }}
                                onConfirm={() => {
                                    setRenderMenu(false);
                                    handleDeleteSpace();
                                }}
                                trigger={
                                    <button type="button" className="flex w-full items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover">
                                        <TrashIcon className="h-5 w-5"></TrashIcon>
                                        <span>Delete Space</span>
                                    </button>
                                }
                            ></Alert>,
                            ,
                            <hr />,
                            <button
                                onClick={() => {
                                    setRenderMenu(false);
                                    setShowCompleted(!spaceData.showCompleted);
                                }}
                                type="button"
                                className="flex w-full flex-row items-center justify-start space-x-2 rounded-md px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                            >
                                {spaceData.showCompleted ? <EyeSlashIcon className="h-5 w-5 flex-none"></EyeSlashIcon> : <EyeIcon className="h-5 w-5 flex-none"></EyeIcon>}
                                <span>{spaceData.showCompleted ? "Hide completed" : "Show completed"}</span>
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
                        ],
                    }}
                />
            )}
        </>
    );
}
