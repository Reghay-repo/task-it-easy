import { ColorBase, ColorBases, ColorGradient, ColorGradients, ColorType } from "../utils/colors";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import * as Slider from "@radix-ui/react-slider";

interface Props {
    color: ColorType;
    setColor: (newValue: ColorType) => void;
    gradientInput: number;
    setGradientInput: (newValue: number) => void;
}

const ColorMap: Record<ColorBase, Record<ColorGradient, string>> = {
    neutral: {
        "50": "bg-neutral-50",
        "100": "bg-neutral-100",
        "200": "bg-neutral-200",
        "300": "bg-neutral-300",
        "400": "bg-neutral-400",
        "500": "bg-neutral-500",
        "600": "bg-neutral-600",
        "700": "bg-neutral-700",
        "800": "bg-neutral-800",
        "900": "bg-neutral-900",
    },
    red: {
        "50": "bg-red-50",
        "100": "bg-red-100",
        "200": "bg-red-200",
        "300": "bg-red-300",
        "400": "bg-red-400",
        "500": "bg-red-500",
        "600": "bg-red-600",
        "700": "bg-red-700",
        "800": "bg-red-800",
        "900": "bg-red-900",
    },
    orange: {
        "50": "bg-orange-50",
        "100": "bg-orange-100",
        "200": "bg-orange-200",
        "300": "bg-orange-300",
        "400": "bg-orange-400",
        "500": "bg-orange-500",
        "600": "bg-orange-600",
        "700": "bg-orange-700",
        "800": "bg-orange-800",
        "900": "bg-orange-900",
    },
    amber: {
        "50": "bg-amber-50",
        "100": "bg-amber-100",
        "200": "bg-amber-200",
        "300": "bg-amber-300",
        "400": "bg-amber-400",
        "500": "bg-amber-500",
        "600": "bg-amber-600",
        "700": "bg-amber-700",
        "800": "bg-amber-800",
        "900": "bg-amber-900",
    },
    yellow: {
        "50": "bg-yellow-50",
        "100": "bg-yellow-100",
        "200": "bg-yellow-200",
        "300": "bg-yellow-300",
        "400": "bg-yellow-400",
        "500": "bg-yellow-500",
        "600": "bg-yellow-600",
        "700": "bg-yellow-700",
        "800": "bg-yellow-800",
        "900": "bg-yellow-900",
    },
    lime: {
        "50": "bg-lime-50",
        "100": "bg-lime-100",
        "200": "bg-lime-200",
        "300": "bg-lime-300",
        "400": "bg-lime-400",
        "500": "bg-lime-500",
        "600": "bg-lime-600",
        "700": "bg-lime-700",
        "800": "bg-lime-800",
        "900": "bg-lime-900",
    },
    green: {
        "50": "bg-green-50",
        "100": "bg-green-100",
        "200": "bg-green-200",
        "300": "bg-green-300",
        "400": "bg-green-400",
        "500": "bg-green-500",
        "600": "bg-green-600",
        "700": "bg-green-700",
        "800": "bg-green-800",
        "900": "bg-green-900",
    },
    emerald: {
        "50": "bg-emerald-50",
        "100": "bg-emerald-100",
        "200": "bg-emerald-200",
        "300": "bg-emerald-300",
        "400": "bg-emerald-400",
        "500": "bg-emerald-500",
        "600": "bg-emerald-600",
        "700": "bg-emerald-700",
        "800": "bg-emerald-800",
        "900": "bg-emerald-900",
    },
    teal: {
        "50": "bg-teal-50",
        "100": "bg-teal-100",
        "200": "bg-teal-200",
        "300": "bg-teal-300",
        "400": "bg-teal-400",
        "500": "bg-teal-500",
        "600": "bg-teal-600",
        "700": "bg-teal-700",
        "800": "bg-teal-800",
        "900": "bg-teal-900",
    },
    cyan: {
        "50": "bg-cyan-50",
        "100": "bg-cyan-100",
        "200": "bg-cyan-200",
        "300": "bg-cyan-300",
        "400": "bg-cyan-400",
        "500": "bg-cyan-500",
        "600": "bg-cyan-600",
        "700": "bg-cyan-700",
        "800": "bg-cyan-800",
        "900": "bg-cyan-900",
    },
    sky: {
        "50": "bg-sky-50",
        "100": "bg-sky-100",
        "200": "bg-sky-200",
        "300": "bg-sky-300",
        "400": "bg-sky-400",
        "500": "bg-sky-500",
        "600": "bg-sky-600",
        "700": "bg-sky-700",
        "800": "bg-sky-800",
        "900": "bg-sky-900",
    },
    blue: {
        "50": "bg-blue-50",
        "100": "bg-blue-100",
        "200": "bg-blue-200",
        "300": "bg-blue-300",
        "400": "bg-blue-400",
        "500": "bg-blue-500",
        "600": "bg-blue-600",
        "700": "bg-blue-700",
        "800": "bg-blue-800",
        "900": "bg-blue-900",
    },
    indigo: {
        "50": "bg-indigo-50",
        "100": "bg-indigo-100",
        "200": "bg-indigo-200",
        "300": "bg-indigo-300",
        "400": "bg-indigo-400",
        "500": "bg-indigo-500",
        "600": "bg-indigo-600",
        "700": "bg-indigo-700",
        "800": "bg-indigo-800",
        "900": "bg-indigo-900",
    },
    violet: {
        "50": "bg-violet-50",
        "100": "bg-violet-100",
        "200": "bg-violet-200",
        "300": "bg-violet-300",
        "400": "bg-violet-400",
        "500": "bg-violet-500",
        "600": "bg-violet-600",
        "700": "bg-violet-700",
        "800": "bg-violet-800",
        "900": "bg-violet-900",
    },
    purple: {
        "50": "bg-purple-50",
        "100": "bg-purple-100",
        "200": "bg-purple-200",
        "300": "bg-purple-300",
        "400": "bg-purple-400",
        "500": "bg-purple-500",
        "600": "bg-purple-600",
        "700": "bg-purple-700",
        "800": "bg-purple-800",
        "900": "bg-purple-900",
    },
    fuchsia: {
        "50": "bg-fuchsia-50",
        "100": "bg-fuchsia-100",
        "200": "bg-fuchsia-200",
        "300": "bg-fuchsia-300",
        "400": "bg-fuchsia-400",
        "500": "bg-fuchsia-500",
        "600": "bg-fuchsia-600",
        "700": "bg-fuchsia-700",
        "800": "bg-fuchsia-800",
        "900": "bg-fuchsia-900",
    },
    pink: {
        "50": "bg-pink-50",
        "100": "bg-pink-100",
        "200": "bg-pink-200",
        "300": "bg-pink-300",
        "400": "bg-pink-400",
        "500": "bg-pink-500",
        "600": "bg-pink-600",
        "700": "bg-pink-700",
        "800": "bg-pink-800",
        "900": "bg-pink-900",
    },
    rose: {
        "50": "bg-rose-50",
        "100": "bg-rose-100",
        "200": "bg-rose-200",
        "300": "bg-rose-300",
        "400": "bg-rose-400",
        "500": "bg-rose-500",
        "600": "bg-rose-600",
        "700": "bg-rose-700",
        "800": "bg-rose-800",
        "900": "bg-rose-900",
    },
};

