import RandomUtil from "../../util/RandomUtil";
import { BinaryProvider, NullaryProvider, UnaryProvider } from "./Provider";
import { BinaryProviderCollection, UnaryProviderCollection } from "./ProviderCollection";
import { BOOLEAN, BOOLEAN_ARRAY, NUMBER, NUMBER_ARRAY, STRING, STRING_ARRAY } from "./types";

export const ALL_NULLARY_PROVIDERS: Record<string, NullaryProvider<any>> = {
    "random number": new NullaryProvider(NUMBER, Math.random),
    "random boolean": new NullaryProvider(BOOLEAN, () => Math.random() <= .5),
    timestamp: new NullaryProvider(NUMBER, Date.now),
};

export const ALL_UNARY_PROVIDERS: Record<string, UnaryProviderCollection<any>> = {
    // basics
    negate: new UnaryProviderCollection(
        "negate",
        new UnaryProvider(BOOLEAN, BOOLEAN, b => !b), // boolean negation
        new UnaryProvider(NUMBER, NUMBER, x => -x), // numeric negation
    ),
    invert: new UnaryProviderCollection(
        "invert",
        new UnaryProvider(NUMBER, NUMBER, x => 1 / x), // numeric inversion
    ),
    signum: new UnaryProviderCollection(
        "signum",
        new UnaryProvider(NUMBER, NUMBER, Math.sign),
    ),
    length: new UnaryProviderCollection(
        "length",
        new UnaryProvider(STRING, NUMBER, s => s.length),
        new UnaryProvider(STRING_ARRAY, NUMBER, s => s.length),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, s => s.length),
        new UnaryProvider(BOOLEAN_ARRAY, NUMBER, s => s.length),
    ),

    // exponents and logarithms
    square: new UnaryProviderCollection(
        "square",
        new UnaryProvider(NUMBER, NUMBER, x => x ** 2),
    ),
    sqrt: new UnaryProviderCollection(
        "square root",
        new UnaryProvider(NUMBER, NUMBER, Math.sqrt),
    ),
    cube: new UnaryProviderCollection(
        "cube",
        new UnaryProvider(NUMBER, NUMBER, x => x ** 3),
    ),
    "cube root": new UnaryProviderCollection(
        "cube root",
        new UnaryProvider(NUMBER, NUMBER, Math.cbrt),
    ),
    exp: new UnaryProviderCollection(
        "exp",
        new UnaryProvider(NUMBER, NUMBER, Math.exp),
    ),
    exp2: new UnaryProviderCollection(
        "exp2",
        new UnaryProvider(NUMBER, NUMBER, x => 2 ** x),
    ),
    exp10: new UnaryProviderCollection(
        "exp10",
        new UnaryProvider(NUMBER, NUMBER, x => 10 ** x),
    ),
    ln: new UnaryProviderCollection(
        "ln",
        new UnaryProvider(NUMBER, NUMBER, Math.log),
    ),
    log2: new UnaryProviderCollection(
        "log2",
        new UnaryProvider(NUMBER, NUMBER, Math.log2),
    ),
    log10: new UnaryProviderCollection(
        "log10",
        new UnaryProvider(NUMBER, NUMBER, Math.log10),
    ),

    // rounding
    round: new UnaryProviderCollection(
        "round",
        new UnaryProvider(NUMBER, NUMBER, Math.round),
    ),
    floor: new UnaryProviderCollection(
        "floor",
        new UnaryProvider(NUMBER, NUMBER, Math.floor),
    ),
    ceil: new UnaryProviderCollection(
        "ceil",
        new UnaryProvider(NUMBER, NUMBER, Math.ceil),
    ),

    // angles and trigonometry
    cos: new UnaryProviderCollection(
        "cos",
        new UnaryProvider(NUMBER, NUMBER, Math.cos),
    ),
    sin: new UnaryProviderCollection(
        "sin",
        new UnaryProvider(NUMBER, NUMBER, Math.sin),
    ),
    tan: new UnaryProviderCollection(
        "tan",
        new UnaryProvider(NUMBER, NUMBER, Math.tan),
    ),
    "deg to rad": new UnaryProviderCollection(
        "deg to rad",
        new UnaryProvider(NUMBER, NUMBER, x => x / 360 * 2 * Math.PI),
    ),
    "rad to deg": new UnaryProviderCollection(
        "rad to deg",
        new UnaryProvider(NUMBER, NUMBER, x => x / 2 / Math.PI * 360),
    ),

    // randomness
    pick: new UnaryProviderCollection(
        "pick",
        new UnaryProvider(NUMBER_ARRAY, NUMBER, RandomUtil.pick),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN, RandomUtil.pick),
        new UnaryProvider(STRING_ARRAY, STRING, RandomUtil.pick),
    ),

    // string manipulation
    lowercase: new UnaryProviderCollection(
        "lowercase",
        new UnaryProvider(STRING, STRING, s => s.toLocaleLowerCase())
    ),
    uppercase: new UnaryProviderCollection(
        "uppercase",
        new UnaryProvider(STRING, STRING, s => s.toLocaleUpperCase())
    ),
    capitalize: new UnaryProviderCollection(
        "capitalize",
        new UnaryProvider(STRING, STRING, s => s.charAt(0).toLocaleUpperCase() + s.substring(1))
    ),
    "capitalize all": new UnaryProviderCollection(
        "capitalize all",
        new UnaryProvider(STRING, STRING, s => s.split(' ').map(p => p.charAt(0).toLocaleUpperCase() + p.substring(1)).join(' '))
    ),
    split: new UnaryProviderCollection(
        "split",
        new UnaryProvider(STRING, STRING_ARRAY, s => s.split(' '))
    ),
    join: new UnaryProviderCollection(
        "join",
        new UnaryProvider(STRING_ARRAY, STRING, sa => sa.join(' '))
    ),
    reverse: new UnaryProviderCollection(
        "reverse",
        new UnaryProvider(STRING, STRING, s => s.split("").reverse().join("")),
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, s => s.reverse()),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, s => s.reverse()),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, s => s.reverse()),
    ),

    // list manipulation
    sort: new UnaryProviderCollection(
        "sort",
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, sa => sa.toSorted()),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, xs => xs.toSorted((x1, x2) => x1 - x2)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, ba => ba.toSorted()),
    ),
    shuffle: new UnaryProviderCollection(
        "shuffle",
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, sa => sa.toSorted(() => Math.random() - .5)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, xs => xs.toSorted(() => Math.random() - .5)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, ba => ba.toSorted(() => Math.random() - .5)),
    ),
    head: new UnaryProviderCollection(
        "head",
        new UnaryProvider(STRING, STRING, s => s.charAt(0)),
        new UnaryProvider(STRING_ARRAY, STRING, sa => {
            if (sa.length === 0) throw new RangeError("empty string array");
            return sa[0];
        }),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, sa => {
            if (sa.length === 0) throw new RangeError("empty number array");
            return sa[0];
        }),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN, sa => {
            if (sa.length === 0) throw new RangeError("empty boolean array");
            return sa[0];
        }),
    ),
    last: new UnaryProviderCollection(
        "last",
        new UnaryProvider(STRING, STRING, s => s.charAt(s.length - 1)),
        new UnaryProvider(STRING_ARRAY, STRING, sa => {
            if (sa.length === 0) throw new RangeError("empty string array");
            return sa[sa.length - 1];
        }),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, sa => {
            if (sa.length === 0) throw new RangeError("empty number array");
            return sa[sa.length - 1];
        }),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN, sa => {
            if (sa.length === 0) throw new RangeError("empty boolean array");
            return sa[sa.length - 1];
        }),
    ),
    init: new UnaryProviderCollection(
        "init",
        new UnaryProvider(STRING, STRING, s => s.slice(1)),
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, s => s.slice(1)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, s => s.slice(1)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, s => s.slice(1)),
    ),
    tail: new UnaryProviderCollection(
        "tail",
        new UnaryProvider(STRING, STRING, s => s.slice(0, -1)),
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, s => s.slice(0, -1)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, s => s.slice(0, -1)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, s => s.slice(0, -1)),
    ),

    // type conversions
    "to string": new UnaryProviderCollection(
        "to string",
        new UnaryProvider(STRING, STRING, s => s),
        new UnaryProvider(NUMBER, STRING, n => n.toString()),
        new UnaryProvider(BOOLEAN, STRING, b => b.toString()),
    ),
};

