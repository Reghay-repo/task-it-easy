import Dexie, { Table } from "dexie";
import { nanoid } from "nanoid";
import { Accent, Note, SheetsAPI, Space, Task, Theme, Workspace } from "../types";
import { initialDueTo } from "../utils/time";
import { BackendInstance, BackendResponse, Session, SessionManager, UserPermissions } from "./BackendFactory";

export class IndexedDBSessionManager implements SessionManager {
    protected lastTimeChecked: number;
    protected currentToken: string;

    constructor(protected workspaces: Table<Workspace>) {
        const sessionString = localStorage.getItem("session");
        this.lastTimeChecked = +new Date();
        this.currentToken = `main-${this.lastTimeChecked}`;

        if (!sessionString) {
            const session: Session = {
                token: this.currentToken,
                permisions: {
                    create: ["workspace"],
                    read: ["workspace"],
                    update: ["workspace"],
                    delete: ["workspace"],
                },
            };

            localStorage.setItem("session", JSON.stringify(session));
        } else {
            const session = JSON.parse(sessionString) as Session;

            localStorage.setItem("session", JSON.stringify({ ...session, token: this.currentToken }));
        }
    }

    async setPermissions(perms: UserPermissions): Promise<void> {
        this.lastTimeChecked = +new Date();
        this.currentToken = `main-${this.lastTimeChecked}`;

        const session: Session = {
            token: this.currentToken,
            permisions: perms,
        };

        localStorage.setItem("session", JSON.stringify(session));
    }

    async checkPermissions(perms: Partial<UserPermissions>): Promise<BackendResponse> {
        let sessionString = localStorage.getItem("session");

        if (!sessionString) {
            return {
                status: "UNAUTHORIZED",
            };
        }

        const session = JSON.parse(sessionString) as Session;

        if (this.currentToken != session.token) {
            return {
                status: "UNAUTHORIZED",
            };
        }

        let hasPermission = true;

        if (perms.create && session.permisions.create[0] != "all") {
            for (let i = 0; i < perms.create.length && hasPermission; i++) {
                if (!session.permisions.create.includes(perms.create[i])) {
                    hasPermission = false;
                }
            }
        }

        if (perms.read && session.permisions.read[0] != "all" && hasPermission) {
            for (let i = 0; i < perms.read.length && hasPermission; i++) {
                if (!session.permisions.read.includes(perms.read[i])) {
                    hasPermission = false;
                }
            }
        }

        if (perms.update && session.permisions.update[0] != "all" && hasPermission) {
            for (let i = 0; i < perms.update.length && hasPermission; i++) {
                if (!session.permisions.update.includes(perms.update[i])) {
                    hasPermission = false;
                }
            }
        }

        if (perms.delete && session.permisions.delete[0] != "all" && hasPermission) {
            for (let i = 0; i < perms.delete.length && hasPermission; i++) {
                if (!session.permisions.delete.includes(perms.delete[i])) {
                    hasPermission = false;
                }
            }
        }

        return {
            status: hasPermission ? "OK" : "UNAUTHORIZED",
        };
    }

    async checkSession(perms: Partial<UserPermissions>, id?: string): Promise<BackendResponse> {
        const now = +new Date();

        if (now - this.lastTimeChecked > 1000 * 60 * 5) {
            /* 5 mins */
            const result = await this.workspaces.get(id ?? "main");

            if (result != undefined && result.name !== "" && result.createdAt !== 0) {
                this.lastTimeChecked = +new Date();
                this.currentToken = `${id ?? "main"}-${this.lastTimeChecked}`;

                const session: Session = {
                    token: this.currentToken,
                    permisions: {
                        create: ["all"],
                        read: ["all"],
                        update: ["all"],
                        delete: ["all"],
                    },
                };

                localStorage.setItem("session", JSON.stringify(session));

                return {
                    status: "OK",
                };
            }

            return {
                status: "UNAUTHORIZED",
            };
        } else {
            const hasPermission = await this.checkPermissions(perms);

            return hasPermission;
        }
    }

