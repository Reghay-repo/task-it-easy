import { Link } from "react-router-dom";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import useDocumentTitle from "../../utils/documentTitle";
import ClipBoardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import { Block } from "./TheBasics";
import CallOut from "../../components/Callout";
import useCopyToClipboard from "../../hooks/copyToClipboards";
import { useToastStore } from "../../stores/toast";

export default function ManageData() {
    useDocumentTitle("Manage data");

    const { addToast } = useToastStore();

    const [value, copy] = useCopyToClipboard();

    const handleCopyToClipboard = async () => {
        const useSheetsFunc = (await import("../../utils/useSheetsFunc")).default;

        copy(useSheetsFunc);

        addToast({ type: "Info", message: "Copied!" });
    };

    return (
        <div className="w-full overflow-y-auto bg-skin-base px-12 py-8 text-skin-base scrollbar-thin">
            <div className="flex max-w-4xl flex-col space-y-1">
                <h1 className="text-3xl font-extrabold">Data model</h1>
                <span className="text-base">To be a offline-first aplication Task it easy uses the IndexedDB API for read and store pretty much everything, like workspace info, tasks, spaces and emoji cache.</span>
                <CallOut type="Warning" message="Deleting your browser data also deletes taskt it easy data."></CallOut>
                <hr className="my-4" />
                <div className="my-4 flex flex-col">
                    <h2 className="mt-4 text-lg font-semibold">IndexedDB</h2>
                    <span>
                        IndexedDB is a database provided by your browser to storage significant amounts of structured data. This API uses indexes to enable high-performance searches.{" "}
                        <Link to="https://developer.mozilla.org/fr/docs/Web/API/IndexedDB_API" className="inline-block cursor-pointer text-skin-accent hover:underline">
                            Read the documentation here
                        </Link>{" "}
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">How it works</h2>
                    <span>
                        During the use of the app, just a fraction of the data is loaded in the memory and every action to create, edit, delete data is directly written in IndexedDB. This means that the user interface just shows the data to the user
                        and not the other way around.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">Dexie</h2>
                    <span>
                        Dexie was the library chosen to wrap the IndexedDB, live queries made the DEV job easy.{" "}
                        <Link to="https://dexie.org/" className="inline-block cursor-pointer text-skin-accent hover:underline">
                            Check out this library here
                        </Link>{" "}
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">Browser profiles</h2>
                    <span>If your browser supports profiles, that means you can have multiple instances of task it easy running because profiles have its own partition in the browser data structure.</span>
                    <hr className="my-4" />
                    <h2 className="mt-4 text-3xl font-semibold">Open your session on another machine/browser</h2>
                    <span>The fact that task it easy if a offline-first app makes this problem quite tricky. We offer you 3 solutions that:</span>
                    <h2 className="mt-4 text-lg font-semibold">Sync with Google Sheets (recommended)</h2>
                    <span className="text-base">
                        First, create a new sheet on your google account and make sure that there is 3 pages called: <strong>"Workspace", "Tasks" and "Spaces"</strong>. Go to <Block text="Extensions > Apps script" /> and a new tab will open. On the
                        file <Block text="Code.gs" /> paste{" "}
                        <span onClick={() => handleCopyToClipboard()} className="link inline-flex cursor-pointer flex-row items-center space-x-2">
                            this code
                            <ClipBoardDocumentIcon className="h-4 w-4 flex-none"></ClipBoardDocumentIcon>.
                        </span>
                    </span>
                    <span className="mt-3">
                        Then go to <Block text="Deply > New deploy" /> select <strong>Web app</strong> for the type of your application, give it a description and make sure that everyone can access your applicaiton. After all that hit the "Deploy"
                        button and authorize the app. Now, copy the Web app URL, go to <Block text="Workspace settings > Google Sheets" /> hit the button activate and paste on the URL field, save your workspace and we're done, now every action will
                        be synchronized with your sheets. To open your data on another browser/machine select <Block text="Google Sheets" /> tab on the home page then paste the web app URL.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">Export and import the workspace data</h2>
                    <span className="text-base">
                        Go to <Block text="Workspace settings > Export" /> to get your <Block text="Workspace-data.json" />, save this file on your computer then load on the home page.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold">Use your own server</h2>
                    <span className="text-base">Still not implemented.</span>
                    <span className="mt-4">
                        We still working on the features so if you want to contribute please check the <strong>Future session</strong>.
                    </span>
                </div>
                <hr className="py-2" />
                <h2 className="text-lg font-semibold">What now?</h2>
                <span>Now that you know the technical details behind task it easy, read more about the future of this project</span>
                <div className="flex w-full flex-row items-center justify-between py-12">
                    <Link to="/about/get-started/the-basics" className="link flex flex-row items-center space-x-2">
                        <ArrowLeftIcon className="h-5 w-5"></ArrowLeftIcon>
                        <span>The basics</span>
                    </Link>
                    <Link to="/about/future/whats-next" className="link flex flex-row items-center space-x-2">
                        <span>What's next?</span>
                        <ArrowRightIcon className="h-5 w-5"></ArrowRightIcon>
                    </Link>
                </div>
            </div>
        </div>
    );
}
