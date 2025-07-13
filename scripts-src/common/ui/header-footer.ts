import ColorPalette from "./settings/ColorPalette";
import AssemblyLine from "./AssemblyLine";
import Loading from "./Loading";
import Responsive from "./Responsive";
import loadIcon, { IconName } from "./load-icon";
import Contrast from "./settings/Contrast";
import Motion from "./settings/Motion";

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
                        loadIcon("settings"),
                        AssemblyLine.fromTagName("button", {})
                            .id("color-palette-button")
                            .children(
                                loadIcon(PALETTE_ICONS[ColorPalette.get()])
                            )
                            .on("click", (_, self) => {
                                const newPalette = ColorPalette.setNext();

                                loadIcon(PALETTE_ICONS[newPalette])
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                        AssemblyLine.fromTagName("button", {})
                            .id("high-contrast-button")
                            .children(
                                loadIcon(CONTRAST_ICONS[Contrast.get()])
                            )
                            .on("click", (_, self) => {
                                const newContrast = Contrast.setNext();

                                loadIcon(CONTRAST_ICONS[newContrast])
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                        AssemblyLine.fromTagName("button", {})
                            .id("reduced-button")
                            .children(
                                loadIcon(MOTION_ICONS[Motion.get()])
                            )
                            .on("click", (_, self) => {
                                const newMotion = Motion.setNext();

                                loadIcon(MOTION_ICONS[newMotion])
                                    .then(icon => self.firstChild?.replaceWith(icon));
                            }),
                    )
                    .on("mouseenter", (_, self) => { // open on hover
                        if (Responsive.canHover()) {
                            self.toggleAttribute("open", true);
                            self.style.setProperty("--target-height", `${self.scrollHeight}px`);
                        }
                    })
                    .on("mouseleave", (_, self) => { // close on non-hover
                        if (Responsive.canHover()) self.toggleAttribute("open", false);
                    })
                    .on("click", (_, self) => { // if hover not available, toggle on click
                        if (!Responsive.canHover()) {
                            self.toggleAttribute("open");
                            self.style.setProperty("--target-height", `${self.scrollHeight}px`);
                        }
                    }),
            )
            .apply()
    )(),
    (async () => // make footer
        AssemblyLine.fromTagName("footer", {})
            .class("flex", "columns")
            .children(
                AssemblyLine.fromTagName("p", {})
                    .text("Made by"),
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