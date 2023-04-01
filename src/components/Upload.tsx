import React, { useRef, useState } from "react";
import FolderIcon from "@heroicons/react/24/outline/FolderIcon";
import { useToastStore } from "../stores/toast";
import { useNavigate } from "react-router-dom";
import { WorkspaceSchema } from "../types";
import backend from "../data/BackendFactory";

export default function Upload() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);

    const { addToast } = useToastStore();

    const navigate = useNavigate();

    const handleUpload = async (json: any) => {
        try {
            const workspaceFile = WorkspaceSchema.parse(json);

            let result = await backend.instance.clearData();

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            result = await backend.instance.bulkAddTask(workspaceFile.tasks!);

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            result = await backend.instance.bulkAddSpace(workspaceFile.spaces!);

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            backend.instance.createWorkspace({
                name: workspaceFile.name,
                createdAt: workspaceFile.createdAt,
                showCompletedInbox: workspaceFile.showCompletedInbox,
                showCompletedToday: workspaceFile.showCompletedToday,
                showCompletedUpcoming: workspaceFile.showCompletedUpcoming,
                useSheets: workspaceFile.useSheets ? workspaceFile.useSheets : undefined,
            });

            addToast({ type: "Success", message: "You're logged! Welcome back" });

            navigate("/app/today");
        } catch (e) {
            addToast({ type: "Error", message: "Something went wrong." });
        }
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
        const file = event.dataTransfer.files[0];
        if (file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = JSON.parse((event.target as any).result);
                handleUpload(json);
            };
            reader.readAsText(file);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as any).files[0];
        if (file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = (event) => {
                const json = JSON.parse((event.target as any).result);
                handleUpload(json);
            };
            reader.readAsText(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEnter = () => {
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    return (
        <div
            onClick={handleClick}
            className={`bg-animation group mx-auto flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-skin-base py-3 px-4 text-center focus:bg-skin-secondary hover:border-skin-secondary hover:bg-skin-secondary lg:mx-0 lg:max-w-none ${
                isDragOver ? "bg-skin-secondary" : ""
            }`}
            onDrop={handleFileDrop}
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept=".json" onChange={handleFileInputChange} className="bg-transparent" />
            <div className="flex flex-col items-center justify-center space-y-2 bg-transparent">
                <FolderIcon className="h-12 w-12 text-skin-secondary group-hover:text-skin-secondaryhover"></FolderIcon>
                <span className="text-skin-secondary group-hover:text-skin-secondaryhover">Click or drag and drop your JSON session file here to login.</span>
            </div>
        </div>
    );
}
