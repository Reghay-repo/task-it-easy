import { Accent, Note, SheetsAPI, Space, Task, Theme, Workspace } from "../types";
import { IndexedDBBackend } from "./IndexedDBBackend";

export interface UserPermissions {
    create: string[] | "all";
    read: string[] | "all";
    update: string[] | "all";
    delete: string[] | "all";
}

export type ReponseStatus = "OK" | "UNAUTHORIZED" | "NOT_FOUND";

export interface BackendResponse {
    status: ReponseStatus;
}

export interface Session {
    token: string;
    permisions: UserPermissions;
}

export interface SessionManager {
    checkPermissions(perms: Partial<UserPermissions>): Promise<BackendResponse>;
    checkSession(perms: Partial<UserPermissions>, id?: string): Promise<BackendResponse>;
    clearSession(): Promise<void>;
    setPermissions(perms: UserPermissions): Promise<void>;
}

export interface BackendInstance {
    session: SessionManager;
    addSpace(space: Omit<Space, "id">): Promise<boolean>;
    deleteSpace(id: string): Promise<boolean>;
    editSpace(id: string, space: Partial<Exclude<Space, "id">>): Promise<boolean>;
    getSpace(id: string): Promise<Space | undefined>;
    addTask(task: Omit<Task, "id">): Promise<boolean>;
    toggleCheckTask(id: string): Promise<boolean>;
    deleteTask(id: string): Promise<boolean>;
    editTask(id: string, task: Partial<Exclude<Task, "id">>): Promise<boolean>;
    getTask(id: string): Promise<Task | undefined>;
    getTasks(): Promise<Task[]>;
    clearData(): Promise<boolean>;
    bulkAddSpace(spaceList: Space[]): Promise<boolean>;
    bulkAddTask(taskList: Task[]): Promise<boolean>;
    getSpaces(): Promise<Space[]>;
    getSpacesByName(name: string): Promise<Space[]>;
    getTasksBySpaceId(spaceId: string, completed?: boolean): Promise<Task[]>;
    getTodayTasks(completed?: boolean): Promise<Task[]>;
    getUpcomingTasks(completed?: boolean): Promise<Task[]>;
    countTasksInbox(): Promise<number>;
    countTasksToday(): Promise<number>;
    countTasksUpcoming(): Promise<number>;
    countTasksSpace(id: string): Promise<number>;
    clearCompletedTasksFromSpace(id: string): Promise<boolean>;
    clearTasksFromSpace(id: string): Promise<boolean>;
    clearTasksToday(): Promise<boolean>;
    clearCompletedTasksToday(): Promise<boolean>;
    clearTasksUpcoming(): Promise<boolean>;
    clearCompletedTasksUpcoming(): Promise<boolean>;
    taskAddNote(id: string, note: Note): Promise<boolean>;
    getWorkspaceData(id?: string): Promise<Workspace>;
    clearWorkspace(id?: string): Promise<boolean>;
    setWorkspaceData(workspace: Partial<Workspace>, id?: string): Promise<boolean>;
    createWorkspace(workspace: Partial<Workspace>, id?: string): Promise<boolean>;
    setTheme(theme: Partial<{ theme: Theme; accent: Accent }>): Promise<boolean>;
    setUseSheets(useSheets: Partial<SheetsAPI>): Promise<boolean>;
}

export type Factory = "IndexedDB";

export interface BackendFactory {
    instance: BackendInstance;
    switch: (factory: Factory) => void;
}

export class Backend implements BackendFactory {
    instance: BackendInstance;

    constructor() {
        this.instance = new IndexedDBBackend();
    }

    switch(factory: Factory) {
        if (factory == "IndexedDB") {
            this.instance = new IndexedDBBackend();
        }
    }
}

const backend = new Backend();

export default backend;
