import { Link } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import useDocumentTitle from "../../utils/documentTitle";

export const Block = ({ text }: { text: string }) => {
    return <span className="rounded-md border border-skin-secondary bg-skin-secondaryhover px-1 py-0.5 text-sm font-semibold text-skin-base">{text}</span>;
};

export default function TheBasics() {
    useDocumentTitle("The basics");
    return (
        <div className="w-full overflow-y-auto bg-skin-base px-12 py-8 text-skin-base scrollbar-thin">
            <div className="flex max-w-4xl flex-col space-y-1">
                <h1 className="text-3xl font-extrabold ">The basics</h1>
                <span className="text-base">Task it easy is designed to be simple, just like another task management solutions the app structure is similar. Let's get started.</span>
                <hr className="my-4" />
                <div className="my-4">
                    <h2 className="mt-4 text-lg font-semibold ">Tasks</h2>
                    <span>
                        Create your tasks with a couple clicks. When tasks are created the deadline is for the current day (that's opined, we're the procrastination enemies here), but feel free to change the deadline as you wish using one date
                        shortcut or using the date picker, tasks can have a frequency, i.e, daily tasks, weekly, monthly tasks. Not less important sometimes you need to give tasks some notes, so feel free to add some.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold ">Spaces</h2>
                    <span>Spaces are meant to create a common room for tasks of the same "category". Every space have some customization, change the color or add an emoji so that it feels more "eye-catching".</span>
                    <h2 className="mt-4 text-lg font-semibold ">Workspaces</h2>
                    <span>
                        Workspaces are nothing more than a collection of spaces, you can create spaces as you wish and manage them, the challenge here is to create your own workflow using these concepts, <strong>Workspaces</strong>,{" "}
                        <strong>Spaces</strong> and <strong>Tasks</strong>, customize the theme and accent color of your workspace just to match your vibe. You can export your data <Block text=".json"></Block> file or even sync your data using google
                        sheets for free{" "}
                        <Link to="/about/get-started/manage-data" className="inline-block cursor-pointer text-skin-accent hover:underline">
                            (Check out the next session)
                        </Link>
                        . Features like colaborative spaces will be implemented in the future. Check the{" "}
                        <Link to="/about/get-started/whats-next" className="inline-block cursor-pointer text-skin-accent hover:underline">
                            What's next session
                        </Link>{" "}
                        to further info.
                    </span>
                </div>
                <hr className="py-2" />
                <h2 className="mt-4 text-lg font-semibold ">What now?</h2>
                <span>
                    That's pretty mutch it, to start using go to the{" "}
                    <Link to="/" className="inline-block cursor-pointer text-skin-accent hover:underline">
                        home page
                    </Link>{" "}
                    to create a workspace. If you're interested in the technical details, check out the next sessions.
                </span>
                <div className="flex w-full flex-row items-center justify-between py-12">
                    <Link to="/about/get-started/what-is" className="link flex flex-row items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>
                        <span>What is task it easy?</span>
                    </Link>
                    <Link to="/about/get-started/manage-data" className="link flex flex-row items-center space-x-2">
                        <span>Manage the data</span>
                        <ArrowRightIcon className="h-5 w-5"></ArrowRightIcon>
                    </Link>
                </div>
            </div>
        </div>
    );
}
