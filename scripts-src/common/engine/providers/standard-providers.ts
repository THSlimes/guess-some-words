import RandomUtil from "../../util/RandomUtil";
import { BinaryProvider, NullaryProvider, TernaryProvider, UnaryProvider } from "./Provider";
import { BinaryProviderCollection, TernaryProviderCollection, UnaryProviderCollection } from "./ProviderCollection";
import { BOOLEAN, BOOLEAN_ARRAY, BOOLEAN_ARRAY_ARRAY, NUMBER, NUMBER_ARRAY, NUMBER_ARRAY_ARRAY, STRING, STRING_ARRAY, STRING_ARRAY_ARRAY } from "../types";

export const ALL_NULLARY_PROVIDERS: Record<string, NullaryProvider<any>> = {
    "random number": new NullaryProvider(NUMBER, Math.random),
    "random boolean": new NullaryProvider(BOOLEAN, () => Math.random() <= .5),
    timestamp: new NullaryProvider(NUMBER, Date.now),
    year: new NullaryProvider(NUMBER, () => new Date().getFullYear()),
    month: new NullaryProvider(NUMBER, () => new Date().getMonth() + 1),
    day: new NullaryProvider(NUMBER, () => new Date().getDate()),
    hours: new NullaryProvider(NUMBER, () => new Date().getHours()),
    minutes: new NullaryProvider(NUMBER, () => new Date().getMinutes()),
    seconds: new NullaryProvider(NUMBER, () => new Date().getSeconds()),
    milliseconds: new NullaryProvider(NUMBER, () => new Date().getMilliseconds()),
};

