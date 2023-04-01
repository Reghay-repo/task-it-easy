export const initialDueTo = () => {
    const today = new Date();
    today.setHours(23, 59, 0, 0);
    return today.getTime();
};

export const dayWeek = (day: number, month: number, year: number) => {
    let t = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];

    year -= month < 3 ? 1 : 0;

    return Math.floor((year + year / 4 - year / 100 + year / 400 + t[month - 1] + day) % 7);
};

export const GetWeekFirstDayOfTheMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
};

export const GetLastDayOfTheMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
};

export const NextMonth = (year: number, month: number): [number, number] => {
    if (month == 11) {
        return [year + 1, 0];
    } else {
        return [year, month + 1];
    }
};

export const PreviousMonth = (year: number, month: number): [number, number] => {
    if (month == 0) {
        return [year - 1, 11];
    } else {
        return [year, month - 1];
    }
};

export const Months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const WeekDays: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const GenerateCalendar = (year: number, month: number): [number[], number[], number[]] => {
    let previous = PreviousMonth(year, month);
    let next = NextMonth(year, month);

    let lastDayBeforeMonth: number = GetLastDayOfTheMonth(previous[0], previous[1]);
    let firstDayCurrentMonth: number = GetWeekFirstDayOfTheMonth(year, month);
    let lastDayCurrentMonth: number = GetLastDayOfTheMonth(year, month);

    let previousMonth: number[] = [];
    let currentMonth: number[] = [];
    let nextMonth: number[] = [];

    for (let i = firstDayCurrentMonth - 1, j = 0; i >= 0; i--, j++) {
        previousMonth.push(lastDayBeforeMonth - j);
    }

    for (let i = 1; i <= lastDayCurrentMonth; i++) {
        currentMonth.push(i);
    }

    for (let i = 1, j = previousMonth.length + currentMonth.length; j < 42; i++, j++) {
        nextMonth.push(i);
    }

    return [previousMonth.reverse(), currentMonth, nextMonth];
};

export const FormatDate = (date: number) => {
    const convertedDate = new Date(date);

    const diff = Math.ceil((convertedDate.getTime() - initialDueTo()) / (1000 * 3600 * 24));

    if (diff == 0) {
        return "Today";
    } else if (diff > 0) {
        /* Future */
        if (diff >= 365) {
            return `${convertedDate.getDate()}th ${
                Months[convertedDate.getMonth()]
            } ${convertedDate.getFullYear()}`;
        } else if (diff >= 7) {
            return `${convertedDate.getDate()}th ${Months[convertedDate.getMonth()]}`;
        } else if (diff >= 2) {
            return `${WeekDays[convertedDate.getDay()]}`;
        } else if (diff == 1) {
            return "Tomorrow";
        }
    } else {
        /* Past */
        if (diff <= -25) {
            return `${convertedDate.getDate()}th ${
                Months[convertedDate.getMonth()]
            } ${convertedDate.getFullYear()}`;
        } else if (diff <= -15) {
            return "This month";
        } else if (diff <= -7) {
            return `${convertedDate.getDate()}th ${Months[convertedDate.getMonth()]}`;
        } else if (diff <= -2) {
            return `${WeekDays[convertedDate.getDay()]}`;
        } else {
            return "Yesterday";
        }
    }
};

export const FormatHour = (date: number) => {
    const convertedDate = new Date(date);

    let hours = convertedDate.getHours();
    let minutes: string | number = convertedDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const strTime = `${hours}:${minutes} ${ampm}`;

    return strTime;
};

export type DatepickerColor =
    | "text-red-600"
    | "text-green-600"
    | "text-blue-600"
    | "text-stone-600";

export const GetDatePickerColor = (date: number): DatepickerColor => {
    const diff = Math.ceil((date - initialDueTo()) / (1000 * 3600 * 24));
    if (diff < 0) {
        return "text-red-600";
    } else if (diff == 0) {
        return "text-green-600";
    } else if (diff < 7) {
        return "text-blue-600";
    } else {
        return "text-stone-600";
    }
};
