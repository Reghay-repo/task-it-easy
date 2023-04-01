import { Link } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import useDocumentTitle from "../../utils/documentTitle";

export default function WhatsNext() {
    useDocumentTitle("What's next");
    return (
        <div className="w-full overflow-y-auto bg-skin-base px-12 py-8 text-skin-base scrollbar-thin">
            <div className="flex max-w-4xl flex-col space-y-1">
                <h1 className="text-3xl font-extrabold">What's next?</h1>
                <span className="text-base">Electron support, servers, plugins and more. This session is dedicated to elaborate future features of task it easy.</span>
                <hr className="my-4" />
                <div className="my-4 flex flex-col">
                    <h2 className="mt-4 text-lg font-semibold">Electron support</h2>
                    <span>To be a true offline-first app, we need to get rid of browsers.</span>
                    <h2 className="mt-4 text-lg font-semibold">Task it easy server</h2>
                    <span>
                        A possible solution to share data is to have your own server. An easy-to-use CLI application that runs a server in the background that stores and serves data using endpoints can be a good idea. The implementations could be in
                        many languages and have different approaches as long as it implements all endspoints needed.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">Teams</h2>
                    <span>Some task/project management services on web charges every person of the team to use their infrastructure. Using a common server for everyone is more cheap and effective.</span>
                    <h2 className="mt-4 text-lg font-semibold">Shared spaces</h2>
                    <span>Sometimes you just need to share your space with someone, this could be a reality with a server.</span>
                    <h2 className="mt-4 text-lg font-semibold">Natural Processing Language for create tasks</h2>
                    <span>Now creating tasks still easy, but it could be more pleasant to just write "Check this every Sunday" then task it easy understands everything.</span>
                    <h2 className="mt-4 text-lg font-semibold">Keyboard shortcuts</h2>
                    <span>Improving the produtivity and the user experience.</span>
                    <h2 className="mt-4 text-lg font-semibold">Plugins Interface</h2>
                    <span>Instead of implmenting and making PR's people could just write and realease their own plugins.</span>
                    <h2 className="mt-4 text-lg font-semibold">Calendar and Habits</h2>
                    <span>Calendars are important piece of the workflow, a one place that centralize all your actions it's a really good idea.</span>
                </div>
                <hr className="py-2" />
                <h2 className="text-lg font-semibold">Wanna help?</h2>
                <span>Check out the next session and start contributing.</span>
                <div className="flex w-full flex-row items-center justify-between py-12">
                    <Link to="/about/get-started/manage-data" className="link flex flex-row items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>
                        <span>Manage the data</span>
                    </Link>
                    <Link to="/about/future/contribute" className="link flex flex-row items-center space-x-2">
                        <span>Contribute</span>
                        <ArrowRightIcon className="h-5 w-5"></ArrowRightIcon>
                    </Link>
                </div>
            </div>
        </div>
    );
}