export default function ColorPicker({ color, setColor, gradientInput, setGradientInput }: Props) {
    const handleChangeGradient = ([newValue]: number[]) => {
        setColor({ base: color.base, gradient: ColorGradients[newValue] });
        setGradientInput(newValue);
    };

    const handleChangeBase = (newBase: ColorBase) => {
        setColor({ base: newBase, gradient: color.gradient });
    };

    return (
        <div className="flex flex-col space-y-2">
            <span className="label">Colors</span>
            <div className="mx-auto grid grid-cols-9 gap-3">
                {ColorBases.map((base, index) => {
                    return (
                        <button key={index} onClick={() => handleChangeBase(base)} type="button" className={`flex h-8 w-8 items-center rounded-full ${ColorMap[base][400]} justify-center`}>
                            {base == color.base && <CheckIcon className="h-5 w-5 text-white"></CheckIcon>}
                        </button>
                    );
                })}
            </div>
            <div className="flex flex-col">
                <div className="flex flex-row items-center justify-between">
                    <span className="label">Lighter</span>
                    <span className="label">Darker</span>
                </div>
                <Slider.Root className="relative flex h-10 w-full touch-none select-none items-center" value={[gradientInput]} min={0} max={9} step={1} onValueChange={(value) => handleChangeGradient(value)} aria-label="Volume">
                    <Slider.Track className="relative h-3 flex-grow rounded-full bg-skin-secondary">
                        <Slider.Range className="absolute h-full rounded-full bg-skin-secondaryhover" />
                    </Slider.Track>
                    <Slider.Thumb className="h-5 w-5 rounded-lg bg-skin-base shadow-md" />
                </Slider.Root>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 rounded-md bg-skin-secondary py-4">
                <div className={`flex h-8 w-8 items-center rounded-full ${ColorMap[color.base][color.gradient]} justify-center`}></div>
                <div className="flex min-w-[100px] flex-col justify-start">
                    <span className="label capitalize">Color: {color.base}</span>
                    <span className="label">Gradient: {color.gradient}</span>
                </div>
            </div>
        </div>
    );
}
