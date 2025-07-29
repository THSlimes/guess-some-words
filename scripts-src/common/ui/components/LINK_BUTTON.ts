import AssemblyLine from "../AssemblyLine";
import loadIcon from "../load-icon";

interface LinkButtonCtx { text: string, href: string | URL };

export const LINK_BUTTON = AssemblyLine.fromTagName<"button", LinkButtonCtx>("button", { text: "button", href: '/' })
    .class("link-button")
    .children(
        (_, ctx) => {
            if ("text" in ctx) {
                const out = document.createElement("h3");
                out.textContent = ctx.text;
                return out;
            }
            else return null;
        },
        loadIcon("open-in-new", "24px")
    )
    .do((self, ctx) => self.addEventListener("click", () => window.open(ctx.href, "_blank")?.focus()));