import { useEffect, useState } from "react";
import { GenerateCalendar, Months, NextMonth, PreviousMonth } from "../utils/time";
import ArrowRight from "@heroicons/react/20/solid/ChevronRightIcon";
import ArrowLeft from "@heroicons/react/20/solid/ChevronLeftIcon";

interface Props {
    currentDate: number;
    onChange: (value: number) => void;
}

export default function DatePicker({ currentDate, onChange }: Props) {
    const convertedDate = new Date(currentDate);

    const [hasSelected, setHasSelected] = useState<boolean>(false);
    const [selectedYear, setSelectedYear] = useState<number>(convertedDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(convertedDate.getMonth());

    const [date, setDate] = useState<number>(convertedDate.getDate());
    const [month, setMonth] = useState<number>(convertedDate.getMonth());
    const [year, setYear] = useState<number>(convertedDate.getFullYear());

    const [_previousMonthArray, _setPreviousMonthArray] = useState<number[]>([]);
    const [_currentMonthArray, _setCurrentMonthArray] = useState<number[]>([]);
    const [_nextMonthArray, _setNextMonthArray] = useState<number[]>([]);

    useEffect(() => {
        let calendars: [number[], number[], number[]] = GenerateCalendar(year, month);

        _setPreviousMonthArray(calendars[0]);
        _setCurrentMonthArray(calendars[1]);
        _setNextMonthArray(calendars[2]);

        if (hasSelected) {
            onChange(new Date(year, month, date, 23, 59, 0, 0).getTime());
        }
    }, [date, month, year, hasSelected]);

    const GoBack = () => {
        setHasSelected(false);

        let results: [number, number] = PreviousMonth(year, month);

        setYear(results[0]);
        setMonth(results[1]);
    };

    const GoNext = () => {
        setHasSelected(false);

        let results: [number, number] = NextMonth(year, month);

        setYear(results[0]);
        setMonth(results[1]);
    };

    const SelectCurrentMonthDay = (day: number) => {
        setHasSelected(true);
        setDate(day + 1);
        setMonth(month);
        setYear(year);

        setSelectedYear(year);
        setSelectedMonth(month);
    };

    const SelectPreviousMonthDay = (day: number) => {
        setHasSelected(true);
        let results: [number, number] = PreviousMonth(year, month);

        setDate(day);
        setMonth(results[1]);
        setYear(results[0]);

        setSelectedYear(results[0]);
        setSelectedMonth(results[1]);
    };

    const SelectNextMonthDay = (day: number) => {
        setHasSelected(true);
        let results: [number, number] = NextMonth(year, month);

        setDate(day);
        setMonth(results[1]);
        setYear(results[0]);

        setSelectedYear(results[0]);
        setSelectedMonth(results[1]);
    };

    return (
        <div className="z-20 flex w-56 flex-col space-y-2 bg-skin-secondary p-2">
            <div className="flex flex-row items-center justify-between">
                <span className="font-semibold text-skin-base">
                    <strong>{Months[month]}</strong> {year}
                </span>
                <div className="flex flex-row space-x-2 text-skin-base">
                    <button onClick={GoBack} type="button" className="bg-animation flex items-center rounded-sm p-1 hover:bg-skin-secondaryhover">
                        <ArrowLeft className="h-4 w-4"></ArrowLeft>
                    </button>
                    <button onClick={GoNext} type="button" className="bg-animation flex items-center rounded-sm p-1 hover:bg-skin-secondaryhover">
                        <ArrowRight className="h-4 w-4"></ArrowRight>
                    </button>
                </div>
            </div>
            <div className="grid w-full grid-cols-7 grid-rows-7 gap-0.5">
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">Su</span>
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">Mo</span>
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">Tu</span>
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">We</span>
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">Th</span>
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">Fr</span>
                <span className="h-6 w-6 text-center text-xs font-semibold text-skin-secondaryhover">Sa</span>
                {_previousMonthArray.map((day, i) => {
                    return (
                        <button key={i} onClick={() => SelectPreviousMonthDay(day)} type="button" className="bg-animation h-6 w-6 rounded-sm text-center text-xs leading-none text-skin-muted hover:bg-skin-accenthover hover:text-white">
                            {day}
                        </button>
                    );
                })}
                {_currentMonthArray.map((day, i) => {
                    let baseClass: string = "w-6 h-6 text-skin-base text-center text-xs leading-none hover:bg-skin-accenthover bg-animation rounded-sm hover:text-white";

                    if (i == date - 1 && selectedMonth == month && selectedYear == year) {
                        baseClass += " bg-skin-accent text-white";
                    }

                    const today = new Date();

                    if (i == today.getDate() - 1 && month == today.getMonth() && year == today.getFullYear()) {
                        baseClass += " border border-skin-accent";
                    }

                    return (
                        <button key={i} onClick={() => SelectCurrentMonthDay(i)} type="button" className={baseClass}>
                            {day}
                        </button>
                    );
                })}
                {_nextMonthArray.map((day, i) => {
                    return (
                        <button key={i} onClick={() => SelectNextMonthDay(day)} type="button" className="bg-animation h-6 w-6 rounded-sm text-center text-xs leading-none text-skin-muted hover:bg-skin-accenthover hover:text-white">
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
