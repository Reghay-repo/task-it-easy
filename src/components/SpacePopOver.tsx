import React, { useState } from "react";
import InboxIcon from "@heroicons/react/24/solid/ArchiveBoxArrowDownIcon";
import useDebounce from "../utils/debounce";
import { getColorClass } from "../utils/colors";
import PopOver from "./PopOver";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import useGetSpacesByName from "../hooks/getSpacesByName";
import useGetSpace from "../hooks/getSpace";

interface Props {
    selected: string;
    setSelected: (value: string) => void;
}

export default function SpaceDropdown({ selected, setSelected }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [search, setSearch] = useState("");
    const debounceSearchValue = useDebounce<string>(search, 300);

    const spaceList = useGetSpacesByName(debounceSearchValue);

    const currentSpace = useGetSpace(selected);

    const handleInputChange = (event: any) => {
        const input = event.target.value;

        setSearch(input);
    };

    const handleSelectSpace = (id: string) => {
        setOpen(false);
        setSelected(id);
    };

    const SpaceItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const space = spaceList![index];

        return (
            <button style={style} key={space.id} onClick={() => handleSelectSpace(space.id)} type="button" className="bg-animation flex w-full flex-row items-center justify-between rounded-md px-2 py-1 hover:bg-skin-secondaryhover">
                <div className="flex flex-row items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${getColorClass(space.color, "bg")}`}></div>
                    <span className="text-sm text-skin-base">{space.name}</span>
                </div>
            </button>
        );
    };

    return (
        <PopOver
            trigger={
                <div className="bg-animation flex w-full flex-row items-center space-x-1 rounded-md px-2 py-1 hover:bg-skin-secondaryhover">
                    {currentSpace == undefined ? (
                        <div role="status" className="flex h-6 w-14 animate-pulse rounded-full bg-skin-secondaryhover"></div>
                    ) : (
                        <>
                            {currentSpace.id == "inbox" ? (
                                <>
                                    <InboxIcon className="h-5 w-5 text-yellow-700" />
                                    <span className="text-sm text-skin-base">Inbox</span>
                                </>
                            ) : (
                                <>
                                    <div className={`h-3 w-3 rounded-full ${getColorClass(currentSpace.color, "bg")}`}></div>

                                    <span className="text-sm text-skin-base">{currentSpace.name}</span>
                                </>
                            )}
                        </>
                    )}
                </div>
            }
            exposedOpen={open}
            setExposedOpen={setOpen}
            className="z-[1000]"
        >
            <div className="flex max-h-64 w-44 flex-col items-center space-y-1 rounded-md bg-skin-secondary py-2 shadow-md">
                <div className="border-b border-skin-secondary px-0.5 py-1">
                    <input type="text" className="input px-0.5 py-0.5 text-sm" placeholder="Search..." autoFocus={true} value={search} onChange={(event) => handleInputChange(event)}></input>
                </div>
                <div className="flex w-full flex-col space-y-2 overflow-y-auto p-1 scrollbar-thin">
                    <button onClick={() => handleSelectSpace("inbox")} type="button" className="bg-animation flex w-full flex-row items-center justify-between rounded-md px-2 py-1 hover:bg-skin-secondaryhover">
                        <div className="flex flex-row items-center space-x-2">
                            <InboxIcon className="h-4 w-4 text-yellow-700" />
                            <span className="text-sm text-skin-base">Inbox</span>
                        </div>
                    </button>
                    {spaceList?.length == 0 ? (
                        <div className="flex flex-col items-center space-y-2">
                            <span className="text-sm text-skin-base">No more spaces.</span>
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    width: "168px",
                                    height: "12rem",
                                    overflowY: "auto",
                                    scrollbarWidth: "none",
                                }}
                            >
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <FixedSizeList height={height} itemCount={spaceList?.length} itemSize={30} width={width} style={{ scrollbarWidth: "none" }}>
                                            {SpaceItem}
                                        </FixedSizeList>
                                    )}
                                </AutoSizer>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PopOver>
    );
}
