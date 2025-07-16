import Responsive from "./Responsive";

export type IconName =
    "dark-mode" |
    "heart-smile" |
    "light-mode" |
    "nature" |
    "set-meal" |
    "settings" |
    "theaters" |
    "contrast" |
    "contrast-circle" |
    "trail-length" |
    "trail-length-short" |
    "nl-flag" |
    "us-flag" |
    "fullscreen" |
    "fullscreen-exit";

const parser = new DOMParser();

export default function loadIcon(name: IconName): Promise<SVGElement> {
    return fetch(`images/icons/${name}.svg`)
        .then(res => {
            if (res.ok) return res.text();
            else throw new Error("icon SVG not found");
        })
        .then(text => parser.parseFromString(text, "image/svg+xml"))
        .then(doc => {
            const svgElement = doc.firstChild;

            if (svgElement instanceof SVGElement) {
                svgElement.classList.add("icon");
                svgElement.setAttribute("icon-name", name);
                return svgElement;
            }
            else throw new TypeError("invalid SVG");
        })
}