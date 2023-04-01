import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import SlideOver from "../components/SlideOver";
import WorkspaceIcon from "@heroicons/react/24/outline/ServerStackIcon";
import ThemeIcon from "@heroicons/react/24/outline/PaintBrushIcon";
import LogOutIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import SlideOverIcon from "@heroicons/react/24/outline/Bars3Icon";

interface Props {
    className: string;
    setSlideOver: React.Dispatch<React.SetStateAction<boolean>>;
}

function LeftSlideOverContent({ className, setSlideOver }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <div className={"w-72 flex-col space-y-2 bg-skin-secondary p-2 " + className}>
            <Link to="/app/settings/workspace" onClick={() => setSlideOver(false)} className={"side-nav-button" + (location.pathname.includes("/workspace") ? " bg-skin-secondaryhover" : "")}>
                <div className="flex flex-row items-center space-x-2">
                    <WorkspaceIcon className="h-6 w-6 text-skin-base"></WorkspaceIcon>
                    <span className="text-base text-skin-base">Workspace</span>
                </div>
            </Link>
            <Link to="/app/settings/theme" onClick={() => setSlideOver(false)} className={"side-nav-button" + (location.pathname.includes("/theme") ? " bg-skin-secondaryhover" : "")}>
                <div className="flex flex-row items-center space-x-2">
                    <ThemeIcon className="h-6 w-6 text-skin-base"></ThemeIcon>
                    <span className="text-base text-skin-base">Theme</span>
                </div>
            </Link>
            <button type="button" onClick={() => handleLogout()} className="side-nav-button flex flex-row space-x-2">
                <LogOutIcon className="h-6 w-6 text-skin-base"></LogOutIcon>
                <span className="text-base text-skin-base">Logout</span>
            </button>
        </div>
    );
}

export default function SettingsLayout() {
    const [slideOver, setSlideOver] = useState<boolean>(false);

    const navigate = useNavigate();
    return (
        <>
            <SlideOver open={slideOver} close={() => setSlideOver(false)} slide="left">
                <LeftSlideOverContent className="flex h-screen" setSlideOver={setSlideOver}></LeftSlideOverContent>
            </SlideOver>
            <div className="fixed inset-0 z-50 h-screen w-screen bg-skin-basebackground">
                <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
                    <div className="flex w-11/12 flex-row items-center justify-between lg:w-11/12">
                        <div className="flex flex-row items-center space-x-2">
                            <button onClick={() => setSlideOver(true)} type="button" className="flex cursor-pointer items-center lg:hidden">
                                <SlideOverIcon className="h-6 w-6 text-skin-base"></SlideOverIcon>
                            </button>
                            <span className="text-2xl font-semibold text-skin-base">Settings</span>
                        </div>
                        <button onClick={() => navigate("/app/today")} type="button" className="button primary">
                            Done
                        </button>
                    </div>
                    <div className="h-5/6 w-11/12 rounded-sm bg-skin-base shadow-md lg:w-11/12">
                        <div className="flex h-full w-full flex-row">
                            <LeftSlideOverContent className="hidden lg:flex" setSlideOver={setSlideOver}></LeftSlideOverContent>
                            <div className="flex flex-grow flex-col bg-skin-base">
                                <Outlet></Outlet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
