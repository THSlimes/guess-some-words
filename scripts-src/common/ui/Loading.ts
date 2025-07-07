import { Class } from "../../util/UtilTypes";

namespace Loading {

    let isDOMContentLoaded = false;
    window.addEventListener("DOMContentLoaded", () => isDOMContentLoaded = true);

    /**
     * Gives a Promise that resolves once the DOM content is loaded.
     * @returns Promise that resolves once the DOM content is loaded
     */
    export function onceDOMContentLoaded(): Promise<void> {
        if (isDOMContentLoaded) return Promise.resolve();
        else return new Promise(resolve => {
            window.addEventListener("DOMContentLoaded", () => resolve());
        });
    }



    /**
     * A NoSuchIdError is a type of Error that should be thrown when an element
     * with a specific ID cannot be found.
     */
    export class NoSuchIdError extends Error {

        public constructor(id: string) {
            super(`No element with ID "${id}"`);
        }

    }

    /**
     * Finds an Element in the document with the given id and of the given class.
     * @param id element's ID
     * @param elementCls element's class
     * @returns Element with `id` of type `elementCls`
     *
     * @throws NoSuchIdError if no element has the given ID
     * @throws TypeError if the element is of an incorrect type
     */
    export function getElementById<E extends Element>(id: string, elementCls: Class<E>): E {
        const elem = document.getElementById(id);

        if (elem === null) throw new NoSuchIdError(id);
        else if (!(elem instanceof elementCls)) throw new TypeError(`Element with ID "${id}" is not a ${elementCls.name}, was "${elem.constructor.name}" instead`);

        return elem;
    }

}

export default Loading;