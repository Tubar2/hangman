import { createContext, useState } from "react";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
    const [player, setPlayer] = useState(null);

    return (
        <PlayerContext.Provider value={[player, setPlayer]}>
            {children}
        </PlayerContext.Provider>
    );
}

export default PlayerContext;