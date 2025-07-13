import Loading from "../Loading";

enum Contrast {
    NORMAL = "normal",
    HIGH = "high"
}
const ALL_CONTRASTS = [Contrast.NORMAL, Contrast.HIGH];
const DEFAULT_CONTRAST = Contrast.NORMAL;

function isContrast(v: unknown): v is Contrast {
    return Object.values(Contrast).some(p => v === p);
}

namespace Contrast {

    const LOCAL_STORAGE_KEY: string = "contrast";
    const BODY_ATTR_NAME: string = "contrast";

    /**
     * Gives the currently applied contrast setting.
     */
    export function get(): Contrast {
        const contrast = localStorage.getItem(LOCAL_STORAGE_KEY);

        return isContrast(contrast) ? contrast : Contrast.NORMAL;
    }

    /**
     * Sets the current contrast.
     * @param contrast new contrast
     */
    export function set(contrast: Contrast) {
        localStorage.setItem(LOCAL_STORAGE_KEY, contrast);

        Loading.onceDOMContentLoaded()
            .then(() => {
                document.body.setAttribute(BODY_ATTR_NAME, contrast);
            });
    }

    /**
     * Cycles to the next contrast setting.
     * @returns the new contrast
     */
    export function setNext(): Contrast {
        const currentIndex = ALL_CONTRASTS.indexOf(get());

        const nextContrast = ALL_CONTRASTS[(currentIndex + 1) % ALL_CONTRASTS.length];
        set(nextContrast);

        return nextContrast;
    }

    // set on load
    const savedContrast = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isContrast(savedContrast)) set(savedContrast); // has saved contrast
    else { // no saved contrast, use preference
        if (matchMedia("(prefers-contrast: more)").matches) set(Contrast.HIGH);
        else set(Contrast.NORMAL);
    }

}

export default Contrast;