import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import backend from "../../data/BackendFactory";
import useGetWorkspace from "../../hooks/getWorkspace";
import { useToastStore } from "../../stores/toast";
import { Space, Task, Workspace } from "../../types";
import useDocumentTitle from "../../utils/documentTitle";
import { FormatDate } from "../../utils/time";

export default function WorkspaceSettings() {
    useDocumentTitle("Workspace settings");

    const {
        id,
        theme,
        accent,
        name,
        createdAt,
        showCompletedInbox,
        showCompletedToday,
        showCompletedUpcoming,
        useSheets,
    } = useGetWorkspace();

    const workspaceNameRef = useRef();
    const sheetsURLRef = useRef();
    const { addToast } = useToastStore();
    const navigate = useNavigate();

    const clearDataHandler = async () => {
        const result = await backend.instance.clearData();

        if (result) {
            addToast({ type: "Success", message: "Data cleared!" });
        } else {
            addToast({ type: "Error", message: "Failed to clear data." });
        }
    };

    const deleteWorkspaceHandler = async () => {
        let result = await backend.instance.clearData();

        if (!result) {
            addToast({ type: "Error", message: "Failed to clear data." });
        }

        result = await backend.instance.clearWorkspace();

        if (!result) {
            addToast({ type: "Error", message: "Failed to clear data." });
        }

        addToast({ type: "Success", message: "Workspace deleted!" });

        navigate("/");
    };

    const handleSaveData = async () => {
        const z = (await import("zod")).z;

        const nameSchema = z
            .string()
            .trim()
            .min(1, { message: "The name must be 1 or more characters long." });
        const urlSchema = z.string().trim().url({ message: "Couldn't parse sheets URL." });

        try {
            const name = nameSchema.parse((workspaceNameRef.current as any).value);

            if (useSheets != undefined) {
                const url = urlSchema.parse((sheetsURLRef.current as any).value);
                await backend.instance.setWorkspaceData({
                    name,
                    useSheets: { url, status: useSheets.status },
                });
            } else {
                await backend.instance.setWorkspaceData({ name });
            }

            addToast({ type: "Success", message: "Workspace data saved!" });
        } catch (e: any) {
            addToast({
                type: "Error",
                message: e[0].message,
            });
        }
    };

    const handleExportWorkspace = async () => {
        addToast({
            type: "Loading",
            message: "Just a second, we're saving the workspace data.",
        });

        let workspace: Workspace = {
            id,
            name,
            createdAt,
            theme,
            accent,
            showCompletedInbox,
            showCompletedToday,
            showCompletedUpcoming,
        };

        const spaces: Space[] = await backend.instance.getSpaces();

        const tasks: Task[] = await backend.instance.getTasks();

        const json = JSON.stringify({
            ...workspace,
            spaces,
            tasks,
        } as Workspace);

        const blob = new Blob([json], { type: "application/json" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = href;
        link.download = `${name}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleActivateSheets = async () => {
        const result = await backend.instance.setUseSheets({
            url: "",
            status: "synced",
        });

        if (!result) {
            addToast({ type: "Error", message: "Failed to open the connection." });
        }
    };

    const handleDeactivateSheets = async () => {
        const result = await backend.instance.setUseSheets(undefined);

        if (!result) {
            addToast({ type: "Error", message: "Failed to close the connection." });
        }
    };

    return (
        <>
            <div className="border-b border-skin-base p-2">
                <span className="text-lg font-semibold text-skin-base">Workspace</span>
            </div>
            <div className="flex min-h-0 w-full min-w-min flex-grow flex-col space-y-2 overflow-y-auto p-3 scrollbar-none lg:w-[65%]">
                {name ? (
                    <span className="text-xs text-gray-400">
                        Workspace created {FormatDate(createdAt)}
                    </span>
                ) : (
                    <div role="status" className="animate-pulse">
                        <div className="h-4 w-64 rounded-full bg-gray-200"></div>
                    </div>
                )}
                <label className="label">Name</label>
                <div className="w-full rounded-md bg-skin-secondary p-0.5">
                    <input
                        ref={workspaceNameRef as any}
                        type="text"
                        name="name"
                        className="input w-full"
                        placeholder="Maria"
                        defaultValue={name ?? ""}
                    />
                </div>
                <label className="label">Export</label>
                <span className="text-sm text-skin-base">
                    Save all data present in this workspace into a file.
                </span>
                <button
                    onClick={() => handleExportWorkspace()}
                    type="button"
                    className="button primary max-w-min flex-none truncate">
                    Export
                </button>
                <div className="flex flex-row items-center space-x-2">
                    <label className="label">Sheets</label>
                    <span className="relative flex h-2 w-2">
                        <span
                            className={
                                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 " +
                                (useSheets != undefined ? "bg-green-400" : "bg-red-400")
                            }></span>
                        <span
                            className={
                                "relative inline-flex h-2 w-2 rounded-full " +
                                (useSheets != undefined ? "bg-green-500" : "bg-red-500")
                            }></span>
                    </span>
                </div>
                <span className="text-sm text-skin-base">
                    Use google sheets as your cloud database.
                </span>
                {useSheets == undefined && (
                    <button
                        onClick={() => handleActivateSheets()}
                        type="button"
                        className="button primary max-w-min flex-none truncate">
                        Activate
                    </button>
                )}
                {useSheets != undefined && (
                    <div className="flex flex-col space-y-2 border border-skin-base p-2">
                        <span className="label">
                            API URL <span className="text-red-400">*</span>
                        </span>
                        <div className="w-full rounded-md bg-skin-secondary p-0.5">
                            <input
                                ref={sheetsURLRef as any}
                                type="text"
                                name="name"
                                className="input w-full"
                                placeholder="https://script.google.com/macros..."
                                defaultValue={useSheets.url ?? ""}
                            />
                        </div>
                        <button
                            onClick={() => handleDeactivateSheets()}
                            type="button"
                            className="button danger max-w-min place-self-end truncate">
                            Turn off
                        </button>
                    </div>
                )}
                <label className="label">Danger zone</label>
                <div className="flex flex-col space-y-2 border border-skin-base p-2">
                    <label className="label text-sm">Clear data</label>
                    <span className="text-sm text-skin-base">
                        Delete all data present in this workspace
                    </span>
                    <button
                        onClick={() => clearDataHandler()}
                        type="button"
                        className="button danger max-w-min truncate">
                        Clear data
                    </button>
                    <label className="label text-sm">Delete workspace</label>
                    <span className="text-sm text-skin-base">
                        Delete the workspace, you'll go back to the homepage
                    </span>
                    <button
                        onClick={() => deleteWorkspaceHandler()}
                        type="button"
                        className="button danger max-w-min truncate">
                        Delete workspace
                    </button>
                </div>
            </div>
            <div className="border-t border-skin-base">
                <div className="flex flex-row items-center justify-end p-2">
                    <button
                        onClick={() => handleSaveData()}
                        type="button"
                        className="button primary">
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
