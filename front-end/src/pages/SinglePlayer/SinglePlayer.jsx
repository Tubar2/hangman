import './SinglePlayer.css';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { forcaSprites } from '/src/components/Forca';
import wordBank from '/src/data/word_bank';
import Game from '/src/components/Game';


function BackArrowSVG() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M20.3284 11.0001V13.0001L7.50011 13.0001L10.7426 16.2426L9.32842 17.6568L3.67157 12L9.32842 6.34314L10.7426 7.75735L7.49988 11.0001L20.3284 11.0001Z"
                fill="currentColor"
            />
        </svg>
    )
}

function ResetGame({ onClick }) {
    return (
        <svg
            onClick={onClick}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5.33929 4.46777H7.33929V7.02487C8.52931 6.08978 10.0299 5.53207 11.6607 5.53207C15.5267 5.53207 18.6607 8.66608 18.6607 12.5321C18.6607 16.3981 15.5267 19.5321 11.6607 19.5321C9.51025 19.5321 7.58625 18.5623 6.30219 17.0363L7.92151 15.8515C8.83741 16.8825 10.1732 17.5321 11.6607 17.5321C14.4222 17.5321 16.6607 15.2935 16.6607 12.5321C16.6607 9.77065 14.4222 7.53207 11.6607 7.53207C10.5739 7.53207 9.56805 7.87884 8.74779 8.46777L11.3393 8.46777V10.4678H5.33929V4.46777Z"
                fill="currentColor"
            />
        </svg>
    )
}

function getRandomWord(wordBank) {
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    return wordBank[randomIndex];
}

function newGame() {
    const { word, clue } = getRandomWord(wordBank);
    console.log(word, clue);

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

export default function SinglePlayer() {
    const [game, setGame] = useState(() => {
        return newGame();
    });

    function clickLetter(letter) {
        setGame(prevGame => {
            if (prevGame.won || prevGame.lost) return prevGame;

            if (prevGame.word.includes(letter)) {
                if (!prevGame.rightLetters.includes(letter)) {
                    return {
                        ...prevGame,
                        rightLetters: [...prevGame.rightLetters, letter],
                        underscores: prevGame.underscores.map((char, index) => prevGame.word[index] === letter ? letter : char)
                    };
                }
            } else if (!prevGame.wrongLetters.includes(letter)) {
                return {
                    ...prevGame,
                    wrongLetters: [...prevGame.wrongLetters, letter]
                };
            }

            return prevGame;
        })

    }


    // add event listener
    useEffect(() => {
        function handleKeyPress(event) {
            clickLetter(event.key.toUpperCase());
        }

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        }
    }, []);

    function checkGameOver() {
        if (game.won || game.lost) return;

        if (!game.underscores.includes('_')) {
            setGame({
                ...game,
                won: true
            });
        } else if (game.wrongLetters.length === forcaSprites.length - 1) {
            setGame({
                ...game,
                lost: true
            });
        }
    }

    // check for game over
    checkGameOver();

    return (
        <>
            <header>
                <Link to='/'>
                    <BackArrowSVG />
                </Link>
                <ResetGame onClick={() => { setGame(newGame()) }} />

            </header>
            <main>
                <Game
                    game={game}
                    clickLetter={clickLetter}
                />

            </main>
        </>
    )
}