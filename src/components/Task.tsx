import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Frequency, Task } from "../types";
import DatePickerPopOver from "./DatePickerPopOver";
import SpacePopOver from "./SpacePopOver";
import TextArea from "./TextArea";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import CommentTaskIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon";
import QuickEditIcon from "@heroicons/react/24/outline/PencilIcon";
import DeleteTaskIcon from "@heroicons/react/24/outline/TrashIcon";
import { Link, useLocation } from "react-router-dom";
import backend from "../data/BackendFactory";
import { useToastStore } from "../stores/toast";
import { DatepickerColor, GetDatePickerColor } from "../utils/time";

interface Props {
    task: Task;
}

const animations = {
    layout: true,
    initial: "in",
    variants: {
        in: { opacity: 1 },
        out: { opacity: 0, zIndex: -1 },
    },
};

export default function TaskComponent({ task }: Props) {
    const [editing, setEditing] = useState<boolean>(false);

    const [editTitle, setEditTitle] = useState<string>(task.title);
    const [editDescription, setEditDescription] = useState<string>(task.description);
    const [frequency, setFrequency] = useState<Frequency>(task.frequency);

    const [date, setDate] = useState<number>(task.deadline);
    const [spaceSelected, setSpaceSelected] = useState<string>(task.spaceId);

    const cleanUp = () => {
        setEditing(false);
        setDate(task.deadline);
        setFrequency(task.frequency);
        setSpaceSelected(task.spaceId);
    };

    const handleToggleCheckTask = async () => {
        const result = await backend.instance.toggleCheckTask(task.id);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const { addToast } = useToastStore();

    const updateDueDate = async (newDealine: number) => {
        const result = await backend.instance.editTask(task.id, { deadline: newDealine });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const updateFrequency = async (newFrequency: Frequency) => {
        const result = await backend.instance.editTask(task.id, { frequency: newFrequency });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const updateSpaceID = async (newId: string) => {
        const result = await backend.instance.editTask(task.id, { spaceId: newId });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const editTask = async () => {
        const result = await backend.instance.editTask(task.id, {
            title: editTitle,
            description: editDescription,
            frequency,
            deadline: date,
            spaceId: spaceSelected,
        });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }

        setEditing(false);
    };

    const deleteTask = async () => {
        const result = await backend.instance.deleteTask(task.id);

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const datepickerColor: DatepickerColor = GetDatePickerColor(date);
    const location = useLocation();

    return (
        <AnimatePresence>
            {editing ? (
                <motion.div className="flex flex-col space-y-1 rounded-md border border-skin-base p-1" {...animations}>
                    <div className="flex w-full flex-col border-b border-skin-base p-1">
                        <TextArea value={editTitle} onChange={(text) => setEditTitle(text)} className="border-none px-1 py-1 text-lg text-skin-base outline-none focus:ring-0" focus={true} placeholder="Task title"></TextArea>
                        <TextArea value={editDescription} onChange={(text) => setEditDescription(text)} focus={false} className="border-none px-1 py-1 text-sm text-skin-muted outline-none focus:ring-0" placeholder="Description"></TextArea>
                    </div>
                    <div className="flex flex-row items-center justify-between p-1">
                        <div className="flex flex-row items-center space-x-2">
                            <DatePickerPopOver date={date} setDate={setDate} frequency={frequency} setFrequency={setFrequency}></DatePickerPopOver>
                            <SpacePopOver selected={spaceSelected} setSelected={(value) => setSpaceSelected(value)}></SpacePopOver>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <button onClick={() => cleanUp()} type="button" className="button secondary text-sm">
                                Cancel
                            </button>
                            <button onClick={() => editTask()} type="button" className="button primary text-sm">
                                Save
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div className="bg-animation group relative flex min-h-[4rem] flex-row rounded-md p-2 hover:bg-skin-secondary" {...animations}>
                    <div className="flex px-2">
                        <button
                            onClick={() => handleToggleCheckTask()}
                            type="button"
                            className={
                                "inline-flex h-5 w-5 items-center justify-center rounded-sm border transition-all duration-300 ease-linear" + (task.checked ? " border-emerald-400 bg-emerald-400 text-white" : " border-skin-base text-skin-muted")
                            }
                        >
                            <CheckIcon className={"h-4 w-4" + (task.checked ? "" : " opacity-0 transition-opacity duration-200 ease-linear hover:opacity-100")}></CheckIcon>
                        </button>
                    </div>
                    <div className="flex min-w-0 flex-grow flex-col space-y-1">
                        <Link
                            to={location.pathname + `/task/${task.id}`}
                            className={"cursor-pointer break-all line-clamp-3" + (task.checked ? " text-skin-muted line-through" : datepickerColor == "text-red-600" ? " text-red-800" : " text-skin-base")}
                        >
                            {task.title}
                        </Link>
                        <Link to={location.pathname + `/task/${task.id}`} className="cursor pointer truncate text-xs font-thin text-skin-muted">
                            {task.description}
                        </Link>
                        <div className="flex flex-row items-center space-x-3">
                            {!task.checked && (
                                <SpacePopOver
                                    selected={task.spaceId}
                                    setSelected={(value) => {
                                        updateSpaceID(value);
                                        setSpaceSelected(value);
                                    }}
                                ></SpacePopOver>
                            )}
                            {!task.checked && (
                                <DatePickerPopOver
                                    date={task.deadline}
                                    setDate={(date: number) => {
                                        updateDueDate(date);
                                        setDate(date);
                                    }}
                                    frequency={task.frequency}
                                    setFrequency={(value) => {
                                        updateFrequency(value);
                                        setFrequency(value);
                                    }}
                                ></DatePickerPopOver>
                            )}
                            {task.notes.length > 0 && (
                                <Link to={location.pathname + `/task/${task.id}`} className="flex flex-none flex-row items-center space-x-1 font-thin text-skin-muted hover:text-skin-base">
                                    <CommentTaskIcon className="bg-animation h-4 w-4 flex-none"></CommentTaskIcon>
                                    <span className="bg-animation flex-none truncate text-sm">{task.notes.length}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="absolute -top-5 right-4 flex max-w-min flex-row items-center space-x-2 rounded-md bg-skin-base p-1 opacity-0 shadow-md transition-opacity duration-200 ease-linear group-hover:opacity-100">
                        {!task.checked && (
                            <button onClick={() => setEditing(true)} type="button" className="rounded-md p-1 text-skin-muted hover:bg-skin-secondary hover:text-skin-base">
                                <QuickEditIcon className="h-4 w-4"></QuickEditIcon>
                            </button>
                        )}
                        <button onClick={() => deleteTask()} type="button" className="rounded-md p-1 text-skin-muted hover:bg-skin-secondary hover:text-skin-base">
                            <DeleteTaskIcon className="h-4 w-4"></DeleteTaskIcon>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
