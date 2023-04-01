import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import SlideOver from "../components/SlideOver";
import React, { useState } from "react";
import ArrowRight from "@heroicons/react/24/outline/ChevronRightIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import CubeIcon from "@heroicons/react/24/outline/CubeIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import ThemeIcon from "@heroicons/react/24/outline/PaintBrushIcon";
import ThemeSlideOver from "../components/ThemeSlideOver";

interface Props {
    className: string;
    setSlideOver: React.Dispatch<React.SetStateAction<boolean>>;
}

function LeftSlideOverContent({ className, setSlideOver }: Props) {
    const location = useLocation();

    return (
        <div className={"h-full w-72 flex-col space-y-2 border-r border-skin-base " + className}>
            <span className="label">Get started</span>
            <Link
                to="/about/get-started/the-project"
                onClick={() => setSlideOver(false)}
                className={`bg-animation text-base` + (location.pathname.includes("the-project") ? " border-l-2 border-skin-accent text-skin-accent" : " text-skin-base hover:border-l-2 hover:border-skin-base hover:text-skin-accent")}
            >
                <div className="flex flex-row items-center space-x-2 px-2">
                    <QuestionMarkCircleIcon className="h-6 w-6"></QuestionMarkCircleIcon>
                    <span>The project</span>
                </div>
            </Link>
            <Link
                to="/about/get-started/the-basics"
                onClick={() => setSlideOver(false)}
                className={`bg-animation text-base` + (location.pathname.includes("the-basics") ? " border-l-2 border-skin-accent text-skin-accent" : " text-skin-base hover:border-l-2 hover:border-skin-base hover:text-skin-accent")}
            >
                <div className="flex flex-row items-center space-x-2 px-2">
                    <SparklesIcon className="h-6 w-6"></SparklesIcon>
                    <span>The basics</span>
                </div>
            </Link>
            <Link
                to="/about/get-started/manage-data"
                onClick={() => setSlideOver(false)}
                className={`bg-animation text-base` + (location.pathname.includes("manage-data") ? " border-l-2 border-skin-accent text-skin-accent" : " text-skin-base hover:border-l-2 hover:border-skin-base hover:text-skin-accent")}
            >
                <div className="flex flex-row items-center space-x-2 px-2">
                    <CubeIcon className="h-6 w-6"></CubeIcon>
                    <span>Manage the data</span>
                </div>
            </Link>
            <span className="label">Future</span>
            <Link
                to="/about/future/whats-next"
                onClick={() => setSlideOver(false)}
                className={`bg-animation text-base` + (location.pathname.includes("whats-next") ? " border-l-2 border-skin-accent text-skin-accent" : " text-skin-base hover:border-l-2 hover:border-skin-base hover:text-skin-accent")}
            >
                <div className="flex flex-row items-center space-x-2 px-2">
                    <LightBulbIcon className="h-6 w-6"></LightBulbIcon>
                    <span>Whats's next?</span>
                </div>
            </Link>
            <Link
                to="/about/future/contribute"
                onClick={() => setSlideOver(false)}
                className={`bg-animation text-base` + (location.pathname.includes("contribute") ? " border-l-2 border-skin-accent text-skin-accent" : " text-skin-base hover:border-l-2 hover:border-skin-base hover:text-skin-accent")}
            >
                <div className="flex flex-row items-center space-x-2 px-2">
                    <svg className="h-6 w-6" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span>Contribute</span>
                </div>
            </Link>
        </div>
    );
}

export default function AboutLayout() {
    const [showSlideOver, setSlideOver] = useState<boolean>(false);
    const [themeSlideOver, setThemeSlideOver] = useState<boolean>(false);

    const location = useLocation();
    const locationSplit = location.pathname.split("/");

    return (
        <>
            <SlideOver open={showSlideOver} close={() => setSlideOver(false)} slide="left">
                <LeftSlideOverContent className="flex overflow-y-auto p-2 scrollbar-thin" setSlideOver={setSlideOver}></LeftSlideOverContent>
            </SlideOver>
            <ThemeSlideOver open={themeSlideOver} setOpen={setThemeSlideOver}></ThemeSlideOver>
            <div className="flex h-screen w-screen flex-col overflow-hidden bg-skin-base">
                <div className="flex flex-row items-center justify-between border-b border-skin-base p-2">
                    <Link to="/" className="flex flex-row items-center space-x-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-skin-accent">
                            <span className="text-lg font-bold text-white">t.</span>
                        </span>
                        <span className="hidden text-xl font-semibold text-skin-base md:block">task it easy.</span>
                    </Link>
                    <div className="flex flex-row items-center space-x-10">
                        <Link to="/about/get-started/the-project" className="link">
                            About
                        </Link>
                    </div>
                </div>
                <div className="flex flex-row items-center space-x-2 border-b border-skin-base p-1 lg:hidden">
                    <button type="button" onClick={() => setSlideOver(true)} className="lg:hidden">
                        <Bars3Icon className="h-5 w-5 text-skin-base"></Bars3Icon>
                    </button>
                    <span className="text-base capitalize text-skin-base">{locationSplit[2].replaceAll("-", " ")}</span>
                    <ArrowRight className="h-4 w-4 text-skin-base"></ArrowRight>
                    <span className="text-base capitalize text-skin-secondary">{locationSplit[3].replaceAll("-", " ")}</span>
                </div>
                <div className="relative flex min-h-0 flex-grow flex-row">
                    <button
                        onClick={() => setThemeSlideOver(true)}
                        type="button"
                        className="bg-animation fixed inset-y-1/2 right-0 z-50 flex h-10 w-10 flex-row items-center justify-center space-x-2 rounded-l-md bg-skin-accent text-white shadow-lg transition-all duration-300"
                    >
                        <ThemeIcon className="h-8 w-8"></ThemeIcon>
                    </button>
                    <LeftSlideOverContent className="hidden min-h-0 flex-grow overflow-y-auto p-2 scrollbar-thin lg:flex" setSlideOver={setSlideOver}></LeftSlideOverContent>
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    );
}
