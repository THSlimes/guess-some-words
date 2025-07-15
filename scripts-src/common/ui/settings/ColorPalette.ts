import Loading from "./../Loading";

enum ColorPalette {
    DEFAULT_LIGHT = "default-light",
    DEFAULT_DARK = "default-dark",
    PLANT = "plant",
    SARDINE = "sardine",
    FILMSTRIP = "filmstrip",
    HEART = "heart"
}
const ALL_PALETTES = [
    ColorPalette.DEFAULT_LIGHT,
    ColorPalette.DEFAULT_DARK,
    ColorPalette.PLANT,
    ColorPalette.SARDINE,
    ColorPalette.FILMSTRIP,
    ColorPalette.HEART
];
const DEFAULT_PALETTE = ColorPalette.DEFAULT_LIGHT;

function isPalette(v: unknown): v is ColorPalette {
    return Object.values(ColorPalette).some(p => v === p);
}

namespace ColorPalette {

    const LOCAL_STORAGE_KEY: string = "palette";
    const BODY_ATTR_NAME: string = "palette";

    /**
     * Gives the currently applied color palette.
     */
    export function get(): ColorPalette {
        const palette = localStorage.getItem(LOCAL_STORAGE_KEY);

        return isPalette(palette) ? palette : DEFAULT_PALETTE;
    }

    /**
     * Sets the current color palette.
     * @param palette new palette
     */
    export function set(palette: ColorPalette) {
        localStorage.setItem(LOCAL_STORAGE_KEY, palette);

        Loading.onceDOMContentLoaded()
            .then(() => {
                document.body.setAttribute(BODY_ATTR_NAME, palette);
            });
    }

    /**
     * Cycles to the next ColorPalette.
     * @returns the new ColorPalette
     */
    export function setNext(): ColorPalette {
        const currentIndex = ALL_PALETTES.indexOf(get());

        const nextPalette = ALL_PALETTES[(currentIndex + 1) % ALL_PALETTES.length];
        set(nextPalette);

        return nextPalette;
    }

    // set on load
    const savedPalette = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isPalette(savedPalette)) set(savedPalette); // has saved palette
    else { // no saved palette, use preference
        if (matchMedia("(prefers-color-scheme: light)").matches) set(ColorPalette.DEFAULT_LIGHT);
        else if (matchMedia("(prefers-color-scheme: dark)").matches) set(ColorPalette.DEFAULT_DARK);
        else set(DEFAULT_PALETTE);
    }

}

export default ColorPalette;