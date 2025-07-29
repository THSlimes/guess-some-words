import AssemblyLine from "../AssemblyLine";
import loadIcon, { IconName } from "../load-icon";

type ClickHandler<E extends HTMLElement> = (self: E, ev: MouseEvent) => void;
type ButtonCtx =
    { text: string, icon: IconName, onClick: ClickHandler<HTMLButtonElement> } |
    { text: string, onClick: ClickHandler<HTMLButtonElement> } |
    { icon: IconName, onClick: ClickHandler<HTMLButtonElement> };

export const BUTTON = AssemblyLine.fromTagName<"button", ButtonCtx>("button", { text: "button", icon: "add-person", onClick: () => { } })
    .children(
        (_, ctx) => {
            if ("text" in ctx) {
                const out = document.createElement("h3");
                out.textContent = ctx.text;
                return out;
            }
            else return null;
        },
        (_, ctx) => "icon" in ctx && loadIcon(ctx.icon, "24px")
    )
    .do((self, ctx) => self.addEventListener("click", ev => ctx.onClick(self, ev)));