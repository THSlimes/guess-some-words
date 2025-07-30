import SharedConstants from "../common/SharedConstants";
import Gamemode from "../common/engine/gamemodes/Gamemode";
import SerializedGamemode from "../common/engine/gamemodes/SerializedGamemode";
import deserializeGamemode from "../common/engine/gamemodes/deserialize-gamemode";
import "../common/ui/Responsive";
import "../common/ui/header-footer";

// load gamemode

function loadGamemode(): Gamemode {
    try {
        const value = sessionStorage.getItem(SharedConstants.GAME_MODE_SESSION_STORAGE_KEY);
        if (value === null) throw new Error("no gamemode was relayed");

        const obj = JSON.parse(value);
        if (!SerializedGamemode.is(obj)) throw new TypeError("invalid gamemode was relayed");

        return deserializeGamemode(obj);
    }
    catch (e) {
        location.replace('/');
        throw e;
    }
}

const GAME_MODE = loadGamemode();