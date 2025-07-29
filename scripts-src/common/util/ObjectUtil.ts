namespace ObjectUtil {

    export function deepCopy<V>(v: V): V {
        if (typeof v !== "object" || v === null) return v;
        else if (Array.isArray(v)) return v.map(deepCopy) as V; // copy array
        else if (v instanceof Date) return new Date(v) as V; // copy Date
        else return Object.fromEntries( // regular object, deep copy values
            Object.entries(v).map(([k, v]) => [k, deepCopy(v)])
        ) as V;
    }

}

export default ObjectUtil;