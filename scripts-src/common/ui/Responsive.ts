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

    const HOVER_MEDIA_QUERY = matchMedia("(hover: hover)");

    /**
     * Checks whether the user can hover over parts of the page.
     * @returns `true` if user can hover, `false` otherwise
     */
    export function canHover(): boolean {
        return HOVER_MEDIA_QUERY.matches;
    }

    type HoverChangeHandler = (canHover: boolean) => void;
    const hoverChangeHandlers: Set<HoverChangeHandler> = new Set();
    /** Attaches a callback function that is called when the hoverability changes. */
    export function onHoverChanged(handler: HoverChangeHandler) {
        hoverChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => {
            document.body.toggleAttribute("hover", HOVER_MEDIA_QUERY.matches); // set initial value
            HOVER_MEDIA_QUERY.addEventListener("change", ev => { // set value on update
                document.body.toggleAttribute("can-hover", ev.matches);

                hoverChangeHandlers.forEach(h => h(ev.matches));
            });
        });

    // pointer

    /** Accuracy of the main pointer device */
    export enum PointerAccuracy {
        NONE = "none",
        COARSE = "coarse",
        FINE = "fine"
    }

    const POINTER_MEDIA_QUERIES: Record<PointerAccuracy, MediaQueryList> = {
        [PointerAccuracy.NONE]: matchMedia("(pointer: none)"),
        [PointerAccuracy.COARSE]: matchMedia("(pointer: coarse)"),
        [PointerAccuracy.FINE]: matchMedia("(pointer: fine)")
    }

    /**
     * Determines the current pointer accuracy.
     * @returns current pointer accuracy
     */
    export function pointerAccuracy(): PointerAccuracy {
        return Object.values(PointerAccuracy).find(pa => POINTER_MEDIA_QUERIES[pa].matches) ?? PointerAccuracy.NONE;
    }

    type PointerChangeHandler = (vp: PointerAccuracy) => void;
    const pointerChangeHandlers: Set<PointerChangeHandler> = new Set();
    /** Attaches a callback function that is called when the pointer accuracy changes. */
    export function onPointerChanged(handler: PointerChangeHandler) {
        pointerChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => Object.values(PointerAccuracy).forEach(pa => {
            const mq = POINTER_MEDIA_QUERIES[pa];

            if (mq.matches) document.body.setAttribute("pointer", pa); // sets initial value

            mq.addEventListener("change", ev => { // sets value on change
                if (ev.matches) {
                    document.body.setAttribute("pointer", pa);
                    pointerChangeHandlers.forEach(h => h(pa));
                }
            });
        }));
}

export default Responsive;