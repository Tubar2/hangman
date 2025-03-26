import { BrowserRouter, Routes, Route } from "react-router";

import Home from './pages/Home/Home';
import SinglePlayer from './pages/SinglePlayer/SinglePlayer';

import LobbyLayout from "./pages/Lobby/Layout/Layout";
import LobbyIndex from './pages/Lobby/Index/Index';
import CreateLobby from "./pages/Lobby/Create/Create";
import JoinLobby from "./pages/Lobby/Join/Join";

// import Multiplayer from './pages/Game/Multiplayer';
import MultiplayerLobby from "./pages/Lobby/Multiplayer/Multiplayer";

import { PlayerProvider } from "./player_context";

export default function App() {

  return (
    <PlayerProvider >
      <BrowserRouter >
        <Routes >
          <Route index element={<Home />} />
          <Route path="/single-player" element={<SinglePlayer />} />
          <Route path="/lobby" element={<LobbyLayout />} >
            <Route path="/lobby"  >
              <Route index element={<LobbyIndex />} />
              <Route path="create" element={<CreateLobby />} />
              <Route path="join" element={<JoinLobby />} />
              <Route path=":id" >
                <Route path="" element={<MultiplayerLobby />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </PlayerProvider >
  )
}

