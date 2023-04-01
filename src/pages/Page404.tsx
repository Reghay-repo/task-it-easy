import { Link } from "react-router-dom";
import Img from "../assets/404.svg";
import useDocumentTitle from "../utils/documentTitle";

export default function Page404() {
    useDocumentTitle("Not found");
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 bg-skin-base">
            <img src={Img} alt="" width={384} height={384} />
            <p className="text-4xl font-semibold text-skin-base">Dude, where's my page?</p>
            <p className="text-base text-skin-muted">Oopsie, this page doesn't exist or maybe fall a sleep! Head back to the homestead and we'll pretend this never happened.</p>
            <Link to={"/"} className="button secondary">
                Back to home
            </Link>
        </div>
    );
}
