import './Create.css';
import { useNavigate } from "react-router";
import PlayerContext from '../../../player_context';


export default function CreateLobby() {
    let navigate = useNavigate();

    function createLobby(data) {
        const lobby_name = data.get('lobby-name');
        const player_name = data.get('player-name')

        async function createLobby() {
            const response = await fetch('http://localhost:3000/lobby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lobby_name,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create lobby');
            }

            const lobby = await response.json();

            sessionStorage.setItem("player_name", player_name);

            navigate(`/lobby/${lobby.id}`);
        }

        createLobby().
            catch(() => {
                alert('Failed to create lobby');
            });
    }

    return (
        <div className='create-page'>
            <form action={createLobby} autoComplete='off'>
                <h1>Create a Lobby</h1>
                <label >
                    <input name='lobby-name' id='lobby-name' type="text" placeholder="Lobby Name" />
                </label>
                <label>
                    <input name='player-name' id='player-name' type="text" placeholder="User Name" />
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}