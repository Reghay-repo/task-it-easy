import Dexie, { Table } from "dexie";
import { Emoji, EmojiGroup } from "../types";

export interface IEmojiCache {
    exists: () => Promise<boolean>;
    fetchEmojis: (controller: AbortController) => Promise<boolean>;
    loadOfflineEmojisByGroup: (group: EmojiGroup) => Promise<Emoji[]>;
    loadOfflineEmojisByName: (name: string) => Promise<Emoji[]>;
    loadEmojisByGroup: (group: EmojiGroup) => Promise<Emoji[]>;
    loadEmojisByName: (name: string) => Promise<Emoji[]>;
}

class EmojiCache extends Dexie implements IEmojiCache {
    emojis!: Table<Emoji>;

    constructor() {
        super("EmojiCache");

        this.version(1).stores({
            emojis: "++id, name, group",
        });
    }

    async exists(): Promise<boolean> {
        return (await this.emojis.count()) > 0;
    }

    async fetchEmojis(controller: AbortController) {
        const response: boolean = await fetch("https://unpkg.com/emoji.json@14.0.0/emoji.json", {
            signal: controller.signal,
        })
            .then((res) => res.json())
            .then(async (data) => {
                const result = await this.emojis
                    .bulkAdd(data as Emoji[])
                    .then(() => true)
                    .catch(() => false);
                return result;
            });

        return response;
    }

    async loadOfflineEmojisByGroup(group: EmojiGroup) {
        const offlineData = (await import("../utils/offlineEmojiData.json")).default as Emoji[];

        return offlineData.filter((emoji) => emoji.group == group);
    }

    async loadOfflineEmojisByName(name: string) {
        const offlineData = (await import("../utils/offlineEmojiData.json")).default as Emoji[];

        return offlineData.filter((emoji) => emoji.name.includes(name));
    }

    async loadEmojisByGroup(group: EmojiGroup) {
        const result = await this.emojis.where("group").equals(group).toArray();

        return result;
    }

    async loadEmojisByName(name: string) {
        const result = await this.emojis.where("name").startsWithIgnoreCase(name).toArray();

        return result;
    }
}

const emojis = new EmojiCache();

export default emojis;
