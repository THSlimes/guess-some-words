import Loading from "./Loading";

enum ColorPalette {
    DEFAULT_LIGHT = "default-light",
    DEFAULT_DARK = "default-dark",
}
const DEFAULT_PALETTE = ColorPalette.DEFAULT_LIGHT;

function isPalette(v: unknown): v is ColorPalette {
    return Object.values(ColorPalette).some(p => v === p);
}

namespace ColorPalette {

    /**
     * Sets the current color palette.
     * @param palette new palette
     */
    export function set(palette: ColorPalette) {
        localStorage.setItem("palette", palette);

        Loading.onceDOMContentLoaded()
            .then(() => {
                document.body.setAttribute("palette", palette);
            });
    }

    // set on load
    const savedPalette = localStorage.getItem("palette");
    set(isPalette(savedPalette) ? savedPalette : DEFAULT_PALETTE);

}

export default ColorPalette;