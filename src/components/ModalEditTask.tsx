import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextArea from "./TextArea";
import AddCommentIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";
import CommentIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import { Frequency, Note, Space, Task } from "../types";
import { FormatDate, FormatHour } from "../utils/time";
import SpaceDropdown from "./SpacePopOver";
import DatePickerPopOver from "./DatePickerPopOver";
import SpacePopOver from "./SpacePopOver";
import Modal from "./Modal";
import { motion, MotionProps } from "framer-motion";
import { useToastStore } from "../stores/toast";
import backend from "../data/BackendFactory";
import useGetTask from "../hooks/getTask";
import useGetSpace from "../hooks/getSpace";

interface NoteButtonProps {
    taskId: string | null;
}

const animations: MotionProps = {
    initial: "in",
    exit: "out",
    animate: "animate",
    variants: {
        in: { scaleY: 0.85, opacity: 0 },
        animate: {
            scaleY: 1,
            opacity: 1,
            transition: {
                type: "spring",
                duration: 0.6,
            },
        },
        out: { scaleY: 0.85, opacity: 0 },
    },
};

const buttonAnimations: MotionProps = {
    whileTap: "tapped",
    variants: {
        tapped: { scale: 0.98, opacity: 0.8, transition: { duration: 0.1 } },
    },
};

function CreateNoteButton({ taskId }: NoteButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [note, setNote] = useState<string>("");

    const cleanUp = () => {
        setOpen(false);
        setNote("");
    };

    const { addToast } = useToastStore();

    const addNote = async () => {
        const result = await backend.instance.taskAddNote(taskId ?? "", {
            content: note,
            date: +new Date(),
        });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }

        cleanUp();
    };

    const handleKeyDown = async (event: any) => {
        if (event.key === "Enter" && note.trim() != "") {
            const result = await backend.instance.taskAddNote(taskId ?? "", {
                content: note,
                date: +new Date(),
            });

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            cleanUp();
        }
    };

    if (!open)
        return (
            <motion.button {...animations} onClick={() => setOpen(true)} type="button" className="flex justify-start rounded-md bg-skin-secondary p-2 text-skin-muted">
                Write a note
            </motion.button>
        );

    return (
        <motion.div {...animations} className="flex flex-col space-y-1 rounded-md border border-skin-base p-1">
            <div className="flex w-full flex-col border-b border-skin-base p-1">
                <TextArea value={note} onChange={(text) => setNote(text)} className="border-none px-1 py-1 text-lg text-skin-base outline-none focus:ring-0" focus={true} placeholder="Your note" onKeyDown={handleKeyDown}></TextArea>
            </div>
            <div className="flex flex-row items-center justify-end p-1">
                <div className="flex flex-row items-center space-x-2">
                    <button onClick={() => cleanUp()} type="button" className="button secondary text-sm">
                        Cancel
                    </button>
                    <button onClick={() => addNote()} type="button" className="button primary flex flex-row items-center space-x-2 text-sm" disabled={note.trim() == ""}>
                        <span>Add</span>
                        <AddCommentIcon className="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

interface TaskButtonProps {
    id: string | undefined;
}

function TaskButton({ id }: TaskButtonProps) {
    const [open, setOpen] = useState<boolean>(false);

    const task = useGetTask(id);

    const [title, setTitle] = useState<string>(task ? task.title : "");
    const [description, setDescription] = useState<string>(task ? task.description : "");

    const { addToast } = useToastStore();

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
        }
    }, [task]);

    if (task == null) {
        return (
            <div className="mb-2 flex flex-row space-x-1 px-2">
                <div className="flex">
                    <div role="status" className="flex h-5 w-5 animate-pulse rounded-md bg-skin-secondary"></div>
                </div>
                <div className="group relative flex min-w-0 flex-grow cursor-pointer flex-col space-y-1 px-2">
                    <div role="status" className="flex h-5 w-32 animate-pulse rounded-md bg-skin-secondary"></div>

                    <div role="status" className="flex h-3 w-64 animate-pulse rounded-md bg-skin-secondary"></div>
                </div>
            </div>
        );
    }

    if (!open) {
        const handleToggleCheckTask = async () => {
            const result = await backend.instance.toggleCheckTask(id!);

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });
            }
        };

        return (
            <motion.div className="mb-2 flex flex-row space-x-1">
                <div className="flex">
                    <button
                        onClick={() => handleToggleCheckTask()}
                        type="button"
                        className={
                            "group inline-flex h-5 w-5 items-center justify-center rounded-sm border transition-all duration-300 ease-linear" + (task.checked ? " border-emerald-400 bg-emerald-400 text-white" : " border-skin-base text-skin-muted")
                        }
                    >
                        <CheckIcon className={"h-4 w-4" + (task.checked ? "" : " opacity-0 transition-opacity duration-200 ease-linear group-hover:opacity-100")}></CheckIcon>
                    </button>
                </div>
                <div onClick={() => setOpen(true)} className="group relative flex min-w-0 flex-grow cursor-pointer flex-col space-y-1 px-2">
                    <span className={"break-all line-clamp-3" + (task.checked ? " text-skin-muted line-through" : " text-skin-base")}>{task.title}</span>
                    <span className="truncate text-xs font-thin text-skin-muted">{task.description}</span>
                </div>
            </motion.div>
        );
    } else {
        const cleanUp = () => {
            setTitle(task.title);
            setDescription(task.description);
            setOpen(false);
        };

        const editTask = async () => {
            const result = await backend.instance.editTask(task.id, { title, description });

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            cleanUp();
        };

        return (
            <motion.div {...buttonAnimations} className="mb-2 flex flex-col space-y-1 rounded-md border border-skin-base">
                <div className="flex flex-col p-1">
                    <TextArea value={title} onChange={(text) => setTitle(text)} className="border-none px-1 py-1 text-lg text-skin-base outline-none focus:ring-0" focus={true} placeholder="Task title"></TextArea>
                    <TextArea value={description} onChange={(text) => setDescription(text)} focus={false} className="border-none px-1 py-1 text-sm text-skin-muted outline-none focus:ring-0" placeholder="Description"></TextArea>
                </div>
                <div className="flex flex-row items-center justify-end space-x-2 p-1">
                    <button onClick={() => cleanUp()} type="button" className="button secondary">
                        Cancel
                    </button>
                    <button onClick={() => editTask()} type="button" className="button primary" disabled={title.trim() == ""}>
                        Save
                    </button>
                </div>
            </motion.div>
        );
    }
}

