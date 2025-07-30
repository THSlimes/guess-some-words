import SharedConstants from "../common/SharedConstants";
import GameMode from "../common/engine/game-modes/GameMode";
import SerializedGameMode from "../common/engine/game-modes/SerializedGameMode";
import deserializeGameMode from "../common/engine/game-modes/deserialize-gamemode";
import "../common/ui/Responsive";
import "../common/ui/header-footer";

// load gamemode

function loadGameMode(): GameMode {
    try {
        const value = sessionStorage.getItem(SharedConstants.GAME_MODE_SESSION_STORAGE_KEY);
        if (value === null) throw new Error("no game mode was relayed");

        const obj = JSON.parse(value);
        if (!SerializedGameMode.is(obj)) throw new TypeError("invalid game mode was relayed");

        return deserializeGameMode(obj);
    }
    catch (e) {
        location.replace('/');
        throw e;
    }
}

const GAME_MODE = loadGameMode();