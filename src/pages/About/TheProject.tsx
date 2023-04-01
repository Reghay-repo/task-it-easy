import { Link } from "react-router-dom";
import CallOut from "../../components/Callout";
import useDocumentTitle from "../../utils/documentTitle";

export default function WhatIs() {
    useDocumentTitle("The project");
    return (
        <div className="w-full overflow-y-auto bg-skin-base px-12 py-8 text-skin-base scrollbar-thin">
            <div className="flex max-w-4xl flex-col space-y-2">
                <h1 className="text-3xl font-extrabold text-skin-base">The project</h1>
                <span className="text-base">
                    <strong>Why build yet another task management app?</strong>
                </span>
                <span className="text-base">
                    Many online tools out there offer a good amount of features and user experience before the paywall. However, the fact that they are <strong>server-first</strong> just doesn't feel right.
                </span>
                <CallOut type="Alert" message="Do i really need to access a third party ecosystem to manage my daily tasks?" title="Problem"></CallOut>
                <span className="text-base">That's why I decided to start Task it Easy, an offline-first task management app that is totally free, anonymous, and open-source. This app has three fundamental directions:</span>
                <div className="px-4 py-2">
                    <ul className="max-w-md list-inside list-disc space-y-1 text-skin-base">
                        <li className="font-semibold">Offline-first</li>
                        <li className="font-semibold">JSON format</li>
                        <li className="font-semibold">Make it extensible</li>
                    </ul>
                </div>
                <span className="text-base">
                    The inpiration is <strong>Obsidian.md</strong> a note-taking app that have similar goals. The experience of using Obsidian for task management feels also wrong because it's primerly a note-taking app, so all plugins made feels not
                    optimal for this specific solution and task it easy also aims to provide an interface for colaborative work.
                </span>
                <hr className="my-4" />
                <div className="flex flex-col">
                    <h2 className="text-2xl font-semibold text-skin-base">Should i use?</h2>
                    <span>
                        Nowadays, there are a lot of options when it comes to task management. Task it Easy offers total control of your data. However, sometimes you don't need control, you need convenience instead, and this is perfectly
                        understandable. We're not trying to sell you anything. Our goal is to create a whole ecosystem for your workflow{" "}
                        <strong>including task and project management, calendars, habit management, collaborative spaces, and much more.</strong> So let's build this place together. Feel free to join us.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold text-skin-base">Server features</h2>
                    <span className="text-base">
                        For server features, task it easy{" "}
                        <Link to="/about/get-started/manage-data" className="cursor-pointer text-skin-accent hover:underline">
                            can be integrated with Google Sheets to sync your data to the cloud at no cost.
                        </Link>
                        For future features like collaborative spaces, you will need to pay for it, and we'll provide you with the interface, everything behind it is completely free.
                    </span>
                    <h2 className="mt-4 text-lg font-semibold text-skin-base">What to read next?</h2>
                    <span>
                        Get familiar with{" "}
                        <Link to="/about/get-started/the-basics" className="cursor-pointer text-skin-accent hover:underline">
                            the basics
                        </Link>
                        , and have fun!
                    </span>
                </div>
            </div>
        </div>
    );
}
