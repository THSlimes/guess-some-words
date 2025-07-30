import SharedConstants from "../common/SharedConstants";
import SerializedGameMode from "../common/engine/game-modes/SerializedGameMode";
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
            // preset game modes menu
            Placeholder.replaceWith("classic-mode-button", BUTTON.apply({
                dictKey: "index.presets.classic",
                icon: "play-circle",
                onClick: () => loadGameMode(fetchGameMode("./game-modes/classic.json"))
            })),
            Placeholder.replaceWith("speedrun-mode-button", BUTTON.apply({
                dictKey: "index.presets.speedrun",
                icon: "speed"
            })),
            Placeholder.replaceWith("endless-mode-button", BUTTON.apply({
                dictKey: "index.presets.endless",
                icon: "all-inclusive"
            })),


            // preset game modes menu
            Placeholder.replaceWith("upload-game-mode-button", BUTTON.apply({
                dictKey: "index.custom.upload",
                icon: "upload"
            }))
        );


        Placeholder.replaceWith("docs-button", LINK_BUTTON.apply({
            dictKey: "index.presets.docs",
            href: REPOSITORY_URL
        }));
    });

function fetchGameMode(src: string | URL): Promise<SerializedGameMode> {
    gameModeButtons.forEach(e => e.disabled = true);

    return fetch(src)
        .then(res => res.json())
        .then(obj => {
            console.log(obj);

            if (SerializedGameMode.is(obj)) return obj;
            else throw new TypeError("invalid serialized game mode");
        })
        .catch(err => {
            gameModeButtons.forEach(e => e.disabled = false);
            throw err;
        });
}

function loadGameMode(fetcher: Promise<SerializedGameMode>): Promise<void> {
    return fetcher.then(gameMode => {
        sessionStorage.setItem(SharedConstants.GAME_MODE_SESSION_STORAGE_KEY, JSON.stringify(gameMode));
        location.assign("./play.html");
    });
}