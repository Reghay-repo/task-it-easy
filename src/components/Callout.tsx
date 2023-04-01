import InformationCircleIcon from "@heroicons/react/24/solid/InformationCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import { useThemeStore } from "../stores/theme";
interface Props {
    type: "Alert" | "Info" | "Warning";
    message: string;
    title?: string;
}

export default function CallOut({ type, message, title }: Props) {
    let icon;
    let txtColor: string = "";
    let bgColor: string = "";
    let borderColor: string = "";

    const { theme } = useThemeStore();

    if (type == "Alert") {
        borderColor = "border-red-600";
        txtColor = "text-red-600";
        icon = <ExclamationCircleIcon className="h-5 w-5 text-red-600"></ExclamationCircleIcon>;

        if (theme == "theme-light") {
            bgColor = "bg-[#fdebec]";
        } else {
            bgColor = "bg-[#3b1919]";
        }
    } else if (type == "Warning") {
        borderColor = "border-yellow-600";
        txtColor = "text-yellow-600";
        icon = <ExclamationCircleIcon className="h-5 w-5 text-yellow-600"></ExclamationCircleIcon>;

        if (theme == "theme-light") {
            bgColor = "bg-[#fbf3db]";
        } else {
            bgColor = "bg-[#392e1e]";
        }
    } else {
        borderColor = "border-blue-600";
        txtColor = "text-blue-600";
        icon = <InformationCircleIcon className="h-5 w-5 text-blue-600"></InformationCircleIcon>;

        if (theme == "theme-light") {
            bgColor = "bg-[#e7f3f8]";
        } else {
            bgColor = "bg-[#1d282e]";
        }
    }

    return (
        <div className="h-full w-full">
            <div className={`my-4 flex h-full w-full flex-col space-y-1 rounded-r-md rounded-l-sm ${bgColor} border-l-4 p-2 ${borderColor}`}>
                <div className="flex flex-row items-center space-x-1">
                    {icon}
                    <span className={`text-base font-semibold uppercase ${txtColor}`}>{title ?? type}</span>
                </div>
                <span className="font-semibold text-skin-base">{message}</span>
            </div>
        </div>
    );
}
