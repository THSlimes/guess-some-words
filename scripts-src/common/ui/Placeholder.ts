import AssemblyLine from "./AssemblyLine";

namespace Placeholder {

    export function replaceWith<N extends Node | string | (Node | string)[]>(id: string, node: N): N {
        const placeholder = document.querySelector(`placeholder#${id}`);
        if (!placeholder) throw new ReferenceError(`no placeholder element with id "${id}"`);

        placeholder.replaceWith(...[node].flat());

        return node;
    }

}

export default Placeholder