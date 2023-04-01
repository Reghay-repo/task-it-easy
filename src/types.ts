import { z } from "zod";
import Space from "./pages/App/Space";
import { ColorSchema } from "./utils/colors";

export const ThemeEnum = z.enum(["theme-light", "theme-dark", "theme-black"]);
export type Theme = z.infer<typeof ThemeEnum>;

export const AccentEnum = z.enum(["theme-accent-default", "theme-accent-blue", "theme-accent-red", "theme-accent-orange"]);
export type Accent = z.infer<typeof AccentEnum>;

const FrenquencyEnum = z.enum(["daily", "weekly", "monthly", "none"]);
export type Frequency = z.infer<typeof FrenquencyEnum>;

const EmojiGroupEnum = z.enum(["Smileys & Emotion", "People & Body", "Animals & Nature", "Food & Drink", "Travel & Places", "Activities", "Objects", "Symbols", "Flags"]);
export type EmojiGroup = z.infer<typeof EmojiGroupEnum>;

export type Emoji = {
    name: string;
    char: string;
    group: EmojiGroup;
};

const NoteSchema = z.object({
    content: z.string().min(1),
    date: z.number(),
});
export type Note = z.infer<typeof NoteSchema>;

export const SpaceSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(15),
    showCompleted: z.boolean(),
    color: ColorSchema,
});
export type Space = z.infer<typeof SpaceSchema>;

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().min(1),
    deadline: z.number(),
    frequency: FrenquencyEnum,
    checked: z.boolean(),
    spaceId: z.string(),
    notes: z.array(NoteSchema),
});

export type Task = z.infer<typeof TaskSchema>;

const SheetStatus = z.enum(["synced", "synchronizing", "error"]);

export const SheetsAPISchema = z
    .object({
        url: z.string().url(),
        status: SheetStatus,
    })
    .optional();

export type SheetsAPI = z.infer<typeof SheetsAPISchema>;

export const WorkspaceSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    createdAt: z.number(),
    showCompletedInbox: z.boolean(),
    showCompletedToday: z.boolean(),
    showCompletedUpcoming: z.boolean(),
    theme: ThemeEnum,
    accent: AccentEnum,
    tasks: z.array(TaskSchema).optional(),
    spaces: z.array(SpaceSchema).optional(),
    useSheets: SheetsAPISchema.optional(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