    async clearSession(): Promise<void> {
        const session: Session = {
            token: this.currentToken,
            permisions: {
                create: ["workspace"],
                read: ["workspace"],
                update: ["workspace"],
                delete: ["workspace"],
            },
        };

        localStorage.setItem("session", JSON.stringify(session));
    }
}

export class IndexedDBBackend extends Dexie implements BackendInstance {
    session: SessionManager;
    workspaces: Table<Workspace>;
    spaces: Table<Space>;
    tasks: Table<Task>;
    sheetsTimeout: any;
    useSheets: boolean = false;

    constructor() {
        super("TaskItEasy", { autoOpen: true });

        this.version(1).stores({
            workspaces: "&id",
            spaces: "&id, name",
            tasks: "&id, deadline, spaceId",
        });

        this.workspaces = this.table("workspaces");
        this.spaces = this.table("spaces");
        this.tasks = this.table("tasks");
        this.session = new IndexedDBSessionManager(this.workspaces);

        this.workspaces
            .get("main")
            .then((workspace) => {
                if (!workspace) {
                    this.useSheets = false;

                    return;
                }

                this.useSheets = workspace.useSheets != undefined;
            })
            .catch((e) => console.log(e));
    }

    async setUseSheets(useSheets: Partial<SheetsAPI> | undefined): Promise<boolean> {
        if (useSheets == undefined) {
            const result = await this.workspaces
                .where("id")
                .equals("main")
                .modify({ useSheets: undefined })
                .then(() => true)
                .catch(() => false);

            if (result) {
                this.useSheets = useSheets != undefined;
            }

            return result;
        } else {
            const result = await this.workspaces
                .where("id")
                .equals("main")
                .modify((current) => {
                    if (current.useSheets) {
                        current.useSheets = { ...current.useSheets, ...useSheets };
                    } else {
                        current.useSheets = {
                            url: useSheets.url ?? "",
                            status: "synced",
                        };
                    }
                })
                .then(() => true)
                .catch(() => false);

            if (result) {
                this.useSheets = useSheets != undefined;
            }

            return result;
        }
    }

