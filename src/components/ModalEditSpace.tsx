import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Modal from "./Modal";
import { ColorType, getGradientSliderIndex } from "../utils/colors";
import EmojiPicker from "./EmojiPicker";
import ColorPicker from "./ColorPicker";
import backend from "../data/BackendFactory";
import { useToastStore } from "../stores/toast";
import useGetSpace from "../hooks/getSpace";

export default function ModalEditSpace() {
    const { spaceId } = useParams();
    let inputRef = useRef<HTMLInputElement>();

    const [color, setColor] = useState<ColorType>({
        base: "neutral",
        gradient: "400",
    });
    const [gradientInput, setgradientInput] = useState(4);

    const { addToast } = useToastStore();

    const spaceData = useGetSpace(spaceId);

    useEffect(() => {
        if (spaceData) {
            setColor(spaceData.color);
            setgradientInput(getGradientSliderIndex(spaceData.color.gradient));
            inputRef.current!.value = spaceData.name;
        }
    }, [spaceData]);

    const selectEmoji = (emoji: string) => {
        inputRef.current!.value = `${inputRef.current!.value} ${emoji}`;
    };

    const submit = async () => {
        const z = (await import("zod")).z;

        let schema = z.string().trim().min(1);

        try {
            let spaceName = schema.parse(inputRef.current!.value);

            const result = await backend.instance.editSpace(spaceId!, { name: spaceName, color });

            if (!result) {
                addToast({ type: "Error", message: "Something went wrong." });

                return;
            }

            navigate(location.pathname.replace(/\/(edit-space)\/(.*)/gm, ""));
        } catch (e) {
            addToast({ type: "Error", message: "The name must be 1 or more characters long." });
        }
    };

    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Modal trigger={<></>} title="Edit Space" className="max-h-[36rem] max-w-[28rem]" defaultOpen={true} onOpenChange={() => navigate(location.pathname.replace(/\/(edit-space)\/(.*)/gm, ""))}>
            <div className="relative flex h-full flex-col">
                <div className="flex h-full min-h-0 flex-grow flex-col justify-start space-y-2 overflow-y-auto p-2 scrollbar-thin">
                    <span className="label">Name</span>
                    <div className="group relative rounded-md bg-skin-secondary p-1">
                        <div className="absolute inset-y-0 right-0 flex flex-row items-center space-x-2 pr-2">
                            <EmojiPicker onSelect={(emoji) => selectEmoji(emoji)}></EmojiPicker>
                        </div>
                        <input autoFocus ref={inputRef as any} defaultValue={inputRef.current?.value} type="text" className="input w-full pr-10" placeholder="Space name..."></input>
                    </div>
                    <ColorPicker color={color} setColor={(newValue) => setColor(newValue)} gradientInput={gradientInput} setGradientInput={(newValue) => setgradientInput(newValue)}></ColorPicker>
                </div>
                <div className="absolute bottom-0 flex w-full flex-none items-center justify-end rounded-b-md bg-skin-secondary p-2">
                    <button type="button" onClick={() => submit()} className="button z-[2000] bg-skin-accent hover:bg-skin-accenthover">
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}
