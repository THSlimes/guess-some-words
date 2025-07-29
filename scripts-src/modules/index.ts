import Loading from "../common/ui/Loading";
import Placeholder from "../common/ui/Placeholder";
import "../common/ui/Responsive";
import { BUTTON } from "../common/ui/components/BUTTON";
import { LINK_BUTTON } from "../common/ui/components/LINK_BUTTON";
import "../common/ui/header-footer";

const REPOSITORY_URL = "https://github.com/THSlimes/guess-some-words";

Loading.onceDOMContentLoaded()
    .then(() => { // preset gamemodes menu
        Placeholder.replaceWith("classic-mode-button", BUTTON.apply({
            text: "Classic",
            icon: "play-circle"
        }));

        Placeholder.replaceWith("speedrun-mode-button", BUTTON.apply({
            text: "Speedrun",
            icon: "speed"
        }));

        Placeholder.replaceWith("endless-mode-button", BUTTON.apply({
            text: "Endless",
            icon: "all-inclusive"
        }));
    });

Loading.onceDOMContentLoaded()
    .then(() => { // preset gamemodes menu
        Placeholder.replaceWith("upload-game-mode-button", BUTTON.apply({
            text: "Classic",
            icon: "play-circle"
        }));

        Placeholder.replaceWith("docs-button", LINK_BUTTON.apply({
            text: "Docs",
            href: REPOSITORY_URL
        }));
    });