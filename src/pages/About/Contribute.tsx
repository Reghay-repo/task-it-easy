import { Link } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import useDocumentTitle from "../../utils/documentTitle";

export default function Contribute() {
    useDocumentTitle("Contribute");
    return (
        <div className="w-full overflow-y-auto bg-skin-base px-12 py-8 text-skin-base scrollbar-thin">
            <div className="flex max-w-4xl flex-col space-y-2">
                <h1 className="text-3xl font-extrabold">Contributing</h1>
                <span className="text-base">
                    Task it easy is an open source project and needs people to write new solutions for the task management environment. More tech info are on our GitHub page{" "}
                    <Link to="https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API" className="inline-block cursor-pointer text-skin-accent hover:underline">
                        github page
                    </Link>{" "}
                    feel free to check it out and give a star.
                </span>
                <div className="flex w-full flex-row items-center py-12">
                    <Link to="/about/future/whats-next" className="link flex flex-row items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>
                        <span>What's next?</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
