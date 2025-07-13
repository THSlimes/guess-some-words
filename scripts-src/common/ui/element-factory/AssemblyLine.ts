type ClassName = string | false;
type AttrName = string | false | null;
type AttrValue = string | null;
type Child<Ctx> = string | Element | AssemblyLine<any, Ctx> | null | false;

class AssemblyLine<E extends HTMLElement, Ctx> {

    private readonly mold: AssemblyLine.Mold<E, Ctx>;
    private readonly defaultCtx: Readonly<Ctx>;

    private constructor(mold: AssemblyLine.Mold<E, Ctx>, defaultCtx: Ctx) {
        this.mold = mold;
        this.defaultCtx = Object.freeze(defaultCtx);
    }

    private addStep(step: AssemblyLine.Step<E, Ctx>): AssemblyLine<E, Ctx> {
        return new AssemblyLine(ctx => {
            const { e, ctx: newCtx } = this.mold(ctx);
            return step(e, newCtx);
        }, this.defaultCtx);
    }

    /**
     * Adds a step to set the ID of the element.
     * @param id new ID for the element
     */
    public id(id: AssemblyLine.DynValue<string, E, Ctx>): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            e.id = AssemblyLine.DynValue.resolve(id, e, ctx);

            return { e, ctx };
        });
    }

    /**
     * Adds a step to add classes to the element.
     * @param classes new classes for the element (Note: falsy values are ignored. If a value contains whitespace, each word is used as a class name.)
     */
    public class(...classes: AssemblyLine.DynValue<ClassName | (ClassName)[], E, Ctx>[]): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            for (const classList of classes) {
                e.classList.add(
                    ...[AssemblyLine.DynValue.resolve(classList, e, ctx)]
                        .flat()
                        .filter(c => c) // take truthy values
                        .map(c => c.toString().split(/\W+/)) // split words
                        .flat() // flatten to array of words
                );
            }

            return { e, ctx };
        });
    }

    /**
     * Adds a step to add an attribute to the element.
     * @param name name for the attribute (Note: falsy values are ignored)
     * @param value value for the attribute (Note: `null` value will not add the attribute)
     */
    public attr(name: AssemblyLine.DynValue<AttrName, E, Ctx>, value?: AssemblyLine.DynValue<AttrValue, E, Ctx>): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            const attrName = AssemblyLine.DynValue.resolve(name, e, ctx);

            if (attrName) { // falsy values are ignored
                if (value) {
                    const attrValue = AssemblyLine.DynValue.resolve(value, e, ctx);
                    if (attrValue !== null) e.setAttribute(attrName, attrValue);
                }
                else e.toggleAttribute(attrName, true); // no-value attribute
            }

            return { e, ctx };
        });
    }

    /**
     * Adds a step to add multiple attributes to the element.
     * @param attributes name-to-value mapping of attributes (Note: any entries with `null` value are ignored)
     */
    public attrs(attributes: AssemblyLine.DynValue<Record<string, AttrValue>, E, Ctx>): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            const resolvedAttrs = AssemblyLine.DynValue.resolve(attributes, e, ctx);

            for (const attrName in resolvedAttrs) {
                const attrValue = resolvedAttrs[attrName];

                if (attrValue !== null) e.setAttribute(attrName, attrValue);
            }

            return { e, ctx };
        });
    }

    /**
     * Adds a step to append children to the element.
     * @param children children (Note: any `null` or `false` values are ignored)
     */
    public children(...children: AssemblyLine.DynValue<Child<Ctx> | Child<Ctx>[], E, Ctx>[]): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            for (const childList of children) {
                const resolvedChildren = [AssemblyLine.DynValue.resolve(childList, e, ctx)].flat();

                for (const child of resolvedChildren) {
                    if (typeof child === "string") e.appendChild(document.createTextNode(child));
                    else if (child instanceof Element) e.appendChild(child);
                    else if (child instanceof AssemblyLine) e.appendChild(child.apply(ctx));
                }

            }

            return { e, ctx };
        });
    }

    /**
     * Adds a step to set the textContent of the element.
     * @param text new text for the element
     */
    public text(text: AssemblyLine.DynValue<string, E, Ctx>): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            e.textContent = AssemblyLine.DynValue.resolve(text, e, ctx);

            return { e, ctx };
        });
    }

    /**
     * Adds a step that attaches an event handler to the element.
     * @param k event keyword
     * @param handler event handler
     */
    public on<K extends keyof HTMLElementEventMap>(k: K, handler: (ev: HTMLElementEventMap[K], self: E, ctx: Ctx) => void): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            e.addEventListener(k, ev => handler(ev, e, ctx));

            return { e, ctx };
        });
    }

    /**
     * Adds a step that attaches a _single-use_ event handler to the element.
     * @param k event keyword
     * @param handler event handler
     */
    public once<K extends keyof HTMLElementEventMap>(k: K, handler: (ev: HTMLElementEventMap[K], self: E, ctx: Ctx) => void): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            e.addEventListener(k, ev => handler(ev, e, ctx), { once: true });

            return { e, ctx };
        });
    }

    public do(callback: (self: E, ctx: Ctx) => void): AssemblyLine<E, Ctx> {
        return this.addStep((e, ctx) => {
            callback(e, ctx);

            return { e, ctx };
        });
    }

    public apply(ctx: Partial<Ctx> = {}): E {
        const resolvedCtx: Ctx = { ...this.defaultCtx, ...ctx }; // apply default values

        return this.mold(resolvedCtx).e;
    }

    public copy(): AssemblyLine<E, Ctx> {
        return new AssemblyLine(this.mold, this.defaultCtx);
    }



    public static fromTagName<TN extends keyof HTMLElementTagNameMap, Ctx>(tagName: TN, defaultContext: Ctx): AssemblyLine<HTMLElementTagNameMap[TN], Ctx> {
        return new AssemblyLine(ctx => {
            return { e: document.createElement(tagName), ctx };
        }, defaultContext);
    }

}

namespace AssemblyLine {

    /** A Mold is a function which initializes an Element, given the context. */
    export type Mold<E extends HTMLElement, Ctx> = (ctx: Ctx) => { e: E, ctx: Ctx };
    /** A Step is a function which modifies the Element and/or the context. */
    export type Step<E extends HTMLElement, Ctx> = (self: E, ctx: Ctx) => { e: E, ctx: Ctx };

    /** Type of values which can be dynamically evaluated */
    type Dynable<E extends HTMLElement, Ctx> =
        string |
        number |
        bigint |
        boolean |
        undefined |
        symbol |
        null |
        Element |
        AssemblyLine<any, Ctx> |
        Dynable<E, Ctx>[] |
        { [k: string]: Dynable<E, Ctx> };
    /** A DynValue is either a value, or a function which evaluates to a value. */
    export type DynValue<T extends Dynable<E, Ctx>, E extends HTMLElement, Ctx> = T | ((e: E, ctx: Ctx) => T);
    export namespace DynValue {

        /**
         * Evaluates a DynValue
         * @param dynValue DynValue to evaluate
         * @param e Element
         * @param ctx context
         * @returns the dynamically evaluated value
         */
        export function resolve<T extends Dynable<E, Ctx>, E extends HTMLElement, Ctx>(dynValue: DynValue<T, E, Ctx>, e: E, ctx: Ctx): T {
            return typeof dynValue === "function" ? dynValue(e, ctx) : dynValue;
        }

    }

}

export default AssemblyLine;