import { Link } from "react-router-dom";
import Img from "../assets/error.svg";
import useDocumentTitle from "../utils/documentTitle";

type Props = {};

export default function PageError({}: Props) {
    useDocumentTitle("Error");
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center space-y-4 bg-skin-base">
            <img src={Img} alt="" width={384} height={384} />
            <p className="text-4xl font-semibold text-skin-base">Oops, that our bad :/</p>
            <p className="text-base text-skin-muted">Looks like our server is taking a coffee break, but we promise it'll be back soon!</p>
            <Link to={"/"} className="button secondary">
                Back to home
            </Link>
        </div>
    );
}
