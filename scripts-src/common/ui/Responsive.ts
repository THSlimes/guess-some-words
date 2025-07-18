import Loading from "./Loading";

/**
 * The Responsive namespace holds helper functions to make it easier to create
 * a responsive UI.
 */
namespace Responsive {

    // aspect ratio

    export class Viewport {

        public static readonly DESKTOP_WIDE = new Viewport("desktop-wide", 16, 9);
        public static readonly DESKTOP = new Viewport("desktop", 4, 3);
        public static readonly TABLET = new Viewport("tablet", 3, 4);
        public static readonly MOBILE = new Viewport("mobile", 9, 16);
        public static readonly MOBILE_SLIM = new Viewport("mobile-slim", 9, 22);
        public static readonly ALL: Readonly<Viewport[]> = Object.freeze([
            this.DESKTOP_WIDE,
            this.DESKTOP,
            this.TABLET,
            this.MOBILE,
            this.MOBILE_SLIM
        ]);

        public readonly name: string;
        private readonly width: number;
        private readonly height: number;
        private get ratio() {
            return this.width / this.height;
        }

        public readonly mediaQuery: MediaQueryList;

        private constructor(name: string, width: number, height: number) {
            this.name = name;
            this.width = width;
            this.height = height

            this.mediaQuery = matchMedia(`(min-aspect-ratio: ${width} / ${height})`);
        }


        public [Symbol.toPrimitive](hint: string) {
            return hint === "number" ? this.ratio : this.name;
        }

    }

    let currentViewport: Viewport | undefined = undefined;
    export function getViewport() {
        return currentViewport!;
    }

    type ViewportChangeHandler = (vp: Viewport) => void;
    const viewportChangeHandlers: Set<ViewportChangeHandler> = new Set();
    /** Attaches a callback function that is called when the viewport updates. */
    export function onViewportChanged(handler: ViewportChangeHandler) {
        viewportChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => {
            window.addEventListener("resize", () => {
                const firstMatch = Viewport.ALL.find(vp => vp.mediaQuery.matches) ?? Viewport.MOBILE_SLIM;

                if (firstMatch !== currentViewport) {
                    currentViewport = firstMatch;
                    document.body.setAttribute("viewport", currentViewport.name);
                    viewportChangeHandlers.forEach(h => h(currentViewport!));
                }
            });

            window.dispatchEvent(new Event("resize"));
        });



    // resolution

    export class Resolution {

        public static readonly TINY = new Resolution("tiny", 300);
        public static readonly SMALL = new Resolution("small", 400);
        public static readonly MEDIUM = new Resolution("medium", 600);
        public static readonly BIG = new Resolution("big", 1000);
        public static readonly ALL: Readonly<Resolution[]> = Object.freeze([
            this.BIG,
            this.MEDIUM,
            this.SMALL,
            this.TINY,
        ]);

        public readonly name: string;
        private readonly size: number;

        public readonly mediaQuery: MediaQueryList;

        private constructor(name: string, size: number) {
            this.name = name;
            this.size = size;

            this.mediaQuery = matchMedia(`(min-width: ${size}px) and (min-height: ${size / 16 * 9}px)`);
        }


        public [Symbol.toPrimitive](hint: string) {
            return hint === "number" ? this.size : this.name;
        }

    }

    let currentResolution: Resolution | undefined = undefined;
    export function getResolution() {
        return currentResolution!;
    }

    type ResolutionChangeHandler = (r: Resolution) => void;
    const resolutionChangeHandlers: Set<ResolutionChangeHandler> = new Set();
    /** Attaches a callback function that is called when the viewport updates. */
    export function onResolutionChanged(handler: ResolutionChangeHandler) {
        resolutionChangeHandlers.add(handler);
    }

    Loading.onceDOMContentLoaded()
        .then(() => {
            window.addEventListener("resize", () => {
                const firstMatch = Resolution.ALL.find(vp => vp.mediaQuery.matches) ?? Resolution.TINY;

                if (firstMatch !== currentResolution) {
                    currentResolution = firstMatch;
                    document.body.setAttribute("resolution", currentResolution.name);
                    resolutionChangeHandlers.forEach(h => h(currentResolution!));
                }
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



    // pointer accuracy

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
    export function getPointerAccuracy(): PointerAccuracy {
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