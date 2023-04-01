import { useRef, useState } from "react";

interface Props {
    className: string;
    onChange: (value: string) => void;
    defaultValue: string;
}

export default function EditableText({ className, onChange, defaultValue }: Props) {
    let inputRef = useRef();
    const [editing, setEdting] = useState<boolean>(false);

    const handleChange = () => {
        if (inputRef.current == null) return;
        if ((inputRef.current as any).value == "") return;

        setEdting(false);
        onChange((inputRef.current as any).value);
    };

    if (editing == false) {
        return (
            <div onClick={() => setEdting(true)} className={className + " bg-animation flex flex-row items-center space-x-1 p-1 hover:bg-skin-secondaryhover"}>
                <span>{defaultValue}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-1">
            <input autoFocus ref={inputRef as any} type="text" className={className + " input rounded-sm px-1 py-0.5"} defaultValue={defaultValue} placeholder="Space name"></input>
            <div className="flex flex-row items-center justify-start space-x-2">
                <button onClick={() => handleChange()} type="button" className="button primary">
                    Save
                </button>
                <button onClick={() => setEdting(false)} type="button" className="button secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}
