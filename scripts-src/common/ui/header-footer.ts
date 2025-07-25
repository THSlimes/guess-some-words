import ColorPalette from "./settings/ColorPalette";
import AssemblyLine from "./AssemblyLine";
import Loading from "./Loading";
import Responsive from "./Responsive";
import loadIcon, { IconName } from "./load-icon";
import Contrast from "./settings/Contrast";
import Motion from "./settings/Motion";
import Language from "./settings/Language";

const PALETTE_ICONS: Record<ColorPalette, IconName> = {
    [ColorPalette.DEFAULT_LIGHT]: "light-mode",
    [ColorPalette.DEFAULT_DARK]: "dark-mode",
    [ColorPalette.PLANT]: "nature",
    [ColorPalette.SARDINE]: "set-meal",
    [ColorPalette.FILMSTRIP]: "theaters",
    [ColorPalette.HEART]: "heart-smile"
};

const CONTRAST_ICONS: Record<Contrast, IconName> = {
    [Contrast.NORMAL]: "contrast",
    [Contrast.HIGH]: "contrast-circle"
}

const MOTION_ICONS: Record<Motion, IconName> = {
    [Motion.NORMAL]: "trail-length",
    [Motion.REDUCED]: "trail-length-short"
}

const LANGUAGE_ICONS: Record<Language, IconName> = {
    [Language.ENGLISH]: "us-flag",
    [Language.DUTCH]: "nl-flag"
}

Promise.all([ // make header while waiting for page load
    (async () => // make header
        AssemblyLine.fromTagName("header", {})
            .class("flex-columns")
            .children(
                AssemblyLine.fromTagName("h1", {})
                    .id("logo")
                    .text("Guess Some Words"),
                AssemblyLine.fromTagName("div", {})
                    .id("settings-dropdown")
                    .class("flex", "rows")
                    .children(
                        loadIcon("settings", "40px"),
                        AssemblyLine.fromTagName("div", {})
                            .class("hr"),
                        AssemblyLine.fromTagName("button", {})
                            .id("language-button")
                            .phraseTooltip("header.settings.language")
                            .children(
                                loadIcon(LANGUAGE_ICONS[Language.get()], "40px")
                            )
                            .on("click", (_, self) => {
                                const newLanguage = Language.setNext();

                                loadIcon(LANGUAGE_ICONS[newLanguage], "40px")
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                        AssemblyLine.fromTagName("button", {})
                            .id("color-palette-button")
                            .phraseTooltip("header.settings.colorPalette")
                            .children(
                                loadIcon(PALETTE_ICONS[ColorPalette.get()], "40px")
                            )
                            .on("click", (_, self) => {
                                const newPalette = ColorPalette.setNext();

                                loadIcon(PALETTE_ICONS[newPalette], "40px")
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                        document.fullscreenEnabled && AssemblyLine.fromTagName("button", {})
                            .id("fullscreen-button")
                            .phraseTooltip("header.settings.fullscreen")
                            .children(
                                loadIcon("fullscreen", "40px")
                            )
                            .on("click", (_, self) => {
                                if (document.fullscreenElement) document.exitFullscreen();
                                else document.body.requestFullscreen({ navigationUI: "hide" });
                            })
                            .do(self => document.addEventListener("fullscreenchange", () => {
                                loadIcon(document.fullscreenElement ? "fullscreen-exit" : "fullscreen", "40px")
                                    .then(icon => self.firstElementChild?.replaceWith(icon))
                            })),
                        AssemblyLine.fromTagName("button", {})
                            .id("high-contrast-button")
                            .phraseTooltip("header.settings.contrast")
                            .children(
                                loadIcon(CONTRAST_ICONS[Contrast.get()], "40px")
                            )
                            .on("click", (_, self) => {
                                const newContrast = Contrast.setNext();

                                loadIcon(CONTRAST_ICONS[newContrast], "40px")
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                        AssemblyLine.fromTagName("button", {})
                            .id("reduced-motion-button")
                            .phraseTooltip("header.settings.reducedMotion")
                            .children(
                                loadIcon(MOTION_ICONS[Motion.get()], "40px")
                            )
                            .on("click", (_, self) => {
                                const newMotion = Motion.setNext();

                                loadIcon(MOTION_ICONS[newMotion], "40px")
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                    )
                    .on("mouseenter", (_, self) => { // open on hover
                        if (Responsive.getViewport() > Responsive.Viewport.TABLET && Responsive.canHover()) {
                            self.toggleAttribute("open", true);
                            self.style.setProperty("--target-height", `${self.scrollHeight}px`);
                        }
                    })
                    .on("mouseleave", (_, self) => { // close on non-hover
                        if (Responsive.getViewport() > Responsive.Viewport.TABLET && Responsive.canHover()) self.toggleAttribute("open", false);
                    })
                    .on("click", (_, self) => { // if hover not available, toggle on click
                        if (Responsive.getViewport() <= Responsive.Viewport.TABLET || !Responsive.canHover()) {
                            self.toggleAttribute("open");
                            self.style.setProperty("--target-height", `${self.scrollHeight}px`);
                        }
                    })
                    .do(self =>
                        new MutationObserver(() => self.style.setProperty("--target-height", `${self.scrollHeight}px`))
                            .observe(self, { childList: true, subtree: true })
                    ),
            )
            .apply()
    )(),
    (async () => // make footer
        AssemblyLine.fromTagName("footer", {})
            .class("flex", "columns")
            .children(
                AssemblyLine.fromTagName("p", {})
                    .phraseText("footer.madeBy"),
                AssemblyLine.fromTagName('a', {})
                    .text("THSlimes")
                    .attr("href", "https://github.com/THSlimes")
            )
            .apply()
    )(),
    Loading.onceDOMContentLoaded()
]).then(([header, footer]) => {
    document.body.prepend(header);
    document.body.append(footer);
});



// DEBUG

Loading.onceDOMContentLoaded()
    .then(() => Loading.getElementById("panel", HTMLDivElement))
    .then(panel => {
        panel.append(
            AssemblyLine.fromTagName('p', {})
                .text("language: " + Language.get())
                .apply(),
            AssemblyLine.fromTagName('p', {})
                .text("palette: " + ColorPalette.get())
                .apply(),
            AssemblyLine.fromTagName('p', {})
                .text("contrast: " + Contrast.get())
                .apply(),
            AssemblyLine.fromTagName('p', {})
                .text("motion: " + Motion.get())
                .apply(),

            AssemblyLine.fromTagName("hr", {}).apply(),

            AssemblyLine.fromTagName('p', {})
                .text("viewport: " + Responsive.getViewport())
                .do(self => Responsive.onViewportChanged(vp => self.textContent = "viewport: " + vp))
                .apply(),
            AssemblyLine.fromTagName('p', {})
                .text("can hover: " + Responsive.canHover())
                .do(self => Responsive.onHoverChanged(h => self.textContent = "can hover: " + h))
                .apply(),
            AssemblyLine.fromTagName('p', {})
                .text("pointer accuracy: " + Responsive.getPointerAccuracy())
                .do(self => Responsive.onPointerChanged(pa => self.textContent = "pointer accuracy: " + pa))
                .apply(),
            AssemblyLine.fromTagName('p', {})
                .text("resolution: " + Responsive.getResolution())
                .do(self => Responsive.onResolutionChanged(r => self.textContent = "resolution: " + r))
                .apply(),
        );
    });