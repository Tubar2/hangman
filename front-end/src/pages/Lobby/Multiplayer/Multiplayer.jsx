import './Multiplayer.css';
import { useParams } from "react-router";
import { useState, useEffect, useContext, useRef } from "react";
import PlayerContext from '/src/player_context';
import Game from '/src/components/Game';
// import Multiplayer from '../../Game/Multiplayer';


export default function Lobby() {
    let { id } = useParams();
    const connection = useRef(null);
    const [lobby, setLobby] = useState(null);
    const [error, setError] = useState(null);
    const [thisPlayer, setPlayer] = useContext(PlayerContext);


    useEffect(() => {
        console.log("using effect");

        const player_name = sessionStorage.getItem("player_name")

        const ws = new WebSocket(`ws://localhost:3000/lobby/join`);

        connection.current = ws;

        ws.onopen = () => {
            console.log("connection opened");

            ws.send(JSON.stringify({
                lobby_id: id,
                player_name: player_name,
            }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            console.log("message received:", msg);

            switch (msg.type) {
                case "set_lobby":
                    console.log("set_lobby", msg.data);
                    setLobby(msg.data);
                    break;
                case "set_player":
                    console.log("set_player", msg.data);
                    setPlayer(msg.data);
                    break;
                case "set_error":
                    console.log("set_error", msg.data);
                    setError(new Error(msg.data));
                    break;
                default:
                    console.error("Unknown message type:", msg.type);
            }

        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setError(new Error("WebSocket error"));
        };

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [id, setPlayer]);

    if (error) {
        return (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
            </div>
        );
    }

    if (!lobby || !thisPlayer) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    switch (lobby.state) {
        case "in_lobby":
            return (
                <InLobby
                    thisPlayer={thisPlayer}
                    lobby={lobby}
                    ws={connection.current}
                />
            );
        case "in_game":
            return (
                <InGame
                    lobby={lobby}
                    ws={connection.current}
                />
            );
    }

}

function InLobby({ lobby, ws, thisPlayer }) {
    return (
        <div className='in-lobby-page'>
            <h1>Lobby</h1>
            <h2 className='lobby-id'
                onClick={() => {
                    // copy to clipboard
                    navigator.clipboard.writeText(lobby.id);
                }}
            >
                Lobby ID: {lobby.id}</h2>
            <h2>Players:</h2>
            <ul>
                {lobby.players.map((player) => (
                    <li
                        key={player.name}
                    >
                        {player.name} {player.id === thisPlayer.id ? "(you)" : null}
                    </li>
                ))}
            </ul>
            <button onClick={() => {
                ws.send(JSON.stringify({
                    type: "start_game",
                }));
            }}>
                Start Game
            </button>
        </div >
    )
}

function InGame({ lobby, ws }) {
    return (
        <div className='in-game-page'>
            <Game
                game={lobby.game}
                clickLetter={(letter) => {
                    const msg = JSON.stringify({
                        type: "click_letter",
                        data: letter,
                    })
                    console.log("sending message:", msg);
                    ws.send(msg);
                }}
            />
        </div >
    )
}


