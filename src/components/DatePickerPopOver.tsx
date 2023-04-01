import { useState } from "react";
import SparklesIcon from "@heroicons/react/24/solid/SparklesIcon";
import CalendarIcon from "@heroicons/react/24/solid/CalendarIcon";
import CalendarDaysIcon from "@heroicons/react/24/solid/CalendarDaysIcon";
import SunIcon from "@heroicons/react/24/solid/SunIcon";
import BellSlashIcon from "@heroicons/react/24/solid/BellSlashIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import { Frequency } from "../types";
import { GetDatePickerColor, FormatDate, initialDueTo, WeekDays, DatepickerColor } from "../utils/time";
import PopOver from "./PopOver";
import DatePicker from "./DatePicker";

interface Props {
    date: number;
    setDate: (date: number) => void;
    frequency: Frequency;
    setFrequency: (frequency: Frequency) => void;
}

export default function DatePickerPopOver({ date, setDate, frequency, setFrequency }: Props) {
    const datepickerColor: DatepickerColor = GetDatePickerColor(date);
    const [openDatepicker, setOpenDatepicker] = useState<boolean>(false);
    const [openFrequnecyPicker, setOpenFrequencyPicker] = useState<boolean>(false);

    const datepickerShortcuts = (shortcut: "tommorrow" | "this weekend" | "next week" | "next month") => {
        let today = initialDueTo();

        if (shortcut == "tommorrow") {
            today += 1000 * 60 * 60 * 24;
            setDate(today);
        } else if (shortcut == "this weekend") {
            const weekday = new Date().getDay();

            if (weekday == 6 || weekday == 0) {
                setDate(today);
            } else {
                today += 1000 * 60 * 60 * 24 * (6 - weekday);
                setDate(today);
            }
        } else if (shortcut == "next week") {
            today += 1000 * 60 * 60 * 24 * 7;
            setDate(today);
        } else {
            today += 1000 * 60 * 60 * 24 * 30;
            setDate(today);
        }

        setOpenDatepicker(false);
        setOpenFrequencyPicker(false);
    };

    return (
        <PopOver
            trigger={
                <div className={`bg-animation flex w-full flex-row items-center space-x-1 px-2 py-1 hover:bg-skin-secondaryhover ${datepickerColor} rounded-md`}>
                    <div className="flex flex-row items-center justify-center space-x-1">
                        <CalendarIcon className="h-5 w-5"></CalendarIcon>
                        <span className="text-sm">{`${FormatDate(date)}`}</span>
                        {frequency != "none" && <ArrowPathIcon className="h-3 w-3"></ArrowPathIcon>}
                    </div>
                </div>
            }
            exposedOpen={openDatepicker}
            setExposedOpen={setOpenDatepicker}
            className="z-[350] bg-skin-secondary"
        >
            <div className="flex min-h-min w-60 flex-col items-center space-y-1 rounded-md bg-skin-secondary py-2 shadow-md">
                <div className="flex w-full flex-col justify-around space-y-2 border-b border-skin-base py-1">
                    <button onClick={() => datepickerShortcuts("tommorrow")} type="button" className="bg-animation w-fullflex-row flex items-center justify-between rounded-sm px-3 py-1 outline-none hover:bg-skin-secondaryhover">
                        <div className="flex flex-grow flex-row items-center space-x-2">
                            <SunIcon className="h-5 w-5 text-yellow-400"></SunIcon>
                            <span className="font-light text-skin-base">Tommorow</span>
                        </div>
                        <span className="text-sm font-light text-skin-muted">{`${WeekDays[new Date(initialDueTo() + 1000 * 60 * 60 * 24).getDay()]}`}</span>
                    </button>
                    <button onClick={() => datepickerShortcuts("this weekend")} type="button" className="bg-animation flex w-full flex-row items-center justify-between rounded-sm px-3 py-1 outline-none hover:bg-skin-secondaryhover">
                        <div className="flex flex-grow flex-row items-center space-x-2">
                            <SparklesIcon className="h-5 w-5 text-yellow-400"></SparklesIcon>
                            <span className="font-light text-skin-base">This weekend</span>
                        </div>
                        <span className="text-sm font-light text-skin-muted">{`${FormatDate(initialDueTo() + 1000 * 60 * 60 * 24 * (6 - new Date().getDay()))}`}</span>
                    </button>
                    <button onClick={() => datepickerShortcuts("next week")} type="button" className="bg-animation flex w-full flex-row items-center justify-between rounded-sm px-3 py-1 outline-none hover:bg-skin-secondaryhover">
                        <div className="flex flex-grow flex-row items-center space-x-2">
                            <BellSlashIcon className="h-5 w-5 text-orange-700"></BellSlashIcon>
                            <span className="font-light text-skin-base">Next week</span>
                        </div>
                        <span className="text-sm font-light text-skin-muted">{`${FormatDate(initialDueTo() + 1000 * 60 * 60 * 24 * 7)}`}</span>
                    </button>
                    <button onClick={() => datepickerShortcuts("next month")} type="button" className="bg-animation flex w-full flex-row items-center justify-between rounded-sm px-3 py-1 outline-none hover:bg-skin-secondaryhover">
                        <div className="flex flex-grow flex-row items-center space-x-2">
                            <CalendarDaysIcon className="h-5 w-5 text-blue-700"></CalendarDaysIcon>
                            <span className="font-light text-skin-base">Next month</span>
                        </div>
                        <span className="text-sm font-light text-skin-muted">{`${FormatDate(initialDueTo() + 1000 * 60 * 60 * 24 * 30)}`}</span>
                    </button>
                </div>
                <DatePicker
                    currentDate={date}
                    onChange={(value) => {
                        setOpenDatepicker(false);
                        setOpenFrequencyPicker(false);
                        setDate(value);
                    }}
                ></DatePicker>
                <PopOver
                    trigger={
                        <div className={"flex flex-row items-center justify-center space-x-2" + (frequency != "none" ? " text-skin-accent" : " text-skin-base")}>
                            {frequency != "none" && <ArrowPathIcon className="h-4 w-4"></ArrowPathIcon>}
                            <span className="capitalize">{frequency ?? "No repeat"}</span>
                        </div>
                    }
                    triggerClassName={"px-2 py-1 border w-52 rounded-md" + (frequency != "none" ? " border-skin-accent" : " border-gray-300")}
                    className="z-[1010] min-h-min w-40 rounded-md bg-skin-secondary p-1.5 shadow-md"
                    exposedOpen={openFrequnecyPicker}
                    setExposedOpen={setOpenFrequencyPicker}
                >
                    <div className="flex flex-col space-y-2">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenFrequencyPicker(false);
                                setFrequency("none");
                            }}
                            className={"bg-animation flex w-full justify-start rounded-md px-2 py-1 text-sm text-skin-secondary hover:bg-skin-secondaryhover hover:text-skin-secondaryhover" + (frequency == "none" ? " bg-skin-secondaryhover" : "")}
                        >
                            No repeat
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOpenFrequencyPicker(false);
                                setFrequency("daily");
                            }}
                            className={"bg-animation flex w-full justify-start rounded-md px-2 py-1 text-sm text-skin-secondary hover:bg-skin-secondaryhover hover:text-skin-secondaryhover" + (frequency == "daily" ? " bg-skin-secondaryhover" : "")}
                        >
                            Daily
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOpenFrequencyPicker(false);
                                setFrequency("weekly");
                            }}
                            className={"bg-animation flex w-full justify-start rounded-md px-2 py-1 text-sm text-skin-secondary hover:bg-skin-secondaryhover hover:text-skin-secondaryhover" + (frequency == "weekly" ? " bg-skin-secondaryhover" : "")}
                        >
                            Weekly
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setOpenFrequencyPicker(false);
                                setFrequency("monthly");
                            }}
                            className={"bg-animation flex w-full justify-start rounded-md px-2 py-1 text-sm text-skin-secondary hover:bg-skin-secondaryhover hover:text-skin-secondaryhover" + (frequency == "monthly" ? " bg-skin-secondaryhover" : "")}
                        >
                            Monthly
                        </button>
                    </div>
                </PopOver>
            </div>
        </PopOver>
    );
}
