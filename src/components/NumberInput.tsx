import React, { useRef } from "react";
import PlusIcon from "@heroicons/react/20/solid/PlusIcon";
import MinusIcon from "@heroicons/react/20/solid/MinusIcon";

interface Props {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    min?: number;
}

export default function NumberInput({ value, onChange, max, min }: Props) {
    const inputRef = useRef();

    const handleOnChange = async (event: any) => {
        const newValue = parseInt(event.target.value);

        if (!newValue) {
            onChange(0);
            return;
        }

        if (min != undefined && newValue < min) {
            onChange(min);
            return;
        }

        if (max != undefined && newValue > max) {
            onChange(min ?? 0);
            return;
        }

        onChange(newValue);
    };

    const handleAdd = () => {
        if (min != undefined && value + 1 < min) {
            return;
        }

        if (max != undefined && value + 1 > max) {
            return;
        }

        onChange(value + 1);
    };

    const handleSubtract = () => {
        if (min != undefined && value - 1 < min) {
            return;
        }

        if (max != undefined && value - 1 > max) {
            return;
        }

        onChange(value - 1);
    };

    return (
        <div className="flex max-w-min flex-row items-center space-x-1 rounded-md border border-skin-base p-0.5">
            <button onClick={() => handleSubtract()} type="button" className="bg-animation rounded-md p-0.5 hover:bg-skin-secondary">
                <MinusIcon className="bg-animation h-4 w-4 text-skin-muted hover:text-skin-base"></MinusIcon>
            </button>
            <input
                ref={inputRef as any}
                type="text"
                value={value}
                className="none m-0 w-7 appearance-none border-none bg-transparent p-0 text-center text-skin-muted focus:text-skin-base focus:outline-none focus:ring-0"
                onChange={(e) => handleOnChange(e)}
            />
            <button type="button" className="bg-animation rounded-md p-0.5 hover:bg-skin-secondary">
                <PlusIcon onClick={() => handleAdd()} className="bg-animation h-4 w-4 text-skin-muted hover:text-skin-base"></PlusIcon>
            </button>
        </div>
    );
}
