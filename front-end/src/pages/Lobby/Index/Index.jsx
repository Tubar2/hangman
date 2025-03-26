import { Link } from "react-router";
import "./Index.css";
import corda from "/src/assets/corda/corda-0.svg";

export default function Page() {
    return (
        <div className="lobby-page">
            <h1>Multiplayer Mode</h1>

            <img className="corda-img" src={corda} alt="corda svg" />

            <Link to="/lobby/create">
                <button>
                    Create Lobby
                </button>
            </Link>

            <Link to="/lobby/join">
                <button>
                    Join Lobby
                </button>
            </Link>
        </div>
    )
}