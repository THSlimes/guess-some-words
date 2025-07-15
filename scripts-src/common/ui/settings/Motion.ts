import Loading from "../Loading";

enum Motion {
    NORMAL = "normal",
    REDUCED = "reduced"
}
const ALL_MOTIONS = [Motion.NORMAL, Motion.REDUCED];
const DEFAULT_MOTION = Motion.NORMAL;

function isMotion(v: unknown): v is Motion {
    return Object.values(Motion).some(p => v === p);
}

namespace Motion {

    const LOCAL_STORAGE_KEY: string = "motion";
    const BODY_ATTR_NAME: string = "motion";

    /**
     * Gives the currently applied motion setting.
     */
    export function get(): Motion {
        const motion = localStorage.getItem(LOCAL_STORAGE_KEY);

        return isMotion(motion) ? motion : DEFAULT_MOTION;
    }

    /**
     * Sets the current motion setting.
     * @param motion new motion setting
     */
    export function set(motion: Motion) {
        localStorage.setItem(LOCAL_STORAGE_KEY, motion);

        Loading.onceDOMContentLoaded()
            .then(() => {
                document.body.setAttribute(BODY_ATTR_NAME, motion);
            });
    }

    /**
     * Cycles to the next motion setting.
     * @returns the new motion setting
     */
    export function setNext(): Motion {
        const currentIndex = ALL_MOTIONS.indexOf(get());

        const nextMotion = ALL_MOTIONS[(currentIndex + 1) % ALL_MOTIONS.length];
        set(nextMotion);

        return nextMotion;
    }

    // set on load
    const savedMotion = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isMotion(savedMotion)) set(savedMotion); // has saved motion setting
    else { // no saved setting, use preference
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) set(Motion.REDUCED);
        else set(DEFAULT_MOTION);
    }

}

export default Motion;