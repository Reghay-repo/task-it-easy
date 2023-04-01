import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import backend from "../data/BackendFactory";
import { useToastStore } from "../stores/toast";
import { Frequency } from "../types";
import { initialDueTo } from "../utils/time";
import DatePickerPopOver from "./DatePickerPopOver";
import SpacePopOver from "./SpacePopOver";
import TextArea from "./TextArea";

interface Props {}

const animations = {
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

export default function CreateTaskButton({}: Props) {
    const [opened, setOpened] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [deadline, setDeadline] = useState<number>(initialDueTo());
    const [frequency, setFrequency] = useState<Frequency>("none");
    const spaceReference = useRef<string>("inbox");
    const [spaceId, setSpaceId] = useState<string>(spaceReference.current);

    const location = useLocation();
    const { addToast } = useToastStore();

    useEffect(() => {
        if (location.pathname.includes("/app/today") || location.pathname.includes("/app/inbox") || location.pathname.includes("/app/upcoming")) {
            spaceReference.current = "inbox";
            setSpaceId("inbox");
        } else {
            spaceReference.current = location.pathname.split("/")[3];
            setSpaceId(location.pathname.split("/")[3]);
        }
    }, [location.pathname]);

    const cleanUp = () => {
        setOpened(false);
        setTitle("");
        setDescription("");
        setFrequency("none");
        setDeadline(initialDueTo());
        setSpaceId(spaceReference.current);
    };

    const createTask = async () => {
        const result = await backend.instance.addTask({
            title,
            description,
            frequency,
            spaceId,
            deadline,
            checked: false,
            notes: [],
        });

        if (!result) {
            addToast({ type: "Error", message: "Something went wrong." });

            return;
        }

        cleanUp();
    };

    const handleKeyDown = async (event: any) => {
        if (event.key === "Enter" && title.trim() != "") {
            const result = await backend.instance.addTask({
                title,
                description,
                frequency,
                spaceId,
                deadline,
                checked: false,
                notes: [],
            });

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            cleanUp();
        }
    };

    return (
        <AnimatePresence>
            {opened ? (
                <motion.div className="flex flex-col space-y-1 rounded-md border border-skin-base p-1" {...animations}>
                    <div className="flex w-full flex-col border-b border-skin-base p-1">
                        <TextArea value={title} onChange={(text) => setTitle(text)} className="border-none px-1 py-1 text-lg text-skin-base outline-none focus:ring-0" focus={true} placeholder="Task title" onKeyDown={handleKeyDown}></TextArea>
                        <TextArea
                            value={description}
                            onChange={(text) => setDescription(text)}
                            focus={false}
                            className="border-none px-1 py-1 text-sm text-skin-muted outline-none focus:ring-0"
                            placeholder="Description"
                            onKeyDown={handleKeyDown}
                        ></TextArea>
                    </div>
                    <div className="flex flex-row items-center justify-between p-1">
                        <div className="flex flex-row items-center space-x-2">
                            <DatePickerPopOver date={deadline} setDate={setDeadline} frequency={frequency} setFrequency={setFrequency}></DatePickerPopOver>
                            <SpacePopOver selected={spaceId} setSelected={(value) => setSpaceId(value)}></SpacePopOver>
                        </div>
                        <div className="flex flex-row items-center space-x-2">
                            <button onClick={() => cleanUp()} type="button" className="button secondary text-sm">
                                Cancel
                            </button>
                            <button onClick={() => createTask()} type="button" className="button primary text-sm">
                                Create
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.button onClick={() => setOpened(true)} type="button" className="flex cursor-text justify-start rounded-md bg-skin-secondaryhover p-2 text-skin-muted" {...animations}>
                    Write a task...
                </motion.button>
            )}
        </AnimatePresence>
    );
}
