import ColorPalette from "./ColorPalette";
import AssemblyLine from "./element-factory/AssemblyLine";
import Loading from "./Loading";

Promise.all([ // make header while waiting for page load
    (async () => // make header
        AssemblyLine.fromTagName("header", {})
            .class("flex-columns")
            .children(
                AssemblyLine.fromTagName("h1", {})
                    .id("logo")
                    .text("Guess Some Words"),
                AssemblyLine.fromTagName("button", {})
                    .id("color-palette-button")
                    .children(
                        AssemblyLine.fromTagName("img", {})
                            .attr("src", `images/icons/${ColorPalette.get()}.svg`)
                    )
                    .on("click", (_, self) => {
                        const newPalette = ColorPalette.setNext();
                        self.firstElementChild!.setAttribute("src", `/images/icons/${newPalette}.svg`);
                    })
            )
            .apply()
    )(),
    (async () => // make footer
        AssemblyLine.fromTagName("footer", {})
            .class("flex", "columns")
            .children(
                AssemblyLine.fromTagName("p", {})
                    .text("Made by "),
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