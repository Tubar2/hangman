import './Game.css';
import Forca from './Forca';


export default function Game({ game, clickLetter }) {
    return (
        <>
            <div className="game-container">
                <div className='game-board'>
                    <div>
                        {game.clue ? <p className='clue'>{game.clue}</p> : null}
                        <p className='underscores'>{game.underscores}</p>
                    </div>
                    <LetterBoard
                        onClick={clickLetter}
                        rightLetters={game.rightLetters}
                        wrongLetters={game.wrongLetters}
                    />
                </div>
                <Forca wrongLetters={game.wrongLetters} />
            </div>
        </>
    )
}

const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
const letters = Array.from(alphabet);

function LetterBoard({ onClick, rightLetters, wrongLetters }) {
    return (
        <div className='letter-board'>
            {letters.map((letter, index) => (
                <Letter
                    key={index}
                    letter={letter}
                    onClick={() => onClick(letter)}
                    className={
                        rightLetters.includes(letter) ? 'correct' :
                            wrongLetters.includes(letter) ? 'incorrect' :
                                null
                    }
                />
            ))}
        </div>
    )
}

function Letter({ letter, onClick, className }) {
    return (
        <button
            className={`
                letter
                ${className}
                `}
            onClick={onClick}
        >
            {letter}
        </button>
    )
}