export const ALL_UNARY_PROVIDERS: Record<string, UnaryProviderCollection<any>> = {
    // basics
    negate: new UnaryProviderCollection(
        "negate",
        new UnaryProvider(BOOLEAN, BOOLEAN, (_, b) => !b),
        new UnaryProvider(NUMBER, NUMBER, (_, x) => -x),
    ),
    invert: new UnaryProviderCollection(
        "invert",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => {
            if (x === 0) throw new RangeError(`cannot take multiplicative inverse of ${x}`);
            return 1 / x;
        }),
    ),
    abs: new UnaryProviderCollection(
        "abs",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.abs(x))
    ),
    signum: new UnaryProviderCollection(
        "signum",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.sign(x)),
    ),
    length: new UnaryProviderCollection(
        "length",
        new UnaryProvider(STRING, NUMBER, (_, s) => s.length),
        new UnaryProvider(STRING_ARRAY, NUMBER, (_, sa) => sa.length),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, (_, xs) => xs.length),
        new UnaryProvider(BOOLEAN_ARRAY, NUMBER, (_, ba) => ba.length),
    ),

    // exponents and logarithms
    square: new UnaryProviderCollection(
        "square",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => x ** 2),
    ),
    sqrt: new UnaryProviderCollection(
        "square root",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => {
            if (x < 0) throw new RangeError(`cannot take square root of ${x}`);
            return Math.sqrt(x);
        }),
    ),
    cube: new UnaryProviderCollection(
        "cube",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => x ** 3),
    ),
    "cube root": new UnaryProviderCollection(
        "cube root",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => {
            if (x < 0) throw new RangeError(`cannot take cube root of ${x}`);
            return Math.cbrt(x);
        }),
    ),
    exp: new UnaryProviderCollection(
        "exp",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.exp(x)),
    ),
    exp2: new UnaryProviderCollection(
        "exp2",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => 2 ** x),
    ),
    exp10: new UnaryProviderCollection(
        "exp10",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => 10 ** x),
    ),
    log: new UnaryProviderCollection(
        "log",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => {
            if (x <= 0) throw new RangeError(`cannot take log of ${x}`);
            return Math.log(x);
        }),
    ),
    log2: new UnaryProviderCollection(
        "log2",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => {
            if (x <= 0) throw new RangeError(`cannot take log2 of ${x}`);
            return Math.log2(x);
        }),
    ),
    log10: new UnaryProviderCollection(
        "log10",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => {
            if (x <= 0) throw new RangeError(`cannot take log10 of ${x}`);
            return Math.log10(x);
        }),
    ),

    // rounding
    round: new UnaryProviderCollection(
        "round",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.round(x)),
    ),
    floor: new UnaryProviderCollection(
        "floor",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.floor(x)),
    ),
    ceil: new UnaryProviderCollection(
        "ceil",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.ceil(x)),
    ),

    // angles and trigonometry
    cos: new UnaryProviderCollection(
        "cos",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.cos(x)),
    ),
    sin: new UnaryProviderCollection(
        "sin",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.sin(x)),
    ),
    tan: new UnaryProviderCollection(
        "tan",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => Math.tan(x)),
    ),
    "deg to rad": new UnaryProviderCollection(
        "deg to rad",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => x / 360 * 2 * Math.PI),
    ),
    "rad to deg": new UnaryProviderCollection(
        "rad to deg",
        new UnaryProvider(NUMBER, NUMBER, (_, x) => x / 2 / Math.PI * 360),
    ),

    // randomness
    pick: new UnaryProviderCollection(
        "pick",
        new UnaryProvider(STRING_ARRAY, STRING, (_, sa) => RandomUtil.pick(sa)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN, (_, ba) => RandomUtil.pick(ba)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, (_, xs) => RandomUtil.pick(xs)),
    ),
    shuffle: new UnaryProviderCollection(
        "shuffle",
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, (_, sa) => sa.toSorted(() => Math.random() - .5)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, (_, xs) => xs.toSorted(() => Math.random() - .5)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, ba) => ba.toSorted(() => Math.random() - .5)),
    ),

    // string manipulation
    lowercase: new UnaryProviderCollection(
        "lowercase",
        new UnaryProvider(STRING, STRING, (_, s) => s.toLocaleLowerCase())
    ),
    uppercase: new UnaryProviderCollection(
        "uppercase",
        new UnaryProvider(STRING, STRING, (_, s) => s.toLocaleUpperCase())
    ),
    capitalize: new UnaryProviderCollection(
        "capitalize",
        new UnaryProvider(STRING, STRING, (_, s) => s.charAt(0).toLocaleUpperCase() + s.substring(1))
    ),
    "capitalize all": new UnaryProviderCollection(
        "capitalize all",
        new UnaryProvider(STRING, STRING, (_, s) => s.split(' ').map(p => p.charAt(0).toLocaleUpperCase() + p.substring(1)).join(' '))
    ),
    split: new UnaryProviderCollection(
        "split",
        new UnaryProvider(STRING, STRING_ARRAY, (_, s) => s.split(' '))
    ),
    join: new UnaryProviderCollection(
        "join",
        new UnaryProvider(STRING_ARRAY, STRING, (_, sa) => sa.join(' '))
    ),
    reverse: new UnaryProviderCollection(
        "reverse",
        new UnaryProvider(STRING, STRING, (_, s) => s.split("").reverse().join("")),
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, (_, s) => s.reverse()),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, (_, s) => s.reverse()),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, s) => s.reverse()),
    ),

    // array manipulation
    array: new UnaryProviderCollection(
        "array",
        new UnaryProvider(STRING, STRING_ARRAY, (_, s) => [s]),
        new UnaryProvider(NUMBER, NUMBER_ARRAY, (_, x) => [x]),
        new UnaryProvider(BOOLEAN, BOOLEAN_ARRAY, (_, b) => [b]),
    ),
    sort: new UnaryProviderCollection(
        "sort",
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, (_, sa) => sa.toSorted()),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, (_, xs) => xs.toSorted((x1, x2) => x1 - x2)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, ba) => ba.toSorted()),
    ),
    head: new UnaryProviderCollection(
        "head",
        new UnaryProvider(STRING, STRING, (_, s) => s.charAt(0)),
        new UnaryProvider(STRING_ARRAY, STRING, (_, sa) => {
            if (sa.length === 0) throw new RangeError("empty string array");
            return sa[0];
        }),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, (_, sa) => {
            if (sa.length === 0) throw new RangeError("empty number array");
            return sa[0];
        }),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN, (_, sa) => {
            if (sa.length === 0) throw new RangeError("empty boolean array");
            return sa[0];
        }),
    ),
    last: new UnaryProviderCollection(
        "last",
        new UnaryProvider(STRING, STRING, (_, s) => s.charAt(s.length - 1)),
        new UnaryProvider(STRING_ARRAY, STRING, (_, sa) => {
            if (sa.length === 0) throw new RangeError("empty string array");
            return sa[sa.length - 1];
        }),
        new UnaryProvider(NUMBER_ARRAY, NUMBER, (_, sa) => {
            if (sa.length === 0) throw new RangeError("empty number array");
            return sa[sa.length - 1];
        }),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN, (_, sa) => {
            if (sa.length === 0) throw new RangeError("empty boolean array");
            return sa[sa.length - 1];
        }),
    ),
    init: new UnaryProviderCollection(
        "init",
        new UnaryProvider(STRING, STRING, (_, s) => s.slice(1)),
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, (_, s) => s.slice(1)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, (_, s) => s.slice(1)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, s) => s.slice(1)),
    ),
    tail: new UnaryProviderCollection(
        "tail",
        new UnaryProvider(STRING, STRING, (_, s) => s.slice(0, -1)),
        new UnaryProvider(STRING_ARRAY, STRING_ARRAY, (_, s) => s.slice(0, -1)),
        new UnaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, (_, s) => s.slice(0, -1)),
        new UnaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, s) => s.slice(0, -1)),
    ),

    // type conversions
    "to string": new UnaryProviderCollection(
        "to string",
        new UnaryProvider(STRING, STRING, (_, s) => s),
        new UnaryProvider(NUMBER, STRING, (_, n) => n.toString()),
        new UnaryProvider(BOOLEAN, STRING, (_, b) => b.toString()),
    ),
    "to number": new UnaryProviderCollection(
        "to number",
        new UnaryProvider(STRING, NUMBER, (_, s) => {
            const out = Number(s);

            if (isNaN(out)) throw new SyntaxError(`invalid number format ${JSON.stringify(s)}`);
            else return out;
        }),
        new UnaryProvider(NUMBER, NUMBER, (_, x) => x),
        new UnaryProvider(BOOLEAN, NUMBER, (_, b) => b ? 1 : 0),
    ),
    "to boolean": new UnaryProviderCollection(
        "to boolean",
        new UnaryProvider(STRING, BOOLEAN, (_, s) => s ? true : false),
        new UnaryProvider(NUMBER, BOOLEAN, (_, x) => x ? true : false),
        new UnaryProvider(BOOLEAN, BOOLEAN, (_, b) => b),
    ),

    // context variables
    "string variable": new UnaryProviderCollection(
        "string variable",
        new UnaryProvider(STRING, STRING, (ctx, varName) => {
            const out = ctx.getStringVar(varName);

            if (out === undefined) throw new ReferenceError(`no string variable named ${JSON.stringify(varName)}`);
            else return out;
        })
    ),
    "number variable": new UnaryProviderCollection(
        "number variable",
        new UnaryProvider(STRING, NUMBER, (ctx, varName) => {
            const out = ctx.getNumberVar(varName);

            if (out === undefined) throw new ReferenceError(`no number variable named ${JSON.stringify(varName)}`);
            else return out;
        })
    ),
    "boolean variable": new UnaryProviderCollection(
        "boolean variable",
        new UnaryProvider(STRING, BOOLEAN, (ctx, varName) => {
            const out = ctx.getBooleanVar(varName);

            if (out === undefined) throw new ReferenceError(`no boolean variable named ${JSON.stringify(varName)}`);
            else return out;
        })
    ),
    "string array variable": new UnaryProviderCollection(
        "string variable",
        new UnaryProvider(STRING, STRING_ARRAY, (ctx, varName) => {
            const out = ctx.getStringArrayVar(varName);

            if (out === undefined) throw new ReferenceError(`no string array variable named ${JSON.stringify(varName)}`);
            else return out;
        })
    ),
    "number array variable": new UnaryProviderCollection(
        "number variable",
        new UnaryProvider(STRING, NUMBER_ARRAY, (ctx, varName) => {
            const out = ctx.getNumberArrayVar(varName);

            if (out === undefined) throw new ReferenceError(`no number array variable named ${JSON.stringify(varName)}`);
            else return out;
        })
    ),
    "boolean array variable": new UnaryProviderCollection(
        "boolean variable",
        new UnaryProvider(STRING, BOOLEAN_ARRAY, (ctx, varName) => {
            const out = ctx.getBooleanArrayVar(varName);

            if (out === undefined) throw new ReferenceError(`no boolean array variable named ${JSON.stringify(varName)}`);
            else return out;
        })
    ),
};

