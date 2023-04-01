import React, { useEffect, useRef, useState } from "react";
import { Emoji, EmojiGroup } from "../types";
import EmojiIcon from "@heroicons/react/24/outline/FaceSmileIcon";
import SearchIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import PopOver from "./PopOver";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import emojis from "../data/EmojiCacheDB";

interface Props {
    onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ onSelect }: Props) {
    const [group, setGroup] = useState<EmojiGroup>("Smileys & Emotion");
    const [data, setData] = useState<Emoji[] | undefined>(undefined);
    const [searchEmoji, setSearchEmoji] = useState<string>("");
    const timeout = useRef<any>();

    const handleSearchEmoji = (event: any) => {
        const input = event.target.value;
        setSearchEmoji(event.target.value);

        return new Promise<Emoji[]>(() => {
            clearTimeout(timeout.current);

            timeout.current = setTimeout(async () => {
                timeout.current = null;
                setData(undefined);

                const theresCache = await emojis.exists();
                let data: Emoji[] = [];

                if (input == "") {
                    data = theresCache ? await emojis.loadEmojisByGroup(group) : await emojis.loadOfflineEmojisByGroup(group);
                } else {
                    if (theresCache) {
                        data = await emojis.loadEmojisByName(input);

                        if (data.length === 0) {
                            data = await emojis.loadEmojisByGroup(group);
                        }
                    } else {
                        data = await emojis.loadOfflineEmojisByName(input);

                        if (data.length === 0) {
                            data = await emojis.loadOfflineEmojisByGroup(group);
                        }
                    }
                }

                setData(data);
            }, 300);
        });
    };

    useEffect(() => {
        let controller = new AbortController();

        const loader = async () => {
            setData(undefined);

            const theresCache = await emojis.exists();

            if (!theresCache) {
                const resultFetch = await emojis.fetchEmojis(controller);
                let data: Emoji[] = [];

                data = resultFetch ? await emojis.loadEmojisByGroup(group) : await emojis.loadOfflineEmojisByGroup(group);

                setData(data);
            } else {
                const data = await emojis.loadEmojisByGroup(group);

                setData(data);
            }

            return () => controller.abort();
        };

        loader();
    }, [group]);

    const handleChangeCategory = (group: EmojiGroup) => {
        setGroup(group);
    };

    const EmojiItem = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
        const index = 8 * rowIndex + columnIndex;
        const emoji = data![index];

        if (!emoji) return <></>;

        return (
            <button style={{ ...style }} key={index} onClick={() => onSelect(emoji.char)} type="button" className="bg-animation flex-none rounded-sm p-1 hover:bg-skin-secondaryhover">
                {emoji.char}
            </button>
        );
    };

    return (
        <PopOver trigger={<EmojiIcon className="bg-animation h-6 w-6 text-skin-base outline-none focus:outline-none hover:text-yellow-600" />} className="z-[300]">
            <div className="flex h-64 w-[25rem] flex-col space-y-1 rounded-md bg-skin-base shadow-lg">
                <div className="relative p-2">
                    <SearchIcon className="absolute top-4 right-4 h-5 w-5 text-skin-secondary"></SearchIcon>
                    <input autoFocus type="text" className="input w-full rounded-md bg-skin-secondary pr-8" placeholder="Search an emoji..." value={searchEmoji} onChange={handleSearchEmoji}></input>
                </div>
                {data == undefined ? (
                    <div className="flex h-full w-[26rem] items-center justify-center p-3">
                        <div role="status" className="flex w-full flex-row items-center justify-center space-x-2">
                            <svg aria-hidden="true" className="h-6 w-6 animate-spin fill-stone-400 text-stone-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="font-semibold text-skin-base">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            width: "25rem",
                            height: "12rem",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                        }}
                        className="scrollbar-thin"
                    >
                        <AutoSizer>
                            {({ height, width }) => (
                                <FixedSizeGrid className="scrollbar-thin" columnCount={8} columnWidth={49} height={height} rowCount={Math.ceil(data.length / 8)} rowHeight={32} width={width}>
                                    {EmojiItem}
                                </FixedSizeGrid>
                            )}
                        </AutoSizer>
                    </div>
                )}
                <div className="flex w-full flex-row items-center justify-evenly border-t border-skin-base p-2">
                    <button type="button" onClick={() => handleChangeCategory("Smileys & Emotion")} className={"rounded-sm p-1" + (group == "Smileys & Emotion" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        😀
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Activities")} className={"rounded-sm p-1" + (group == "Activities" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        ⚽️
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Travel & Places")} className={"rounded-sm p-1" + (group == "Travel & Places" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        🚗
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Animals & Nature")} className={"rounded-sm p-1" + (group == "Animals & Nature" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        🐶
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Food & Drink")} className={"rounded-sm p-1" + (group == "Food & Drink" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        🍎
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Objects")} className={"rounded-sm p-1" + (group == "Objects" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        ⌚️
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Flags")} className={"rounded-sm p-1" + (group == "Flags" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        🏳️
                    </button>
                    <button type="button" onClick={() => handleChangeCategory("Symbols")} className={"rounded-sm p-1" + (group == "Symbols" ? " border-b-2 border-skin-accent" : " opacity-40")}>
                        ❤️
                    </button>
                </div>
            </div>
        </PopOver>
    );
}
