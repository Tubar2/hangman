import podium from '/src/assets/podium.svg'
import forca from '/src/assets/forca-home.svg'
import { Link } from 'react-router'

import './Home.css';

export default function Home() {
    return (
        <>
            <main>
                <section className='game-menu'>
                    <h1>Jogar</h1>
                    <Link
                        to='/single-player'
                    >
                        <button className='play-button'>Jogar</button>
                    </Link>

                    <button className='podium-button'>
                        <img src={podium} alt="podium image" />
                    </button>

                    <Link
                        to='/lobby'
                    >
                        <button className='room-button'>Multiplayer</button>
                    </Link>
                </section>

                <div className='image-container'>
                    <img src={forca} alt="forca image" />
                </div>
            </main>

            <footer></footer>
        </>
    )
}