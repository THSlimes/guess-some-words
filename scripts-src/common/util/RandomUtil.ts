namespace RandomUtil {

    export function pick<T>(options: T[]): T {
        const ind = Math.floor(Math.random() * options.length);

        return options[ind];
    }

}

export default RandomUtil;