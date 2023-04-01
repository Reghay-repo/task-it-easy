import { useEffect, useRef } from "react";

interface Props {
    value: string;
    onChange: (text: string) => void;
    className?: string;
    focus: boolean;
    placeholder?: string;
    onKeyDown?: (event: any) => void;
}

export default function TextArea({ value, onChange, className, focus, placeholder, onKeyDown }: Props) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const moveCaretAtEnd = (e: any) => {
        var temp_value = e.target.value;
        e.target.value = "";
        e.target.value = temp_value;
    };

    useEffect(() => {
        const textArea = textAreaRef.current!;

        if (textArea == null) return;

        textArea.style.height = "auto";
        textArea.style.height = textArea.scrollHeight + "px";
    }, [value]);

    return (
        <textarea
            ref={textAreaRef}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(text) => onChange(text.target.value)}
            className={"resize-none bg-transparent focus:outline-none " + className}
            autoFocus={focus}
            rows={1}
            onFocus={moveCaretAtEnd}
            placeholder={placeholder}
        ></textarea>
    );
}
