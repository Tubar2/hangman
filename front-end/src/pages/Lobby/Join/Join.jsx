import './Join.css';
import { useNavigate } from "react-router";


export default function Join() {
    let navigate = useNavigate();


    function joinLobby(data) {
        const lobby_id = data.get('lobby-id');
        const player_name = data.get('player-name');


        sessionStorage.setItem("player_name", player_name);

        navigate(`/lobby/${lobby_id}`);
    }

    return (
        <div className="join-page" >
            <h1>Join a Room</h1>
            <form action={joinLobby} >
                <input name='lobby-id' type="text" placeholder="Lobby ID" />
                <input name='player-name' type="text" placeholder="User Name" />
                <button type="submit">Join</button>
            </form>
        </div>
    );
}