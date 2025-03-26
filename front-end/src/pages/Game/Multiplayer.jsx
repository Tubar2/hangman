import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Game from "/src/components/Game";

const BASE_ENDPOINT = "ws://localhost:3000/rooms/";

function newGame() {
    const word = "hello";
    const clue = "greeting";

    return {
        word: word.toUpperCase(),
        clue: clue.toUpperCase(),
        underscores: Array.from(word).map(() => "_"),
        wrongLetters: [],
        rightLetters: [],
        won: false,
        lost: false,
    };
}

export default function Multiplayer() {
    let { id } = useParams();
    const connection = useRef(null);
    const [error, setError] = useState(null);
    const [game, setGame] = useState(() => {
        return newGame();
    });

    useEffect(() => {
        function clickLetter(letter) {
            setGame(prevGame => {
                console.log("prev:", prevGame);

                if (prevGame.won || prevGame.lost) return prevGame;

                if (prevGame.word.includes(letter)) {
                    if (!prevGame.underscores.includes(letter)) {
                        return {
                            ...prevGame,
                            rightLetters: [...prevGame.rightLetters, letter],
                            underscores: prevGame.underscores.map((char, index) => prevGame.word[index] === letter ? letter : char)
                        };
                    }

                    return prevGame;

                } else if (!prevGame.wrongLetters.includes(letter)) {
                    return {
                        ...prevGame,
                        wrongLetters: [...prevGame.wrongLetters, letter]
                    }
                } else {
                    return prevGame;
                }
            })
        }

        // open websocket connection
        const ws = new WebSocket(BASE_ENDPOINT + id + "/join");

        ws.onopen = (e) => {
            console.log("opened", e);
            setError(null);
        };


        ws.onmessage = (e) => {
            console.log("message", e.data);
            clickLetter(e.data);
        };

        ws.onerror = (e) => {
            console.log("error", e);
            setError("Could not connect to room");
        };

        connection.current = ws;

        // close websocket connection
        return () => {
            connection.current.close();
        };
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }


    function broadcastClickedLetter(letter) {
        connection.current.send(letter);
    }


    return (
        <div>
            <h1>Room {id}</h1>
            <Game
                game={game}
                clickLetter={broadcastClickedLetter}
            />
        </div>
    );
}