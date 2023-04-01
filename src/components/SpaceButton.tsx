import { AnimatePresence, motion } from "framer-motion";
import OptionsIcon from "@heroicons/react/24/outline/EllipsisHorizontalIcon";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ColorType, getColorClass } from "../utils/colors";
import Alert from "./Alert";
import Facade from "./Facade";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import ArchiveBoxXMarkIcon from "@heroicons/react/24/outline/ArchiveBoxXMarkIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import DocumentMinusIcon from "@heroicons/react/24/outline/DocumentMinusIcon";
import backend from "../data/BackendFactory";
import { useToastStore } from "../stores/toast";
import useSpaceTaskCount from "../hooks/getSpaceTaskCount";

interface Props {
    id: string;
    name: string;
    color: ColorType;
    showCompleted: boolean;
    setSlideOver: React.Dispatch<React.SetStateAction<boolean>>;
}

const animations = {
    layout: true,
    initial: "in",
    whileTap: "tapped",
    variants: {
        in: { scaleY: 1, opacity: 1 },
        out: { scaleY: 0, opacity: 0, zIndex: -1 },
        tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    duration: { delay: 0.3, ease: "linear" },
};

export default function SpaceButton({ id, name, color, showCompleted, setSlideOver }: Props) {
    const [showOptions, setOptions] = useState<boolean>(false);
    const [render, setRender] = useState<boolean>(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { addToast } = useToastStore();

    let handleDeleteSpace = async () => {
        const result = await backend.instance.deleteSpace(id);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }

        if (location.pathname.includes(id)) {
            navigate("/app/today");
        }
    };

    let handleDuplicate = async () => {
        const result = await backend.instance.addSpace({ name, color, showCompleted: false });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    let handleClearTasks = async () => {
        const result = await backend.instance.clearTasksFromSpace(id);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const handleClearCompleted = async () => {
        const result = await backend.instance.clearCompletedTasksFromSpace(id);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const tasksNumber = useSpaceTaskCount(id);

    const setShowCompleted = async (completed: boolean) => {
        const result = await backend.instance.editSpace(id, { showCompleted: completed });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    return (
        <motion.div
            onMouseEnter={() => setOptions(true)}
            onMouseLeave={() => {
                setOptions(false);
                setRender(false);
            }}
            className={"side-nav-button flex flex-row items-center justify-between py-2 text-sm" + (location.pathname.includes(id) ? " bg-skin-secondaryhover" : "")}
            {...animations}
        >
            <Link to={`/app/spaces/${id}`} onClick={() => setSlideOver(false)} className="flex min-w-0 flex-grow flex-row items-center space-x-3">
                <div className={`h-2.5 w-2.5 flex-none rounded-md ${getColorClass(color, "bg")}`}></div>
                <span className="truncate text-skin-base">{name}</span>
            </Link>
            <AnimatePresence>
                {showOptions ? (
                    <Facade
                        render={render}
                        facade={
                            <button
                                type="button"
                                onClick={() => {
                                    setRender(true);
                                }}
                            >
                                <OptionsIcon className="bg-animation h-5 w-5 text-skin-base hover:text-skin-secondaryhover"></OptionsIcon>
                            </button>
                        }
                        element={() => import("./Select")}
                        props={{
                            trigger: <OptionsIcon className="bg-animation h-5 w-5 text-skin-secondary hover:text-skin-secondaryhover"></OptionsIcon>,
                            className: "z-[100] flex w-44 flex-col space-y-2 rounded-md bg-skin-secondary shadow-lg",
                            labels: [
                                <Link to={location.pathname + `/edit-space/${id}`} className="flex w-full items-center justify-start space-x-2 rounded-md bg-skin-secondary px-2 py-1 text-skin-base hover:bg-skin-secondaryhover">
                                    <PencilIcon className="h-5 w-5 flex-none"></PencilIcon>
                                    <span>Edit</span>
                                </Link>,
                                <button
                                    onClick={() => {
                                        setRender(false);
                                        handleDuplicate();
                                    }}
                                    type="button"
                                    className="flex w-full items-center justify-start space-x-2 rounded-md bg-skin-secondary px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                                >
                                    <DocumentDuplicateIcon className="h-5 w-5 flex-none"></DocumentDuplicateIcon>
                                    <span>Duplicate</span>
                                </button>,
                                <button onClick={() => handleClearTasks()} type="button" className="flex w-full items-center justify-start space-x-2 rounded-md bg-skin-secondary px-2 py-1 text-skin-base hover:bg-skin-secondaryhover">
                                    <DocumentMinusIcon className="h-5 w-5"></DocumentMinusIcon>
                                    <span>Clear tasks</span>
                                </button>,
                                <Alert
                                    title="Delete Space"
                                    message="Are you sure? all the tasks will be deleted."
                                    confirmText="Yes, delete"
                                    onCancel={() => {
                                        setRender(false);
                                    }}
                                    onConfirm={() => {
                                        setRender(false);
                                        handleDeleteSpace();
                                    }}
                                    trigger={
                                        <button type="button" className="flex w-full items-center justify-start space-x-2 rounded-md bg-skin-secondary px-2 py-1 text-skin-base hover:bg-skin-secondaryhover">
                                            <TrashIcon className="h-5 w-5"></TrashIcon>
                                            <span>Delete Space</span>
                                        </button>
                                    }
                                ></Alert>,
                                ,
                                <hr className="text-skin-secondary" />,
                                <button
                                    onClick={() => {
                                        setRender(false);
                                        setShowCompleted(!showCompleted);
                                    }}
                                    type="button"
                                    className="flex w-full flex-row items-center justify-start space-x-2 rounded-md bg-skin-secondary px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                                >
                                    {showCompleted ? <EyeSlashIcon className="h-5 w-5 flex-none"></EyeSlashIcon> : <EyeIcon className="h-5 w-5 flex-none"></EyeIcon>}
                                    <span>{showCompleted ? "Hide completed" : "Show completed"}</span>
                                </button>,
                                <button
                                    onClick={() => {
                                        setRender(false);
                                        handleClearCompleted();
                                    }}
                                    type="button"
                                    className="flex w-full flex-row items-center justify-start space-x-2 rounded-md bg-skin-secondary px-2 py-1 text-skin-base hover:bg-skin-secondaryhover"
                                >
                                    <ArchiveBoxXMarkIcon className="h-5 w-5 flex-none"></ArchiveBoxXMarkIcon>
                                    <span>Clear completed</span>
                                </button>,
                            ],
                        }}
                    />
                ) : (
                    <>
                        {tasksNumber ? (
                            <motion.span className="text-sm text-skin-base" {...animations}>
                                {tasksNumber > 99 ? "99+" : tasksNumber}
                            </motion.span>
                        ) : null}
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
