namespace FunctionUtil {

    export function curry<First, Rest extends any[], O>(firstArg: First, funct: (first: First, ...args: Rest) => O): (...args: Rest) => O {
        return (...args) => funct(firstArg, ...args);
    }

}

export default FunctionUtil