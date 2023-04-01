import { ReactNode, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import TodayIcon from "@heroicons/react/24/solid/CalendarIcon";
import UpcomingIcon from "@heroicons/react/24/solid/CalendarDaysIcon";
import ArrowDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import PlusIcon from "@heroicons/react/20/solid/PlusIcon";
import UserIcon from "@heroicons/react/24/solid/UserCircleIcon";
import InboxIcon from "@heroicons/react/24/solid/ArchiveBoxArrowDownIcon";
import SlideOver from "../components/SlideOver";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import { AnimatePresence, MotionProps, motion } from "framer-motion";
import SidebarButton from "../components/SidebarButton";
import SpaceButton from "../components/SpaceButton";
import CreateTaskButton from "../components/CreateTaskButton";
import TaskList from "../components/TaskList";
import useGetWorkspace from "../hooks/getWorkspace";
import useCounters from "../hooks/getCounters";
import useGetSpaces from "../hooks/getSpaces";
import Tooltip from "../components/Tooltip";

const sideBarAnimations: MotionProps = {
    layout: true,
    layoutRoot: true,
    transition: { ease: "easeOut", duration: 0.4 },
    initial: "in",
    animate: "animate",
    exit: "out",
    variants: {
        in: { opacity: 0, height: 0 },
        animate: {
            opacity: 1,
            height: "auto",
            transition: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
        },
        out: { opacity: 0, height: 0 },
    },
};

interface Props {
    setSlideOver: React.Dispatch<React.SetStateAction<boolean>>;
}

function SideBarContent({ setSlideOver }: Props) {
    const [collapseSpaceList, setCollapseSpaceList] = useState<boolean>(false);

    let { name, useSheets } = useGetWorkspace();
    const spaceList = useGetSpaces();
    const { inboxCount, todayCount, upcomingCount } = useCounters();
    const location = useLocation();
    const [useSheetsStatus, setUseSheetsStatus] = useState<ReactNode>(<CheckCircleIcon className="h-4 w-4 flex-none text-green-600"></CheckCircleIcon>);

    useEffect(() => {
        if (useSheets) {
            if (useSheets.status == "synced") {
                setUseSheetsStatus(<CheckCircleIcon className="h-4 w-4 flex-none text-green-600"></CheckCircleIcon>);
            } else if (useSheets.status == "synchronizing") {
                setUseSheetsStatus(
                    <svg aria-hidden="true" className="h-4 w-4 flex-none animate-spin fill-sky-600 text-skin-secondary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                );
            } else {
                setUseSheetsStatus(<ExclamationCircleIcon className="h-4 w-4 flex-none text-red-600"></ExclamationCircleIcon>);
            }
        } else {
            setUseSheetsStatus(null);
        }
    }, [useSheets]);

    return (
        <>
            <div className="group flex h-screen w-72 flex-col space-y-2 overflow-y-auto bg-skin-secondary p-2 scrollbar-thin">
                <Link onClick={() => setSlideOver(false)} to="/app/settings/workspace" className="bg-animation flex w-full cursor-pointer flex-row items-center space-x-2 rounded-md px-3 py-1 text-skin-base outline-none hover:bg-skin-secondaryhover">
                    {name == "" ? (
                        <div role="status" className="flex h-4 w-28 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                    ) : (
                        <>
                            <div className="flex min-w-0 flex-grow flex-row items-center space-x-2">
                                <UserIcon className="h-5 w-5 flex-none text-blue-700"></UserIcon>
                                <span className="truncate text-base text-skin-base">{name}</span>
                            </div>
                            <Tooltip
                                message={
                                    <span>
                                        Google Sheets: <strong className="capitalize">{useSheets?.status}</strong>
                                    </span>
                                }
                                side="right"
                            >
                                {useSheetsStatus}
                            </Tooltip>
                        </>
                    )}
                </Link>
                <SidebarButton label="Inbox" icon={<InboxIcon className="h-5 w-5 text-yellow-700"></InboxIcon>} href="/app/inbox" count={inboxCount} active={location.pathname.includes("/inbox")} action={() => setSlideOver(false)}></SidebarButton>
                <SidebarButton label="Today" icon={<TodayIcon className="h-5 w-5 text-green-700"></TodayIcon>} href="/app/today" count={todayCount} active={location.pathname.includes("/today")} action={() => setSlideOver(false)}></SidebarButton>
                <SidebarButton
                    label="Upcoming"
                    icon={<UpcomingIcon className="h-5 w-5 text-purple-700"></UpcomingIcon>}
                    href="/app/upcoming"
                    count={upcomingCount}
                    active={location.pathname.includes("/upcoming")}
                    action={() => setSlideOver(false)}
                ></SidebarButton>
                <SidebarButton
                    label="Spaces"
                    labelClass="text-xs text-skin-base uppercase tracking-wider font-semibold"
                    extra={
                        <div className="flex flex-row items-baseline space-x-2 transition-opacity duration-200 ease-linear">
                            <Link to={location.pathname + "/create-space"}>
                                <PlusIcon className="h-5 w-5"></PlusIcon>
                            </Link>
                            <button onClick={() => setCollapseSpaceList(!collapseSpaceList)} type="button">
                                <ArrowDownIcon className={"h-5 w-5" + (collapseSpaceList ? " -rotate-90" : "")}></ArrowDownIcon>
                            </button>
                        </div>
                    }
                ></SidebarButton>
                <AnimatePresence>
                    {!collapseSpaceList && (
                        <motion.div {...sideBarAnimations} className="flex flex-col space-y-2">
                            {spaceList?.map((space) => {
                                return <SpaceButton key={space.id} id={space.id} name={space.name} color={space.color} showCompleted={space.showCompleted} setSlideOver={setSlideOver}></SpaceButton>;
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export type AppContext = {
    setSlideOver: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AppLayout() {
    const [slideOver, setSlideOver] = useState<boolean>(false);

    return (
        <div className="h-screen w-screen">
            <div className="flex h-full w-full flex-row">
                <SlideOver open={slideOver} close={() => setSlideOver(false)} slide="left">
                    <SideBarContent setSlideOver={setSlideOver} />
                </SlideOver>
                <div className="hidden w-72 flex-row lg:flex">
                    <SideBarContent setSlideOver={setSlideOver} />
                </div>
                <div className="flex h-full w-full min-w-0 flex-grow">
                    <div className="flex h-full w-full flex-row bg-skin-base">
                        <div className="flex h-full min-w-0 flex-grow flex-col">
                            <div className="mx-auto flex w-full max-w-4xl flex-row items-center justify-between p-3">
                                <Outlet context={{ setSlideOver }}></Outlet>
                            </div>
                            <div className="flex h-full w-full min-w-0 flex-grow flex-col items-center overflow-y-auto bg-skin-base p-3 scrollbar-thin">
                                <div className="mb-20 w-full">
                                    <AnimatePresence>
                                        <motion.div layout layoutRoot className="mx-auto flex w-full max-w-4xl flex-col space-y-2">
                                            <CreateTaskButton></CreateTaskButton>
                                            <TaskList></TaskList>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
