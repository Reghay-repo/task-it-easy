import ThemeIcon from "@heroicons/react/24/outline/PaintBrushIcon";
import { Link, useNavigate } from "react-router-dom";
import HeroImg from "../assets/hero.svg";
import Upload from "../components/Upload";
import { useEffect, useRef, useState } from "react";
import { useToastStore } from "../stores/toast";
import useDocumentTitle from "../utils/documentTitle";
import ThemeSlideOver from "../components/ThemeSlideOver";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";
import backend from "../data/BackendFactory";
import { HaveSession } from "../guards/haveSession";
import { WorkspaceSchema } from "../types";
import Tooltip from "../components/Tooltip";
import PaperClipIcon from "@heroicons/react/24/outline/PaperClipIcon";

export default function Home() {
    useDocumentTitle("Task it easy");
    const nameRef = useRef();
    const sheetsURLRef = useRef();

    const navigate = useNavigate();
    const { addToast } = useToastStore();

    const initiateSession = async () => {
        const z = (await import("zod")).z;

        let schema = z.string().trim().min(1);

        try {
            let name = schema.parse((nameRef.current as any).value);

            let result = await backend.instance.createWorkspace({
                name,
                createdAt: +new Date(),
                showCompletedInbox: false,
                showCompletedToday: false,
                showCompletedUpcoming: false,
            });

            if (result) {
                result = await backend.instance.clearData();

                if (result) {
                    navigate("/app/inbox");
                    addToast({ type: "Success", message: "Session created! Welcome." });
                } else {
                    addToast({
                        type: "Error",
                        message: "Something went wrong :/",
                    });
                }
            } else {
                addToast({
                    type: "Error",
                    message: "Something went wrong :/",
                });
            }
        } catch (e) {
            addToast({
                type: "Error",
                message: "The name must be 1 or more characters long.",
            });
        }
    };

    const [hasSession, setHasSession] = useState<boolean>(false);

    useEffect(() => {
        const loader = async () => {
            const session = await HaveSession();

            if (session) {
                setHasSession(true);
            }
        };

        loader();
    }, []);

    const [open, setOpen] = useState<boolean>(false);

    const [isJson, setIsJson] = useState<boolean>(true);

    const handleConnectSheets = async () => {
        const z = (await import("zod")).z;

        const url = (sheetsURLRef.current as any).value;
        const schema = z.string().url();

        try {
            const parsedURL = schema.parse(url);

            addToast({
                type: "Loading",
                message: "Fetching sheet data",
            });

            await fetch(parsedURL)
                .then((res) => res.json())
                .then(async (data) => {
                    try {
                        /* Pré processing */
                        const workspace = data.data;

                        if (workspace.useSheets) {
                            workspace.useSheets = JSON.parse(workspace.useSheets);
                        }

                        for (let i = 0; i < workspace.spaces.length; i++) {
                            if (!isNaN(workspace.spaces[i].name)) {
                                workspace.spaces[i].name = JSON.stringify(workspace.spaces[i].name);
                            }

                            workspace.spaces[i].color = JSON.parse(workspace.spaces[i].color);
                        }

                        for (let i = 0; i < workspace.tasks.length; i++) {
                            if (!isNaN(workspace.tasks[i].title)) {
                                workspace.tasks[i].title = JSON.stringify(workspace.tasks[i].title);
                            }

                            if (!isNaN(workspace.tasks[i].description)) {
                                workspace.tasks[i].description = JSON.stringify(workspace.tasks[i].description);
                            }

                            workspace.tasks[i].notes = JSON.parse(workspace.tasks[i].notes);
                        }

                        /* Pré processing */

                        const workspaceData = WorkspaceSchema.parse(workspace);

                        let result = await backend.instance.clearData();

                        if (!result) {
                            addToast({ type: "Error", message: "Something went wrong." });

                            return;
                        }

                        result = await backend.instance.bulkAddTask(workspaceData.tasks!);

                        if (!result) {
                            addToast({ type: "Error", message: "Something went wrong." });

                            return;
                        }

                        result = await backend.instance.bulkAddSpace(workspaceData.spaces!);

                        if (!result) {
                            addToast({ type: "Error", message: "Something went wrong." });

                            return;
                        }

                        result = await backend.instance.createWorkspace({
                            id: workspaceData.id,
                            name: workspaceData.name,
                            createdAt: workspaceData.createdAt,
                            showCompletedInbox: workspaceData.showCompletedInbox,
                            showCompletedToday: workspaceData.showCompletedToday,
                            showCompletedUpcoming: workspaceData.showCompletedUpcoming,
                            useSheets: {
                                url: parsedURL,
                                status: "synced",
                            },
                        });

                        if (!result) {
                            addToast({ type: "Error", message: "Something went wrong." });

                            return;
                        }

                        addToast({ type: "Success", message: "You're logged! Welcome back" });

                        navigate("/app/today");
                    } catch (e) {
                        addToast({
                            type: "Error",
                            message: "Something went wrong.",
                        });
                    }
                })
                .catch(() => {
                    addToast({
                        type: "Error",
                        message: "Something went wrong.",
                    });
                });
        } catch (e) {
            addToast({
                type: "Error",
                message: "URL is invalid.",
            });
        }
    };

    return (
        <>
            <ThemeSlideOver open={open} setOpen={setOpen}></ThemeSlideOver>
            <div className="relative overflow-y-auto bg-skin-base scrollbar-thin">
                <button
                    onClick={() => setOpen(true)}
                    type="button"
                    className="bg-animation fixed inset-y-1/2 right-0 z-50 flex h-10 w-10 flex-row items-center justify-center space-x-2 rounded-l-md bg-skin-accent text-white shadow-lg transition-all duration-300"
                >
                    <ThemeIcon className="h-8 w-8"></ThemeIcon>
                </button>
                <div className="flex min-h-screen w-full flex-col overflow-x-hidden scrollbar-thin">
                    <div className="flex flex-row items-center justify-between border-b border-skin-base p-2">
                        <Link to="/" className="flex flex-row items-center space-x-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-skin-accent">
                                <span className="text-lg font-bold text-white">t.</span>
                            </span>
                            <span className="hidden text-xl font-semibold text-skin-base md:block">task it easy</span>
                        </Link>
                        <div className="flex flex-row items-center space-x-10">
                            <Link to="/about/get-started/the-project" className="link">
                                About
                            </Link>
                        </div>
                    </div>
                    <div className="grid w-full flex-grow grid-cols-1 scrollbar-thin lg:grid-cols-2">
                        <div className="relative hidden h-full w-full flex-col space-y-2 p-2 lg:flex">
                            <img src={HeroImg} alt="" className="object-contain p-20" />
                        </div>
                        <div className="flex w-full flex-col items-center space-y-2 p-2">
                            <div className="mx-auto max-w-6xl">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex flex-col space-y-6">
                                        <h1 className="text-3xl font-bold text-skin-base md:text-3xl lg:text-5xl 2xl:text-6xl">Manage your daily tasks and be the owner of your data.</h1>
                                        <span className="text-lg text-skin-secondary">
                                            Now you can use a good task management application without worrying about your data for <strong className="text-skin-accent">free</strong>.
                                        </span>
                                    </div>
                                    <div className="2xl:space-y-18 flex max-w-xl flex-col space-y-2">
                                        <div className="flex w-full flex-col space-y-3">
                                            <span className="text-xl font-semibold text-skin-base">First time?</span>
                                            <div className="flex flex-row items-center justify-between rounded-md bg-skin-secondary p-2">
                                                <input ref={nameRef as any} type="text" placeholder="Maria..." className="input flex-grow"></input>
                                                <button onClick={() => initiateSession()} type="button" className="button primary">
                                                    Create Session
                                                </button>
                                            </div>
                                            {hasSession ? (
                                                <Link to="/app/today" className="link text-skin-accent hover:text-skin-accenthover">
                                                    We've detected that you have an active session, click here to return to your session
                                                </Link>
                                            ) : null}
                                        </div>
                                        <div className="flex flex-row items-center space-x-2">
                                            <span className="text-xl font-semibold text-skin-base">I have a session</span>
                                            <Tooltip message="Check the about session to more info." side="top">
                                                <InformationCircleIcon className="h-4 w-4 text-skin-muted"></InformationCircleIcon>
                                            </Tooltip>
                                        </div>
                                        <div className="flex w-full flex-row">
                                            <button
                                                onClick={() => setIsJson(true)}
                                                type="button"
                                                className={
                                                    "bg-animation flex flex-none flex-grow basis-0 flex-row items-center justify-center space-x-2 border-b border-skin-accent px-2 py-1 font-semibold text-skin-base hover:bg-skin-secondary" +
                                                    (isJson ? " border-skin-accent" : " border-skin-base")
                                                }
                                            >
                                                <PaperClipIcon className="h-4 w-4"></PaperClipIcon>
                                                <span>JSON</span>
                                            </button>
                                            <button
                                                onClick={() => setIsJson(false)}
                                                type="button"
                                                className={
                                                    "bg-animation flex flex-none flex-grow basis-0 flex-row items-center justify-center space-x-2 border-b border-skin-accent px-2 py-1 font-semibold text-skin-base hover:bg-skin-secondary" +
                                                    (!isJson ? " border-skin-accent" : " border-skin-base")
                                                }
                                            >
                                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        className="h-4 w-4"
                                                        d="M8 2H12.5C12.7761 2 13 2.22386 13 2.5V5H8V2ZM7 5V2H2.5C2.22386 2 2 2.22386 2 2.5V5H7ZM2 6V9H7V6H2ZM8 6H13V9H8V6ZM8 10H13V12.5C13 12.7761 12.7761 13 12.5 13H8V10ZM2 12.5V10H7V13H2.5C2.22386 13 2 12.7761 2 12.5ZM1 2.5C1 1.67157 1.67157 1 2.5 1H12.5C13.3284 1 14 1.67157 14 2.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V2.5Z"
                                                        fill="currentColor"
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                    ></path>
                                                </svg>
                                                <span>Google Sheets</span>
                                            </button>
                                        </div>
                                        {isJson ? (
                                            <Upload></Upload>
                                        ) : (
                                            <div className="flex flex-row items-center justify-between rounded-md bg-skin-secondary p-2">
                                                <input ref={sheetsURLRef as any} type="text" placeholder="https://script.google.com/macros..." className="input flex-grow"></input>
                                                <button onClick={() => handleConnectSheets()} type="button" className="button primary">
                                                    Connect
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between space-x-6 bg-skin-secondary p-2">
                        <Link to="https://github.com/costaluu" className="link flex flex-row items-center space-x-2">
                            <svg className="h-5 w-5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="hidden truncate md:block">Made with ❤️ by costaluu</span>
                            <span className="truncate md:hidden">costaluu</span>
                        </Link>
                        <Link to="https://undraw.co/" className="link hidden truncate md:block">
                            Illustrations by unDraw.co
                        </Link>
                        <Link to="https://undraw.co/" className="link truncate md:hidden">
                            unDraw.co
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
