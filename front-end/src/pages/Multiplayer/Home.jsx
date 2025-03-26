import { Link } from 'react-router';
import './Home.css';
import BackArrow from '/src/components/BackArrow/BackArrow';
import Corda from '/src/components/Corda/Corda';

export default function Home() {
    return (
        <>
            <header>
                <Link to='/'>
                    <BackArrow />
                </Link>
            </header>
            <main>
                <div className='corda-0'>
                    <Corda className='foo' idx={0} />
                    <h1>Modo Multiplayer</h1>
                    <div>
                        <Link
                            to='/lobby/create'
                        >
                            <button>Criar</button>
                        </Link>
                        <Link
                            to='/lobby/join'
                        >
                            <button>Entrar</button>
                        </Link>
                    </div>
                </div>

            </main>
        </>
    )
}