interface RenderNotesProps {
    loading: boolean;
    notes: Note[];
}

function NotesRender({ loading, notes }: RenderNotesProps) {
    if (loading) {
        return (
            <>
                {Array(3)
                    .fill(0)
                    .map((_, index) => {
                        return (
                            <div key={index} className="mb-2 flex flex-col space-y-1">
                                <div role="status" className="flex h-4 w-48 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                                <div role="status" className="flex h-4 w-96 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                                <div role="status" className="flex h-4 w-96 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                                <div role="status" className="flex h-4 w-64 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                            </div>
                        );
                    })}
            </>
        );
    }

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center space-y-1 text-gray-400">
                <CommentIcon className="h-10 w-10 bg-skin-base"></CommentIcon>
                <span className="text-skin-muted">No notes here.</span>
            </div>
        );
    } else {
        return (
            <div className="mb-4 space-y-2">
                {notes.map((note, index) => {
                    return (
                        <div key={index} className="flex flex-col space-y-1 rounded-md border border-skin-base p-2 text-sm">
                            <span className="font-semibold text-skin-base">
                                {FormatDate(note.date)} {FormatHour(note.date)}
                            </span>
                            <span className="text-skin-muted">{note.content}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default function ModalEditTask() {
    const { taskId } = useParams();

    const [task, setTask] = useState<Task | null>(null);
    const [space, setSpace] = useState<Space | null>(null);

    const taskData = useGetTask(taskId);
    const spaceData = useGetSpace(taskData?.spaceId);

    const { addToast } = useToastStore();

    useEffect(() => {
        if (taskData) {
            setTask(taskData);
        }

        if (spaceData) {
            setSpace(spaceData);
        }
    }, [taskData, spaceData]);

    const updateSpaceID = async (newId: string) => {
        const result = await backend.instance.editTask(taskId ?? "", { spaceId: newId });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const updateDueDate = async (newDate: number) => {
        const result = await backend.instance.editTask(taskId ?? "", { deadline: newDate });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const updateFrequency = async (newFrequency: Frequency) => {
        const result = await backend.instance.editTask(taskId ?? "", { frequency: newFrequency });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const navigate = useNavigate();

    return (
        <Modal
            trigger={<></>}
            title={
                <div className="flex w-full flex-row space-x-2 pr-20">
                    {task === null || space === null ? (
                        <div className="flex flex-row items-baseline space-x-2">
                            <div role="status" className="flex h-4 w-24 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                            <h3 className="text-lg font-semibold">/</h3>
                            <div role="status" className="flex h-4 w-48 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                        </div>
                    ) : (
                        <>
                            <h3 className="flex-none truncate text-lg font-semibold">{space.name}</h3>
                            <h3 className="text-lg font-semibold">/</h3>
                            <h3 className="truncate text-lg font-semibold">{task.title}</h3>
                        </>
                    )}
                </div>
            }
            className="max-h-[38rem] max-w-[44rem]"
            defaultOpen={true}
            onOpenChange={() => navigate(location.pathname.replace(/\/(task)\/(.*)/gm, ""))}
        >
            <div className="flex h-full w-full flex-col overflow-y-auto scrollbar-none">
                <div className="hidden h-full flex-row overflow-y-auto scrollbar-none lg:flex">
                    <div className="flex h-full min-w-0 flex-grow flex-col space-y-2 p-4">
                        <TaskButton id={taskId}></TaskButton>
                        <div className="flex flex-col space-y-4">
                            <span className="label">Comments</span>
                            <CreateNoteButton taskId={taskId ?? ""}></CreateNoteButton>
                            <NotesRender loading={task == null} notes={task ? task.notes : []}></NotesRender>
                        </div>
                    </div>
                    <div className="flex h-full w-48 flex-none flex-col space-y-2 rounded-r-md bg-skin-secondary py-2">
                        {task === null || space === null ? (
                            <div role="status" className="flex h-6 w-48 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                        ) : (
                            <SpacePopOver
                                selected={task.spaceId}
                                setSelected={(value) => {
                                    updateSpaceID(value);
                                }}
                            ></SpacePopOver>
                        )}
                        {task === null || space === null ? (
                            <div role="status" className="flex h-6 w-48 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                        ) : (
                            <DatePickerPopOver
                                date={task.deadline}
                                setDate={(date: number) => {
                                    updateDueDate(date);
                                }}
                                frequency={task.frequency}
                                setFrequency={(value) => {
                                    updateFrequency(value);
                                }}
                            ></DatePickerPopOver>
                        )}
                    </div>
                </div>
                <div className="flex flex-col space-y-4 overflow-y-auto p-4 scrollbar-none lg:hidden">
                    <TaskButton id={taskId}></TaskButton>
                    <div className="flex flex-col space-y-4">
                        {task === null || space === null ? (
                            <div role="status" className="flex h-6 w-48 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                        ) : (
                            <DatePickerPopOver
                                date={task.deadline}
                                setDate={(date: number) => {
                                    updateDueDate(date);
                                }}
                                frequency={task.frequency}
                                setFrequency={(value) => {
                                    updateFrequency(value);
                                }}
                            ></DatePickerPopOver>
                        )}
                        {task === null || space === null ? (
                            <div role="status" className="flex h-6 w-48 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                        ) : (
                            <SpaceDropdown
                                selected={task.spaceId}
                                setSelected={(value) => {
                                    updateSpaceID(value);
                                }}
                            ></SpaceDropdown>
                        )}
                        <span className="label">Comments</span>
                        <CreateNoteButton taskId={taskId ?? ""}></CreateNoteButton>
                        <NotesRender loading={task == null} notes={task ? task.notes : []}></NotesRender>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
