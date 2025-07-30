import SharedConstants from "../common/SharedConstants";
import SerializedGamemode from "../common/engine/gamemodes/SerializedGamemode";
import Loading from "../common/ui/Loading";
import Placeholder from "../common/ui/Placeholder";
import "../common/ui/Responsive";
import { BUTTON } from "../common/ui/components/BUTTON";
import { LINK_BUTTON } from "../common/ui/components/LINK_BUTTON";
import "../common/ui/header-footer";

const REPOSITORY_URL = "https://github.com/THSlimes/guess-some-words";


let gameModeButtons: HTMLButtonElement[] = [];
Loading.onceDOMContentLoaded()
    .then(() => {
        gameModeButtons.push(
            // preset gamemodes menu
            Placeholder.replaceWith("classic-mode-button", BUTTON.apply({
                dictKey: "index.presets.classic",
                icon: "play-circle",
                onClick: () => loadGamemode(fetchGamemode("./gamemodes/classic.json"))
            })),
            Placeholder.replaceWith("speedrun-mode-button", BUTTON.apply({
                dictKey: "index.presets.speedrun",
                icon: "speed"
            })),
            Placeholder.replaceWith("endless-mode-button", BUTTON.apply({
                dictKey: "index.presets.endless",
                icon: "all-inclusive"
            })),


            // preset gamemodes menu
            Placeholder.replaceWith("upload-gamemode-button", BUTTON.apply({
                dictKey: "index.custom.upload",
                icon: "upload"
            }))
        );


        Placeholder.replaceWith("docs-button", LINK_BUTTON.apply({
            dictKey: "index.presets.docs",
            href: REPOSITORY_URL
        }));
    });

function fetchGamemode(src: string | URL): Promise<SerializedGamemode> {
    gameModeButtons.forEach(e => e.disabled = true);

    return fetch(src)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);

            if (SerializedGamemode.is(obj)) return obj;
            else throw new TypeError("invalid serialized gamemode");
        })
        .catch(err => {
            gameModeButtons.forEach(e => e.disabled = false);
            throw err;
        });
}

function loadGamemode(fetcher: Promise<SerializedGamemode>): Promise<void> {
    return fetcher.then(gameMode => {
        sessionStorage.setItem(SharedConstants.GAME_MODE_SESSION_STORAGE_KEY, JSON.stringify(gameMode));
        location.assign("./play.html");
    });
}