    async syncSheets() {
        if (!this.useSheets) {
            return false;
        }

        const hasPermission = await this.session.checkSession({
            read: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        let result = await this.workspaces.get("main").catch(() => false);

        if (typeof result == "boolean" && !result) {
            return false;
        }

        if (typeof result == "object" && result.useSheets == undefined) {
            return false;
        }

        return new Promise<boolean>((resolve) => {
            clearTimeout(this.sheetsTimeout);

            this.sheetsTimeout = setTimeout(async () => {
                this.sheetsTimeout = null;

                if (!result) {
                    return false;
                }

                const workspace = result as Workspace;

                let statusResult = await this.setUseSheets({
                    status: "synchronizing",
                });

                if (!statusResult) {
                    return resolve(false);
                }

                const tasks = await this.tasks.toArray();
                const spaces = await this.spaces.toArray();

                const body: Workspace = {
                    id: workspace.id,
                    name: workspace.name,
                    createdAt: workspace.createdAt,
                    showCompletedInbox: workspace.showCompletedInbox,
                    showCompletedToday: workspace.showCompletedToday,
                    showCompletedUpcoming: workspace.showCompletedUpcoming,
                    theme: workspace.theme,
                    accent: workspace.accent,
                    useSheets: workspace.useSheets,
                    tasks,
                    spaces,
                };

                const statusPost = await fetch(workspace.useSheets!.url, {
                    method: "POST",
                    mode: "no-cors",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "follow",
                    body: JSON.stringify(body),
                })
                    .then((res) => console.log(res))
                    .then(() => true)
                    .catch(() => false);

                if (statusPost) {
                    await this.setUseSheets({
                        status: "synced",
                    });
                } else {
                    await this.setUseSheets({
                        status: "error",
                    });
                }

                resolve(statusPost);
            }, 10000); // 30 seconds
        });
    }

    async addSpace(space: Omit<Space, "id">): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            create: ["space"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const id = nanoid();
        const result = await this.spaces
            .add({ id, ...space })
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async deleteSpace(id: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["space"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.spaces
            .delete(id)
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async editSpace(id: string, space: Partial<Exclude<Space, "id">>): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            update: ["space"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.spaces
            .where("id")
            .equals(id)
            .modify({ ...space })
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async getSpace(id: string): Promise<Space | undefined> {
        const hasPermission = await this.session.checkSession({
            read: ["space"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return undefined;
        }

        const result = await this.spaces.get(id);

        return result;
    }

    async addTask(task: Omit<Task, "id">): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            create: ["task"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const id = nanoid();
        const result = await this.tasks
            .add({ id, ...task })
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async toggleCheckTask(id: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            update: ["task"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.tasks
            .where("id")
            .equals(id)
            .modify((current) => {
                if (current.frequency == "none") {
                    current.checked = !current.checked;
                } else if (current.frequency == "daily") {
                    current.deadline += 1000 * 60 * 60 * 24;
                } else if (current.frequency == "weekly") {
                    current.deadline += 1000 * 60 * 60 * 24 * 7;
                } else {
                    current.deadline += 1000 * 60 * 60 * 24 * 30;
                }
            })
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async deleteTask(id: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["task"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.tasks
            .delete(id)
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async editTask(id: string, task: Partial<Exclude<Task, "id">>): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            update: ["task"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.tasks
            .where("id")
            .equals(id)
            .modify({ ...task })
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async getTask(id: string): Promise<Task | undefined> {
        const hasPermission = await this.session.checkSession({
            read: ["task"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return undefined;
        }

        const result = await this.tasks.get(id);

        return result;
    }

    async getTasks(): Promise<Task[]> {
        const hasPermission = await this.session.checkSession({
            read: ["task"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return [];
        }

        const result = await this.tasks.toArray();

        return result;
    }

    async clearData(): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const clearTasks = await this.tasks
            .clear()
            .then(() => true)
            .catch(() => false);
        const clearSpaces = await this.spaces
            .clear()
            .then(() => true)
            .catch(() => false);

        if (clearTasks && clearSpaces) {
            this.syncSheets();
        }

        return clearTasks && clearSpaces;
    }

    async bulkAddSpace(spaceList: Space[]): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            create: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.spaces
            .bulkAdd(spaceList)
            .then(() => true)
            .catch(() => false);

        return result;
    }

    async bulkAddTask(taskList: Task[]): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            create: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.tasks
            .bulkAdd(taskList)
            .then(() => true)
            .catch(() => false);

        return result;
    }

    async getSpaces(): Promise<Space[]> {
        const hasPermission = await this.session.checkSession({
            read: ["spaces"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return [];
        }

        const result = await this.spaces.toArray();

        return result;
    }

    async getSpacesByName(name: string): Promise<Space[]> {
        const hasPermission = await this.session.checkSession({
            read: ["spaces"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return [];
        }

        const result = await this.spaces.where("name").startsWithIgnoreCase(name).toArray();

        return result;
    }

    async getTasksBySpaceId(spaceId: string, completed?: boolean): Promise<Task[]> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return [];
        }

        if (completed) {
            const result = await this.tasks
                .where("spaceId")
                .equals(spaceId)
                .and((task) => task.checked == true)
                .toArray();

            return result;
        } else {
            const result = await this.tasks
                .where("spaceId")
                .equals(spaceId)
                .and((task) => task.checked == false)
                .toArray();

            return result;
        }
    }

    async getTodayTasks(completed?: boolean): Promise<Task[]> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return [];
        }

        if (completed) {
            const result = await this.tasks
                .where("deadline")
                .belowOrEqual(initialDueTo())
                .and((task) => task.checked == true)
                .toArray();

            return result;
        } else {
            const result = await this.tasks
                .where("deadline")
                .belowOrEqual(initialDueTo())
                .and((task) => task.checked == false)
                .toArray();

            return result;
        }
    }

    async getUpcomingTasks(completed?: boolean): Promise<Task[]> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return [];
        }

        if (completed) {
            const result = await this.tasks
                .where("deadline")
                .above(initialDueTo())
                .and((task) => task.checked == true)
                .toArray();

            return result;
        } else {
            const result = await this.tasks
                .where("deadline")
                .above(initialDueTo())
                .and((task) => task.checked == false)
                .toArray();

            return result;
        }
    }

    async countTasksInbox(): Promise<number> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return 0;
        }

        const result = await this.tasks
            .where("spaceId")
            .equals("inbox")
            .and((current) => current.checked == false)
            .count();

        return result;
    }

    async countTasksToday(): Promise<number> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return 0;
        }

        const result = await this.tasks
            .where("deadline")
            .belowOrEqual(initialDueTo())
            .and((current) => current.checked == false)
            .count();

        return result;
    }

    async countTasksUpcoming(): Promise<number> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return 0;
        }

        const result = await this.tasks
            .where("deadline")
            .above(initialDueTo())
            .and((current) => current.checked == false)
            .count();

        return result;
    }

    async countTasksSpace(id: string): Promise<number> {
        const hasPermission = await this.session.checkSession({
            read: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return 0;
        }
        const result = await this.tasks
            .where("spaceId")
            .equals(id)
            .and((task) => task.checked == false)
            .count();

        return result;
    }

    async clearCompletedTasksFromSpace(id: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const list = await this.tasks
            .where("spaceId")
            .equals(id)
            .and((task) => task.checked == true)
            .toArray();

        let result = true;

        for (let i = 0; i < list.length && result; i++) {
            result = await this.tasks
                .delete(list[i].id)
                .then(() => true)
                .catch(() => false);
        }

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async clearTasksFromSpace(id: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const list = await this.tasks.where("spaceId").equals(id).toArray();

        let result = true;

        for (let i = 0; i < list.length && result; i++) {
            result = await this.tasks
                .delete(list[i].id)
                .then(() => true)
                .catch(() => false);
        }

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async clearTasksToday(): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const list = await this.tasks.where("deadline").belowOrEqual(initialDueTo()).toArray();

        let result = true;

        for (let i = 0; i < list.length && result; i++) {
            result = await this.tasks
                .delete(list[i].id)
                .then(() => true)
                .catch(() => false);
        }

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async clearCompletedTasksToday(): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const list = await this.tasks
            .where("deadline")
            .belowOrEqual(initialDueTo())
            .and((task) => task.checked == true)
            .toArray();

        let result = true;

        for (let i = 0; i < list.length && result; i++) {
            result = await this.tasks
                .delete(list[i].id)
                .then(() => true)
                .catch(() => false);
        }

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async clearTasksUpcoming(): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const list = await this.tasks.where("deadline").above(initialDueTo()).toArray();

        let result = true;

        for (let i = 0; i < list.length && result; i++) {
            result = await this.tasks
                .delete(list[i].id)
                .then(() => true)
                .catch(() => false);
        }

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async clearCompletedTasksUpcoming(): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            delete: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const list = await this.tasks
            .where("deadline")
            .above(initialDueTo())
            .and((task) => task.checked == true)
            .toArray();

        let result = true;

        for (let i = 0; i < list.length && result; i++) {
            result = await this.tasks
                .delete(list[i].id)
                .then(() => true)
                .catch(() => false);
        }

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async taskAddNote(id: string, note: Note): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            update: ["tasks"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const result = await this.tasks
            .where("id")
            .equals(id)
            .modify((current) => {
                current.notes = [...current.notes, note];
            })
            .then(() => true)
            .catch(() => false);

        if (result) {
            this.syncSheets();
        }

        return result;
    }

    async getWorkspaceData(id?: string): Promise<Workspace> {
        const hasPermission = await this.session.checkSession({
            read: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return {
                id: "main",
                name: "",
                createdAt: 0,
                theme: "theme-dark",
                accent: "theme-accent-default",
                showCompletedInbox: false,
                showCompletedToday: false,
                showCompletedUpcoming: false,
            };
        }

        if (!id) {
            const result = await this.workspaces.get("main").catch((e) => console.log(e));

            if (!result) {
                await this.workspaces
                    .add({
                        id: "main",
                        name: "",
                        createdAt: 0,
                        theme: "theme-dark",
                        accent: "theme-accent-default",
                        showCompletedInbox: false,
                        showCompletedToday: false,
                        showCompletedUpcoming: false,
                    })
                    .catch((e) => undefined); /* Multiple adds will lay on error. "same id" */

                return {
                    id: "main",
                    name: "",
                    createdAt: 0,
                    theme: "theme-dark",
                    accent: "theme-accent-default",
                    showCompletedInbox: false,
                    showCompletedToday: false,
                    showCompletedUpcoming: false,
                };
            }

            return result;
        } else {
            let result = await this.workspaces.get(id).catch((e) => console.log(e));

            if (!result) {
                result = await this.workspaces.get("main").catch((e) => console.log(e));
            }

            return result!;
        }
    }

    async clearWorkspace(id?: string): Promise<boolean> {
        const result = await this.workspaces
            .delete(id ?? "main")
            .then(() => true)
            .catch(() => false);

        await this.session.clearSession();

        return result;
    }

    async setWorkspaceData(workspace: Partial<Workspace>, id?: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            update: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const exists = await this.workspaces.get(id ?? "main");

        if (!exists) {
            const result = await this.workspaces
                .add({
                    id: id ?? "main",
                    name: workspace.name ?? "",
                    createdAt: workspace.createdAt ?? 0,
                    theme: workspace.theme ?? "theme-dark",
                    accent: workspace.accent ?? "theme-accent-default",
                    showCompletedInbox: workspace.showCompletedInbox ?? false,
                    showCompletedToday: workspace.showCompletedToday ?? false,
                    showCompletedUpcoming: workspace.showCompletedUpcoming ?? false,
                    useSheets: workspace.useSheets ?? undefined,
                })
                .then(() => true)
                .catch(() => false);

            if (result) {
                this.syncSheets();
            }

            return result;
        } else {
            const result = await this.workspaces
                .where("id")
                .equals(id ?? "main")
                .modify({ ...workspace })
                .then(() => true)
                .catch(() => false);

            if (result) {
                this.syncSheets();
            }

            return result;
        }
    }

    async createWorkspace(workspace: Partial<Workspace>, id?: string): Promise<boolean> {
        const hasPermission = await this.session.checkSession({
            create: ["workspace"],
        });

        if (hasPermission.status == "UNAUTHORIZED") {
            return false;
        }

        const exists = await this.workspaces.get(id ?? "main");

        if (workspace.useSheets) {
            this.useSheets = true;
        }

        if (!exists) {
            const result = await this.workspaces
                .add({
                    id: id ?? "main",
                    name: workspace.name ?? "",
                    createdAt: workspace.createdAt ?? 0,
                    theme: workspace.theme ?? "theme-dark",
                    accent: workspace.accent ?? "theme-accent-default",
                    showCompletedInbox: workspace.showCompletedInbox ?? false,
                    showCompletedToday: workspace.showCompletedToday ?? false,
                    showCompletedUpcoming: workspace.showCompletedUpcoming ?? false,
                    useSheets: workspace.useSheets ?? undefined,
                })
                .then(() => true)
                .catch(() => false);

            await this.session.setPermissions({
                create: ["all"],
                read: ["all"],
                update: ["all"],
                delete: ["all"],
            });

            return result;
        } else {
            const result = await this.workspaces
                .where("id")
                .equals(id ?? "main")
                .modify({ ...workspace })
                .then(() => true)
                .catch(() => false);

            await this.session.setPermissions({
                create: ["all"],
                read: ["all"],
                update: ["all"],
                delete: ["all"],
            });

            return result;
        }
    }

    async setTheme(theme: Partial<{ theme: Theme; accent: Accent }>): Promise<boolean> {
        const themeStr = localStorage.getItem("theme");

        if (!themeStr) {
            const newTheme: { theme: Theme; accent: Accent } = {
                theme: "theme-dark",
                accent: "theme-accent-default",
                ...theme,
            };

            localStorage.setItem("theme", JSON.stringify(newTheme));

            const result = await this.setWorkspaceData({ ...newTheme });

            if (result) {
                this.syncSheets();
            }

            return result;
        } else {
            const oldTheme: { theme: Theme; accent: Accent } = JSON.parse(themeStr);

            localStorage.setItem(
                "theme",
                JSON.stringify({
                    ...oldTheme,
                    ...theme,
                })
            );

            const result = await this.setWorkspaceData({ ...oldTheme, ...theme });

            if (result) {
                this.syncSheets();
            }

            return result;
        }
    }
}