export const ALL_BINARY_PROVIDERS: Record<string, BinaryProviderCollection<any>> = {
    // math operations
    add: new BinaryProviderCollection(
        "add",
        new BinaryProvider(STRING, STRING, STRING, (s1, s2) => s1 + s2, true),
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x + y, true),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 || b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (b, x) => b ? 0 : x, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (b, s) => b ? "" : s, true),
    ),
    sub: new BinaryProviderCollection(
        "sub",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x - y),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 && !b2),
    ),
    mul: new BinaryProviderCollection(
        "mul",
        new BinaryProvider(STRING, NUMBER, STRING, (s, x) => s.repeat(Math.floor(x)) + s.substring(0, Math.round(x % 1 * s.length)), true),
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x * y, true),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 && b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (b, x) => b ? x : 0, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (b, s) => b ? s : "", true),
    ),
    div: new BinaryProviderCollection(
        "div",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x / y),
        new BinaryProvider(STRING, NUMBER, STRING, (s, x) => s.substring(0, Math.round(s.length / x))),
    ),
    mod: new BinaryProviderCollection(
        "mod",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x % y),
    ),

    // binary operations
    or: new BinaryProviderCollection(
        "or",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 || b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (b, x) => b ? 0 : x, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (b, s) => b ? "" : s, true),
    ),
    and: new BinaryProviderCollection(
        "and",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 && b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (b, x) => b ? x : 0, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (b, s) => b ? s : "", true),
    ),
    xor: new BinaryProviderCollection(
        "xor",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 !== b2, true),
    ),
    nand: new BinaryProviderCollection(
        "nand",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => !(b1 && b2), true),
    ),
    nor: new BinaryProviderCollection(
        "nor",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => !(b1 || b2), true),
    ),
    xnor: new BinaryProviderCollection(
        "xnor",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (b1, b2) => b1 === b2, true),
    ),

    // bitwise operations
    "bitwise or": new BinaryProviderCollection(
        "bitwise or",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x | y, true),
    ),
    "bitwise and": new BinaryProviderCollection(
        "bitwise and",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x & y, true),
    ),
    "bitwise xor": new BinaryProviderCollection(
        "bitwise xor",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (x, y) => x ^ y, true),
    ),

    // array manipulation
    join: new BinaryProviderCollection(
        "join",
        new BinaryProvider(STRING, STRING, STRING_ARRAY, (s1, s2) => [s1, s2]),
        new BinaryProvider(STRING, STRING_ARRAY, STRING_ARRAY, (s, sa) => [s, ...sa]),
        new BinaryProvider(STRING_ARRAY, STRING, STRING_ARRAY, (sa, s) => [...sa, s]),
        new BinaryProvider(STRING_ARRAY, STRING_ARRAY, STRING_ARRAY, (sa1, sa2) => sa1.concat(sa2)),

        new BinaryProvider(NUMBER, NUMBER, NUMBER_ARRAY, (x1, x2) => [x1, x2]),
        new BinaryProvider(NUMBER, NUMBER_ARRAY, NUMBER_ARRAY, (x, xs) => [x, ...xs]),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER_ARRAY, (xs, x) => [...xs, x]),
        new BinaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, NUMBER_ARRAY, (xs, ys) => xs.concat(ys)),

        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN_ARRAY, (b1, b2) => [b1, b2]),
        new BinaryProvider(BOOLEAN, BOOLEAN_ARRAY, BOOLEAN_ARRAY, (b, ba) => [b, ...ba]),
        new BinaryProvider(BOOLEAN_ARRAY, BOOLEAN, BOOLEAN_ARRAY, (ba, b) => [...ba, b]),
        new BinaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, BOOLEAN_ARRAY, (ba1, ba2) => ba1.concat(ba2)),
    ),

    // randomness
    "pick n": new BinaryProviderCollection(
        "pick n",
        new BinaryProvider(STRING_ARRAY, NUMBER, STRING_ARRAY, (sa, n) => sa.toSorted(() => Math.random() - .5).slice(0, n)),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER_ARRAY, (xs, n) => xs.toSorted(() => Math.random() - .5).slice(0, n)),
        new BinaryProvider(BOOLEAN_ARRAY, NUMBER, BOOLEAN_ARRAY, (ba, n) => ba.toSorted(() => Math.random() - .5).slice(0, n)),
    ),
    "pick n returned": new BinaryProviderCollection(
        "pick n returned",
        new BinaryProvider(STRING_ARRAY, NUMBER, STRING_ARRAY, (sa, n) => {
            const out: string[] = [];
            for (let i = 0; i < n; i++) out.push(sa[(Math.floor(Math.random() * sa.length))]);

            return out;
        }),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER_ARRAY, (xs, n) => {
            const out: number[] = [];
            for (let i = 0; i < n; i++) out.push(xs[(Math.floor(Math.random() * xs.length))]);

            return out;
        }),
        new BinaryProvider(BOOLEAN_ARRAY, NUMBER, BOOLEAN_ARRAY, (ba, n) => {
            const out: boolean[] = [];
            for (let i = 0; i < n; i++) out.push(ba[(Math.floor(Math.random() * ba.length))]);

            return out;
        }),
    ),
};