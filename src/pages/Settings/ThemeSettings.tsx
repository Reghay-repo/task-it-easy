import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import backend from "../../data/BackendFactory";
import { useThemeStore } from "../../stores/theme";
import useDocumentTitle from "../../utils/documentTitle";

export default function ThemeSettings() {
    useDocumentTitle("Theme settings");
    const { theme, accent, setTheme } = useThemeStore();

    return (
        <>
            <div className="border-b border-skin-base p-2">
                <span className="text-lg font-semibold text-skin-base">Theme</span>
            </div>
            <div className="flex min-h-0 w-full min-w-min flex-grow flex-col space-y-2 overflow-y-auto p-3 scrollbar-thin">
                <span className="text-sm text-skin-base">
                    Personalize task it easy to match your vibe.
                </span>
                <label className="label">Accent</label>
                <div className="grid max-w-max grid-cols-4 gap-4">
                    <button
                        onClick={() => setTheme({ accent: "theme-accent-default" })}
                        type="button"
                        className={
                            "flex items-center justify-center rounded-md p-2  outline-none" +
                            (accent == "theme-accent-default" ? " border border-gray-300" : "")
                        }>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 outline-none">
                            {accent == "theme-accent-default" && (
                                <CheckIcon className="h-5 w-5 text-white"></CheckIcon>
                            )}
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme({ accent: "theme-accent-blue" })}
                        className={
                            "flex items-center justify-center rounded-md p-2  outline-none" +
                            (accent == "theme-accent-blue" ? " border border-gray-300" : "")
                        }>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 outline-none">
                            {accent == "theme-accent-blue" && (
                                <CheckIcon className="h-5 w-5 text-white"></CheckIcon>
                            )}
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme({ accent: "theme-accent-red" })}
                        className={
                            "flex items-center justify-center rounded-md p-2  outline-none" +
                            (accent == "theme-accent-red" ? " border border-gray-300" : "")
                        }>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 outline-none">
                            {accent == "theme-accent-red" && (
                                <CheckIcon className="h-5 w-5 text-white"></CheckIcon>
                            )}
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTheme({ accent: "theme-accent-orange" })}
                        className={
                            "flex items-center justify-center rounded-md p-2  outline-none" +
                            (accent == "theme-accent-orange" ? " border border-gray-300" : "")
                        }>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 outline-none">
                            {accent == "theme-accent-orange" && (
                                <CheckIcon className="h-5 w-5 text-white"></CheckIcon>
                            )}
                        </div>
                    </button>
                </div>
                <label className="label">Themes</label>
                <div className="mx-auto grid max-w-max grid-cols-1 gap-4 md:mx-0 md:grid-cols-3">
                    <div
                        onClick={() => setTheme({ theme: "theme-light" })}
                        className="m-0 flex h-24 w-96 cursor-pointer flex-col rounded-sm p-0 md:h-28 md:w-56 lg:h-32">
                        <div className="flex h-[25px] flex-none flex-row items-center bg-skin-accent px-2">
                            <span className="text-xs text-white">Light</span>
                        </div>
                        <div className="flex flex-none flex-grow flex-col justify-between space-y-2 bg-gray-50 p-2">
                            <div className="space-y-2">
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-gray-200"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-gray-200"></div>
                                    </div>
                                </div>
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-gray-200"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-gray-200"></div>
                                    </div>
                                </div>
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-gray-200"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-gray-200"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-none flex-row items-center justify-between">
                                <div className="h-3 w-[20%] flex-none bg-skin-accent"></div>
                                {theme == "theme-light" && (
                                    <CheckIcon className="h-3 w-3 flex-none"></CheckIcon>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => setTheme({ theme: "theme-dark" })}
                        className="m-0 flex h-24 w-96 cursor-pointer flex-col rounded-sm bg-stone-800 p-0 md:h-28 md:w-56 lg:h-32">
                        <div className="flex h-[25px] flex-none flex-row items-center bg-skin-accent px-2">
                            <span className="text-xs text-white">Dark</span>
                        </div>
                        <div className="flex flex-none flex-grow flex-col justify-between space-y-2 p-2">
                            <div className="space-y-2">
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-stone-500"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-stone-500"></div>
                                    </div>
                                </div>
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-stone-500"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-stone-500"></div>
                                    </div>
                                </div>
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-stone-500"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-stone-500"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-none flex-row items-center justify-between">
                                <div className="h-3 w-[20%] flex-none bg-skin-accent"></div>
                                {theme == "theme-dark" && (
                                    <CheckIcon className="h-3 w-3 flex-none text-white"></CheckIcon>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => setTheme({ theme: "theme-black" })}
                        className="m-0 flex h-24 w-96 cursor-pointer flex-col rounded-sm bg-black p-0 md:h-28 md:w-56 lg:h-32">
                        <div className="flex h-[25px] flex-none flex-row items-center bg-skin-accent px-2">
                            <span className="text-xs text-white">Black</span>
                        </div>
                        <div className="flex flex-none flex-grow flex-col justify-between space-y-2 p-2">
                            <div className="space-y-2">
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-stone-500"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-stone-500"></div>
                                    </div>
                                </div>
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-stone-500"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-stone-500"></div>
                                    </div>
                                </div>
                                <div className="flex flex-none flex-row items-center space-x-2">
                                    <div className="h-2 w-[30%] flex-none rounded-md bg-stone-500"></div>
                                    <div className="flex flex-grow flex-row items-center justify-center space-x-2">
                                        <div className="rounded-xs h-2 w-2 flex-none border border-gray-300"></div>
                                        <div className="h-2 w-[80%] flex-none rounded-md bg-stone-500"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-none flex-row items-center justify-between">
                                <div className="h-3 w-[20%] flex-none bg-skin-accent"></div>
                                {theme == "theme-black" && (
                                    <CheckIcon className="h-3 w-3 flex-none text-white"></CheckIcon>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