export const ALL_BINARY_PROVIDERS: Record<string, BinaryProviderCollection<any>> = {
    // math operations
    add: new BinaryProviderCollection(
        "add",
        new BinaryProvider(STRING, STRING, STRING, (_, s1, s2) => s1 + s2, false),
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x + y, true),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 || b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (_, b, x) => b ? 0 : x, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (_, b, s) => b ? "" : s, true),
    ),
    sub: new BinaryProviderCollection(
        "sub",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x - y),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 && !b2),
    ),
    mul: new BinaryProviderCollection(
        "mul",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x * y, true),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 && b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (_, b, x) => b ? x : 0, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (_, b, s) => b ? s : "", true),
        new BinaryProvider(STRING, NUMBER, STRING, (_, s, x) => s.repeat(Math.floor(x)) + s.substring(0, Math.round(x % 1 * s.length)), true),
    ),
    div: new BinaryProviderCollection(
        "div",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x / y),
        new BinaryProvider(STRING, NUMBER, STRING, (_, s, x) => s.substring(0, Math.round(s.length / x))),
    ),
    mod: new BinaryProviderCollection(
        "mod",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x % y),
    ),

    // binary operations
    or: new BinaryProviderCollection(
        "or",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 || b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (_, b, x) => b ? 0 : x, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (_, b, s) => b ? "" : s, true),
    ),
    and: new BinaryProviderCollection(
        "and",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 && b2, true),
        new BinaryProvider(BOOLEAN, NUMBER, NUMBER, (_, b, x) => b ? x : 0, true),
        new BinaryProvider(BOOLEAN, STRING, STRING, (_, b, s) => b ? s : "", true),
    ),
    xor: new BinaryProviderCollection(
        "xor",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 !== b2, true),
    ),
    nand: new BinaryProviderCollection(
        "nand",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => !(b1 && b2), true),
    ),
    nor: new BinaryProviderCollection(
        "nor",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => !(b1 || b2), true),
    ),
    xnor: new BinaryProviderCollection(
        "xnor",
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 === b2, true),
    ),

    // bitwise operations
    "bitwise or": new BinaryProviderCollection(
        "bitwise or",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x | y, true),
    ),
    "bitwise and": new BinaryProviderCollection(
        "bitwise and",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x & y, true),
    ),
    "bitwise xor": new BinaryProviderCollection(
        "bitwise xor",
        new BinaryProvider(NUMBER, NUMBER, NUMBER, (_, x, y) => x ^ y, true),
    ),

    // comparisons
    "less than or equal": new BinaryProviderCollection(
        "less than or equal",
        new BinaryProvider(NUMBER, NUMBER, BOOLEAN, (_, x, y) => x <= y),
        new BinaryProvider(STRING, STRING, BOOLEAN, (_, s1, s2) => s1.localeCompare(s2) <= 0),
    ),
    "less than": new BinaryProviderCollection(
        "less than",
        new BinaryProvider(NUMBER, NUMBER, BOOLEAN, (_, x, y) => x < y),
        new BinaryProvider(STRING, STRING, BOOLEAN, (_, s1, s2) => s1.localeCompare(s2) < 0),
    ),
    equals: new BinaryProviderCollection(
        "equals",
        new BinaryProvider(NUMBER, NUMBER, BOOLEAN, (_, x, y) => x === y, true),
        new BinaryProvider(STRING, STRING, BOOLEAN, (_, s1, s2) => s1.localeCompare(s2) === 0, true),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 === b2, true),
    ),
    "not equals": new BinaryProviderCollection(
        "not equals",
        new BinaryProvider(NUMBER, NUMBER, BOOLEAN, (_, x, y) => x !== y, true),
        new BinaryProvider(STRING, STRING, BOOLEAN, (_, s1, s2) => s1.localeCompare(s2) !== 0, true),
        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, (_, b1, b2) => b1 !== b2, true),
    ),
    "greater than": new BinaryProviderCollection(
        "greater than",
        new BinaryProvider(NUMBER, NUMBER, BOOLEAN, (_, x, y) => x > y),
        new BinaryProvider(STRING, STRING, BOOLEAN, (_, s1, s2) => s1.localeCompare(s2) > 0),
    ),
    "greater than or equal": new BinaryProviderCollection(
        "greater than or equal",
        new BinaryProvider(NUMBER, NUMBER, BOOLEAN, (_, x, y) => x >= y),
        new BinaryProvider(STRING, STRING, BOOLEAN, (_, s1, s2) => s1.localeCompare(s2) >= 0),
    ),

    // array manipulation
    index: new BinaryProviderCollection(
        "index",
        new BinaryProvider(STRING_ARRAY, NUMBER, STRING, (_, sa, x) => {
            if (x % 1 !== 0) throw new Error(`RHS ${x} is not an integer`);
            else if (x < 0 || x >= sa.length) throw new RangeError(`index ${x} is out of range for array of length ${sa.length}`);

            return sa[x];
        }),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER, (_, xs, x) => {
            if (x % 1 !== 0) throw new Error(`RHS ${x} is not an integer`);
            else if (x < 0 || x >= xs.length) throw new RangeError(`index ${x} is out of range for array of length ${xs.length}`);

            return xs[x];
        }),
        new BinaryProvider(BOOLEAN_ARRAY, NUMBER, BOOLEAN, (_, ba, x) => {
            if (x % 1 !== 0) throw new Error(`RHS ${x} is not an integer`);
            else if (x < 0 || x >= ba.length) throw new RangeError(`index ${x} is out of range for array of length ${ba.length}`);

            return ba[x];
        }),
    ),
    join: new BinaryProviderCollection(
        "join",
        new BinaryProvider(STRING, STRING, STRING_ARRAY, (_, s1, s2) => [s1, s2]),
        new BinaryProvider(STRING, STRING_ARRAY, STRING_ARRAY, (_, s, sa) => [s, ...sa]),
        new BinaryProvider(STRING_ARRAY, STRING, STRING_ARRAY, (_, sa, s) => [...sa, s]),
        new BinaryProvider(STRING_ARRAY, STRING_ARRAY, STRING_ARRAY, (_, sa1, sa2) => sa1.concat(sa2)),

        new BinaryProvider(NUMBER, NUMBER, NUMBER_ARRAY, (_, x1, x2) => [x1, x2]),
        new BinaryProvider(NUMBER, NUMBER_ARRAY, NUMBER_ARRAY, (_, x, xs) => [x, ...xs]),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER_ARRAY, (_, xs, x) => [...xs, x]),
        new BinaryProvider(NUMBER_ARRAY, NUMBER_ARRAY, NUMBER_ARRAY, (_, xs, ys) => xs.concat(ys)),

        new BinaryProvider(BOOLEAN, BOOLEAN, BOOLEAN_ARRAY, (_, b1, b2) => [b1, b2]),
        new BinaryProvider(BOOLEAN, BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, b, ba) => [b, ...ba]),
        new BinaryProvider(BOOLEAN_ARRAY, BOOLEAN, BOOLEAN_ARRAY, (_, ba, b) => [...ba, b]),
        new BinaryProvider(BOOLEAN_ARRAY, BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, ba1, ba2) => ba1.concat(ba2)),
    ),

    // randomness
    "pick n": new BinaryProviderCollection(
        "pick n",
        new BinaryProvider(STRING_ARRAY, NUMBER, STRING_ARRAY, (_, sa, n) => {
            if (sa.length === 0) throw new Error("cannot pick from empty array");
            return sa.toSorted(() => Math.random() - .5).slice(0, n);
        }),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER_ARRAY, (_, xs, n) => {
            if (xs.length === 0) throw new Error("cannot pick from empty array");
            return xs.toSorted(() => Math.random() - .5).slice(0, n);
        }),
        new BinaryProvider(BOOLEAN_ARRAY, NUMBER, BOOLEAN_ARRAY, (_, ba, n) => {
            if (ba.length === 0) throw new Error("cannot pick from empty array");
            return ba.toSorted(() => Math.random() - .5).slice(0, n);
        }),
        new BinaryProvider(STRING_ARRAY_ARRAY, NUMBER, STRING_ARRAY_ARRAY, (_, sa, n) => {
            if (sa.length === 0) throw new Error("cannot pick from empty array");
            return sa.toSorted(() => Math.random() - .5).slice(0, n);
        }),
        new BinaryProvider(NUMBER_ARRAY_ARRAY, NUMBER, NUMBER_ARRAY_ARRAY, (_, xs, n) => {
            if (xs.length === 0) throw new Error("cannot pick from empty array");
            return xs.toSorted(() => Math.random() - .5).slice(0, n);
        }),
        new BinaryProvider(BOOLEAN_ARRAY_ARRAY, NUMBER, BOOLEAN_ARRAY_ARRAY, (_, ba, n) => {
            if (ba.length === 0) throw new Error("cannot pick from empty array");
            return ba.toSorted(() => Math.random() - .5).slice(0, n);
        }),
    ),
    "pick n returned": new BinaryProviderCollection(
        "pick n returned",
        new BinaryProvider(STRING_ARRAY, NUMBER, STRING_ARRAY, (_, sa, n) => {
            if (sa.length === 0) throw new Error("cannot pick from empty array");

            const out: string[] = [];
            for (let i = 0; i < n; i++) out.push(sa[(Math.floor(Math.random() * sa.length))]);

            return out;
        }),
        new BinaryProvider(NUMBER_ARRAY, NUMBER, NUMBER_ARRAY, (_, xs, n) => {
            if (xs.length === 0) throw new Error("cannot pick from empty array");

            const out: number[] = [];
            for (let i = 0; i < n; i++) out.push(xs[(Math.floor(Math.random() * xs.length))]);

            return out;
        }),
        new BinaryProvider(BOOLEAN_ARRAY, NUMBER, BOOLEAN_ARRAY, (_, ba, n) => {
            if (ba.length === 0) throw new Error("cannot pick from empty array");

            const out: boolean[] = [];
            for (let i = 0; i < n; i++) out.push(ba[(Math.floor(Math.random() * ba.length))]);

            return out;
        }),
        new BinaryProvider(STRING_ARRAY_ARRAY, NUMBER, STRING_ARRAY_ARRAY, (_, sa, n) => {
            if (sa.length === 0) throw new Error("cannot pick from empty array");

            const out: string[][] = [];
            for (let i = 0; i < n; i++) out.push(sa[(Math.floor(Math.random() * sa.length))]);

            return out;
        }),
        new BinaryProvider(NUMBER_ARRAY_ARRAY, NUMBER, NUMBER_ARRAY_ARRAY, (_, xs, n) => {
            if (xs.length === 0) throw new Error("cannot pick from empty array");

            const out: number[][] = [];
            for (let i = 0; i < n; i++) out.push(xs[(Math.floor(Math.random() * xs.length))]);

            return out;
        }),
        new BinaryProvider(BOOLEAN_ARRAY_ARRAY, NUMBER, BOOLEAN_ARRAY_ARRAY, (_, ba, n) => {
            if (ba.length === 0) throw new Error("cannot pick from empty array");

            const out: boolean[][] = [];
            for (let i = 0; i < n; i++) out.push(ba[(Math.floor(Math.random() * ba.length))]);

            return out;
        }),
    ),
};

export const ALL_TERNARY_PROVIDERS: Record<string, TernaryProviderCollection<any>> = {
    conditional: new TernaryProviderCollection(
        "conditional",
        new TernaryProvider(BOOLEAN, STRING, STRING, STRING, (_, a, b, c) => a ? b : c),
        new TernaryProvider(BOOLEAN, NUMBER, NUMBER, NUMBER, (_, a, b, c) => a ? b : c),
        new TernaryProvider(BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, (_, a, b, c) => a ? b : c),
        new TernaryProvider(BOOLEAN, STRING_ARRAY, STRING_ARRAY, STRING_ARRAY, (_, a, b, c) => a ? b : c),
        new TernaryProvider(BOOLEAN, NUMBER_ARRAY, NUMBER_ARRAY, NUMBER_ARRAY, (_, a, b, c) => a ? b : c),
        new TernaryProvider(BOOLEAN, BOOLEAN_ARRAY, BOOLEAN_ARRAY, BOOLEAN_ARRAY, (_, a, b, c) => a ? b : c),
    )
};