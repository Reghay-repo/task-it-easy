import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
    icon?: ReactNode;
    label: string | null;
    count?: number;
    labelClass?: string;
    href?: string;
    extra?: ReactNode;
    active?: boolean;
    action?: () => void;
}

export default function SidebarButton({ icon, label, labelClass, extra, href, active, count, action }: Props) {
    return (
        <div className={"bg-animation flex w-full cursor-pointer flex-row items-center justify-between rounded-md px-3 py-1 text-skin-base outline-none hover:bg-skin-secondaryhover" + (active == true ? " bg-skin-secondaryhover" : "")}>
            {href != undefined ? (
                <Link to={href} onClick={() => (action ? action() : null)} className="flex w-full min-w-0 flex-grow flex-row items-center space-x-2">
                    {icon}
                    {label ? (
                        <span className={labelClass + (active == true ? " min-w-0 flex-grow truncate font-semibold" : " flex-grow")}>{label}</span>
                    ) : (
                        <div role="status" className="animate-pulse">
                            <div className="h-4 w-32 rounded-full bg-skin-secondaryhover"></div>
                        </div>
                    )}
                </Link>
            ) : (
                <div className="flex w-full min-w-0 flex-grow flex-row items-center space-x-2">
                    {icon}
                    <span className={`${labelClass} min-w-0 max-w-full flex-grow truncate ` + (active == true ? "font-semibold" : "")}>{label}</span>
                </div>
            )}
            {count ? <span>{count > 100 ? "99+" : count}</span> : <>{extra}</>}
        </div>
    );
}
