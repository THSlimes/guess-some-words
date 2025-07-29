import Loading from "../common/ui/Loading";
import Placeholder from "../common/ui/Placeholder";
import "../common/ui/Responsive";
import { BUTTON } from "../common/ui/components/BUTTON";
import { LINK_BUTTON } from "../common/ui/components/LINK_BUTTON";
import "../common/ui/header-footer";

const REPOSITORY_URL = "https://github.com/THSlimes/guess-some-words";

Loading.onceDOMContentLoaded()
    .then(() => { // preset game modes menu
        Placeholder.replaceWith("classic-mode-button", BUTTON.apply({
            dictKey: "index.presets.classic",
            icon: "play-circle"
        }));

        Placeholder.replaceWith("speedrun-mode-button", BUTTON.apply({
            dictKey: "index.presets.speedrun",
            icon: "speed"
        }));

        Placeholder.replaceWith("endless-mode-button", BUTTON.apply({
            dictKey: "index.presets.endless",
            icon: "all-inclusive"
        }));
    });

Loading.onceDOMContentLoaded()
    .then(() => { // preset game modes menu
        Placeholder.replaceWith("upload-game-mode-button", BUTTON.apply({
            dictKey: "index.custom.upload",
            icon: "upload"
        }));

        Placeholder.replaceWith("docs-button", LINK_BUTTON.apply({
            dictKey: "index.presets.docs",
            href: REPOSITORY_URL
        }));
    });