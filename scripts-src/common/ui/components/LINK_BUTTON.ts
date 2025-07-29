import { ProviderContext } from "../../engine/providers/Provider";
import AssemblyLine from "../AssemblyLine";
import loadIcon from "../load-icon";
import Language from "../settings/Language";

type LinkButtonCtx =
    { text: string, href: string | URL } |
    { dictKey: string, href: string | URL };

export const LINK_BUTTON = AssemblyLine.fromTagName<"button", LinkButtonCtx>("button", { text: "button", href: '/' })
    .class("link-button")
    .children(
        (_, ctx) => {
            if ("dictKey" in ctx) {
                const out = document.createElement("h3");
                Language.MANAGER_PROMISE.then(manager => manager.registerTextContent(ctx.dictKey, new ProviderContext(), out));
                return out;
            }
            else {
                const out = document.createElement("h3");
                out.textContent = ctx.text;
                return out;
            }
        },
        loadIcon("open-in-new", "24px")
    )
    .do((self, ctx) => self.addEventListener("click", () => window.open(ctx.href, "_blank")?.focus()));