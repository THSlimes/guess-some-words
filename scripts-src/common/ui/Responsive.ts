import Loading from "./Loading";

/**
 * The Responsive namespace holds helper functions to make it easier to create
 * a responsive UI.
 */
namespace Responsive {

    // aspect ratio

    /** Type of screen aspect ratio */
    export enum Viewport {
        MOBILE_SLIM = "mobile-slim",
        MOBILE = "mobile",
        TABLET = "tablet",
        DESKTOP = "desktop",
        DESKTOP_WIDE = "desktop-wide"
    }

    const VIEWPORT_ASPECT_RATIOS: Record<Viewport, { width: number, height: number }> = {
        [Viewport.DESKTOP_WIDE]: { width: 16, height: 9 },
        [Viewport.DESKTOP]: { width: 4, height: 3 },
        [Viewport.TABLET]: { width: 3, height: 4 },
        [Viewport.MOBILE]: { width: 9, height: 16 },
        [Viewport.MOBILE_SLIM]: { width: 9, height: 22 },
    };

    type ViewportChangeHandler = (vp: Viewport) => void;
    const viewportChangeHandlers: Set<ViewportChangeHandler> = new Set();
    /** Attaches a callback function that is called when the viewport updates. */
    export function onViewportChanged(handler: ViewportChangeHandler) {
        viewportChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => {
            window.addEventListener("resize", () => {
                const firstMatch = Object.values(Viewport).find(vp => {
                    const { width, height } = VIEWPORT_ASPECT_RATIOS[vp];
                    return matchMedia(`(max-aspect-ratio: ${width} / ${height})`).matches;
                }) ?? Viewport.DESKTOP_WIDE;

                document.body.setAttribute("viewport", firstMatch);
                viewportChangeHandlers.forEach(h => h(firstMatch));
            });

            window.dispatchEvent(new Event("resize"));
        });

    // hover

    type HoverChangeHandler = (canHover: boolean) => void;
    const hoverChangeHandlers: Set<HoverChangeHandler> = new Set();
    /** Attaches a callback function that is called when the hoverability changes. */
    export function onHoverChanged(handler: HoverChangeHandler) {
        hoverChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => {
            const mq = matchMedia("(hover: hover)");

            document.body.toggleAttribute("hover", mq.matches); // set initial value
            mq.addEventListener("change", ev => { // set value on update
                document.body.toggleAttribute("can-hover", ev.matches);

                hoverChangeHandlers.forEach(h => h(ev.matches));
            });
        });

    // pointer

    /** Accuracy of the main pointer device */
    export enum Pointer {
        NONE = "none",
        COARSE = "coarse",
        FINE = "fine"
    }

    const POINTER_MEDIA_QUERIES: Record<Pointer, MediaQueryList> = {
        [Pointer.NONE]: matchMedia("(pointer: none)"),
        [Pointer.COARSE]: matchMedia("(pointer: coarse)"),
        [Pointer.FINE]: matchMedia("(pointer: fine)")
    }

    type PointerChangeHandler = (vp: Pointer) => void;
    const pointerChangeHandlers: Set<PointerChangeHandler> = new Set();
    /** Attaches a callback function that is called when the pointer accuracy changes. */
    export function onPointerChanged(handler: PointerChangeHandler) {
        pointerChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => Object.values(Pointer).forEach(p => {
            const mq = POINTER_MEDIA_QUERIES[p];

            if (mq.matches) document.body.setAttribute("pointer", p); // sets initial value

            mq.addEventListener("change", ev => { // sets value on change
                if (ev.matches) {
                    document.body.setAttribute("pointer", p);
                    pointerChangeHandlers.forEach(h => h(p));
                }
            });
        }));
}

export default Responsive;