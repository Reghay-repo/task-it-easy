import React from "react";
import SlideOver from "./SlideOver";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import MoonIcon from "@heroicons/react/24/solid/MoonIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";
import backend from "../data/BackendFactory";
import { useThemeStore } from "../stores/theme";

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ThemeSlideOver({ open, setOpen }: Props) {
    let { theme, accent, setTheme } = useThemeStore();

    return (
        <SlideOver open={open} close={() => setOpen(false)} slide="right">
            <div className="flex flex-col justify-start space-y-2 p-4">
                <span className="label">Themes</span>
                <div onClick={() => setTheme({ theme: "theme-light" })} className={"flex cursor-pointer flex-row space-x-2 rounded-md border p-2" + (theme == "theme-light" ? " border-skin-accent" : " border-gray-300")}>
                    <SunIcon className="h-8 w-8 flex-none place-self-center text-skin-base"></SunIcon>
                    <div className="flex flex-grow flex-col">
                        <span className="font-semibold text-skin-base">Light Theme</span>
                        <span className="text-skin-muted">Turn on the lights!</span>
                    </div>
                    <input type="radio" className="flex-none text-skin-accent outline-none focus:outline-none focus:ring-0" onChange={() => 1} checked={theme == "theme-light"} />
                </div>
                <div onClick={() => setTheme({ theme: "theme-dark" })} className={"flex cursor-pointer flex-row space-x-2 rounded-md border p-2" + (theme == "theme-dark" ? " border-skin-accent" : " border-gray-300")}>
                    <MoonIcon className="h-7 w-7 flex-none place-self-center text-skin-base"></MoonIcon>
                    <div className="flex flex-grow flex-col">
                        <span className="font-semibold text-skin-base">Dark Theme</span>
                        <span className="text-skin-muted">Balanced as it should be</span>
                    </div>
                    <input type="radio" className="flex-none text-skin-accent outline-none focus:outline-none focus:ring-0" onChange={() => 1} checked={theme == "theme-dark"} />
                </div>
                <div onClick={() => setTheme({ theme: "theme-black" })} className={"flex cursor-pointer flex-row space-x-2 rounded-md border p-2" + (theme == "theme-black" ? " border-skin-accent" : " border-gray-300")}>
                    <EyeSlashIcon className="h-7 w-7 flex-none place-self-center text-skin-base"></EyeSlashIcon>
                    <div className="flex flex-grow flex-col">
                        <span className="font-semibold text-skin-base">Black Theme</span>
                        <span className="text-skin-muted">Blackout background</span>
                    </div>
                    <input type="radio" className="flex-none text-skin-accent outline-none focus:outline-none focus:ring-0" onChange={() => 1} checked={theme == "theme-black"} />
                </div>
                <span className="label">Accents</span>
                <div className="grid grid-cols-5 gap-1">
                    <button onClick={() => setTheme({ accent: "theme-accent-default" })} type="button" className={"flex items-center justify-center rounded-md p-2  outline-none" + (accent == "theme-accent-default" ? " border border-gray-300" : "")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 outline-none">{accent == "theme-accent-default" && <CheckIcon className="h-5 w-5 text-white"></CheckIcon>}</div>
                    </button>
                    <button type="button" onClick={() => setTheme({ accent: "theme-accent-blue" })} className={"flex items-center justify-center rounded-md p-2  outline-none" + (accent == "theme-accent-blue" ? " border border-gray-300" : "")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 outline-none">{accent == "theme-accent-blue" && <CheckIcon className="h-5 w-5 text-white"></CheckIcon>}</div>
                    </button>
                    <button type="button" onClick={() => setTheme({ accent: "theme-accent-red" })} className={"flex items-center justify-center rounded-md p-2  outline-none" + (accent == "theme-accent-red" ? " border border-gray-300" : "")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 outline-none">{accent == "theme-accent-red" && <CheckIcon className="h-5 w-5 text-white"></CheckIcon>}</div>
                    </button>
                    <button type="button" onClick={() => setTheme({ accent: "theme-accent-orange" })} className={"flex items-center justify-center rounded-md p-2  outline-none" + (accent == "theme-accent-orange" ? " border border-gray-300" : "")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 outline-none">{accent == "theme-accent-orange" && <CheckIcon className="h-5 w-5 text-white"></CheckIcon>}</div>
                    </button>
                </div>
            </div>
        </SlideOver>
    );
}
